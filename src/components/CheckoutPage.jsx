import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, CreditCard, Truck, ShieldCheck, ChevronRight, CheckCircle, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderApi } from "../services/api";

const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive" },
  { value: "UPI", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
  { value: "CARD", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { value: "NETBANKING", label: "Net Banking", icon: "🏦", desc: "All major banks" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();

  const addresses = user?.addresses || [];
  const selectedAddrId = location.state?.addressId;
  const defaultAddr = addresses.find((a) => a._id === selectedAddrId)
    || addresses.find((a) => a.isDefault)
    || addresses[0];

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(null);

  const deliveryCharge = totalAmount >= 500 ? 0 : 49;
  const grandTotal = totalAmount + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!defaultAddr) {
      setError("Please add a delivery address first.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const order = await orderApi.place({
        shippingAddressId: defaultAddr._id,
        paymentMethod,
      });
      setOrderPlaced(order);
      // Cart is cleared server-side; clear client state too
      clearCart();
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // ── Order Confirmation ──
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <CheckCircle size={64} className="order-success__icon" />
            <h1 className="order-success__title">Order Placed Successfully!</h1>
            <p className="order-success__order-no">Order #{orderPlaced.orderNumber}</p>
            <p className="order-success__msg">
              Thank you for your purchase. We'll send you a confirmation email shortly.
            </p>
            <div className="order-success__summary">
              <div className="order-success__row">
                <span>Items</span>
                <span>{orderPlaced.items?.length || 0}</span>
              </div>
              <div className="order-success__row">
                <span>Total</span>
                <span>₹{orderPlaced.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="order-success__row">
                <span>Payment</span>
                <span>{orderPlaced.paymentMethod}</span>
              </div>
            </div>
            <div className="order-success__actions">
              <button className="order-success__btn order-success__btn--primary" onClick={() => navigate("/profile/orders")}>
                <Package size={16} /> View My Orders
              </button>
              <button className="order-success__btn order-success__btn--outline" onClick={() => navigate("/")}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart guard ──
  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before checking out.</p>
            <button className="order-success__btn order-success__btn--primary" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__link" onClick={() => navigate("/cart")}>Cart</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Checkout</span>
      </div>

      <div className="container">
        <h1 className="checkout__title">Checkout</h1>

        <div className="checkout__body">
          {/* Left Column */}
          <div className="checkout__left">
            {/* Delivery Address */}
            <div className="checkout-section">
              <div className="checkout-section__header">
                <h3><MapPin size={18} /> Delivery Address</h3>
                <button className="checkout-section__change" onClick={() => navigate("/address")}>
                  Change <ChevronRight size={14} />
                </button>
              </div>
              {defaultAddr ? (
                <div className="checkout-addr">
                  <span className="checkout-addr__label">{defaultAddr.label}</span>
                  <p className="checkout-addr__name">{defaultAddr.fullName}</p>
                  <p className="checkout-addr__line">
                    {defaultAddr.line1}{defaultAddr.line2 ? `, ${defaultAddr.line2}` : ""}
                  </p>
                  <p className="checkout-addr__line">
                    {defaultAddr.city}, {defaultAddr.state} - {defaultAddr.pincode}
                  </p>
                  <p className="checkout-addr__phone">Phone: {defaultAddr.phone}</p>
                </div>
              ) : (
                <div className="checkout-addr checkout-addr--empty">
                  <p>No address saved.</p>
                  <button className="checkout-section__change" onClick={() => navigate("/address")}>
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="checkout-section">
              <h3 className="checkout-section__header">
                <Package size={18} /> Order Items ({items.length})
              </h3>
              <div className="checkout-items">
                {items.map((item) => {
                  const product = item.product || item;
                  const productId = product._id || product.id;
                  const price = item.price || 0;
                  const image = product.images?.[0] || product.image || "";
                  return (
                    <div key={productId} className="checkout-item">
                      <img src={image} alt={product.name} className="checkout-item__img" />
                      <div className="checkout-item__info">
                        <p className="checkout-item__name">{product.name}</p>
                        {product.brand && <p className="checkout-item__brand">{product.brand}</p>}
                        <div className="checkout-item__meta">
                          <span>Qty: {item.quantity}</span>
                          <span className="checkout-item__price">₹{(price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h3 className="checkout-section__header">
                <CreditCard size={18} /> Payment Method
              </h3>
              <div className="checkout-payments">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className={`checkout-payment ${paymentMethod === pm.value ? "checkout-payment--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={() => setPaymentMethod(pm.value)}
                    />
                    <span className="checkout-payment__icon">{pm.icon}</span>
                    <div>
                      <span className="checkout-payment__label">{pm.label}</span>
                      <span className="checkout-payment__desc">{pm.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="checkout__right">
            <div className="checkout-summary">
              <h3 className="checkout-summary__title">Order Summary</h3>
              <div className="checkout-summary__rows">
                <div className="checkout-summary__row">
                  <span>Items ({items.length})</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="checkout-summary__row">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? <span style={{ color: "#16a34a" }}>FREE</span> : `₹${deliveryCharge}`}</span>
                </div>
                <div className="checkout-summary__row checkout-summary__row--total">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {error && <p className="checkout-error">{error}</p>}

              <button
                className="checkout-summary__cta"
                onClick={handlePlaceOrder}
                disabled={placing || !defaultAddr}
              >
                {placing ? "Placing Order..." : `Place Order - ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>

              <div className="checkout-secure">
                <ShieldCheck size={16} />
                <span>Your payment information is secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
