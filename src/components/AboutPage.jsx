import { useNavigate } from "react-router-dom";
import {
  Tv,
  Smartphone,
  Refrigerator,
  Laptop,
  Headphones,
  Speaker,
  Monitor,
  Microwave,
  Camera,
  Watch,
} from "lucide-react";

const PRODUCT_ICONS = [
  Tv,
  Smartphone,
  Refrigerator,
  Microwave,
  Laptop,
  Headphones,
  Speaker,
  Monitor,
  Camera,
  Watch,
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>
          Home
        </span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">About Matru Kripa Enterprise</span>
      </div>

      {/* Hero */}
      <section className="ab-hero">
        <div className="container ab-hero__inner">
          <div className="ab-hero__content">
            <span className="ab-hero__eyebrow">About Matru Kripa</span>
            <h1 className="ab-hero__title">
              Trusted Electronics &amp;{" "}
              <span className="ab-hero__title-accent">Home Solutions</span>{" "}
              for Every Home
            </h1>
            <p className="ab-hero__lede">
              A growing retail brand built on quality, reliability, and a
              seamless shopping experience — online and in-store.
            </p>
            <div className="ab-hero__stats">
              <div className="ab-hero__stat">
                <span className="ab-hero__stat-num">10+</span>
                <span className="ab-hero__stat-label">Trusted brands</span>
              </div>
              <div className="ab-hero__stat-divider" aria-hidden="true" />
              <div className="ab-hero__stat">
                <span className="ab-hero__stat-num">100+</span>
                <span className="ab-hero__stat-label">Products</span>
              </div>
              <div className="ab-hero__stat-divider" aria-hidden="true" />
              <div className="ab-hero__stat">
                <span className="ab-hero__stat-num">Karnataka</span>
                <span className="ab-hero__stat-label">Active markets</span>
              </div>
            </div>
          </div>
          <div className="ab-hero__visual">
            <img
              className="ab-hero__visual-main"
              src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80"
              alt="Matru Krupa television showroom"
            />
            <img
              className="ab-hero__visual-accent"
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80"
              alt="Retail store interior"
            />
            <div className="ab-hero__visual-badge">
              <span className="ab-hero__visual-badge-num">Since 2010</span>
              <span className="ab-hero__visual-badge-label">
                Serving Karnataka
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="ab-intro container">
        <p>
          Matru Kripa Enterprises is a growing retail brand specializing in
          electronics and home appliances committed to delivering quality
          products, reliable service, and a seamless shopping experience both
          online and in-store.
        </p>
        <p>
          With a strong focus on customer satisfaction and long-term
          partnerships, we aim to make modern technology and home essentials
          accessible, affordable, and dependable for everyone.
        </p>
      </section>

      {/* Story blocks */}
      <section className="ab-blocks container">
        <article className="ab-card">
          <h2 className="ab-card__title">Who We Are</h2>
          <div className="ab-card__body">
            <p>
              Founded with a vision to build a trusted retail ecosystem, Matru
              Kripa Enterprises operates across multiple product categories
              including:
            </p>
            <ul className="ab-card__list">
              <li>Televisions &amp; Audio</li>
              <li>Home &amp; Kitchen Appliances</li>
              <li>Laptops, Mobiles &amp; Accessories</li>
            </ul>
            <p>
              We combine expert product knowledge, transparent pricing, and
              dependable after-sales support to ensure every customer makes a
              confident purchase.
            </p>
          </div>
        </article>

        <article className="ab-card">
          <h2 className="ab-card__title">What We Do</h2>
          <div className="ab-rows">
            <div className="ab-row">
              <div className="ab-row__visual">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80"
                  alt="Retail and online shopping"
                />
              </div>
              <div className="ab-row__body">
                <h3>Retail &amp; Online Shopping</h3>
                <p>
                  We offer a wide range of branded electronics and home
                  solutions through our physical stores and online platform,
                  making shopping convenient and reliable.
                </p>
              </div>
            </div>
            <div className="ab-row">
              <div className="ab-row__visual">
                <img
                  src="https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=900&q=80"
                  alt="Franchise network"
                />
              </div>
              <div className="ab-row__body">
                <h3>Franchise Network</h3>
                <p>
                  Our franchise model empowers partners with a structured
                  business opportunity, operational support, and access to a
                  trusted product ecosystem.
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="ab-card">
          <h2 className="ab-card__title">Growing Together</h2>
          <div className="ab-card__body">
            <p>
              At Matru Kripa Enterprises, we believe growth is strongest when
              built together — with customers, partners, and teams. Whether
              you're shopping for your home, starting a franchise, or building
              a career, we're here to support you every step of the way.
            </p>
          </div>
        </article>
      </section>

      {/* Products banner */}
      <section className="ab-products">
        <div className="container ab-products__inner">
          <span className="ab-products__eyebrow">Trusted Range</span>
          <h2 className="ab-products__headline">
            <span className="ab-products__number">
              100<span className="ab-products__plus">+</span>
            </span>
            <span className="ab-products__label">
              Products across every home
            </span>
          </h2>
          <p className="ab-products__sub">
            From entertainment and kitchen to mobility and audio — curated brands,
            reliable service, one trusted store.
          </p>
          <div className="ab-products__grid">
            {PRODUCT_ICONS.map((Icon, i) => (
              <div key={i} className="ab-products__icon">
                <Icon size={22} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
