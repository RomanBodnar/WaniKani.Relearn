import { Link } from "react-router";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openPolicyModal } = useCookieConsent();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} bonpom.
          </p>
          <nav className="footer-legal-links" aria-label="Legal and Privacy Links">
            <Link to="/cookies-policy" className="footer-legal-link">
              Cookie Policy
            </Link>
            <span className="footer-link-divider">•</span>
            <Link to="/technology-list" className="footer-legal-link">
              Technology List
            </Link>
            <span className="footer-link-divider">•</span>
            <button
              type="button"
              className="footer-legal-button"
              onClick={openPolicyModal}
            >
              Cookie Settings
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
