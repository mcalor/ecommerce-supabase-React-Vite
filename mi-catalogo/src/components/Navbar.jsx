import { useCart } from '../context/CartContext';

export default function Navbar({ onLoginClick, user }) {
  const { cart, setIsCartOpen } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <h1 style={styles.logo}>NUTRICION <span style={{color: '#f39c12'}}> TOTAL </span></h1>
      </div>
      
      <div style={styles.links}>
        <a href="#" style={styles.link}> Inicio</a>
        <BR>
        </BR>
        <a href="#" style={styles.link}> Productos</a>
        <BR>
        </BR>
        <a href="#" style={styles.link}> Nosotros</a>
        <BR>
        </BR>
      </div>

      <div style={styles.actions}>
        {user ? (
          <span style={styles.user}> Hola, {user.email}</span>
        ) : (
          <button onClick={onLoginClick} style={styles.loginBtn}> Ingresar</button>
        )}
        
        <button onClick={() => setIsCartOpen(true)} style={styles.cartBtn}>
          🛒 Carrito
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#2c3e50', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { fontSize: '1.5rem', margin: 0, fontWeight: '800' },
  links: { display: 'flex', gap: '20px' },
  link: { color: '#ecf0f1', textDecoration: 'none', fontWeight: '500' },
  actions: { display: 'flex', alignItems: 'center', gap: '15px' },
  loginBtn: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#34495e', color: 'white', cursor: 'pointer' },
  cartBtn: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#f39c12', color: 'white', cursor: 'pointer', position: 'relative' },
  badge: { position: 'absolute', top: '-5px', right: '-5px', background: 'red', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  user: { fontSize: '0.9rem' }
};