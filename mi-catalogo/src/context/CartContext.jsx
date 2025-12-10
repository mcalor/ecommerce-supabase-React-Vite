import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Agregar producto
  const addToCart = (product) => {
    setCart((prevCart) => {
      // ¿El producto ya está en el carrito?
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Si existe, sumamos 1 a la cantidad
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Si no, lo agregamos con cantidad 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Abrimos el carrito automáticamente al agregar
  };

  // Quitar producto
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calcular total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};