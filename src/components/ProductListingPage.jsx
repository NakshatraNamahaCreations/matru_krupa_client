import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const SONY_PRODUCTS = [
  {
    id: 1,
    name: "Sony 108cm 32(in) Bravia2 4K Ultra HD TV",
    image: "https://res.cloudinary.com/dflefzc57/image/upload/v1774587960/844ae7a7068c2f800606fc9951d69fd811b3c643_gplb34.jpg",
    price: "₹33,990",
    originalPrice: "₹47,900",
    discount: "22% Off",
    rating: 4.1,
    reviews: 12,
    bg: "#f4f8ff",
  },
  {
    id: 2,
    name: "Sony Bravia3 189cm 75(in) Ultra HD 4K Smart LED Google TV",
    image: "https://res.cloudinary.com/dflefzc57/image/upload/v1774587675/9f8ab0b589219fb00050b05c1cf9d32f77427d5d_d0rvn3.png",
    price: "₹1,13,990",
    originalPrice: "₹1,21,240",
    discount: "6% Off",
    rating: 4.3,
    reviews: 8,
    bg: "#f0f8ff",
  },
  {
    id: 3,
    name: "Sony 108cm 43(in) Bravia2 4K Ultra HD Google TV",
    image: "https://res.cloudinary.com/dflefzc57/image/upload/v1774587892/6b3e52073616c1b4bda4d7088c2cf2de2d70c839_funxnf.png",
    price: "₹43,990",
    originalPrice: "₹91,990",
    discount: "52% Off",
    rating: 4.2,
    reviews: 6,
    bg: "#f5f0ff",
  },
  {
    id: 4,
    name: "Sony Bravia2 139.7cm 55(in) 4K Ultra HD LED Google TV",
    image: "https://res.cloudinary.com/dflefzc57/image/upload/v1774588233/eef2aad2bcfbbe42a3f7bd634a3e8db1c2c247de_x4djmi.png",
    price: "₹62,590",
    originalPrice: "₹91,900",
    discount: "32% Off",
    rating: 4.2,
    reviews: 4,
    bg: "#fff0f5",
  },
];

const FILTERS = [
  { label: "Display Type", options: ["LED", "OLED", "QLED"] },
  { label: "Series", options: ["Bravia 2", "Bravia 3", "XR OLED"] },
  { label: "TV Operating System", options: ["Google TV", "Android TV"] },
  { label: "No. of HDMI Ports", options: ["2", "3", "4"] },
];

function FilterSection({ label, options }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const toggle = (o) => setChecked(p => p.includes(o) ? p.filter(x => x !== o) : [...p, o]);
  return (
    <div className="lf-section">
      <button className="lf-section__head" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }} />
      </button>
      {open && (
        <div className="lf-section__body">
          {options.map(o => (
            <label key={o} className="lf-section__check">
              <input type="checkbox" checked={checked.includes(o)} onChange={() => toggle(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductListingPage() {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState([]);
  const toggleWish = (id) => setWishlisted(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const [page] = useState(1);
  const [priceRange, setPriceRange] = useState([22590, 229590]);
  const [discountFilter, setDiscountFilter] = useState(0);
  const [available, setAvailable] = useState(false);
  const [screenSizes, setScreenSizes] = useState([]);
  const toggleSize = (s) => setScreenSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <div className="listing-page">
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__link" onClick={() => navigate("/category/Televisions")}>Televisions</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Sony TVs</span>
      </div>

      <div className="container listing-page__body">
        {/* Filters sidebar */}
        <aside className="listing-filters">
          <h3 className="lf-title">Filters</h3>

          {/* Available */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Available</div>
            <label className="lf-section__check">
              <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
              <span>Available</span>
            </label>
          </div>

          {/* Price */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Price</div>
            <div className="lf-range">
              <div className="lf-range__labels">
                <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
              </div>
              <input type="range" min="5000" max="500000" value={priceRange[1]} className="lf-range__slider"
                onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
            </div>
          </div>

          {/* Discount */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Discount</div>
            <div className="lf-range">
              <div className="lf-range__labels">
                <span>{discountFilter}%</span>
                <span>60%</span>
              </div>
              <input type="range" min="0" max="60" value={discountFilter} className="lf-range__slider"
                onChange={e => setDiscountFilter(+e.target.value)} />
            </div>
          </div>

          {/* Screen Size */}
          <div className="lf-section">
            <div className="lf-section__head-plain">Screen Size (Diagonal)</div>
            {["139 cm (55 inch)", "189 cm (75 inch)", "108 cm (32 inch)"].map(s => (
              <label key={s} className="lf-section__check">
                <input type="checkbox" checked={screenSizes.includes(s)} onChange={() => toggleSize(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>

          {FILTERS.map(f => <FilterSection key={f.label} label={f.label} options={f.options} />)}
        </aside>

        {/* Products area */}
        <div className="listing-main">
          <div className="listing-main__header">
            <h1 className="listing-main__title">Sony TVs <span className="listing-main__count">({SONY_PRODUCTS.length})</span></h1>
            <button className="listing-main__sort">
              <SlidersHorizontal size={14} /> Sort
            </button>
          </div>

          <div className="listing-grid">
            {SONY_PRODUCTS.map(p => (
              <div key={p.id} className="lp-card" onClick={() => navigate("/product")}>
                <button
                  className={`lp-card__wish ${wishlisted.includes(p.id) ? "lp-card__wish--active" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleWish(p.id); }}
                >
                  <Heart size={18} fill={wishlisted.includes(p.id) ? "currentColor" : "none"} />
                </button>
                <div className="lp-card__img-wrap" style={{ background: p.bg }}>
                  <img src={p.image} alt={p.name} className="lp-card__img" />
                </div>
                <div className="lp-card__info">
                  <p className="lp-card__name">{p.name}</p>
                  <div className="lp-card__pricing">
                    <span className="lp-card__price">{p.price}</span>
                    <span className="lp-card__original">{p.originalPrice}</span>
                    <span className="lp-card__discount">{p.discount}</span>
                  </div>
                  <label className="lp-card__compare">
                    <input type="checkbox" onClick={e => e.stopPropagation()} />
                    <span>Compare</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="listing-pagination">
            <button className="lpag__btn"><ChevronLeft size={16} /></button>
            <button className="lpag__btn lpag__btn--active">1</button>
            <button className="lpag__btn">2</button>
            <button className="lpag__btn"><ChevronRight size={16} /></button>
          </div>

          {/* Editorial */}
          <div className="listing-editorial">
            <h2>Buy Sony TVs Online – Smart Entertainment with Bravia Technology</h2>
            <p>Sony has led the television industry through innovation — from early display technologies to today's advanced Bravia-powered Smart TVs. At Matru Kripa Enterprises, you can explore a wide range of Sony televisions that combine cutting-edge picture processing, immersive sound, and intelligent smart features.</p>

            <h3>Explore Sony TV Series & Display Technologies</h3>

            <h4>1. Sony Bravia TVs – Intelligent Picture & Immersive Sound</h4>
            <p>The Sony Bravia TV series represents Sony's most advanced television lineup, designed for viewers who demand exceptional picture and sound quality. Powered by the XR Cognitive Processor, Bravia TVs analyse visuals the way the human brain does. Key highlights include:</p>
            <ul>
              <li>Dolby Vision support for enhanced HDR performance</li>
              <li>Triluminos wide colour technology</li>
              <li>Advanced audio systems such as Acoustic Surface Audio+ and XR Sound Positioning</li>
              <li>Dolby Atmos compatibility for immersive sound</li>
            </ul>

            <h4>2. Sony LED TV & Sony OLED TV – Picture Perfection for Every Viewer</h4>
            <p>Matru Kripa Enterprises offers both Sony LED TVs and Sony OLED TVs to suit different viewing preferences and budgets. Sony LED TVs are known for their brightness, durability, and energy efficiency. Sony OLED panels offer precise pixel-level control, ensuring stunning visuals from every viewing angle.</p>

            <h4>3. Sony Smart TVs with Google TV – Smarter Entertainment</h4>
            <p>All modern Sony TVs run on Google TV, providing access to popular streaming platforms like Netflix, YouTube, Disney+, and Prime Video. Key smart features include:</p>
            <ul>
              <li>Voice control with Google Assistant</li>
              <li>Built-in Chromecast for screen casting</li>
              <li>Customised content recommendations</li>
              <li>Dedicated remote buttons for quick app access</li>
            </ul>

            <h4>4. Sony 4K & 8K TVs – Ultra-High-Resolution Viewing</h4>
            <p>Sony's 4K and 8K televisions deliver remarkable clarity and detail. Sony 4K TVs use XR 4K Upscaling to enhance lower-resolution content. These models are ideal for high-quality streaming, gaming, and premium home theatres.</p>

            <h3>Why Buy Sony TVs from Matru Kripa Enterprises?</h3>
            <ul>
              <li><strong>Competitive Prices & Flexible Payment Options</strong> — Enjoy attractive pricing, seasonal offers, and flexible EMI options across a wide range of Sony televisions.</li>
              <li><strong>Smooth Online & In-Store Shopping Experience</strong> — Shop online or visit our authorised stores for expert assistance.</li>
              <li><strong>Genuine Warranty & After-Sales Support</strong> — All Sony TVs sold by Matru Kripa Enterprises come with official manufacturer warranty.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
