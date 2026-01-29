import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, isAuthenticated, refreshWallet } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [isAuthenticated, token]);

  const fetchCart = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (planName, priceNGN, priceUSD, description) => {
    if (!token) throw new Error('Must be logged in');
    
    const res = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ planName, priceNGN, priceUSD, description })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to add item');
    }

    await fetchCart();
    return data;
  };

  const removeItem = async (itemId) => {
    if (!token) throw new Error('Must be logged in');
    
    const res = await fetch(`${API_URL}/cart/remove/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to remove item');
    }

    await fetchCart();
    return data;
  };

  const clearCart = async () => {
    if (!token) throw new Error('Must be logged in');
    
    const res = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to clear cart');
    }

    setItems([]);
    setTotal(0);
    return data;
  };

  const checkout = async () => {
    if (!token) throw new Error('Must be logged in');
    
    const res = await fetch(`${API_URL}/cart/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Checkout failed');
    }

    // Clear cart and refresh wallet
    setItems([]);
    setTotal(0);
    await refreshWallet();
    
    return data;
  };

  const value = {
    items,
    total,
    loading,
    itemCount: items.length,
    fetchCart,
    addItem,
    removeItem,
    clearCart,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
