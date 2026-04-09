import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "../data/products";
import { storeApi } from "../services/api";
import { useCarousel } from "../hooks/useCarousel";

function mapBannerToSlide(b) {
  return {
    id: b._id,
    title: b.title,
    subtitle: b.subtitle,
    cta: b.ctaText || "Shop Now",
    theme: b.theme || "dark",
    accent: b.accentColor || "#111",
    bg: b.bgColor || "#f5f5f5",
    image: b.image,
  };
}

export default function HeroSlider() {
  const [slides, setSlides] = useState(heroSlides);

  useEffect(() => {
    storeApi.getBanners("hero")
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.banners;
        if (list && list.length > 0) setSlides(list.map(mapBannerToSlide));
      })
      .catch(() => {});
  }, []);

  const { current, next, prev, goTo, reset } = useCarousel(slides.length, true, 4500);

  return (
    <>
      <section className="hero">
        <div className="hero__track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`hero__slide hero__slide--${slide.theme}`}
              style={{ background: slide.bg }}
            >
              <div className="hero__content container">
                <div className="hero__text">
                  <h1 className="hero__title">{slide.title}</h1>
                  <p className="hero__subtitle">{slide.subtitle}</p>
                  <button
                    className="hero__cta"
                    style={{
                      background: slide.accent,
                      color: slide.theme === "light" ? "#fff" : "#000",
                    }}
                  >
                    {slide.cta}
                  </button>
                </div>
                <div className="hero__visual">
                  <img src={slide.image} alt={slide.title} className="hero__img" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="hero__arrow hero__arrow--prev"
          onClick={() => { prev(); reset(); }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="hero__arrow hero__arrow--next"
          onClick={() => { next(); reset(); }}
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        <div className="hero__progress">
          <div key={current} className="hero__progress-bar" style={{ animationDuration: "4.5s" }} />
        </div>
      </section>

      {/* Dots rendered below the hero */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? "hero__dot--active" : ""}`}
            onClick={() => { goTo(i); reset(); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
