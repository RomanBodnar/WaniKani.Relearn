import { Link } from "react-router";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} bonpom.
          </p>
          <div className="footer-social">
            {/* Add social links here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
