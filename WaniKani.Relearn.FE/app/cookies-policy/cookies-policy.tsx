import React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/cookies-policy";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import "./cookies-policy.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cookie Policy | WaniKani:Relearn" },
    { name: "description", content: "Comprehensive explanation of cookie usage, encryption, privacy, and storage practices on WaniKani:Relearn." },
  ];
}

export default function CookiesPolicy() {
  const { openPolicyModal, consent } = useCookieConsent();

  return (
    <div className="policy-page-container">
      <header className="policy-page-header">
        <h1 className="policy-page-title">Cookie Statement & Privacy Policy</h1>
        <p className="policy-page-subtitle">
          Last updated: August 2026 • Full disclosure on cookies, client storage, and WaniKani API token protection
        </p>
      </header>

      <div className="policy-page-card">
        <section className="policy-section">
          <h2>1. Introduction & Overview</h2>
          <p>
            At WaniKani:Relearn, we prioritize user privacy, data security, and compliance with modern privacy frameworks (GDPR and ePrivacy Directive). This document explains what cookies and client storage technologies we use, why we use them, and how you can manage or revoke your consent.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. What Are Cookies and Local Storage?</h2>
          <p>
            <strong>HTTP Cookies</strong> are small text fragments stored by your browser when navigating websites. They allow web applications to maintain logged-in states across page reloads.
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <strong>Local Storage</strong> is a secure HTML5 browser storage mechanism that allows applications to save persistent key-value configuration settings (such as your preferred dark mode theme or floating watermark animations) directly on your device.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. Detailed Breakdown of Storage Categories</h2>
          
          <div className="category-block">
            <h3>A. Essential Cookies (Strictly Necessary)</h3>
            <p>
              Essential cookies are required for the application to function securely. Without them, user login sessions and API authorization cannot be maintained.
            </p>
            <ul className="policy-list">
              <li>
                <code>BonPomAuth</code>: Encrypted session cookie issued by the ASP.NET Core backend when you log in. Expires after 14 days.
              </li>
              <li>
                <code>X-User-Claims</code>: Base64-encoded cookie containing identity claims (username and email) so the React frontend UI can display your logged-in user state. Expires after 14 days.
              </li>
            </ul>
          </div>

          <div className="category-block">
            <h3>B. Functional Storage (WaniKani Token & User Preferences)</h3>
            <p>
              Functional storage remembers your choices to provide an enhanced, personalized experience.
            </p>
            <ul className="policy-list">
              <li>
                <code>WK-User-Token</code>: If you explicitly choose <em>not</em> to store your WaniKani Personal Access Token in our PostgreSQL database, your token is encrypted and stored in this browser cookie. Expires after 1 year.
              </li>
              <li>
                <code>bonpom_cookie_consent</code>: LocalStorage item preserving your cookie consent choice (<code>granted</code> or <code>declined</code>).
              </li>
              <li>
                <code>bonpom_settings</code>: LocalStorage item saving your interface preferences (light/dark theme mode and floating kanji watermark animations).
              </li>
            </ul>
          </div>

          <div className="category-block">
            <h3>C. Analytical & Advertising Cookies (0 Active)</h3>
            <p>
              WaniKani:Relearn does <strong>not</strong> use third-party tracking cookies, Google Analytics, social media trackers, or advertising networks. We do not sell or monetize your learning data.
            </p>
          </div>
        </section>

        <section className="policy-section">
          <h2>4. Security & Encryption of WaniKani Personal Access Tokens</h2>
          <p>
            WaniKani Personal Access Tokens grant access to your WaniKani study progress. We offer two secure methods for storing your key:
          </p>
          <ul className="policy-list" style={{ marginTop: "0.5rem" }}>
            <li>
              <strong>Database Storage (Recommended):</strong> Encrypted using ASP.NET Core Data Protection symmetric encryption before saving to PostgreSQL.
            </li>
            <li>
              <strong>Browser Cookie Storage:</strong> Stored locally on your device in the <code>WK-User-Token</code> cookie. Requires functional cookie consent.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Your Rights and Managing Preferences</h2>
          <p>
            Your current cookie consent status is: <span className="policy-status-badge">{consent.toUpperCase()}</span>.
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            You can change your consent preferences or revoke functional cookies at any time using our preference center.
          </p>
          
          <div className="policy-action-row">
            <button
              type="button"
              className="wk-btn wk-btn-primary"
              onClick={openPolicyModal}
            >
              Open Preference Center
            </button>
            <Link to="/technology-list" className="policy-link-btn">
              Explore Full Technology & Vendor Inventory →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
