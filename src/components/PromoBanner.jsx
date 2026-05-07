export default function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="promo-banner__inner container">
        <div className="promo-banner__text">
          <h2 className="promo-banner__title">Unleash Your Power</h2>
          <p className="promo-banner__sub">
            Exclusive offers on premium devices
          </p>
          <p className="promo-banner__price">Starting at ₹32,999</p>
          <button className="promo-banner__btn">Buy now</button>
        </div>
        <div className="promo-banner__visuals">
          <div className="promo-banner__device promo-banner__device--back">
            <span>💻</span>
          </div>
          <div className="promo-banner__device promo-banner__device--mid">
            <span>🖥️</span>
          </div>
          <div className="promo-banner__device promo-banner__device--front">
            <span>📱</span>
          </div>
        </div>
      </div>
    </section>
  );
}
