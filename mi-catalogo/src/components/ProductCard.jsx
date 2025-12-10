import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      {/* Si tienes imágenes reales en la BD, usa product.image_url */}
      <div style={styles.imagePlaceholder}>
         <img src="https://via.placeholder.com/150" alt={product.name} style={{width:'100%'}}/> 
      </div>
      <div style={styles.info}>
        <span style={styles.category}>{product.category || 'General'}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>${product.price.toLocaleString('es-CL')}</p>
        <button onClick={() => addToCart(product)} style={styles.btn}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' },
  imagePlaceholder: { height: '200px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' },
  category: { fontSize: '0.8rem', color: '#f39c12', fontWeight: 'bold', textTransform: 'uppercase' },
  title: { margin: 0, fontSize: '1.1rem', color: '#2c3e50' },
  price: { fontSize: '1.4rem', fontWeight: 'bold', color: '#27ae60', margin: 0 },
  btn: { padding: '10px', background: 'transparent', border: '2px solid #f39c12', color: '#f39c12', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: 'auto', transition: '0.3s' }
};