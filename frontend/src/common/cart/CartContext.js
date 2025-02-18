import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem('userId')
        console.log('Stored userId:', localStorage.getItem('userId'));

        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);

        setCart(response.data.items); // Assuming 'items' is an array of cart items

      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);



  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        productId: product._id, // Assuming _id is the product identifier
        quantity: 1,
        discount:1,
        
        
      });
      setCart(response.data.cart.items); // Update cart from the backend response

    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.delete('http://localhost:5000/api/cart/remove', {
        data: { userId, productId },
      });
      setCart(response.data.cart.items); // Update cart from the backend response
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.put('http://localhost:5000/api/cart/update', {
        userId,
        productId,
        quantity,
        discount:1,

      });
      setCart(response.data.cart.items); // Update cart from the backend response
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  const reloadCart = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(response.data.items); // Assuming 'items' is the array of cart items
    } catch (error) {
      console.error('Failed to reload cart:', error);
    } finally {
      setLoading(false);
    }
  };
  

  

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity,reloadCart  }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
