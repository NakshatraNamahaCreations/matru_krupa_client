const BASE = "https://matru-krupa-server.vercel.app/api";
// const BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("mk_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
  updateProfile: (body) =>
    request("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
  changePassword: (body) =>
    request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  addAddress: (body) =>
    request("/auth/addresses", { method: "POST", body: JSON.stringify(body) }),
  updateAddress: (id, body) =>
    request(`/auth/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: "DELETE" }),
  toggleWishlist: (productId) =>
    request(`/auth/wishlist/${productId}`, { method: "POST" }),
};

// ── Public Storefront (no auth needed) ───────────────────────────
export const storeApi = {
  // Products — fetches active products from backend
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE}/products/public?${query}`).then((r) => r.json());
  },
  getProductById: (id) => fetch(`${BASE}/products/${id}`).then((r) => r.json()),

  // Categories — from backend
  getCategories: () => fetch(`${BASE}/categories`).then((r) => r.json()),
  getCategoryByName: (name) =>
    fetch(`${BASE}/categories/by-name/${encodeURIComponent(name)}`).then((r) =>
      r.ok ? r.json() : null,
    ),

  // Banners — hero sliders & promo banners
  getBanners: (type) => {
    const query = type ? `?type=${type}` : "";
    return fetch(`${BASE}/banners${query}`).then((r) => r.json());
  },
};

// ── Cart ──────────────────────────────────────────────────────────
export const cartApi = {
  get: () => request("/cart"),
  add: (productId, quantity = 1) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
  update: (productId, quantity) =>
    request(`/cart/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  remove: (productId) => request(`/cart/${productId}`, { method: "DELETE" }),
  clear: () => request("/cart/clear", { method: "DELETE" }),
};

// ── Orders ────────────────────────────────────────────────────────
export const orderApi = {
  place: (body) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders/my?${query}`);
  },
  getById: (id) => request(`/orders/${id}`),
  cancel: (id, reason) =>
    request(`/orders/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
};
