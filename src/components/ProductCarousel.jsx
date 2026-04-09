import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarousel } from "../hooks/useCarousel";

function useResponsiveCount(defaultCount) {
  const getCount = () => {
    if (typeof window === "undefined") return defaultCount;
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
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

function StandardCard({ item, navigateTo, effective }) {
  const navigate = useNavigate();
  return (
    <div
      className="prod-card"
      style={{ minWidth: `${100 / effective}%` }}
      onClick={() => navigateTo && navigate(navigateTo)}
    >
      <div className="prod-card__visual" style={{ background: item.bg }}>
        <img src={item.image} alt={item.name} className="prod-card__img" />
      </div>
      <div className="prod-card__info">
        <p className="prod-card__name">{item.name}</p>
        <p className="prod-card__sub">{item.subtitle || item.tag}</p>
        <div className="prod-card__pricing">
          <span className="prod-card__price">
            {item.priceLabel || "From"} {item.price}
            {item.originalPrice && <sup>*</sup>}
          </span>
          {item.originalPrice && (
            <span className="prod-card__original">{item.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function FloatingCard({ item, navigateTo, effective }) {
  const navigate = useNavigate();
  return (
    <div
      className="prod-card prod-card--floating"
      style={{ minWidth: `${100 / effective}%` }}
      onClick={() => navigateTo && navigate(navigateTo)}
    >
      <div className="prod-card__frame">
        {/* Gradient card background */}
        <div className="prod-card__bg" style={{ background: item.bg }} />
        {/* Image floats above the card */}
        <img src={item.image} alt={item.name} className="prod-card__img" />
      </div>
      <div className="prod-card__info prod-card__info--bare">
        <p className="prod-card__name">{item.name}</p>
        <p className="prod-card__sub">{item.subtitle || item.tag}</p>
        <div className="prod-card__pricing">
          <span className="prod-card__price">
            {item.priceLabel || "From"} {item.price}
            {item.originalPrice && <sup>*</sup>}
          </span>
          {item.originalPrice && (
            <span className="prod-card__original">{item.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductCarousel({ title, items, visibleCount = 4, navigateTo, cardStyle = "standard" }) {
  const effective = useResponsiveCount(visibleCount);
  const total = Math.max(0, items.length - effective + 1);
  const { current, next, prev, reset } = useCarousel(total, false);
  const touchStart = useRef(null);

  const canPrev = current > 0;
  const canNext = current < total - 1;

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && canNext) { next(); reset(); }
      else if (diff < 0 && canPrev) { prev(); reset(); }
    }
    touchStart.current = null;
  };

  return (
    <section className="prod-carousel section-pad">
      <div className="container">
        <h2 className="section-title">{title}</h2>

        <div className="prod-carousel__wrapper">
          {canPrev && (
            <button
              className="prod-carousel__float prod-carousel__float--prev"
              onClick={() => { prev(); reset(); }}
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            className="prod-carousel__viewport"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="prod-carousel__track"
              style={{ transform: `translateX(-${current * (100 / effective)}%)` }}
            >
              {items.map((item) =>
                cardStyle === "floating" ? (
                  <FloatingCard key={item.id} item={item} navigateTo={navigateTo} effective={effective} />
                ) : (
                  <StandardCard key={item.id} item={item} navigateTo={navigateTo} effective={effective} />
                )
              )}
            </div>
          </div>

          {canNext && (
            <button
              className="prod-carousel__float prod-carousel__float--next"
              onClick={() => { next(); reset(); }}
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
