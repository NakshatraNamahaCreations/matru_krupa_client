import { useNavigate } from "react-router-dom";
import { Trash2, Heart, Truck, ShieldCheck, Tag, ChevronRight, Plus, Minus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function getItemDetails(item) {
  const product = item.product || item;
  const productId = product._id || product.id;

  // Price: use item.price (snapshot) for logged-in, or extract numeric price
  let unitPrice = item.price || 0;
  if (!unitPrice && product.price) {
    unitPrice = typeof product.price === "string"
      ? Number(product.price.replace(/[₹,]/g, ""))
      : Number(product.price);
  }

  // Original price (MRP)
  let originalPrice = product.numericOriginalPrice || product.originalPrice || 0;
  if (typeof originalPrice === "string") {
    originalPrice = Number(originalPrice.replace(/[₹,]/g, "")) || 0;
  }

  // Discount %
  const discount = originalPrice > unitPrice
    ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
    : 0;

  // Image
  const image = product.images?.[0] || product.image || "";

  return { product, productId, unitPrice, originalPrice, discount, image };
}

export default function CartPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, toggleWishlist } = useAuth();
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  const deliveryCharge = totalAmount >= 500 ? 0 : 49;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="cart-page__heading">My cart</h1>
          <div className="cart-empty">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521508-4610092.png"
              alt="Empty Cart"
              className="cart-empty__img"
            />
            <h2 className="cart-empty__title">Empty Cart</h2>
            <p className="cart-empty__sub">Browse items and add them to your cart</p>
            <button className="cart-empty__btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals for summary
  const summaryItems = items.map((item) => {
    const { unitPrice, originalPrice } = getItemDetails(item);
    return { unitPrice, originalPrice, quantity: item.quantity };
  });
  const subtotal = summaryItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const totalMRP = summaryItems.reduce((s, i) => s + (i.originalPrice || i.unitPrice) * i.quantity, 0);
  const totalDiscount = totalMRP - subtotal;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__heading">
            My cart <span className="cart-page__count">({items.length} {items.length === 1 ? "item" : "items"})</span>
          </h1>
          <button className="cart-page__clear" onClick={clearCart} disabled={loading}>
            <Trash2 size={16} />
            Empty Cart
          </button>
        </div>

        <div className="cart-page__body">
          {/* Left: Items */}
          <div className="cart-items">
            {items.map((item) => {
              const { product, productId, unitPrice, originalPrice, discount, image } = getItemDetails(item);
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={productId} className="cart-item">
                  <img
                    src={image}
                    alt={product.name}
                    className="cart-item__img"
                    onClick={() => navigate(`/product/${productId}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="cart-item__info">
                    <p
                      className="cart-item__name"
                      onClick={() => navigate(`/product/${productId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </p>
                    {product.brand && <p className="cart-item__brand">{product.brand}</p>}
                    <div className="cart-item__pricing">
                      <span className="cart-item__price">₹{lineTotal.toLocaleString("en-IN")}</span>
                      {originalPrice > 0 && originalPrice !== unitPrice && (
                        <span className="cart-item__original">
                          ₹{(originalPrice * item.quantity).toLocaleString("en-IN")}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="cart-item__discount">{discount}% Off</span>
                      )}
                    </div>
                    <p className="cart-item__tax">Inclusive of all taxes</p>
                    <div className="cart-item__delivery">
                      <Truck size={14} />
                      {subtotal >= 500 ? "Free Delivery" : "Delivery ₹49"}
                    </div>

                    {/* Quantity controls */}
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="cart-item__qty-val">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        disabled={loading}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="cart-item__actions">
                      {isLoggedIn && (
                        <button
                          className="cart-item__btn cart-item__btn--primary"
                          onClick={() => { toggleWishlist(productId); removeFromCart(productId); }}
                        >
                          <Heart size={14} /> Move to Wishlist
                        </button>
                      )}
                      <button
                        className="cart-item__btn cart-item__btn--outline"
                        onClick={() => removeFromCart(productId)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Summary */}
          <div className="cart-summary">
            <button className="cart-coupon">
              <Tag size={16} className="cart-coupon__icon" />
              <span>Apply Coupon code</span>
              <ChevronRight size={16} className="cart-coupon__arrow" />
            </button>

            <div className="cart-payment">
              <h3 className="cart-payment__title">Payment Summary</h3>
              <div className="cart-payment__rows">
                {totalMRP > subtotal && (
                  <div className="cart-payment__row">
                    <span>Total MRP</span>
                    <span>₹{totalMRP.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="cart-payment__row cart-payment__row--green">
                    <span>Discount</span>
                    <span>- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="cart-payment__row">
                  <span>Price ({items.length} {items.length === 1 ? "item" : "items"})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="cart-payment__row">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharge === 0
                      ? <span style={{ color: "#16a34a" }}>FREE</span>
                      : `₹${deliveryCharge}`
                    }
                  </span>
                </div>
                <div className="cart-payment__row cart-payment__row--total">
                  <span>Total</span>
                  <span>₹{(subtotal + deliveryCharge).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button
                className="cart-payment__cta"
                onClick={() => {
                  if (!isLoggedIn) return navigate("/login", { state: { from: "/cart" } });
                  const hasAddress = user?.addresses?.length > 0;
                  navigate(hasAddress ? "/checkout" : "/address");
                }}
              >
                {isLoggedIn ? (user?.addresses?.length > 0 ? "Proceed to Checkout" : "Add Address to Proceed") : "Login to Proceed"}
              </button>
            </div>

            <div className="cart-secure">
              <ShieldCheck size={18} className="cart-secure__icon" />
              <span>Safe &amp; Secure Payments. 100% Authentic Products.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
