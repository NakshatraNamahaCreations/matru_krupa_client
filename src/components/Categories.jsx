import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories as staticCategories } from "../data/products";
import { storeApi } from "../services/api";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    storeApi.getCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.categories;
        if (list && list.length > 0) {
          setCategories(list.map((c) => ({
            id: c._id,
            name: c.name,
            icon: c.image,
            color: c.color || "#1a1a2e",
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="categories section-pad">
      <div className="container">
        <h2 className="section-title">Our Top Categories</h2>
        <div className="categories__grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <div className="category-card__icon">
                <img src={cat.icon} alt={cat.name} className="category-card__img" />
              </div>
              <span className="category-card__name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
