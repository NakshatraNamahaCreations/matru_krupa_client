import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User, MapPin, Package, Wrench, Heart, LogOut, ChevronRight, Pencil,
  X, Trash2, Clock, Truck, CheckCircle, XCircle, RotateCcw,
  ChevronLeft, Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { orderApi, storeApi } from "../services/api";

const NAV_ITEMS = [
  { key: "profile",  label: "My Profile",         icon: User },
  { key: "address",  label: "My Address",          icon: MapPin },
  { key: "orders",   label: "My Orders",           icon: Package },
  { key: "service",  label: "My Service Requests", icon: Wrench },
  { key: "wishlist", label: "My Wishlist",         icon: Heart },
  { key: "logout",   label: "Logout",              icon: LogOut },
];

const VALID_TABS = ["profile", "address", "orders", "service", "wishlist"];

/* ═══════════════════════════════════════════════════════════════════
   ORDERS TAB
   ═══════════════════════════════════════════════════════════════════ */

const STATUS_CONFIG = {
  placed:    { icon: Clock,       color: "#f59e0b", label: "Placed" },
  confirmed: { icon: CheckCircle, color: "#3b82f6", label: "Confirmed" },
  packed:    { icon: Package,     color: "#8b5cf6", label: "Packed" },
  shipped:   { icon: Truck,       color: "#3b82f6", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "#16a34a", label: "Delivered" },
  cancelled: { icon: XCircle,     color: "#dc2626", label: "Cancelled" },
  returned:  { icon: RotateCcw,   color: "#dc2626", label: "Returned" },
};

const ORDER_STEPS = ["placed", "confirmed", "packed", "shipped", "delivered"];

function OrderDetailView({ order, onBack, onCancel, cancelling }) {
  const sc = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
  const StatusIcon = sc.icon;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const canCancel = ["placed", "confirmed"].includes(order.orderStatus);
  const currentStepIdx = ORDER_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";
  const isReturned = order.orderStatus === "returned";

  return (
    <>
      <button className="profile-order-detail__back" onClick={onBack}>
        <ChevronLeft size={16} /> Back to Orders
      </button>
      <div className="profile-order-detail">
        <div className="profile-order-detail__section">
          <div className="profile-order-detail__section-title">Order Information</div>
          <div className="profile-order-detail__grid">
            <div className="profile-order-detail__field"><label>Order Number</label><span>#{order.orderNumber}</span></div>
            <div className="profile-order-detail__field"><label>Placed On</label><span>{orderDate}</span></div>
            <div className="profile-order-detail__field"><label>Status</label>
              <span style={{ color: sc.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <StatusIcon size={14} /> {sc.label}
              </span>
            </div>
            <div className="profile-order-detail__field"><label>Payment Method</label><span>{order.paymentMethod}</span></div>
            <div className="profile-order-detail__field"><label>Payment Status</label>
              <span style={{ color: order.paymentStatus === "paid" ? "#16a34a" : "#f59e0b" }}>
                {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {!isCancelled && !isReturned && (
          <div className="profile-order-detail__section">
            <div className="profile-order-detail__section-title">Order Timeline</div>
            <div className="profile-order-detail__timeline">
              {ORDER_STEPS.map((step, i) => {
                let cls = "profile-order-detail__step--pending";
                if (i < currentStepIdx) cls = "profile-order-detail__step--done";
                else if (i === currentStepIdx) cls = "profile-order-detail__step--active";
                const StepIcon = STATUS_CONFIG[step]?.icon || Clock;
                return (
                  <span key={step} className={`profile-order-detail__step ${cls}`}>
                    <StepIcon size={12} /> {STATUS_CONFIG[step]?.label || step}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="profile-order-detail__section">
          <div className="profile-order-detail__section-title">Items ({order.items.length})</div>
          {order.items.map((item, i) => (
            <div key={i} className="profile-order-card__item" style={{ marginBottom: 10 }}>
              <img src={item.image} alt={item.name} className="profile-order-card__img" />
              <div className="profile-order-card__item-info">
                <p className="profile-order-card__item-name">{item.name}</p>
                {item.brand && <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.brand}</span>}
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <span className="profile-order-card__item-qty">Qty: {item.quantity}</span>
                  <span style={{ fontSize: 13, color: "#475569" }}>₹{Number(item.price).toLocaleString("en-IN")} each</span>
                  <span className="profile-order-card__item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {order.shippingAddress && (
          <div className="profile-order-detail__section">
            <div className="profile-order-detail__section-title">Shipping Address</div>
            <div style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>
              <strong>{order.shippingAddress.fullName}</strong> &middot; {order.shippingAddress.phone}<br />
              {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} &ndash; {order.shippingAddress.pincode}
            </div>
          </div>
        )}

        <div className="profile-order-detail__section">
          <div className="profile-order-detail__section-title">Price Details</div>
          <div style={{ fontSize: 14, color: "#475569", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Items Total</span><span>₹{(order.itemsTotal || order.totalAmount).toLocaleString("en-IN")}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                <span>Discount</span><span>-₹{order.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery</span><span>{order.deliveryCharge > 0 ? `₹${order.deliveryCharge.toLocaleString("en-IN")}` : "Free"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#1e293b", borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
              <span>Total</span><span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {isCancelled && order.cancelReason && (
          <div className="profile-order-detail__section">
            <div className="profile-order-detail__section-title">Cancellation</div>
            <p style={{ fontSize: 14, color: "#dc2626" }}>{order.cancelReason}</p>
          </div>
        )}

        {canCancel && (
          <div className="profile-order-detail__section" style={{ textAlign: "right" }}>
            <button
              className="profile-order-card__btn profile-order-card__btn--cancel"
              onClick={() => onCancel(order._id)}
              disabled={cancelling === order._id}
            >
              {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function MyOrdersTab() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderApi.getMyOrders()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      const updated = await orderApi.cancel(orderId, "Cancelled by user");
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      if (selectedOrder?._id === updated._id) setSelectedOrder(updated);
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="profile-content__empty">
        <Package size={48} />
        <p>No orders yet</p>
        <button className="profile-form__save" style={{ marginTop: 16 }} onClick={() => navigate("/")}>
          Start Shopping
        </button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onCancel={handleCancel}
        cancelling={cancelling}
      />
    );
  }

  return (
    <>
      <h2 className="profile-content__title">My Orders</h2>
      <div className="profile-orders">
        {orders.map((order) => {
          const sc = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
          const StatusIcon = sc.icon;
          const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          });
          const canCancel = ["placed", "confirmed"].includes(order.orderStatus);

          return (
            <div key={order._id} className="profile-order-card">
              <div className="profile-order-card__header">
                <div>
                  <span className="profile-order-card__number">#{order.orderNumber}</span>
                  <span className="profile-order-card__date">{orderDate}</span>
                </div>
                <span className="profile-order-card__status" style={{ color: sc.color, background: `${sc.color}14` }}>
                  <StatusIcon size={14} /> {sc.label}
                </span>
              </div>

              <div className="profile-order-card__items">
                {order.items.map((item, i) => (
                  <div key={i} className="profile-order-card__item">
                    <img src={item.image} alt={item.name} className="profile-order-card__img" />
                    <div className="profile-order-card__item-info">
                      <p className="profile-order-card__item-name">{item.name}</p>
                      <span className="profile-order-card__item-qty">Qty: {item.quantity}</span>
                      <span className="profile-order-card__item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profile-order-card__footer">
                <div className="profile-order-card__total">
                  <span>Total:</span>
                  <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                  <span className="profile-order-card__payment">{order.paymentMethod}</span>
                </div>
                <div className="profile-order-card__actions">
                  <button
                    className="profile-order-card__btn"
                    style={{ background: "#f0f7ff", color: "#3b82f6", border: "1px solid #bfdbfe" }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    View Details
                  </button>
                  {canCancel && (
                    <button
                      className="profile-order-card__btn profile-order-card__btn--cancel"
                      onClick={() => handleCancel(order._id)}
                      disabled={cancelling === order._id}
                    >
                      {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   WISHLIST TAB
   ═══════════════════════════════════════════════════════════════════ */

function WishlistTab() {
  const navigate = useNavigate();
  const { user, toggleWishlist } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.wishlist || user.wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    Promise.all(
      user.wishlist.map((id) =>
        storeApi.getProductById(id).catch(() => null)
      )
    ).then((results) => {
      setProducts(results.filter(Boolean));
      setLoading(false);
    });
  }, [user?.wishlist]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>Loading wishlist...</div>;
  }

  return (
    <>
      <h2 className="profile-content__title">My Wishlist</h2>
      {products.length === 0 ? (
        <div className="profile-content__empty">
          <Heart size={48} />
          <p>Your wishlist is empty</p>
          <button className="profile-form__save" style={{ marginTop: 16 }} onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="profile-wishlist-grid">
          {products.map((p) => (
            <div key={p._id} className="profile-wishlist-card" onClick={() => navigate(`/product/${p._id}`)}>
              <button
                className="profile-wishlist-card__remove"
                onClick={(e) => { e.stopPropagation(); toggleWishlist(p._id); }}
                title="Remove from wishlist"
              >
                <X size={16} />
              </button>
              <img src={p.images?.[0] || p.image || ""} alt={p.name} className="profile-wishlist-card__img" />
              <div className="profile-wishlist-card__info">
                <span className="profile-wishlist-card__brand">{p.brand}</span>
                <p className="profile-wishlist-card__name">{p.name}</p>
                <div className="profile-wishlist-card__pricing">
                  <span className="profile-wishlist-card__price">₹{Number(p.price).toLocaleString("en-IN")}</span>
                  {p.originalPrice && (
                    <span className="profile-wishlist-card__original">₹{Number(p.originalPrice).toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MY PROFILE TAB
   ═══════════════════════════════════════════════════════════════════ */

function MyProfileTab() {
  const { user, updateProfile, changePassword } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [passForm, setPassForm] = useState({ current: "", next: "" });
  const [passMsg, setPassMsg] = useState("");

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await updateProfile({ name: form.name, phone: form.phone });
      setSaveMsg("Saved successfully!");
    } catch (err) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg("");
    try {
      await changePassword(passForm.current, passForm.next);
      setPassMsg("Password updated!");
      setPassForm({ current: "", next: "" });
    } catch (err) {
      setPassMsg(err.message);
    } finally {
      setTimeout(() => setPassMsg(""), 3000);
    }
  };

  return (
    <>
      <h2 className="profile-content__title">My Profile</h2>
      <div className="profile-form">
        <div className="profile-form__row">
          <div className="profile-form__field">
            <label className="profile-form__label">Full Name*</label>
            <input
              className="profile-form__input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="profile-form__field">
            <label className="profile-form__label">Mobile Number</label>
            <input
              className="profile-form__input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>
        </div>

        <div className="profile-form__row">
          <div className="profile-form__field">
            <label className="profile-form__label">Email ID</label>
            <div className="profile-form__input-icon">
              <input className="profile-form__input" value={user?.email || ""} readOnly />
              <Pencil size={14} className="profile-form__edit-icon" />
            </div>
          </div>
        </div>

        {saveMsg && (
          <p style={{ color: saveMsg.includes("uccess") ? "#16a34a" : "#dc2626", fontSize: 13, marginBottom: 8 }}>
            {saveMsg}
          </p>
        )}
        <div className="profile-form__actions">
          <button className="profile-form__discard" onClick={() => setForm({ name: user?.name || "", phone: user?.phone || "" })}>
            Discard Changes
          </button>
          <button className="profile-form__save" onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <h3 className="profile-content__title" style={{ marginTop: 32, fontSize: 16 }}>Change Password</h3>
        <form className="profile-form" onSubmit={handleChangePassword}>
          <div className="profile-form__row">
            <div className="profile-form__field">
              <label className="profile-form__label">Current Password</label>
              <input
                type="password"
                className="profile-form__input"
                value={passForm.current}
                onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                required
              />
            </div>
            <div className="profile-form__field">
              <label className="profile-form__label">New Password</label>
              <input
                type="password"
                className="profile-form__input"
                value={passForm.next}
                onChange={(e) => setPassForm({ ...passForm, next: e.target.value })}
                minLength={6}
                required
              />
            </div>
          </div>
          {passMsg && (
            <p style={{ color: passMsg.includes("updated") ? "#16a34a" : "#dc2626", fontSize: 13, marginBottom: 8 }}>
              {passMsg}
            </p>
          )}
          <div className="profile-form__actions">
            <button type="submit" className="profile-form__save">Update Password</button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MY ADDRESS TAB
   ═══════════════════════════════════════════════════════════════════ */

function MyAddressTab() {
  const navigate = useNavigate();
  const { user, deleteAddress } = useAuth();

  return (
    <>
      <h2 className="profile-content__title">Saved Addresses</h2>
      {(!user?.addresses || user.addresses.length === 0) ? (
        <div className="profile-content__empty">
          <MapPin size={48} />
          <p>No saved addresses</p>
          <button className="profile-form__save" style={{ marginTop: 16 }} onClick={() => navigate("/address")}>
            Add New Address
          </button>
        </div>
      ) : (
        <div className="profile-addresses">
          {user.addresses.map((addr) => (
            <div key={addr._id} className="profile-addr-card">
              <div className="profile-addr-card__head">
                <span className="profile-addr-card__label">{addr.label}</span>
                {addr.isDefault && <span className="profile-addr-card__default">Default</span>}
              </div>
              <p className="profile-addr-card__name">{addr.fullName} · {addr.phone}</p>
              <p className="profile-addr-card__line">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
              <p className="profile-addr-card__line">{addr.city}, {addr.state} – {addr.pincode}</p>
              <button
                className="profile-addr-card__delete"
                onClick={() => deleteAddress(addr._id)}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ))}
          <button className="profile-form__save" onClick={() => navigate("/address")}>
            + Add New Address
          </button>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SERVICE TAB
   ═══════════════════════════════════════════════════════════════════ */

function ServiceTab() {
  return (
    <div className="profile-content__empty">
      <Wrench size={48} />
      <p>No service requests</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROFILE PAGE (layout + routing)
   ═══════════════════════════════════════════════════════════════════ */

export default function ProfilePage() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const { user, logout } = useAuth();

  // Resolve the active tab from the URL param, fallback to "profile"
  const activeTab = VALID_TABS.includes(tab) ? tab : "profile";

  const handleNav = (key) => {
    if (key === "logout") { logout(); navigate("/"); return; }
    navigate(key === "profile" ? "/profile" : `/profile/${key}`);
  };

  return (
    <div className="profile-page">
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">My Account</span>
      </div>

      <div className="container profile-page__body">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar__avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="profile-sidebar__name">{user?.name}</p>
          <p className="profile-sidebar__email">{user?.email}</p>
          <div className="profile-sidebar__section-label">Account</div>
          <nav className="profile-sidebar__nav">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`profile-sidebar__item ${activeTab === key ? "profile-sidebar__item--active" : ""}`}
                onClick={() => handleNav(key)}
              >
                <Icon size={18} className="profile-sidebar__item-icon" />
                <span>{label}</span>
                <ChevronRight size={16} className="profile-sidebar__item-arrow" />
              </button>
            ))}
          </nav>
        </aside>

        {/* Content — each tab is its own component */}
        <div className="profile-content">
          {activeTab === "profile" && <MyProfileTab />}
          {activeTab === "address" && <MyAddressTab />}
          {activeTab === "orders" && <MyOrdersTab />}
          {activeTab === "service" && <ServiceTab />}
          {activeTab === "wishlist" && <WishlistTab />}
        </div>
      </div>
    </div>
  );
}
