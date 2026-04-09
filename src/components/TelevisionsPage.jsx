import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TV_HERO_IMG = "https://res.cloudinary.com/dflefzc57/image/upload/v1774588233/ebfa63ce1469980eb65464eb4b4da00c734e9a66_lbreho.png";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

function useResponsiveCount(defaultCount) {
  const getCount = () => {
    if (typeof window === "undefined") return defaultCount;
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    return defaultCount;
  };
  const [count, setCount] = useState(getCount);
  useEffect(() => {
    const update = () => setCount(getCount());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [defaultCount]);
  return count;
}
import {
  tvBrands,
  tvs32,
  tvs55,
  tvs65Plus,
  tvDisplayTypes,
  tvSizes,
  tvFaqs,
} from "../data/products";

function TvProductCard({ item }) {
  const navigate = useNavigate();
  return (
    <div className="tv-card" onClick={() => navigate("/product")} style={{ cursor: "pointer" }}>
      <div className="tv-card__image" style={{ background: item.bg }}>
        {item.tag && <span className="tv-card__tag">{item.tag}</span>}
        <img src={item.image} alt={item.name} className="tv-card__img" />
        <span className="tv-card__brand">{item.brand}</span>
      </div>
      <div className="tv-card__info">
        <p className="tv-card__name">{item.name}</p>
        <div className="tv-card__pricing">
          <span className="tv-card__price">{item.price}</span>
          <span className="tv-card__original">{item.originalPrice}</span>
          <span className="tv-card__discount">{item.discount}</span>
        </div>
      </div>
    </div>
  );
}

function TvCarousel({ title, items }) {
  const visible = useResponsiveCount(3);
  const [index, setIndex] = useState(0);
  const max = Math.max(0, items.length - visible);
  const touchStart = useRef(null);

  const canPrev = index > 0;
  const canNext = index < max;

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && canNext) setIndex((i) => Math.min(max, i + 1));
      else if (diff < 0 && canPrev) setIndex((i) => Math.max(0, i - 1));
    }
    touchStart.current = null;
  };

  return (
    <div className="tv-section section-pad--sm">
      <div className="container">
        <div className="tv-section__header">
          <h2 className="tv-section__title">{title}</h2>
        </div>
        <div className="tv-carousel__wrapper">
          <button
            className={`tv-carousel__arrow ${!canPrev ? "tv-carousel__arrow--disabled" : ""}`}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
          >
            <ChevronLeft size={20} />
          </button>
          <div
            className="tv-carousel__viewport"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="tv-carousel__track"
              style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="tv-carousel__item"
                  style={{ flex: `0 0 ${100 / visible}%` }}
                >
                  <TvProductCard item={item} />
                </div>
              ))}
            </div>
          </div>
          <button
            className={`tv-carousel__arrow ${!canNext ? "tv-carousel__arrow--disabled" : ""}`}
            onClick={() => setIndex((i) => Math.min(max, i + 1))}
            disabled={!canNext}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button className="faq-item__question" onClick={() => setOpen(!open)}>
        <span>{faq.q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <p className="faq-item__answer">{faq.a}</p>}
    </div>
  );
}

export default function TelevisionsPage() {
  const navigate = useNavigate();
  return (
    <div className="tv-page">
      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Televisions</span>
      </div>

      {/* Hero Banner */}
      <div className="tv-hero">
        <div className="tv-hero__inner container">
          <div className="tv-hero__text">
            <h1 className="tv-hero__title">Big Screens. Bigger Savings</h1>
            <p className="tv-hero__sub">Entertainment That Brings Everyone Together</p>
            <button className="tv-hero__btn">Shop Now</button>
          </div>
          <div className="tv-hero__visual">
            <img src={TV_HERO_IMG} alt="TV" className="tv-hero__img" />
          </div>
        </div>
      </div>

      {/* Brand Logos */}
      <div className="tv-brands">
        <div className="tv-brands__inner container">
          {tvBrands.map((b) => (
            <button key={b.name} className="tv-brands__item">
              <span className="tv-brands__logo">{b.logo}</span>
              <span className="tv-brands__name">{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Carousels */}
      <TvCarousel title='Get 32" TVs for Everyday Viewing' items={tvs32} />
      <TvCarousel title='Smart Deals on Big Screen – 55" TVs' items={tvs55} />
      <TvCarousel title='Upgrade Big with 65"+ TVs on Offer' items={tvs65Plus} />

      {/* Select Display Type */}
      <div className="tv-display-types section-pad--sm">
        <div className="container">
          <h2 className="section-title">Select Your Display Type</h2>
          <div className="tv-display-types__grid">
            {tvDisplayTypes.map((t) => (
              <button key={t.label} className="tv-display-card" style={{ background: t.bg }}>
                <span className="tv-display-card__emoji">📺</span>
                <span className="tv-display-card__label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shop by Size */}
      <div className="tv-sizes section-pad--sm">
        <div className="container">
          <h2 className="section-title">Shop by Size</h2>
          <div className="tv-sizes__grid">
            {tvSizes.map((s) => (
              <button key={s.size} className="tv-size-card">
                <div className="tv-size-card__screen">
                  <span className="tv-size-card__number">{s.size}</span>
                </div>
                <p className="tv-size-card__label">{s.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="tv-editorial section-pad">
        <div className="container">
          <h2 className="tv-editorial__title">The Perfect TVs for Every Home</h2>
          <p className="tv-editorial__body">
            Whether you&apos;re binge-watching your favourite shows, watching sports with family, or enjoying movie nights on a big screen, choosing the right TV can transform your experience. At Matru Kripa Enterprises, you can explore a wide range of televisions designed to suit different room sizes, viewing distances, and budgets.
          </p>

          <h3 className="tv-editorial__heading">What Types of TVs Are Available?</h3>
          <p className="tv-editorial__body">
            With numerous models available from trusted brands, choosing the right TV can feel overwhelming. The first thing to consider is screen size. Depending on the size of your room and viewing distance, you can choose televisions starting from 32 inches to 75 inches and above.
          </p>
          <p className="tv-editorial__body">
            The next important factor is the display technology. LED TVs are popular for their energy efficiency and brightness, making them ideal for everyday viewing. QLED TVs enhance colour accuracy and brightness using advanced panel technology, while OLED TVs offer perfect blacks and superior contrast, ideal for home theatre setups. Resolution also plays a key role in your viewing experience. HD Ready and Full HD TVs are suitable for regular viewing, while 4K Ultra HD TVs offer sharper images, richer details, and support for high-quality streaming and gaming.
          </p>

          <h3 className="tv-editorial__heading">Smart TVs for Smarter Entertainment</h3>
          <p className="tv-editorial__body">
            Most modern televisions come with smart features that allow you to access popular streaming platforms, apps, and online content directly on your TV. Smart TVs support seamless connectivity, voice control, screen casting and mirroring, and multiple HDMI and USB ports for connecting external devices such as gaming consoles, sound systems, and streaming sticks. Before choosing your TV, it&apos;s also important to consider sound quality, connectivity options, and compatibility with your home setup.
          </p>

          <h3 className="tv-editorial__heading">Explore a Wide Range of TVs at Matru Kripa Enterprises</h3>
          <p className="tv-editorial__body">
            At Matru Kripa Enterprises, you can shop from a carefully curated selection of televisions from leading brands such as Samsung, LG, Sony, TCL, Panasonic, and many more. Our TV range includes popular sizes like 32, 43, 50, 55, and 65 inches, along with Ultra HD and Smart TV features in multiple sizes and price ranges. We also offer reliable after-sales support, warranty coverage, and service assistance to ensure you shop with complete confidence.
          </p>

          {/* FAQs */}
          <h2 className="tv-editorial__title" style={{ marginTop: 40 }}>FAQs</h2>
          <div className="faq-list">
            {tvFaqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
