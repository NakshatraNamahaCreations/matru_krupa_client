import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { greatDeals } from "../data/products";
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

export default function GreatDeals() {
  const visibleCount = 4;
  const effective = useResponsiveCount(visibleCount);
  const total = Math.max(0, greatDeals.length - effective + 1);
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
    <section className="great-deals">
      <div className="container">
        <div className="gd-header">
          <div className="gd-header__left">
            <h2 className="gd-header__title">Great Deals on Electronics</h2>
            <p className="gd-header__sub">Exclusive prices — updated every day</p>
          </div>
          <div className="gd-header__right">
            <a href="#" className="gd-header__btn">
              View All <ArrowRight size={14} />
            </a>
            <div className="gd-header__arrows">
              <button
                className={`gd-arrow ${!canPrev ? "gd-arrow--disabled" : ""}`}
                onClick={() => { prev(); reset(); }}
                disabled={!canPrev}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className={`gd-arrow ${!canNext ? "gd-arrow--disabled" : ""}`}
                onClick={() => { next(); reset(); }}
                disabled={!canNext}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="gd-carousel__viewport"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="gd-carousel__track"
            style={{ transform: `translateX(-${current * (100 / effective)}%)` }}
          >
            {greatDeals.map((item) => (
              <div
                key={item.id}
                className="gd-card"
                style={{ minWidth: `${100 / effective}%` }}
              >
                <div
                  className="gd-card__inner"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.10) 75%, transparent 100%), url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="gd-card__brand">{item.brand}</span>
                  <div className="gd-card__overlay">
                    <p className="gd-card__name">{item.name}</p>
                    <div className="gd-card__pricing">
                      <span className="gd-card__price">From {item.price}</span>
                      {item.originalPrice && (
                        <span className="gd-card__original">{item.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
