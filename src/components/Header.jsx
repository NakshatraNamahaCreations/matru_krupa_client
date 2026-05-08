import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Heart, User, MapPin,
  Store, Menu, X, ChevronRight, Building2, LogOut, Crosshair,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { storeApi } from "../services/api";
import LogoutConfirmModal from "./LogoutConfirmModal";

export default function Header() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [savedPincode, setSavedPincode] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("mk_pincode") || "";
  });
  const [geoStatus, setGeoStatus] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const pincodeInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    storeApi
      .getCategories()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.categories || [];
        const onlyTv = list.filter((c) =>
          (c?.name || "").toLowerCase().includes("television"),
        );
        setCategories(onlyTv);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || locationOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, locationOpen]);

  useEffect(() => {
    if (!locationOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setLocationOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locationOpen]);

  useEffect(() => {
    if (!locationOpen) return;
    const id = requestAnimationFrame(() => {
      const el = pincodeInputRef.current;
      if (el) {
        el.focus();
        el.select();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [locationOpen]);

  const openLocation = () => {
    setPincode(savedPincode);
    setGeoStatus("");
    setLocationOpen(true);
  };

  const savePincode = (raw) => {
    const clean = String(raw || "").replace(/\D/g, "").slice(0, 6);
    if (clean.length !== 6) return null;
    localStorage.setItem("mk_pincode", clean);
    setSavedPincode(clean);
    setPincode(clean);
    return clean;
  };

  const applyPincode = (e) => {
    e.preventDefault();
    const saved = savePincode(pincode);
    if (!saved) {
      setGeoStatus("Please enter a valid 6-digit pincode.");
      return;
    }
    setGeoStatus(`Saved. Delivering to ${saved}.`);
    setTimeout(() => setLocationOpen(false), 600);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation is not supported by this browser.");
      return;
    }
    setGeoStatus("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setGeoStatus("Looking up your pincode…");
          const url =
            `https://nominatim.openstreetmap.org/reverse?format=json` +
            `&lat=${coords.latitude}&lon=${coords.longitude}` +
            `&zoom=18&addressdetails=1`;
          const res = await fetch(url, { headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error("Lookup failed");
          const data = await res.json();
          const postcode = data?.address?.postcode || "";
          const saved = savePincode(postcode);
          if (!saved) {
            setGeoStatus("Couldn't read pincode here. Please enter it manually.");
            return;
          }
          setGeoStatus(`Location set to ${saved}.`);
          setTimeout(() => setLocationOpen(false), 700);
        } catch {
          setGeoStatus("Couldn't look up your pincode. Please enter it manually.");
        }
      },
      (err) => setGeoStatus(err.message || "Could not detect location."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCategoryClick = (name) => {
    setMenuOpen(false);
    navigate(`/category/${encodeURIComponent(name)}`);
  };

  const requestLogout = () => setLogoutOpen(true);

  const confirmLogout = () => {
    setLogoutOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      {/* Top utility bar */}
      <div className="header__topbar">
        <div className="header__topbar-inner container">
          <div className="header__topbar-left">
            <span
              className="header__topbar-item"
              onClick={() => navigate("/find-in-stores")}
              style={{ cursor: "pointer" }}
            >
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
                  onClick={requestLogout}
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
            <button className="header__nav-btn" onClick={openLocation}>
              <MapPin size={18} />
              <span className="header__location-text">
                {savedPincode ? `Deliver to ${savedPincode}` : "Select your Location"}
              </span>
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

      {/* Location Modal */}
      {locationOpen && (
        <div className="loc-modal-overlay" onClick={() => setLocationOpen(false)}>
          <div className="loc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="loc-modal__head">
              <h3 className="loc-modal__title">Select your delivery location</h3>
              <button
                className="loc-modal__close"
                onClick={() => setLocationOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form className="loc-modal__form" onSubmit={applyPincode}>
              <div className="loc-modal__field">
                <label htmlFor="loc-pincode" className="loc-modal__label">Enter Pincode</label>
                <input
                  id="loc-pincode"
                  ref={pincodeInputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  onFocus={(e) => e.target.select()}
                  className="loc-modal__input"
                  placeholder="6-digit pincode"
                />
              </div>
              <button type="submit" className="loc-modal__apply">Apply</button>
            </form>

            <button
              type="button"
              className="loc-modal__current"
              onClick={useCurrentLocation}
            >
              <Crosshair size={16} />
              Use my current location
            </button>

            {geoStatus && <p className="loc-modal__status">{geoStatus}</p>}

            <div className="loc-modal__divider"><span>Or</span></div>

            <p className="loc-modal__signin-text">
              To view your saved delivery address, sign in
            </p>
            <button
              type="button"
              className="loc-modal__login"
              onClick={() => {
                setLocationOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div
              className="menu-drawer__franchise"
              onClick={() => { setMenuOpen(false); navigate("/franchise"); }}
            >
              <Building2 size={20} className="menu-drawer__franchise-icon" />
              <span>Franchise Opportunity</span>
            </div>

            <div className="menu-drawer__section-title">Shop by Category</div>
            <div className="menu-drawer__divider" />
            <nav className="menu-drawer__nav">
              {categories.length === 0 ? (
                <div className="menu-drawer__item" style={{ color: "#888" }}>
                  No categories available
                </div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat._id || cat.name}
                    className="menu-drawer__item"
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight size={18} className="menu-drawer__chevron" />
                  </button>
                ))
              )}
            </nav>

            {isLoggedIn && (
              <>
                <div className="menu-drawer__divider" />
                <button className="menu-drawer__item" onClick={() => { setMenuOpen(false); navigate("/profile"); }}>
                  <span>My Profile</span>
                  <ChevronRight size={18} className="menu-drawer__chevron" />
                </button>
                <button className="menu-drawer__item" onClick={() => { setMenuOpen(false); requestLogout(); }}>
                  <span>Logout</span>
                  <ChevronRight size={18} className="menu-drawer__chevron" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </header>
  );
}
