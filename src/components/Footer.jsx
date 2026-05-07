import { footerLinks } from "../data/products";
import { ArrowRight } from "lucide-react";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        {/* Connect With Us */}
        <div className="footer__col">
          <h3 className="footer__heading">Connect With Us</h3>
          <div className="footer__newsletter">
            <input
              type="email"
              placeholder="Enter Email Id"
              className="footer__email-input"
            />
            <button className="footer__email-btn">
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" className="footer__social" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="footer__social" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>

        {/* Site Info */}
        <div className="footer__col">
          <h3 className="footer__heading">Site Info</h3>
          <ul className="footer__list">
            {footerLinks.siteInfo.map((item) => (
              <li key={item}>
                <a href="#" className="footer__link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="footer__col">
          <h3 className="footer__heading">&nbsp;</h3>
          <ul className="footer__list">
            {footerLinks.legal.map((item) => (
              <li key={item}>
                <a href="#" className="footer__link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div className="footer__col">
          <h3 className="footer__heading">Products</h3>
          <ul className="footer__list">
            {footerLinks.products.map((item) => (
              <li key={item}>
                <a href="#" className="footer__link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p className="footer__copy">
            © Copyright 2025 Matru Kripa Enterprises. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
