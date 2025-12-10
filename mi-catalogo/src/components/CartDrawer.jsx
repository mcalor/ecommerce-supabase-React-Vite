import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

export default function CartDrawer({ user }) {
  const { cart, removeFromCart, total, isCartOpen, setIsCartOpen } = useCart();

  async function handleCheckout() {
    if (!user) return alert("Inicia sesión para pagar");

    try {
      // 1. Preparar el array para el Backend
      const orderItemsInput = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      // 2. Crear Orden en DB (RPC)
      const { data: orderData, error: orderError } = await supabase.rpc('create_order', {
        order_items_input: orderItemsInput
      });

      if (orderError) throw orderError;

      // 3. Llamar a Mercado Pago
      const { data: mpData, error: mpError } = await supabase.functions.invoke('create-mp-preference', {
        body: {
          orderId: orderData.order_id,
          title: "Compra en Mercado Trainee", // Título genérico para el carrito
          price: total, // El total calculado
          quantity: 1
        }
      });

      if (mpError) throw mpError;
      
      // 4. Redirigir
      window.location.href = mpData.sandbox_init_point;

    } catch (error) {
      console.error(error);
      alert("Error al procesar: " + error.message);
    }
  }

  if (!isCartOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <h2>Tu Carrito</h2>
          <button onClick={() => setIsCartOpen(false)} style={styles.closeBtn}>X</button>
        </div>
        
        {cart.length === 0 ? <p>Tu carrito está vacío.</p> : (
          <div style={styles.items}>
            {cart.map(item => (
              <div key={item.id} style={styles.item}>
                <div>
                  <strong>{item.name}</strong>
                  <p>${item.price} x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>Eliminar</button>
              </div>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          <h3>Total: ${total.toLocaleString('es-CL')}</h3>
          <button 
            onClick={handleCheckout} 
            disabled={cart.length === 0}
            style={styles.checkoutBtn}
          >
            Ir a Pagar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' },
  drawer: { width: '400px', background: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  items: { flex: 1, overflowY: 'auto' },
  item: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  footer: { marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '20px' },
  checkoutBtn: { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  removeBtn: { background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};