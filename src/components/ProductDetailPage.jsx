import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { storeApi } from "../services/api";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Star,
  Plus,
  Check,
  AlertCircle,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { sonyBraviaProduct, recentlyViewedProducts } from "../data/products";

/* ── Star Rating ─────────────────────────────────────────────────── */
function StarRating({ value, max = 5, size = 14 }) {
  return (
    <span className="star-rating">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(value)
              ? "star-rating__star--filled"
              : "star-rating__star--empty"
          }
        />
      ))}
    </span>
  );
}

/* ── Product Gallery ─────────────────────────────────────────────── */
function ProductGallery({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn, toggleWishlist, isWishlisted } = useAuth();
  const { addToCart, isInCart, loading: cartLoading } = useCart();
  const [active, setActive] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = async () => {
    await addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div className="pd-gallery">
      <div className="pd-gallery__actions">
        <button
          className={`pd-gallery__action-btn ${wishlisted ? "pd-gallery__action-btn--active" : ""}`}
          aria-label="Wishlist"
          onClick={handleWishlist}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <button className="pd-gallery__action-btn" aria-label="Share">
          <Share2 size={18} />
        </button>
      </div>

      {/* Main image */}
      <div className="pd-gallery__main">
        <img
          src={product.images[active]}
          alt={product.name}
          className="pd-gallery__img"
        />
      </div>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="pd-gallery__thumbs">
          {product.images.map((src, i) => (
            <button
              key={i}
              className={`pd-gallery__thumb ${i === active ? "pd-gallery__thumb--active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img
                src={src}
                alt={`View ${i + 1}`}
                className="pd-gallery__thumb-img"
              />
            </button>
          ))}
        </div>
      )}

      {/* Compare & Connect */}
      <div className="pd-gallery__meta">
        <label className="pd-gallery__compare">
          <input type="checkbox" />
          <span>Compare</span>
        </label>
        <button className="pd-gallery__connect">
          <MapPin size={14} />
          Connect to stores
        </button>
      </div>

      {/* CTA Buttons */}
      <div className="pd-gallery__ctas">
        <button
          className={`pd-cta pd-cta--cart ${inCart ? "pd-cta--in-cart" : ""}`}
          onClick={inCart ? () => navigate("/cart") : handleAddToCart}
          disabled={cartLoading}
        >
          <ShoppingCart size={16} />
          {inCart ? "Go to Cart" : addedToCart ? "Added!" : "Add to Cart"}
        </button>
        <button
          className="pd-cta pd-cta--buy"
          onClick={() => setShowModal(true)}
        >
          <Zap size={16} />
          Buy Now
        </button>
      </div>

      {showModal && (
        <RecommendedServicesModal
          onClose={() => setShowModal(false)}
          onSkip={() => {
            setShowModal(false);
            navigate("/cart");
          }}
        />
      )}
    </div>
  );
}

/* ── Smart Savings ───────────────────────────────────────────────── */
function SmartSavings({ offers }) {
  const [open, setOpen] = useState(false);
  if (!offers || offers.length === 0) return null;

  return (
    <div className="pd-savings">
      <button className="pd-savings__header" onClick={() => setOpen(!open)}>
        <span className="pd-savings__title">
          Smart Savings{" "}
          <span className="pd-savings__count">({offers.length} Offers)</span>
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="pd-savings__body">
          {offers.map((o, i) => (
            <div key={i} className="pd-savings__offer">
              <span className="pd-savings__offer-icon">{o.icon}</span>
              <div>
                <div className="pd-savings__offer-title">{o.title}</div>
                <div className="pd-savings__offer-desc">{o.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Warranty Cards ──────────────────────────────────────────────── */
function WarrantyCards({ warranties }) {
  const [selected, setSelected] = useState(null);
  if (!warranties || warranties.length === 0) return null;

  return (
    <div className="pd-warranty">
      <div className="pd-warranty__header">
        <ShieldCheck size={16} className="pd-warranty__icon" />
        <span className="pd-warranty__title">Extended warranty</span>
      </div>
      <div className="pd-warranty__grid">
        {warranties.map((w, i) => (
          <div
            key={i}
            className={`pd-warranty__card ${selected === i ? "pd-warranty__card--selected" : ""}`}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <div className="pd-warranty__card-top">
              <span className="pd-warranty__card-label">{w.label}</span>
              {selected === i && (
                <Check size={14} className="pd-warranty__card-check" />
              )}
            </div>
            <p className="pd-warranty__card-title">{w.title}</p>
            <p className="pd-warranty__card-sub">{w.subTitle}</p>
            <div className="pd-warranty__card-footer">
              <span className="pd-warranty__card-price">{w.price}</span>
              <button className="pd-warranty__add-btn">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Key Features ────────────────────────────────────────────────── */
function KeyFeatures({ features }) {
  const [expanded, setExpanded] = useState(false);
  if (!features || features.length === 0) return null;
  const visible = expanded ? features : features.slice(0, 4);

  return (
    <div className="pd-features">
      <h3 className="pd-features__title">Key Features</h3>
      <ul className="pd-features__list">
        {visible.map((f, i) => (
          <li key={i} className="pd-features__item">
            <span className="pd-features__dot" />
            {f}
          </li>
        ))}
      </ul>
      {features.length > 4 && (
        <button
          className="pd-features__toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See Less" : "See More"}{" "}
          <ChevronDown
            size={14}
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "0.2s",
            }}
          />
        </button>
      )}
    </div>
  );
}

/* ── Essential Combos ────────────────────────────────────────────── */
function EssentialCombos({ combos }) {
  const [checked, setChecked] = useState([]);
  if (!combos || combos.length === 0) return null;

  const toggle = (id) =>
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className="pd-combos">
      <h3 className="pd-combos__title">Essential Combos</h3>
      <div className="pd-combos__list">
        {combos.map((c) => (
          <label key={c.id} className="pd-combo__item">
            <input
              type="checkbox"
              className="pd-combo__check"
              checked={checked.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            <span className="pd-combo__emoji">{c.emoji}</span>
            <div className="pd-combo__info">
              <span className="pd-combo__name">{c.name}</span>
              <div className="pd-combo__pricing">
                <span className="pd-combo__price">{c.price}</span>
                {c.originalPrice && (
                  <span className="pd-combo__original">{c.originalPrice}</span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      <button className="pd-combos__add-btn">
        Add {checked.length > 0 ? checked.length : combos.length} items to cart
      </button>
    </div>
  );
}

/* ── Specifications ──────────────────────────────────────────────── */
function Specifications({ specs }) {
  const [showAll, setShowAll] = useState(false);
  if (!specs || typeof specs !== "object" || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs);
  const visible = showAll ? entries : entries.slice(0, 3);

  return (
    <div className="pd-specs">
      <h2 className="pd-specs__heading">SPECIFICATIONS</h2>
      {visible.map(([group, fields]) => (
        <div key={group} className="pd-specs__group">
          <h3 className="pd-specs__group-title">{group.toUpperCase()}</h3>
          <div className="pd-specs__table">
            {Object.entries(fields).map(([key, val]) => (
              <div key={key} className="pd-specs__row">
                <span className="pd-specs__key">{key}</span>
                <span className="pd-specs__val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {entries.length > 3 && (
        <button
          className="pd-specs__see-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "See Less" : "See More"}{" "}
          <ChevronDown
            size={14}
            style={{
              transform: showAll ? "rotate(180deg)" : "none",
              transition: "0.2s",
            }}
          />
        </button>
      )}
    </div>
  );
}

/* ── Overview ────────────────────────────────────────────────────── */
function Overview({ overview }) {
  const [expanded, setExpanded] = useState(false);
  if (!overview || overview.length === 0) return null;
  const visible = expanded ? overview : overview.slice(0, 2);

  return (
    <div className="pd-overview">
      <h2 className="pd-overview__title">Overview</h2>
      {visible.map((item, i) => (
        <div key={i} className="pd-overview__item">
          <h3 className="pd-overview__heading">{item.heading}</h3>
          <p className="pd-overview__body">{item.body}</p>
        </div>
      ))}
      {overview.length > 2 && (
        <button
          className="pd-overview__toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See Less" : "See More"}{" "}
          <ChevronDown
            size={14}
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "0.2s",
            }}
          />
        </button>
      )}
    </div>
  );
}

/* ── Reviews ─────────────────────────────────────────────────────── */
function Reviews({ product }) {
  return (
    <div className="pd-reviews">
      <h2 className="pd-reviews__title">Reviews</h2>
      <p className="pd-reviews__sub">Review This Product</p>
      <p className="pd-reviews__desc">
        Help other customers make their decision.
      </p>
      <button className="pd-reviews__write-btn">
        <Star size={14} />
        Write a Review
      </button>
    </div>
  );
}

/* ── Recently Viewed ─────────────────────────────────────────────── */
function RecentlyViewed({ items }) {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const max = items.length - visible;

  return (
    <div className="pd-recent">
      <div className="container">
        <h2 className="pd-recent__title">Recently Viewed</h2>
        <div className="pd-recent__wrapper">
          <button
            className={`tv-carousel__arrow ${idx === 0 ? "tv-carousel__arrow--disabled" : ""}`}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="tv-carousel__viewport">
            <div
              className="tv-carousel__track"
              style={{ transform: `translateX(-${idx * (100 / visible)}%)` }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="tv-carousel__item"
                  style={{ flex: `0 0 ${100 / visible}%` }}
                >
                  <div
                    className="pd-recent__card"
                    onClick={() => navigate("/product")}
                  >
                    <div
                      className="pd-recent__card-img"
                      style={{ background: item.bg }}
                    >
                      {item.tag && (
                        <span className="tv-card__tag">{item.tag}</span>
                      )}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="pd-recent__card-img-el"
                      />
                    </div>
                    <div className="pd-recent__card-info">
                      <p className="tv-card__name">{item.name}</p>
                      <div className="tv-card__pricing">
                        <span className="tv-card__price">{item.price}</span>
                        <span className="tv-card__original">
                          {item.originalPrice}
                        </span>
                        <span className="tv-card__discount">
                          {item.discount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`tv-carousel__arrow ${idx >= max ? "tv-carousel__arrow--disabled" : ""}`}
            onClick={() => setIdx((i) => Math.min(max, i + 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Recommended Services Modal ──────────────────────────────────── */
const REC_SERVICES = [
  {
    id: 1,
    title: "1 Year Care Plan – Extended Warranty",
    subtitle: "Applicable for TVs priced from ₹20,000 to ₹35,000",
    tag: "Extend Warranty",
    desc: "This Care Plan can be availed only on purchases made through Matru Kripa Enterprises, either online or at our authorised stores. The plan becomes active after the expiry of the brand/manufacturer warranty.",
    coverage: [
      "TV panel, motherboard & internal components",
      "Speakers & display-related issues",
      "Electrical and mechanical breakdowns",
      "Preventive maintenance support",
      "Repairs due to manufacturing defects or malfunction",
    ],
    price: "₹3,149",
    perDay: "₹10/day",
  },
  {
    id: 2,
    title: "2 Years Care Plan – Extended Warranty",
    subtitle: "Applicable for TVs priced from ₹35,000 to ₹60,000",
    tag: "Extend Warranty",
    desc: "This Care Plan is available exclusively for purchases made via Matru Kripa Enterprises. Coverage starts immediately after the standard manufacturer warranty ends.",
    coverage: [
      "TV panel, power supply & internal circuits",
      "Speaker and connectivity-related issues",
      "Electrical faults & performance breakdowns",
      "Preventive maintenance & health checks",
    ],
    price: "₹9,349",
    perDay: "₹17/day",
  },
];

function RecommendedServicesModal({ onClose, onSkip }) {
  const [idx, setIdx] = useState(0);
  const [added, setAdded] = useState([]);

  return (
    <div className="rec-modal-overlay">
      <div className="rec-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rec-modal__head">
          <h2 className="rec-modal__title">Recommended Services</h2>
          <button className="rec-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="rec-modal__body">
          <button
            className="rec-modal__arrow rec-modal__arrow--prev"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="rec-modal__cards">
            {REC_SERVICES.map((s) => (
              <div
                key={s.id}
                className={`rec-card ${added.includes(s.id) ? "rec-card--added" : ""}`}
              >
                <h3 className="rec-card__title">{s.title}</h3>
                <p className="rec-card__subtitle">{s.subtitle}</p>
                <span className="rec-card__tag">{s.tag}</span>
                <p className="rec-card__desc">{s.desc}</p>
                <p className="rec-card__coverage-label">Coverage includes:</p>
                <ul className="rec-card__coverage">
                  {s.coverage.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <div className="rec-card__footer">
                  <div>
                    <span className="rec-card__price">{s.price}</span>
                    <span className="rec-card__per-day"> ({s.perDay})</span>
                    <p className="rec-card__mrp">
                      MRP (inclusive of all taxes)
                    </p>
                  </div>
                  <button
                    className={`rec-card__add ${added.includes(s.id) ? "rec-card__add--done" : ""}`}
                    onClick={() =>
                      setAdded((p) =>
                        p.includes(s.id)
                          ? p.filter((x) => x !== s.id)
                          : [...p, s.id],
                      )
                    }
                  >
                    {added.includes(s.id) ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="rec-modal__arrow rec-modal__arrow--next"
            onClick={() => setIdx((i) => Math.min(1, i + 1))}
            disabled={idx === 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="rec-modal__foot">
          <button className="rec-modal__skip" onClick={onSkip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Map API product to display format ───────────────────────────── */
function mapApiProduct(p) {
  const price = Number(p.price);
  const originalPrice = Number(p.originalPrice);
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return {
    id: p._id,
    _id: p._id,
    brand: p.brand || "",
    name: p.name,
    shortName: p.name,
    modelSeries: "",
    modelNumber: p.skuCode || "",
    image: p.images?.[0] || p.image || sonyBraviaProduct.image,
    images: p.images?.length ? p.images : p.image ? [p.image] : sonyBraviaProduct.images,
    rating: p.rating || 4,
    reviewCount: p.reviewCount || 0,
    reviewTextCount: p.reviewTextCount || 0,
    numericPrice: price,
    numericOriginalPrice: originalPrice,
    price: `₹${price.toLocaleString("en-IN")}`,
    originalPrice: originalPrice ? `₹${originalPrice.toLocaleString("en-IN")}` : null,
    discount: discount > 0 ? `${discount}% Off` : null,
    deliveryLocation: "Bengaluru 560085",
    deliveryDate: "tomorrow",
    description: p.description || "",
    keyFeatures: p.keyFeatures?.length ? p.keyFeatures : [],
    specifications: p.specifications && Object.keys(p.specifications).length > 0
      ? p.specifications
      : null,
    overview: p.overview?.length ? p.overview : [],
    smartSavings: sonyBraviaProduct.smartSavings,
    warranties: sonyBraviaProduct.warranties,
    combos: sonyBraviaProduct.combos,
    reviews: [],
  };
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setProduct(sonyBraviaProduct);
      setLoading(false);
      return;
    }
    setLoading(true);
    storeApi
      .getProductById(id)
      .then((data) => {
        const p = data?.product || data;
        if (p?._id) {
          setProduct(mapApiProduct(p));
        } else {
          setProduct(sonyBraviaProduct);
        }
      })
      .catch(() => setProduct(sonyBraviaProduct))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pd-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "#888" }}>Loading product...</div>
      </div>
    );
  }

  if (!product) return null;

  const categoryName = product.category?.name || "";

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>
          Home
        </span>
        {categoryName && (
          <>
            <span className="breadcrumb__sep">&gt;</span>
            <span
              className="breadcrumb__link"
              onClick={() => navigate(`/category/${encodeURIComponent(categoryName)}`)}
            >
              {categoryName}
            </span>
          </>
        )}
        {product.brand && (
          <>
            <span className="breadcrumb__sep">&gt;</span>
            <span className="breadcrumb__link">{product.brand}</span>
          </>
        )}
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">{product.shortName}</span>
      </div>

      {/* Main product area */}
      <div className="pd-main container">
        {/* Left: Gallery */}
        <ProductGallery product={product} />

        {/* Right: Product info */}
        <div className="pd-info">
          <h1 className="pd-info__title">{product.name}</h1>

          {/* Rating */}
          <div className="pd-info__rating">
            <span className="pd-info__rating-score">{product.rating}</span>
            <StarRating value={product.rating} />
            {product.reviewCount > 0 && (
              <span className="pd-info__rating-count">
                ({product.reviewCount} Ratings &amp; {product.reviewTextCount}{" "}
                Review)
              </span>
            )}
          </div>

          {/* Price */}
          <div className="pd-info__price-block">
            <span className="pd-info__price">{product.price}</span>
            {product.originalPrice && (
              <span className="pd-info__original">{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="pd-info__discount">{product.discount}</span>
            )}
          </div>
          <p className="pd-info__tax-note">Inclusive of all taxes</p>

          {/* Description */}
          {product.description && (
            <p className="pd-info__description">{product.description}</p>
          )}

          {/* Delivery */}
          <div className="pd-info__delivery">
            <MapPin size={14} className="pd-info__delivery-icon" />
            <span>
              Delivery at:{" "}
              <strong className="pd-info__delivery-pin">
                {product.deliveryLocation}
              </strong>
              <span className="pd-info__delivery-eta">
                {" "}
                – Will be delivered by {product.deliveryDate}
              </span>
            </span>
          </div>

          {/* Smart Savings */}
          <SmartSavings offers={product.smartSavings} />

          {/* Extended Warranty */}
          <WarrantyCards warranties={product.warranties} />

          {/* Key Features */}
          <KeyFeatures features={product.keyFeatures} />

          {/* Report issue */}
          <div className="pd-info__report">
            <AlertCircle size={14} />
            Notice any issues?{" "}
            <button className="pd-info__report-link">Report Here</button>
          </div>

          {/* Essential Combos */}
          <EssentialCombos combos={product.combos} />
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <div className="container">
          <Specifications specs={product.specifications} />
        </div>
      )}

      {/* Overview */}
      {product.overview?.length > 0 && (
        <div className="container">
          <Overview overview={product.overview} />
        </div>
      )}

      {/* Reviews */}
      <div className="container">
        <Reviews product={product} />
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed items={recentlyViewedProducts} />
    </div>
  );
}
