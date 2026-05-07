import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { franchiseApi } from "../services/api";

const STATES = [
  "Karnataka", "Maharashtra", "Tamil Nadu", "Kerala", "Andhra Pradesh",
  "Telangana", "Goa", "Gujarat", "Delhi", "Other",
];

const CITIES_BY_STATE = {
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati"],
  Telangana: ["Hyderabad", "Warangal"],
  Goa: ["Panaji", "Margao"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Delhi: ["New Delhi"],
  Other: ["Other"],
};

const EMPLOYMENT = ["Self Employed", "Employed", "Business Owner", "Other"];
const FIRM_NATURE = ["Proprietorship", "Partnership", "Private Limited", "LLP", "Other"];
const POSITIONS = ["Owner", "Director", "Partner", "Manager", "Other"];
const TURNOVER = [
  "Below ₹10 Lakh",
  "₹10 Lakh – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "₹1 Crore – ₹5 Crore",
  "Above ₹5 Crore",
];
const BUSINESS_TYPES = ["Retail", "Wholesale", "Distribution", "Service", "Other"];
const YES_NO = ["Yes", "No"];
const ACCOUNT_TYPES = ["Savings", "Current"];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  state: "",
  city: "",
  pincode: "",
  firmName: "",
  firmAddress: "",
  gstNumber: "",
  employment: "",
  firmNature: "",
  position: "",
  turnover: "",
  businessType: "",
  ownsRetail: "",
  legalDisputes: "",
  cities: "",
  ownsProperty: "",
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  branchName: "",
  accountType: "",
  comments: "",
  depositConfirm: false,
  acceptTerms: false,
};

export default function FranchiseOpportunity() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" ? { city: "" } : {}),
    }));
  };

  const validate = () => {
    const e = {};
    const required = [
      "firstName", "lastName", "email", "mobile",
      "state", "city", "pincode",
      "firmName", "firmAddress", "employment", "firmNature",
      "position", "turnover", "businessType", "ownsRetail",
      "legalDisputes", "cities", "ownsProperty",
      "accountHolder", "bankName", "accountNumber",
      "ifsc", "branchName", "accountType",
    ];
    required.forEach((k) => { if (!form[k]) e[k] = "Required"; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a 10-digit number";
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a 6-digit pincode";
    if (form.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstNumber)) {
      e.gstNumber = "Enter a valid 15-character GSTIN";
    }
    if (form.accountNumber && !/^\d{9,18}$/.test(form.accountNumber)) {
      e.accountNumber = "Enter a valid account number (9-18 digits)";
    }
    if (form.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
      e.ifsc = "Enter a valid 11-character IFSC code";
    }
    if (!form.depositConfirm) e.depositConfirm = "Required";
    if (!form.acceptTerms) e.acceptTerms = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await franchiseApi.apply(form);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message || "Could not submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cityOptions = form.state ? CITIES_BY_STATE[form.state] || [] : [];

  return (
    <>
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>Home</span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Franchise Opportunity</span>
      </div>

      {/* Hero */}
      <section className="franchise-hero">
        <div className="franchise-hero__bg-orb franchise-hero__bg-orb--1" aria-hidden="true" />
        <div className="franchise-hero__bg-orb franchise-hero__bg-orb--2" aria-hidden="true" />
        <div className="franchise-hero__grid" aria-hidden="true" />
        <div className="container franchise-hero__inner">
          <div className="franchise-hero__content">
            <span className="franchise-hero__eyebrow">Business Partnership Opportunity</span>
            <h1 className="franchise-hero__title">
              Build a Retail Empire with{" "}
              <span className="franchise-hero__title-accent">Matru Krupa</span>
            </h1>
            <p className="franchise-hero__lede">
              Partner with one of Karnataka's fastest-growing multi-category retail brands.
              Electronics, home & kitchen appliances, smart devices — backed by trusted
              brand names and proven retail systems.
            </p>
           
            <div className="franchise-hero__stats">
              <div className="franchise-hero__stat">
                <span className="franchise-hero__stat-num">10+</span>
                <span className="franchise-hero__stat-label">Trusted brands</span>
              </div>
              <div className="franchise-hero__stat-divider" aria-hidden="true" />
              <div className="franchise-hero__stat">
                <span className="franchise-hero__stat-num">Karnataka-wide</span>
                <span className="franchise-hero__stat-label">Active expansion</span>
              </div>
              <div className="franchise-hero__stat-divider" aria-hidden="true" />
              <div className="franchise-hero__stat">
                <span className="franchise-hero__stat-num">3-5 days</span>
                <span className="franchise-hero__stat-label">Application response</span>
              </div>
            </div>
          </div>
          <div className="franchise-hero__visual">
            <img
              className="franchise-hero__visual-main"
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80"
              alt="Matru Krupa retail store interior"
            />
            <img
              className="franchise-hero__visual-accent"
              src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&q=80"
              alt="Television showroom"
            />
            <div className="franchise-hero__visual-badge">
              <span className="franchise-hero__visual-badge-num">₹5L</span>
              <span className="franchise-hero__visual-badge-label">Initial deposit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section id="franchise-intro" className="franchise-intro container">
        <p>Thank you for your interest in becoming a Matru Krupa Retail Business Partner (Franchisee).</p>
        <p>
          Matru Krupa Enterprises is a fast-growing, multi-category retail brand offering Electronics,
          Home Appliances, Kitchen Appliances and Smart Devices. No matter what your customer's need is,
          Matru Krupa ensures they find the right product that fits their lifestyle, budget, and home.
          With strong industry experience, a customer-centric vision, and a wide range of trusted brands,
          Matru Krupa Enterprises has quickly established itself as a reliable and modern retail
          destination for families across Karnataka.
        </p>
        <p>
          Matru Krupa Enterprises is expanding rapidly across Karnataka. To accelerate this growth, we
          now invite passionate entrepreneurs to partner with us and build successful retail stores
          under the Matru Krupa brand.
        </p>
        <p>To begin your franchise journey with us, simply fill out the application form with your details.</p>
      </section>

      {/* Form */}
      <section id="franchise-form" className="franchise-form-section container">
        {submitted ? (
          <div className="franchise-success">
            <h2>Thank you!</h2>
            <p>
              Your franchise application has been received. Our team will reach out to you within
              3-5 business days.
            </p>
            <button className="franchise-form__submit" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        ) : (
          <form className="franchise-form" onSubmit={handleSubmit} noValidate>
            {/* PERSONAL INFORMATION */}
            <h3 className="franchise-form__section-title">PERSONAL INFORMATION</h3>

            <div className="franchise-form__row franchise-form__row--2">
              <Field label="First Name" required error={errors.firstName}>
                <input type="text" placeholder="First Name" value={form.firstName} onChange={update("firstName")} />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input type="text" placeholder="Last Name" value={form.lastName} onChange={update("lastName")} />
              </Field>
            </div>

            <Field label="Email Address" required error={errors.email}>
              <input type="email" placeholder="Email Address" value={form.email} onChange={update("email")} />
            </Field>

            <Field label="Mobile Number" required error={errors.mobile}>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              />
            </Field>

            <div className="franchise-form__row franchise-form__row--3">
              <Field label="State" required error={errors.state}>
                <select value={form.state} onChange={update("state")}>
                  <option value="">Select State</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="City" required error={errors.city}>
                <select value={form.city} onChange={update("city")} disabled={!form.state}>
                  <option value="">Select City</option>
                  {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Pincode" required error={errors.pincode}>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                />
              </Field>
            </div>

            <hr className="franchise-form__divider" />

            {/* CAREER / BUSINESS INFORMATION */}
            <h3 className="franchise-form__section-title">CAREER / BUSINESS INFORMATION</h3>

            <Field label="Name of the firm" required error={errors.firmName}>
              <input type="text" placeholder="Name of the firm" value={form.firmName} onChange={update("firmName")} />
            </Field>

            <Field label="Address of the firm" required error={errors.firmAddress}>
              <input type="text" placeholder="Address of the firm" value={form.firmAddress} onChange={update("firmAddress")} />
            </Field>

            <Field label="GST Number (optional)" error={errors.gstNumber}>
              <input
                type="text"
                placeholder="e.g. 29ABCDE1234F1Z5"
                maxLength={15}
                value={form.gstNumber}
                onChange={(e) => setForm((p) => ({ ...p, gstNumber: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 15) }))}
              />
            </Field>

            <div className="franchise-form__row franchise-form__row--2">
              <Field label="Self Employed/Employed by" required error={errors.employment}>
                <select value={form.employment} onChange={update("employment")}>
                  <option value="">Please Select Employment</option>
                  {EMPLOYMENT.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Nature of the Firm" required error={errors.firmNature}>
                <select value={form.firmNature} onChange={update("firmNature")}>
                  <option value="">Please Select Nature of firm</option>
                  {FIRM_NATURE.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <div className="franchise-form__row franchise-form__row--2">
              <Field label="Position in the Firm" required error={errors.position}>
                <select value={form.position} onChange={update("position")}>
                  <option value="">Position in the Firm</option>
                  {POSITIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Last FY Turnover (in Rs.)" required error={errors.turnover}>
                <select value={form.turnover} onChange={update("turnover")}>
                  <option value="">Last FY Turnover</option>
                  {TURNOVER.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Type of Business" required error={errors.businessType}>
              <select value={form.businessType} onChange={update("businessType")}>
                <option value="">Type of Business</option>
                {BUSINESS_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field
              label="Currently own or operate any branded/non branded electronics retail shop/showroom"
              required
              error={errors.ownsRetail}
            >
              <select value={form.ownsRetail} onChange={update("ownsRetail")}>
                <option value="">Please Select</option>
                {YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="If Firm involved in any legal disputes (If yes, please specify)" required error={errors.legalDisputes}>
              <input type="text" value={form.legalDisputes} onChange={update("legalDisputes")} />
            </Field>

            <hr className="franchise-form__divider" />

            {/* INVESTMENT / PROPERTY INFORMATION */}
            <h3 className="franchise-form__section-title">INVESTMENT/PROPERTY INFORMATION</h3>

            <Field label="Cities of interest for ownership" required error={errors.cities}>
              <select value={form.cities} onChange={update("cities")}>
                <option value="">Cities of interest for ownership</option>
                {(CITIES_BY_STATE.Karnataka).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Do you own property in any of the above cities" required error={errors.ownsProperty}>
              <select value={form.ownsProperty} onChange={update("ownsProperty")}>
                <option value="">Please Select</option>
                {YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <hr className="franchise-form__divider" />

            {/* BANK DETAILS */}
            <h3 className="franchise-form__section-title">BANK DETAILS</h3>

            <Field label="Account Holder Name" required error={errors.accountHolder}>
              <input type="text" placeholder="Account Holder Name" value={form.accountHolder} onChange={update("accountHolder")} />
            </Field>

            <div className="franchise-form__row franchise-form__row--2">
              <Field label="Bank Name" required error={errors.bankName}>
                <input type="text" placeholder="Bank Name" value={form.bankName} onChange={update("bankName")} />
              </Field>
              <Field label="Branch Name" required error={errors.branchName}>
                <input type="text" placeholder="Branch Name" value={form.branchName} onChange={update("branchName")} />
              </Field>
            </div>

            <div className="franchise-form__row franchise-form__row--2">
              <Field label="Account Number" required error={errors.accountNumber}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Account Number"
                  maxLength={18}
                  value={form.accountNumber}
                  onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 18) }))}
                />
              </Field>
              <Field label="IFSC Code" required error={errors.ifsc}>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                  value={form.ifsc}
                  onChange={(e) => setForm((p) => ({ ...p, ifsc: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 11) }))}
                />
              </Field>
            </div>

            <Field label="Account Type" required error={errors.accountType}>
              <select value={form.accountType} onChange={update("accountType")}>
                <option value="">Please Select Account Type</option>
                {ACCOUNT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <hr className="franchise-form__divider" />

            <label className={`franchise-form__check ${errors.depositConfirm ? "franchise-form__check--error" : ""}`}>
              <input type="checkbox" checked={form.depositConfirm} onChange={update("depositConfirm")} />
              <span>I confirm that I can make the fixed franchise deposit of ₹5,00,000</span>
            </label>

            <label className={`franchise-form__check ${errors.acceptTerms ? "franchise-form__check--error" : ""}`}>
              <input type="checkbox" checked={form.acceptTerms} onChange={update("acceptTerms")} />
              <span>
                Accept the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms &amp; Conditions</a>
              </span>
            </label>

            {submitError && (
              <p className="franchise-form__error" role="alert">{submitError}</p>
            )}

            <div className="franchise-form__submit-wrap">
              <button
                type="submit"
                className="franchise-form__submit"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className={`franchise-field ${error ? "franchise-field--error" : ""}`}>
      <label className="franchise-field__label">
        {label}
        {required && <span className="franchise-field__req">*</span>}
      </label>
      {children}
      {error && <p className="franchise-field__error">{error}</p>}
    </div>
  );
}
