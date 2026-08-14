import React from "react";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import { CookiePolicyModal } from "./CookiePolicyModal";
import "./CookieConsentBanner.css";

export function CookieConsentBanner() {
  const {
    consent,
    acceptAll,
    declineFunctional,
    isPolicyModalOpen,
    openPolicyModal,
    closePolicyModal,
  } = useCookieConsent();

  if (consent !== "pending") {
    return (
      <CookiePolicyModal
        isOpen={isPolicyModalOpen}
        onClose={closePolicyModal}
      />
    );
  }

  return (
    <>
      <div className="cookie-banner-wrapper">
        <div className="cookie-banner-content">
          <div className="cookie-banner-text-group">
            <div className="cookie-banner-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="cookie-banner-text">
              We use essential cookies to manage authentication. Functional cookies are optional and used only to save your WaniKani API token locally if you opt out of database storage.
              <button
                type="button"
                className="cookie-banner-link"
                onClick={openPolicyModal}
              >
                Learn more & Cookie Policy
              </button>
            </p>
          </div>

          <div className="cookie-banner-actions">
            <button
              type="button"
              className="wk-btn wk-btn-secondary"
              onClick={declineFunctional}
            >
              Essential Only
            </button>
            <button
              type="button"
              className="wk-btn wk-btn-primary"
              onClick={acceptAll}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      <CookiePolicyModal
        isOpen={isPolicyModalOpen}
        onClose={closePolicyModal}
      />
    </>
  );
}
