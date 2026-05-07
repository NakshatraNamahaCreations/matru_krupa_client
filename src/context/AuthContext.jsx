import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // checking saved token on mount

  // On mount: restore session from saved token
  useEffect(() => {
    const token = localStorage.getItem("mk_token");
    if (token) {
      authApi.getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem("mk_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem("mk_token", data.token);
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (name, email, phone, password) => {
    const data = await authApi.register({ name, email, phone, password });
    localStorage.setItem("mk_token", data.token);
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mk_token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (fields) => {
    const updated = await authApi.updateProfile(fields);
    setUser(updated);
    return updated;
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    return authApi.changePassword({ currentPassword, newPassword });
  }, []);

  const addAddress = useCallback(async (addr) => {
    const addresses = await authApi.addAddress(addr);
    setUser((u) => ({ ...u, addresses }));
    return addresses;
  }, []);

  const updateAddress = useCallback(async (id, addr) => {
    const addresses = await authApi.updateAddress(id, addr);
    setUser((u) => ({ ...u, addresses }));
    return addresses;
  }, []);

  const deleteAddress = useCallback(async (id) => {
    const addresses = await authApi.deleteAddress(id);
    setUser((u) => ({ ...u, addresses }));
    return addresses;
  }, []);

  // Toggle wishlist — stored as product IDs in user.wishlist
  const toggleWishlist = useCallback(async (productId) => {
    if (!user) return null;
    const data = await authApi.toggleWishlist(productId);
    setUser((u) => ({ ...u, wishlist: data.wishlist }));
    return data.wishlist;
  }, [user]);

  const isWishlisted = useCallback((productId) => {
    if (!user?.wishlist) return false;
    return user.wishlist.some((id) => id.toString() === productId.toString());
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      addAddress,
      updateAddress,
      deleteAddress,
      toggleWishlist,
      isWishlisted,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
