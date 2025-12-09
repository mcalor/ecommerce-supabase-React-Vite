import { useEffect, useState } from 'react'

function Success() {
  const [paymentId, setPaymentId] = useState(null)

  useEffect(() => {
    // Leemos los datos que Mercado Pago puso en la URL
    const params = new URLSearchParams(window.location.search)
    const id = params.get('payment_id') // El ID del comprobante
    setPaymentId(id)
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1 style={{ color: '#009ee3', fontSize: '3rem' }}>¡Gracias por tu compra! 🎉</h1>
      
      {paymentId && (
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          Tu pago fue procesado con éxito. <br/>
          <strong>ID de transacción: {paymentId}</strong>
        </p>
      )}

      <button 
        onClick={() => window.location.href = '/'} // Recarga la página y vuelve al inicio
        style={{ 
          marginTop: '30px', 
          padding: '12px 24px', 
          backgroundColor: '#333', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Volver a la tienda
      </button>
    </div>
  )
}

export default Success