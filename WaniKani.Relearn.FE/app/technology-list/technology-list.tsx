import React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/technology-list";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import "./technology-list.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Technology List & Vendors | WaniKani:Relearn" },
    { name: "description", content: "Complete technical inventory of cookies, storage items, and external API providers used on WaniKani:Relearn." },
  ];
}

export default function TechnologyList() {
  const { openPolicyModal } = useCookieConsent();

  return (
    <div className="policy-page-container">
      <header className="policy-page-header">
        <h1 className="policy-page-title">Technology List & Vendor Inventory</h1>
        <p className="policy-page-subtitle">
          Detailed technical breakdown of active cookies, client storage keys, and third-party API dependencies
        </p>
      </header>

      <div className="policy-page-card">
        <section className="policy-section">
          <h2>1. Client Storage & Cookie Inventory</h2>
          <p>
            The table below provides a full inventory of every cookie and browser storage item utilized by WaniKani:Relearn:
          </p>

          <div className="tech-table-wrapper">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Storage Key</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Technical Purpose & Function</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>BonPomAuth</code></td>
                  <td>HTTP Cookie</td>
                  <td><span className="cookie-badge essential">Essential</span></td>
                  <td>Encrypted session token issued by ASP.NET Core for authenticated user endpoints. HttpOnly & Secure.</td>
                  <td>14 Days</td>
                </tr>
                <tr>
                  <td><code>X-User-Claims</code></td>
                  <td>HTTP Cookie</td>
                  <td><span className="cookie-badge essential">Essential</span></td>
                  <td>Base64-encoded user identity claims (username and email) read by React UI authentication status. Secure.</td>
                  <td>14 Days</td>
                </tr>
                <tr>
                  <td><code>WK-User-Token</code></td>
                  <td>HTTP Cookie</td>
                  <td><span className="cookie-badge functional">Functional</span></td>
                  <td>Encrypted local storage of your WaniKani Personal Access Token when database storage is left unchecked. Secure.</td>
                  <td>1 Year</td>
                </tr>
                <tr>
                  <td><code>bonpom_cookie_consent</code></td>
                  <td>LocalStorage</td>
                  <td><span className="cookie-badge functional">Functional</span></td>
                  <td>Stores your cookie consent selection (<code>granted</code> or <code>declined</code>) to prevent recurring banners.</td>
                  <td>Persistent</td>
                </tr>
                <tr>
                  <td><code>bonpom_settings</code></td>
                  <td>LocalStorage</td>
                  <td><span className="cookie-badge functional">Functional</span></td>
                  <td>Saves interface settings including light/dark theme preference and floating kanji watermark toggles.</td>
                  <td>Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="policy-section">
          <h2>2. External API Services & Network Integrations</h2>
          <p>
            WaniKani:Relearn communicates directly with essential API endpoints to deliver study content and user data:
          </p>

          <div className="category-block">
            <h3>A. WaniKani API v2 (<code>https://api.wanikani.com/v2/</code>)</h3>
            <p>
              When a WaniKani Personal Access Token is configured, requests are dispatched directly to WaniKani servers to query your current level, subscription status, and study assignments. No user credentials or passwords are shared.
            </p>
          </div>

          <div className="category-block">
            <h3>B. Google Fonts (Typography Delivery)</h3>
            <p>
              We load open-source Japanese and serif fonts (Noto Sans JP, Shippori Mincho, Cascadia Code) via Google Fonts (<code>fonts.googleapis.com</code> & <code>fonts.gstatic.com</code>). Google Fonts requests do not place tracking cookies.
            </p>
          </div>
        </section>

        <section className="policy-section">
          <h2>3. Managing Storage Preferences</h2>
          <p>
            You can modify your consent settings or revoke functional cookie permissions at any time.
          </p>

          <div className="policy-action-row">
            <button
              type="button"
              className="wk-btn wk-btn-primary"
              onClick={openPolicyModal}
            >
              Open Preference Center
            </button>
            <Link to="/cookies-policy" className="policy-link-btn">
              ← Read Cookie Policy Statement
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
