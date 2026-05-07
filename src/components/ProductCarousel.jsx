import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";

function StandardCard({ item, navigateTo }) {
  const navigate = useNavigate();
  return (
    <div className="prod-card" onClick={() => navigateTo && navigate(navigateTo)}>
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

function FloatingCard({ item, navigateTo }) {
  const navigate = useNavigate();
  return (
    <div
      className="prod-card prod-card--floating"
      onClick={() => navigateTo && navigate(navigateTo)}
    >
      <div className="prod-card__frame">
        <div className="prod-card__bg" style={{ background: item.bg }} />
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

export default function ProductCarousel({
  title,
  items,
  visibleCount = 4,
  navigateTo,
  cardStyle = "standard",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const Card = cardStyle === "floating" ? FloatingCard : StandardCard;

  return (
    <section className="prod-carousel section-pad">
      <div className="container">
        <h2 className="section-title">{title}</h2>

        <div className="prod-carousel__wrapper">
          <button
            ref={prevRef}
            className="prod-carousel__float prod-carousel__float--prev"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            ref={nextRef}
            className="prod-carousel__float prod-carousel__float--next"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            watchOverflow
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              480: { slidesPerView: 2, slidesPerGroup: 1 },
              768: { slidesPerView: 3, slidesPerGroup: 1 },
              1024: { slidesPerView: visibleCount, slidesPerGroup: 1 },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <Card item={item} navigateTo={navigateTo} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
