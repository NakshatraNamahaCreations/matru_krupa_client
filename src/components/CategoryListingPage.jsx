import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { categoryData } from "../data/categoryProducts";
import { storeApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

function CollapsibleFilter({ label, options, selected = [], onChange }) {
  const [open, setOpen] = useState(false);
  const toggle = (o) => {
    const next = selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o];
    onChange(label, next);
  };

  return (
    <div className="lf-section">
      <button className="lf-section__head" onClick={() => setOpen(!open)}>
        <span>{label}{selected.length > 0 ? ` (${selected.length})` : ""}</span>
        <ChevronDown
          size={15}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "0.2s",
          }}
        />
      </button>
      {open && (
        <div className="lf-section__body">
          {options.map((o) => (
            <label key={o} className="lf-section__check">
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
              />
              <span>{o}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="lp-card__rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={s <= Math.round(rating) ? "#f59e0b" : "#ccc"}
        />
      ))}
      <span className="lp-card__rating-val">{rating}</span>
    </div>
  );
}

function mapProduct(p) {
  return {
    id: p._id || p.id,
    name: p.name,
    brand: p.brand || "",
    price: `₹${Number(p.price).toLocaleString("en-IN")}`,
    originalPrice: p.originalPrice
      ? `₹${Number(p.originalPrice).toLocaleString("en-IN")}`
      : null,
    discount: p.discount ? `${p.discount}% off` : null,
    rating: p.rating || 4,
    image: p.images?.[0] || p.image || "",
    bg: "#f5f5f5",
  };
}

export default function CategoryListingPage() {
  const navigate = useNavigate();
  const { name } = useParams();
  const category = decodeURIComponent(name);
  const staticData = categoryData[category];
  const { toggleWishlist, isWishlisted } = useAuth();

  const [allProducts, setAllProducts] = useState(staticData?.products || []);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(500000);
  const [discountMin, setDiscountMin] = useState(0);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showSort, setShowSort] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (label, values) => {
    setActiveFilters((prev) => ({ ...prev, [label]: values }));
  };

  // Apply filters to products
  const products = allProducts.filter((p) => {
    // Price filter
    const numPrice = typeof p.price === "string" ? Number(p.price.replace(/[₹,]/g, "")) : Number(p.price);
    if (numPrice > priceRange) return false;
    // Discount filter
    const numDiscount = typeof p.discount === "string" ? parseInt(p.discount) : (p.discount || 0);
    if (numDiscount < discountMin) return false;
    // Dynamic filters (Brand, etc.)
    for (const [label, selected] of Object.entries(activeFilters)) {
      if (selected.length === 0) continue;
      const lowerLabel = label.toLowerCase();
      if (lowerLabel === "brand") {
        if (!selected.some((s) => s.toLowerCase() === (p.brand || "").toLowerCase())) return false;
      }
    }
    return true;
  });

  useEffect(() => {
    setLoading(true);
    setActiveFilters({});
    storeApi
      .getProducts({ category: category })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products;
        if (list && list.length > 0) {
          setAllProducts(list.map(mapProduct));
        } else if (staticData?.products) {
          setAllProducts(staticData.products);
        }
      })
      .catch(() => {
        if (staticData?.products) setAllProducts(staticData.products);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const sortOptions = [
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
    "Discount",
    "Newest",
  ];

  return (
    <div className="listing-page">
      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>
          Home
        </span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">{category}</span>
      </div>

      <div className="container listing-page__body">
        {/* Filters sidebar */}
        <aside className="listing-filters">
          <h3 className="lf-title">Filters</h3>

          {/* Availability */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Availability</div>
            <label className="lf-section__check">
              <input type="checkbox" />
              <span>In Stock</span>
            </label>
          </div>

          {/* Price */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Price</div>
            <div className="lf-range">
              <div className="lf-range__labels">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                value={priceRange}
                className="lf-range__slider"
                onChange={(e) => setPriceRange(+e.target.value)}
              />
            </div>
          </div>

          {/* Discount */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Discount</div>
            <div className="lf-range">
              <div className="lf-range__labels">
                <span>{discountMin}%+</span>
                <span>60%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={discountMin}
                className="lf-range__slider"
                onChange={(e) => setDiscountMin(+e.target.value)}
              />
            </div>
          </div>

          {/* Brand filter (auto-generated from products if not in static filters) */}
          {!staticData?.filters?.some((f) => f.label === "Brand") && (() => {
            const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
            return brands.length > 0 ? (
              <CollapsibleFilter
                label="Brand"
                options={brands}
                selected={activeFilters["Brand"] || []}
                onChange={handleFilterChange}
              />
            ) : null;
          })()}

          {/* Dynamic filters per category */}
          {staticData?.filters?.map((f) => (
            <CollapsibleFilter
              key={f.label}
              label={f.label}
              options={f.options}
              selected={activeFilters[f.label] || []}
              onChange={handleFilterChange}
            />
          ))}
        </aside>

        {/* Products area */}
        <div className="listing-main">
          {/* Header row */}
          <div className="listing-main__header">
            <h1 className="listing-main__title">
              {category}
              <span className="listing-main__count">
                {" "}
                ({products.length} products)
              </span>
            </h1>
            <div
              className="listing-main__sort-wrap"
              style={{ position: "relative" }}
            >
              <button
                className="listing-main__sort"
                onClick={() => setShowSort(!showSort)}
              >
                <SlidersHorizontal size={14} /> Sort: {sortBy}
              </button>
              {showSort && (
                <div className="listing-sort__dropdown">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      className={`listing-sort__option ${sortBy === opt ? "listing-sort__option--active" : ""}`}
                      onClick={() => {
                        setSortBy(opt);
                        setShowSort(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product grid */}
          <div className="listing-grid">
            {loading ? (
              <p style={{ padding: "40px 0", color: "#888" }}>
                Loading products…
              </p>
            ) : products.length === 0 ? (
              <p style={{ padding: "40px 0", color: "#888" }}>
                No products found.
              </p>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="lp-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <button
                    className={`lp-card__wish ${isWishlisted?.(p.id) ? "lp-card__wish--active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist?.(p.id);
                    }}
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted?.(p.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <div
                    className="lp-card__img-wrap"
                    style={{ background: p.bg }}
                  >
                    <img src={p.image} alt={p.name} className="lp-card__img" />
                  </div>
                  <div className="lp-card__info">
                    <span className="lp-card__brand">{p.brand}</span>
                    <p className="lp-card__name">{p.name}</p>
                    <StarRating rating={p.rating} />
                    <div className="lp-card__pricing">
                      <span className="lp-card__price">{p.price}</span>
                      {p.originalPrice && (
                        <span className="lp-card__original">
                          {p.originalPrice}
                        </span>
                      )}
                      {p.discount && (
                        <span className="lp-card__discount">{p.discount}</span>
                      )}
                    </div>
                    <label
                      className="lp-card__compare"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input type="checkbox" />
                      <span>Compare</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="listing-pagination">
            <button className="lpag__btn">
              <ChevronLeft size={16} />
            </button>
            <button className="lpag__btn lpag__btn--active">1</button>
            <button className="lpag__btn">2</button>
            <button className="lpag__btn">3</button>
            <button className="lpag__btn">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Editorial */}
          {staticData?.editorial && (
            <div className="listing-editorial">
              <h2>{staticData.editorial.title}</h2>
              <p>{staticData.editorial.intro}</p>
              {staticData.editorial.sections?.map((s, i) => (
                <div key={i}>
                  <h3>{s.heading}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
