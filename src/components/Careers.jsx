import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Store,
  Briefcase,
  Send,
  ChevronRight,
} from "lucide-react";

const PERKS = [
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description: "Learn, grow, and advance as we expand across regions.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "Work with supportive teams across sales, tech, and operations.",
  },
  {
    icon: Store,
    title: "Retail Innovation",
    description: "Be part of a brand shaping modern electronics retail.",
  },
];

const OPENINGS = [
  {
    title: "Store Sales Executive",
    description:
      "Join our team as a Store Sales Executive responsible for assisting customers, explaining products, achieving sales targets, and ensuring a great in-store experience.",
    responsibilities: [
      "Greet and assist customers in-store",
      "Explain features of electronics and home appliances",
      "Achieve daily and monthly sales targets",
    ],
  },
  {
    title: "Store Manager",
    description:
      "Join our team as a Store Manager responsible for daily store operations, sales performance, staff management, and ensuring customer satisfaction.",
    responsibilities: [
      "Manage store sales targets and performance",
      "Supervise and train store staff",
      "Handle inventory and stock planning",
      "Coordinate with head office and vendor",
    ],
  },
  {
    title: "Customer Support Executive",
    description:
      "Join our team as a Customer Support Executive responsible for handling customer queries, complaints, service coordination, and after-sales support.",
    responsibilities: [
      "Respond to customer calls, emails, and messages",
      "Coordinate with service teams for installations and repairs",
      "Handle complaints and ensure resolution",
      "Maintain customer records",
    ],
  },
];

const CAREERS_EMAIL = "careers@matrukripa.com";
const inquiryHref = (title) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Inquiry — ${title}`)}`;
const applyHref = (title) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application — ${title}`)}`;

export default function Careers() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <div className="breadcrumb container">
        <span className="breadcrumb__link" onClick={() => navigate("/")}>
          Home
        </span>
        <span className="breadcrumb__sep">&gt;</span>
        <span className="breadcrumb__current">Careers</span>
      </div>

      {/* Hero */}
      <section className="cr-hero">
        <div className="container cr-hero__inner">
          <div className="cr-hero__intro">
            <span className="cr-hero__eyebrow">Careers</span>
            <h1 className="cr-hero__title">
              Build Your <span className="cr-hero__title-accent">Career</span>{" "}
              with Matru Kripa Enterprises
            </h1>
            <p className="cr-hero__lede">
              We're building a modern retail experience across electronics and
              appliances — we're looking for passionate people to grow with us.
            </p>
          </div>
          <div className="cr-hero__visual">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
              alt="Matru Krupa team collaborating"
            />
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="cr-perks">
        <div className="container">
          <h2 className="cr-perks__title">Why Join Matru Kripa Enterprises?</h2>
          <div className="cr-perks__grid">
            {PERKS.map(({ icon: Icon, title, description }) => (
              <article key={title} className="cr-perk">
                <div className="cr-perk__icon">
                  <Icon size={22} />
                </div>
                <h3 className="cr-perk__title">{title}</h3>
                <p className="cr-perk__desc">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="cr-openings">
        <div className="container">
          <h2 className="cr-openings__title">
            <Briefcase size={20} className="cr-openings__title-icon" />
            {OPENINGS.length} Current Openings
          </h2>
          <div className="cr-openings__grid">
            {OPENINGS.map((job, i) => {
              const isExpanded = expanded === i;
              const items = isExpanded
                ? job.responsibilities
                : job.responsibilities.slice(0, 3);
              const hasMore = job.responsibilities.length > 3;
              return (
                <article key={job.title} className="cr-job">
                  <h3 className="cr-job__title">{job.title}</h3>
                  <p className="cr-job__desc">{job.description}</p>
                  <h4 className="cr-job__sub">Key Responsibilities</h4>
                  <ul className="cr-job__list">
                    {items.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <div className="cr-job__actions">
                    {hasMore ? (
                      <button
                        type="button"
                        className="cr-job__btn cr-job__btn--secondary"
                        onClick={() => setExpanded(isExpanded ? null : i)}
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>
                    ) : (
                      <a
                        className="cr-job__btn cr-job__btn--secondary"
                        href={inquiryHref(job.title)}
                      >
                        View Details
                      </a>
                    )}
                    <a
                      className="cr-job__btn cr-job__btn--primary"
                      href={applyHref(job.title)}
                    >
                      Apply <ChevronRight size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cr-cta">
        <div className="container">
          <div className="cr-cta__panel">
            <h2 className="cr-cta__title">
              Didn't Find the Position You're Looking For?
            </h2>
            <p className="cr-cta__sub">
              We're always interested in connecting with talented and motivated
              individuals. If you don't see a role that matches your profile
              right now, feel free to share your resume with us.
            </p>
            <a
              className="cr-cta__btn"
              href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
                "Resume — Open Application",
              )}`}
            >
              <Send size={16} />
              Send us your resume
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
