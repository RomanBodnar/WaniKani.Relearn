import { Link } from "react-router";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openPolicyModal } = useCookieConsent();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              bonpom
            </Link>
            <p className="footer-tagline">
              A focused Japanese study companion for WaniKani learners — practice verb conjugations, furigana sentence reading, and vocabulary decks.
            </p>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-nav-col">
              <h4 className="footer-links-title">Study & Practice</h4>
              <ul className="footer-links-list">
                <li><Link to="/grammar" className="footer-nav-link">Grammar & Conjugation</Link></li>
                <li><Link to="/grammar/exercise" className="footer-nav-link">Conjugation Exercises</Link></li>
                <li><Link to="/reading-practice" className="footer-nav-link">Sentence Reading</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-links-title">WaniKani Library</h4>
              <ul className="footer-links-list">
                <li><Link to="/kanji" className="footer-nav-link">Kanji Characters</Link></li>
                <li><Link to="/vocabulary" className="footer-nav-link">Vocabulary Decks</Link></li>
                <li><Link to="/radicals" className="footer-nav-link">Radicals Library</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-links-title">Tools & Account</h4>
              <ul className="footer-links-list">
                <li><Link to="/search" className="footer-nav-link">Search & Japanese IME</Link></li>
                <li><Link to="/settings" className="footer-nav-link">Settings & API Token</Link></li>
                <li><Link to="/auth/login" className="footer-nav-link">Log In / Sign Up</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} bonpom. Japanese study companion.
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
