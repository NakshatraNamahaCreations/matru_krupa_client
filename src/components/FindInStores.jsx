import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Maximize2, Phone } from "lucide-react";

const STORES = [
  {
    id: 1,
    name: "Matru Kripa Enterprises",
    distance: "2.3 km",
    address: "Banashankari 3rd Stage, Bengaluru 560085",
    phone: "9900029279",
    lat: 12.9255,
    lng: 77.5468,
  },
  {
    id: 2,
    name: "Matru Kripa Enterprises",
    distance: "3.9 km",
    address: "Jp Nagar 1st Stage, Bengaluru 560019",
    phone: "9887642190",
    lat: 12.9082,
    lng: 77.5855,
  },
  {
    id: 3,
    name: "Matru Kripa Enterprises",
    distance: "5.6 km",
    address: "Jayanagar 4th Block, Bengaluru 560011",
    phone: "9845112233",
    lat: 12.9250,
    lng: 77.5938,
  },
  {
    id: 4,
    name: "Matru Kripa Enterprises",
    distance: "7.2 km",
    address: "Koramangala 5th Block, Bengaluru 560095",
    phone: "9844509871",
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: 5,
    name: "Matru Kripa Enterprises",
    distance: "9.4 km",
    address: "Indiranagar 100ft Road, Bengaluru 560038",
    phone: "9900456789",
    lat: 12.9719,
    lng: 77.6412,
  },
];

export default function FindInStores() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(STORES[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STORES;
    return STORES.filter(
      (s) =>
        s.address.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    );
  }, [query]);

  const active = STORES.find((s) => s.id === activeId) || STORES[0];
  const mapSrc = `https://maps.google.com/maps?q=${active.lat},${active.lng}&z=12&output=embed`;

  const openFullscreen = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <>
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Find In Stores</span>
      </div>

      <section className="store-locator section-pad">
        <div className="container">
          <h2 className="store-locator__title">Store Locator</h2>

          <div className="store-locator__grid">
            {/* Left: search + list */}
            <aside className="store-panel">
              <h3 className="store-panel__heading">Find a store near you</h3>

              <div className="store-panel__search">
                <input
                  type="text"
                  placeholder="Enter city name or pincode"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search size={18} />
              </div>

              <ul className="store-list">
                {filtered.map((store) => (
                  <li
                    key={store.id}
                    className={`store-card ${store.id === activeId ? "store-card--active" : ""}`}
                    onClick={() => setActiveId(store.id)}
                  >
                    <div className="store-card__top">
                      <p className="store-card__name">{store.name}</p>
                      <span className="store-card__distance">{store.distance}</span>
                    </div>
                    <p className="store-card__address">{store.address}</p>
                    <a
                      className="store-card__call"
                      href={`tel:${store.phone}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={13} />
                      Call: {store.phone}
                    </a>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="store-list__empty">No stores match “{query}”.</li>
                )}
              </ul>
            </aside>

            {/* Right: map */}
            <div className="store-map">
              <button
                className="store-map__fullscreen"
                onClick={openFullscreen}
                aria-label="Open in Google Maps"
              >
                <Maximize2 size={16} />
              </button>
              <iframe
                key={active.id}
                title={`Map for ${active.name}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
