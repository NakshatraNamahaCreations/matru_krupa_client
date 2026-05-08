import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_KEY = "mk_guest_cart";
const WARRANTY_KEY = "mk_cart_warranties";

function loadGuestCart() {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY)) || []; }
  catch { return []; }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

function loadWarrantyMap() {
  try { return JSON.parse(localStorage.getItem(WARRANTY_KEY)) || {}; }
  catch { return {}; }
}

function saveWarrantyMap(map) {
  localStorage.setItem(WARRANTY_KEY, JSON.stringify(map));
}

function priceToNumber(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const n = parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warrantyMap, setWarrantyMap] = useState(loadWarrantyMap);

  const setWarrantyFor = useCallback((productId, warranty) => {
    setWarrantyMap((prev) => {
      const next = { ...prev };
      if (warranty) next[productId] = warranty;
      else delete next[productId];
      saveWarrantyMap(next);
      return next;
    });
  }, []);

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

  const addToCart = useCallback(async (product, quantity = 1, warranty) => {
    const productId = product._id || product.id;
    const isMongoId = typeof productId === "string" && /^[0-9a-f]{24}$/i.test(productId);

    // Always reflect the user's current warranty selection in the cart.
    // Pass undefined to leave the map untouched; pass null to explicitly clear.
    if (warranty !== undefined) {
      setWarrantyFor(productId, warranty);
    }

    if (isLoggedIn && isMongoId) {
      setLoading(true);
      try {
        const cart = await cartApi.add(productId, quantity);
        setItems(cart.items || []);
        return;
      } catch (err) {
        console.error("Failed to sync cart with server, falling back to local update:", err);
        // fall through to optimistic local update so the user still gets feedback
      } finally {
        setLoading(false);
      }
    }

    // Local update — used for guests and as fallback for static/demo products
    setItems((prev) => {
      const exists = prev.findIndex(
        (i) => (i.product?.id || i.product?._id) === productId
      );
      let next;
      if (exists > -1) {
        next = prev.map((i, idx) =>
          idx === exists ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        const price = product.numericPrice || product.price || 0;
        const numPrice =
          typeof price === "string" ? Number(String(price).replace(/[₹,]/g, "")) : Number(price);
        next = [...prev, { product, quantity, price: numPrice || 0 }];
      }
      if (!isLoggedIn) saveGuestCart(next);
      return next;
    });
  }, [isLoggedIn, setWarrantyFor]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return;
    const isMongoId = typeof productId === "string" && /^[0-9a-f]{24}$/i.test(productId);

    if (isLoggedIn && isMongoId) {
      setLoading(true);
      try {
        const cart = await cartApi.update(productId, quantity);
        setItems(cart.items || []);
        return;
      } catch (err) {
        console.error("Failed to update cart on server, falling back to local update:", err);
      } finally {
        setLoading(false);
      }
    }

    setItems((prev) => {
      const next = prev.map((i) =>
        (i.product?.id || i.product?._id) === productId ? { ...i, quantity } : i
      );
      if (!isLoggedIn) saveGuestCart(next);
      return next;
    });
  }, [isLoggedIn]);

  const removeFromCart = useCallback(async (productId) => {
    const isMongoId = typeof productId === "string" && /^[0-9a-f]{24}$/i.test(productId);
    setWarrantyFor(productId, null);

    if (isLoggedIn && isMongoId) {
      setLoading(true);
      try {
        const cart = await cartApi.remove(productId);
        setItems(cart.items || []);
        return;
      } catch (err) {
        console.error("Failed to remove from server cart, falling back to local update:", err);
      } finally {
        setLoading(false);
      }
    }

    setItems((prev) => {
      const next = prev.filter((i) => (i.product?.id || i.product?._id) !== productId);
      if (!isLoggedIn) saveGuestCart(next);
      return next;
    });
  }, [isLoggedIn, setWarrantyFor]);

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      await cartApi.clear();
    } else {
      localStorage.removeItem(GUEST_KEY);
    }
    saveWarrantyMap({});
    setWarrantyMap({});
    setItems([]);
  }, [isLoggedIn]);

  const isInCart = useCallback((productId) => {
    return items.some((i) => (i.product?.id || i.product?._id) === productId);
  }, [items]);

  // Decorate each line with the saved warranty (if any) so consumers can show it.
  const decoratedItems = items.map((i) => {
    const pid = i.product?.id || i.product?._id;
    return { ...i, warranty: warrantyMap[pid] || null };
  });

  const totalItems = decoratedItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = decoratedItems.reduce((s, i) => {
    const w = i.warranty ? priceToNumber(i.warranty.price) : 0;
    return s + ((i.price || 0) + w) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items: decoratedItems,
      loading,
      totalItems,
      totalAmount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isInCart,
      setWarrantyFor,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
