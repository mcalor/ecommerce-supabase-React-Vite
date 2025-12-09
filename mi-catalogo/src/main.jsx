import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Success from './Success.jsx' // <--- Importamos la nueva página

// Leemos en qué dirección web está el usuario ahora mismo
const path = window.location.pathname

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Si la URL es "/success", mostramos Success. Si no, mostramos la tienda (App) */}
    {path === '/success' ? <Success /> : <App />}
  </StrictMode>,
)