import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import './App.css'; // Asegúrate de tener estilos básicos de reset

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    checkUser();
  }, []);

  async function fetchProducts() {
    // Ordenamos por ID para que no salten al actualizar
    const { data } = await supabase.from('products').select('*').order('id');
    setProducts(data || []);
    setLoading(false);
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function handleLogin() {
    const email = prompt("Email de prueba:");
    const password = prompt("Password:");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) window.location.reload();
    else alert(error.message);
  }

  if (loading) return <div>Cargando experiencia...</div>;

  return (
    <CartProvider>
      <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
        <Navbar onLoginClick={handleLogin} user={user} />
        
        <CartDrawer user={user} />

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          
          {/* Banner Hero Simple */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#2c3e50' }}>Nutrientes para tu Salud</h2>
            <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>Nutrirse nunca fue tan fácil.</p>
          </div>

          {/* Grid de Productos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </main>
      </div>
    </CartProvider>
  );
}

export default App;