import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ToggleSwitch } from "./ToggleSwitch";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import "./CookiePolicyModal.css";

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookiePolicyModal({ isOpen, onClose }: CookiePolicyModalProps) {
  const { consent, acceptAll, declineFunctional } = useCookieConsent();

  // Local category states
  const [functional, setFunctional] = useState(consent === "granted");

  useEffect(() => {
    setFunctional(consent === "granted");
  }, [consent]);

  if (!isOpen) return null;

  const isAllEnabled = functional;

  const handleMasterToggle = (enableAll: boolean) => {
    setFunctional(enableAll);
  };

  const handleSave = () => {
    if (functional) {
      acceptAll();
    } else {
      declineFunctional();
    }
    onClose();
  };

  return (
    <div className="cookie-modal-backdrop" onClick={onClose}>
      <div className="cookie-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cookie-modal-header">
          <div className="cookie-modal-title-group">
            <button
              type="button"
              className="cookie-modal-back-btn"
              onClick={onClose}
              title="Back"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="cookie-modal-title">Manage Cookie Preferences</h2>
          </div>
        </div>

        <div className="cookie-modal-body">
          <p className="cookie-intro-text">
            You can find complete information in our{" "}
            <Link to="/cookies-policy" onClick={onClose} className="cookie-link">
              cookie policy statement
            </Link>{" "}
            and in our{" "}
            <Link to="/technology-list" onClick={onClose} className="cookie-link">
              technology list
            </Link>.
          </p>

          {/* Master Enable All Switch */}
          <div className="cookie-category-row master">
            <div className="cookie-category-info">
              <span className="cookie-category-title master">Enable All</span>
            </div>
            <ToggleSwitch
              checked={isAllEnabled}
              onChange={handleMasterToggle}
              color="#FE3365"
            />
          </div>

          <hr className="cookie-divider" />

          {/* Category 1: Essential Cookies */}
          <div className="cookie-category-row">
            <div className="cookie-category-info">
              <div className="cookie-title-badge">
                <span className="cookie-category-title">Essential Cookies</span>
                <span className="cookie-tag essential">Required</span>
              </div>
              <p className="cookie-category-desc">
                These cookies are essential for the proper functioning of the website and your login session. The services you requested (such as authentication) cannot be provided without these cookies.
              </p>
            </div>
            <div className="toggle-disabled-wrapper" title="Essential cookies cannot be disabled">
              <ToggleSwitch
                checked={true}
                onChange={() => {}}
                color="#cbd5e1"
              />
            </div>
          </div>

          {/* Category 2: Functional Cookies */}
          <div className="cookie-category-row">
            <div className="cookie-category-info">
              <span className="cookie-category-title">Functional Cookies</span>
              <p className="cookie-category-desc">
                These cookies allow the site to remember your choices (such as storing your WaniKani API token locally in browser cookies when database storage is disabled, and UI theme preferences).
              </p>
            </div>
            <ToggleSwitch
              checked={functional}
              onChange={(checked) => setFunctional(checked)}
              color="#FE3365"
            />
          </div>

          {/* Category 3: Analytical Cookies (Inactive - Commented out)
          <div className="cookie-category-row">
            <div className="cookie-category-info">
              <span className="cookie-category-title">Analytical Cookies</span>
              <p className="cookie-category-desc">
                Analytical cookies help us understand how visitors interact with the site to measure and improve performance. (No third-party analytical cookies are currently active).
              </p>
            </div>
            <ToggleSwitch
              checked={analytics}
              onChange={(checked) => setAnalytics(checked)}
              color="#FE3365"
            />
          </div>
          */}

          {/* Category 4: Personalization & Advertising (Inactive - Commented out)
          <div className="cookie-category-row">
            <div className="cookie-category-info">
              <span className="cookie-category-title">Personalization & Advertising</span>
              <p className="cookie-category-desc">
                Used to present personalized content or track advertising campaign performance. (WaniKani:Relearn does not track users for advertising).
              </p>
            </div>
            <ToggleSwitch
              checked={targeting}
              onChange={(checked) => setTargeting(checked)}
              color="#FE3365"
            />
          </div>
          */}
        </div>

        <div className="cookie-modal-footer">
          <button
            type="button"
            className="wk-btn cookie-save-btn"
            onClick={handleSave}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
