import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar productos al inicio
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (error) console.error(error)
    else setProducts(data)
    setLoading(false)
  }

  // --- LA LÓGICA DE COMPRA ACTUALIZADA ---
  async function handleBuy(product) {
    // 1. Verificar Login
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Por favor, inicia sesión para comprar (Botón arriba a la derecha)")
      return
    }

    try {
      // 2. Crear la orden en TU base de datos (Postgres)
      // Esto asegura el stock y el precio real antes de ir a Mercado Pago
      const { data: orderData, error: orderError } = await supabase.rpc('create_order', {
        order_items_input: [{ product_id: product.id, quantity: 1 }] 
      })

      if (orderError) throw orderError
      
      console.log("Orden creada internamente ID:", orderData.order_id)

      // 3. Llamar a tu Edge Function (La que acabas de desplegar)
      // Esta función hablará con Mercado Pago usando tu token secreto
      const { data: mpData, error: mpError } = await supabase.functions.invoke('create-mp-preference', {
        body: {
          orderId: orderData.order_id,
          title: product.name,
          price: product.price, // En un sistema real, la Edge Function debería buscar el precio de nuevo, pero para trainee está bien así
          quantity: 1
        }
      })

      if (mpError) throw mpError
      if (mpData.error) throw new Error(mpData.error)

      // 4. ¡MAGIA! Redirigir al usuario a Mercado Pago
      // Usamos 'sandbox_init_point' para pruebas. Cuando salgas a producción usarás 'init_point'
      console.log("Redirigiendo a Mercado Pago...", mpData.sandbox_init_point)
      window.location.href = mpData.sandbox_init_point

    } catch (error) {
      console.error('Error en el proceso:', error)
      alert('Hubo un error: ' + error.message)
    }
  }

  // Login simple para pruebas
  const handleLogin = async () => {
    const email = prompt("Email de prueba:")
    const password = prompt("Password:")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else alert("¡Logueado! Ahora intenta comprar.")
  }

  if (loading) return <h1>Cargando tienda...</h1>

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Mercado Trainee 🛒</h1>
        <button onClick={handleLogin}>Iniciar Sesión (Test)</button>
      </header>
      
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p style={{ color: '#666' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${product.price}</span>
              <button 
                // Pasamos el objeto producto completo a la función
                onClick={() => handleBuy(product)}
                style={{ backgroundColor: '#009ee3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Pagar con Mercado Pago
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App