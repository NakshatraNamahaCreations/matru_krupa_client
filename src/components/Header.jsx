import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Heart, User, MapPin,
  Store, Menu, X, ChevronRight, Building2, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const categories = [
  "Televisions",
  "Home Appliances",
  "Kitchen Appliances",
  "Audio & Vedio",
  "Laptops & Tablets",
  "Phones & Wearables",
];

export default function Header() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleCategoryClick = (cat) => {
    setMenuOpen(false);
    navigate(`/category/${encodeURIComponent(cat)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      {/* Top utility bar */}
      <div className="header__topbar">
        <div className="header__topbar-inner container">
          <div className="header__topbar-left">
            <span className="header__topbar-item">
              <Store size={14} />
              Find In Stores
            </span>
          </div>
          <div className="header__topbar-right">
            <span className="header__topbar-item" onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
              <ShoppingCart size={14} />
              Cart
              {totalItems > 0 && <span className="header__badge">{totalItems}</span>}
            </span>
            <span
              className="header__topbar-item"
              onClick={() => isLoggedIn ? navigate("/profile/wishlist") : navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              <Heart size={14} />
              Wishlist
              {wishlistCount > 0 && <span className="header__badge">{wishlistCount}</span>}
            </span>
            {isLoggedIn ? (
              <>
                <span
                  className="header__topbar-item"
                  onClick={() => navigate("/profile")}
                  style={{ cursor: "pointer" }}
                >
                  <User size={14} />
                  {user.name.split(" ")[0]}
                </span>
                <span
                  className="header__topbar-item"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <LogOut size={14} />
                  Logout
                </span>
              </>
            ) : (
              <span
                className="header__topbar-item"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                <User size={14} />
                Login
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="header__main">
        <div className="header__main-inner container">
          {/* Logo */}
          <div className="header__logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <span className="header__logo-text">Matru Krupa Enterprise</span>
          </div>

          {/* Nav Controls */}
          <div className="header__nav">
            <button
              className={`header__nav-btn ${menuOpen ? "header__nav-btn--active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
              <span>Menu</span>
            </button>
            <button className="header__nav-btn">
              <MapPin size={18} />
              <span className="header__location-text">Select your Location</span>
            </button>
          </div>

          {/* Search */}
          <form
            className={`header__search ${searchFocused ? "header__search--focused" : ""}`}
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/category/${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
              }
            }}
          >
            <Search size={18} className="header__search-icon" />
            <input
              type="text"
              placeholder="Search Products & Brands"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="header__search-input"
            />
            {searchQuery && (
              <button type="button" className="header__search-clear" onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="menu-drawer__franchise" onClick={() => setMenuOpen(false)}>
              <Building2 size={20} className="menu-drawer__franchise-icon" />
              <span>Franchise Opportunity</span>
            </div>

            <div className="menu-drawer__section-title">Shop by Category</div>
            <div className="menu-drawer__divider" />
            <nav className="menu-drawer__nav">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="menu-drawer__item"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <span>{cat}</span>
                  <ChevronRight size={18} className="menu-drawer__chevron" />
                </button>
              ))}
            </nav>

            {isLoggedIn && (
              <>
                <div className="menu-drawer__divider" />
                <button className="menu-drawer__item" onClick={() => { setMenuOpen(false); navigate("/profile"); }}>
                  <span>My Profile</span>
                  <ChevronRight size={18} className="menu-drawer__chevron" />
                </button>
                <button className="menu-drawer__item" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                  <span>Logout</span>
                  <ChevronRight size={18} className="menu-drawer__chevron" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
