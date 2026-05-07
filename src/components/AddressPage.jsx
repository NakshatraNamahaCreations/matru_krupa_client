import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Navigation, ChevronRight, MapPin, Check, Trash2, Edit2, Plus, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  fullName: "",
  phone: "",
  pincode: "",
  line1: "",
  line2: "",
  locality: "",
  city: "",
  state: "",
  label: "Home",
  isDefault: false,
};

export default function AddressPage() {
  const navigate = useNavigate();
  const { user, addAddress, updateAddress, deleteAddress } = useAuth();
  const addresses = user?.addresses || [];

  const [view, setView] = useState(addresses.length > 0 ? "list" : "search"); // "list" | "search" | "form"
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState("");
  const [mapQuery, setMapQuery] = useState("India");

  // Pre-fill name & phone from user profile
  useEffect(() => {
    if (user && !editingId) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user, editingId]);

  const set = (k, v) => { setForm((prev) => ({ ...prev, [k]: v })); setError(""); };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setView("form");
      return;
    }

    setDetecting(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapQuery(`${latitude},${longitude}`);

        try {
          // Reverse geocode using free Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          const locality = addr.suburb || addr.neighbourhood || addr.village || addr.town || "";
          const city = addr.city || addr.state_district || addr.county || "";
          const state = addr.state || "";
          const pincode = addr.postcode || "";
          const display = data.display_name || "";

          setDetectedLocation(
            `${locality}${locality && city ? ", " : ""}${city}${pincode ? " " + pincode : ""}`
          );
          setForm((prev) => ({
            ...prev,
            locality,
            city,
            state,
            pincode,
          }));
        } catch {
          setDetectedLocation("Location detected");
        }

        setDetecting(false);
        setView("form");
      },
      (err) => {
        setDetecting(false);
        if (err.code === 1) {
          setError("Location permission denied. Please allow location access or enter address manually.");
        } else {
          setError("Unable to detect location. Please enter address manually.");
        }
        setView("form");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearchFocus = () => {
    setDetectedLocation("");
    setView("form");
  };

  const handleEdit = (addr) => {
    setEditingId(addr._id);
    setForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      pincode: addr.pincode || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      locality: "",
      city: addr.city || "",
      state: addr.state || "",
      label: addr.label || "Home",
      isDefault: addr.isDefault || false,
    });
    setDetectedLocation("");
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
    } catch (err) {
      alert(err.message || "Failed to delete address");
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      fullName: user?.name || "",
      phone: user?.phone || "",
    });
    setDetectedLocation("");
    setError("");
    setView("search");
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) return "Valid mobile number is required";
    if (!form.pincode.trim() || form.pincode.replace(/\D/g, "").length < 6) return "Valid 6-digit PIN code is required";
    if (!form.line1.trim()) return "Address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.state.trim()) return "State is required";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    setError("");
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        pincode: form.pincode.trim(),
        line1: form.line1.trim(),
        line2: [form.line2, form.locality].filter(Boolean).join(", ").trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        label: form.label,
        isDefault: form.isDefault,
      };

      if (editingId) {
        await updateAddress(editingId, payload);
      } else {
        await addAddress(payload);
      }

      setEditingId(null);
      setForm({ ...emptyForm });
      setView("list");
    } catch (err) {
      setError(err.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAddress = async (addr) => {
    // Set as default if not already, then go to cart
    if (!addr.isDefault) {
      try {
        await updateAddress(addr._id, { ...addr, isDefault: true });
      } catch {}
    }
    navigate("/checkout", { state: { addressId: addr._id } });
  };

  // ── Render: Address List ──
  if (view === "list" && addresses.length > 0) {
    return (
      <div className="address-page">
        <div className="breadcrumb container">
          <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
          <span className="breadcrumb__sep">&gt;</span>
          <span className="breadcrumb__link" onClick={() => navigate("/cart")}>Cart</span>
          <span className="breadcrumb__sep">&gt;</span>
          <span className="breadcrumb__current">Select Address</span>
        </div>
        <div className="container">
          <div className="addr-wrap">
            <div className="addr-list-header">
              <h2 className="addr-wrap__title">Select Delivery Address</h2>
              <button className="addr-add-new-btn" onClick={handleAddNew}>
                <Plus size={16} /> Add New Address
              </button>
            </div>

            <div className="addr-list">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`addr-card ${addr.isDefault ? "addr-card--default" : ""}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="addr-card__top">
                    <span className="addr-card__label">{addr.label || "Home"}</span>
                    {addr.isDefault && (
                      <span className="addr-card__badge"><Check size={12} /> Default</span>
                    )}
                  </div>
                  <p className="addr-card__name">{addr.fullName}</p>
                  <p className="addr-card__line">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                  </p>
                  <p className="addr-card__line">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="addr-card__phone">Phone: {addr.phone}</p>
                  <div className="addr-card__actions">
                    <button
                      className="addr-card__btn"
                      onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="addr-card__btn addr-card__btn--danger"
                      onClick={(e) => { e.stopPropagation(); handleDelete(addr._id); }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Search / Form ──
  return (
    <div className="address-page">
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__link" onClick={() => navigate("/cart")}>Cart</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Add Address</span>
      </div>

      <div className="container">
        <div className="addr-wrap">
          <div className="addr-list-header">
            <h2 className="addr-wrap__title">{editingId ? "Edit Address" : "Add New Address"}</h2>
            {addresses.length > 0 && (
              <button className="addr-add-new-btn" onClick={() => setView("list")}>
                Back to Addresses
              </button>
            )}
          </div>

          {view === "search" ? (
            <div className="addr-search">
              <div className="addr-search__box">
                <Search size={16} className="addr-search__icon" />
                <input
                  className="addr-search__input"
                  placeholder="Search building name, landmark, area.."
                  onFocus={handleSearchFocus}
                />
              </div>
              <button
                className="addr-search__location"
                onClick={handleUseCurrentLocation}
                disabled={detecting}
              >
                {detecting ? (
                  <Loader2 size={16} className="addr-search__loc-icon addr-spin" />
                ) : (
                  <Navigation size={16} className="addr-search__loc-icon" />
                )}
                <span>{detecting ? "Detecting location..." : "Use Current Location"}</span>
                <ChevronRight size={16} className="addr-search__arrow" />
              </button>
              {error && <p className="addr-error">{error}</p>}
            </div>
          ) : (
            <div className="addr-form-wrap">
              {/* Map */}
              <div className="addr-map">
                <iframe
                  title="map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=14`}
                  className="addr-map__iframe"
                  allowFullScreen
                />
              </div>

              {/* Detected address */}
              {detectedLocation && (
                <div className="addr-detected">
                  <MapPin size={16} className="addr-detected__icon" />
                  <span className="addr-detected__text">{detectedLocation}</span>
                  <button className="addr-detected__change" onClick={handleAddNew}>Change</button>
                </div>
              )}

              {/* Form */}
              <div className="addr-form">
                <div className="addr-form__row">
                  <div className="addr-form__field">
                    <label className="addr-form__label">Full Name *</label>
                    <input className="addr-form__input" placeholder="Enter full name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                  </div>
                  <div className="addr-form__field">
                    <label className="addr-form__label">Mobile Number *</label>
                    <div className="addr-form__mobile">
                      <span className="addr-form__mobile-code">+91</span>
                      <input className="addr-form__input addr-form__input--mobile" placeholder="Enter mobile number" value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={10} />
                    </div>
                  </div>
                </div>
                <div className="addr-form__row">
                  <div className="addr-form__field">
                    <label className="addr-form__label">PIN Code *</label>
                    <input className="addr-form__input" placeholder="Enter 6-digit PIN code" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6} />
                  </div>
                  <div className="addr-form__field">
                    <label className="addr-form__label">City *</label>
                    <input className="addr-form__input" placeholder="Enter city" value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                </div>
                <div className="addr-form__field addr-form__field--full">
                  <label className="addr-form__label">Address (Flat no, Building, Street) *</label>
                  <input className="addr-form__input" placeholder="Flat no, Building, Company name, Street" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
                </div>
                <div className="addr-form__row">
                  <div className="addr-form__field">
                    <label className="addr-form__label">Landmark</label>
                    <input className="addr-form__input" placeholder="Nearby landmark" value={form.line2} onChange={(e) => set("line2", e.target.value)} />
                  </div>
                  <div className="addr-form__field">
                    <label className="addr-form__label">Locality / Area</label>
                    <input className="addr-form__input" placeholder="Locality or area" value={form.locality} onChange={(e) => set("locality", e.target.value)} />
                  </div>
                </div>
                <div className="addr-form__field addr-form__field--full">
                  <label className="addr-form__label">State *</label>
                  <input className="addr-form__input" placeholder="Enter state" value={form.state} onChange={(e) => set("state", e.target.value)} />
                </div>

                <div className="addr-type">
                  {["Home", "Work", "Other"].map((t) => (
                    <label key={t} className="addr-type__option">
                      <input type="radio" name="addrType" value={t} checked={form.label === t} onChange={() => set("label", t)} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>

                <label className="addr-default">
                  <input type="checkbox" checked={form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} />
                  <span>Make this my default address</span>
                </label>

                {error && <p className="addr-error">{error}</p>}

                <div className="addr-form__actions">
                  <button className="addr-save" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                  </button>
                  {(addresses.length > 0 || editingId) && (
                    <button className="addr-cancel" onClick={() => { setEditingId(null); setView(addresses.length > 0 ? "list" : "search"); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
