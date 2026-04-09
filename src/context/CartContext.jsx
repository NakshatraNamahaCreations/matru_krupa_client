import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_KEY = "mk_guest_cart";

function loadGuestCart() {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY)) || []; }
  catch { return []; }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart whenever auth state changes
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      cartApi.get()
        .then((cart) => setItems(cart.items || []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      setItems(loadGuestCart());
    }
  }, [isLoggedIn]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (isLoggedIn) {
      setLoading(true);
      try {
        const cart = await cartApi.add(product._id || product.id, quantity);
        setItems(cart.items || []);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart — store full product info in localStorage
      setItems((prev) => {
        const exists = prev.findIndex((i) => i.product.id === product.id);
        let next;
        if (exists > -1) {
          next = prev.map((i, idx) =>
            idx === exists ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          const price = product.numericPrice || product.price || 0;
          const numPrice = typeof price === "string" ? Number(price.replace(/[₹,]/g, "")) : Number(price);
          next = [...prev, { product, quantity, price: numPrice || 0 }];
        }
        saveGuestCart(next);
        return next;
      });
    }
  }, [isLoggedIn]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return;
    if (isLoggedIn) {
      setLoading(true);
      try {
        const cart = await cartApi.update(productId, quantity);
        setItems(cart.items || []);
      } finally {
        setLoading(false);
      }
    } else {
      setItems((prev) => {
        const next = prev.map((i) =>
          (i.product.id || i.product._id) === productId ? { ...i, quantity } : i
        );
        saveGuestCart(next);
        return next;
      });
    }
  }, [isLoggedIn]);

  const removeFromCart = useCallback(async (productId) => {
    if (isLoggedIn) {
      setLoading(true);
      try {
        const cart = await cartApi.remove(productId);
        setItems(cart.items || []);
      } finally {
        setLoading(false);
      }
    } else {
      setItems((prev) => {
        const next = prev.filter((i) => (i.product.id || i.product._id) !== productId);
        saveGuestCart(next);
        return next;
      });
    }
  }, [isLoggedIn]);

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      await cartApi.clear();
    } else {
      localStorage.removeItem(GUEST_KEY);
    }
    setItems([]);
  }, [isLoggedIn]);

  const isInCart = useCallback((productId) => {
    return items.some((i) => (i.product?.id || i.product?._id) === productId);
  }, [items]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      totalItems,
      totalAmount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
