import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ClipboardList,
  Building2,
  Users,
  MessageCircle,
} from "lucide-react";

const SUPPORT_CATEGORIES = [
  {
    icon: Sparkles,
    title: "Customer Support",
    description:
      "For general queries related to products, orders, delivery, and installations.",
  },
  {
    icon: ClipboardList,
    title: "Online Order Assistance",
    description:
      "Get assistance for online orders, payment issues, order status, cancellations, and refunds.",
  },
  {
    icon: Building2,
    title: "Franchise & Partner Support",
    description:
      "Get assistance with franchise onboarding, operations, payments, and partner-related support.",
  },
  {
    icon: Users,
    title: "Human Resources",
    description: "For career-related queries and employee support.",
  },
];

const initialForm = {
  fullName: "",
  mobile: "",
  email: "",
  message: "",
};

export default function HelpSupport() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.mobile.trim()) e.mobile = "Required";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a 10-digit number";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitted(true);
    setForm(initialForm);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>
          Home
        </span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Help & Support</span>
      </div>

      {/* Hero band with intro + contact form */}
      <section className="hs-hero">
        <div className="container hs-hero__inner">
          <div className="hs-hero__intro">
            <span className="hs-hero__eyebrow">Help &amp; Support</span>
            <h1 className="hs-hero__title">
              What can we <span className="hs-hero__title-accent">help</span> you with?
            </h1>
            <p className="hs-hero__lede">
              Need assistance with an order, product, service, or franchise enquiry?
            </p>
            <p className="hs-hero__lede">
              Our support team is here to ensure you get quick and reliable help.
            </p>
          </div>

          <form className="hs-form" onSubmit={handleSubmit} noValidate>
            <h2 className="hs-form__title">Please Fill in your details below</h2>
            <p className="hs-form__note">
              <span>*</span>All fields are mandatory
            </p>

            <div className="hs-form__field">
              <input
                type="text"
                className="hs-form__input"
                placeholder="Enter your Full Name"
                value={form.fullName}
                onChange={update("fullName")}
              />
              {errors.fullName && (
                <small className="hs-form__error">{errors.fullName}</small>
              )}
            </div>

            <div className="hs-form__field">
              <input
                type="tel"
                className="hs-form__input"
                placeholder="Enter your Mobile Number"
                inputMode="numeric"
                maxLength={10}
                value={form.mobile}
                onChange={update("mobile")}
              />
              {errors.mobile && (
                <small className="hs-form__error">{errors.mobile}</small>
              )}
            </div>

            <div className="hs-form__field">
              <input
                type="email"
                className="hs-form__input"
                placeholder="Enter your Email ID"
                value={form.email}
                onChange={update("email")}
              />
              {errors.email && (
                <small className="hs-form__error">{errors.email}</small>
              )}
            </div>

            <div className="hs-form__field">
              <textarea
                rows={4}
                className="hs-form__input hs-form__textarea"
                placeholder="Your Message"
                value={form.message}
                onChange={update("message")}
              />
              {errors.message && (
                <small className="hs-form__error">{errors.message}</small>
              )}
            </div>

            <button type="submit" className="hs-form__submit">
              Submit
            </button>
            {submitted && (
              <p className="hs-form__success">
                Thanks! We've received your request and will reach out shortly.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Support categories */}
      <section className="hs-categories">
        <div className="container">
          <h2 className="hs-categories__title">
            Select a support category below and we'll guide you to the right
            assistance
          </h2>
          <div className="hs-categories__grid">
            {SUPPORT_CATEGORIES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="hs-card">
                <div className="hs-card__icon">
                  <Icon size={20} />
                </div>
                <h3 className="hs-card__title">{title}</h3>
                <p className="hs-card__desc">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Need more help panel */}
      <section className="hs-help">
        <div className="container">
          <div className="hs-help__panel">
          <div className="hs-help__col hs-help__col--lead">
            <h3 className="hs-help__title">Need More Help?</h3>
            <p className="hs-help__sub">
              Connect with us — our team is here to help.
            </p>
          </div>

          <div className="hs-help__col">
            <p className="hs-help__quick">For quick support</p>
            <p className="hs-help__detail">
              Just send "Hi" on WhatsApp to our Assist number
            </p>
            <a
              href="https://wa.me/"
              className="hs-help__wa"
              aria-label="WhatsApp Support"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} />
            </a>
          </div>

          <div className="hs-help__divider">or</div>

          <div className="hs-help__col hs-help__col--qr">
            <p className="hs-help__quick">Scan the QR code</p>
            {/* Replace this placeholder with <img src="/help-qr.png" alt="..." /> when available */}
            <div className="hs-help__qr" aria-label="Support QR code">
              <div className="hs-help__qr-grid" />
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
