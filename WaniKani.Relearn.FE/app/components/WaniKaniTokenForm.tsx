import React, { useState } from "react";
import { useWaniKaniToken } from "~/hooks/useWaniKaniToken";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import { ToggleSwitch } from "~/components/ToggleSwitch";
import "./WaniKaniTokenForm.css";

export function WaniKaniTokenForm() {
  const { status, isLoading, error, saveToken, disconnectToken } = useWaniKaniToken();
  const { consent, resetConsent, openPolicyModal } = useCookieConsent();
  const [tokenInput, setTokenInput] = useState("");
  const [saveToDatabase, setSaveToDatabase] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setSuccessMsg(null);
    setLocalError(null);

    if (!saveToDatabase && consent === "declined") {
      setLocalError("Functional cookies are currently declined. Please enable cookie consent or toggle database storage on.");
      return;
    }

    const success = await saveToken(tokenInput.trim(), saveToDatabase);
    if (success) {
      setSuccessMsg("WaniKani API Key connected successfully!");
      setTokenInput("");
    }
  };

  const handleDisconnect = async () => {
    if (confirm("Are you sure you want to disconnect your WaniKani API token?")) {
      setSuccessMsg(null);
      const success = await disconnectToken();
      if (success) {
        setSuccessMsg("WaniKani integration disconnected.");
      }
    }
  };

  return (
    <div className="settings-card">
      <div className="settings-group">
        <div className="wk-header-row">
          <h2 className="settings-group-title">Integrations</h2>
          <div
            className={`wk-status-pill ${
              status.hasToken ? "connected" : "disconnected"
            }`}
          >
            <span className="wk-status-dot" />
            {status.hasToken ? (
              <span>
                Connected ({status.storageType})
                {status.maxAllowedLevel ? ` • Lvl 1-${status.maxAllowedLevel}` : ""}
              </span>
            ) : (
              <span>Not Connected</span>
            )}
          </div>
        </div>

        <div className="wk-intro-group">
          <div className="wk-badge-icon">ワ</div>
          <div>
            <span className="settings-label" style={{ fontSize: "16px" }}>
              WaniKani API Integration
            </span>
            <p className="settings-description">
              Connect your WaniKani account to unlock subject mnemonics and sync learning progress
            </p>
          </div>
        </div>

        {localError && (
          <div className="wk-error-alert">
            {localError}{" "}
            <button
              type="button"
              className="cookie-banner-link"
              style={{ color: "inherit", fontWeight: 700 }}
              onClick={resetConsent}
            >
              Change Cookie Settings
            </button>
          </div>
        )}
        {error && <div className="wk-error-alert">{error}</div>}
        {successMsg && <div className="wk-success-alert">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="wk-form-body">
          <div className="wk-input-container">
            <label htmlFor="wk-token-input" className="settings-label">
              Personal Access Token
            </label>
            <div className="wk-input-wrapper">
              <input
                id="wk-token-input"
                type={showToken ? "text" : "password"}
                className="wk-input-field"
                placeholder="e.g. 5d6a8f12-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="wk-toggle-visibility-btn"
                onClick={() => setShowToken(!showToken)}
                title={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.046 10.046 0 013.122-.563c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9.172-9.172" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            className="settings-row"
            style={{ padding: "16px 0", cursor: "pointer" }}
            onClick={() => setSaveToDatabase((prev) => !prev)}
          >
            <div className="settings-row-text">
              <span className="settings-label">Store token securely in database</span>
              <span className="settings-description">
                By enabling this option, you explicitly agree to store an encrypted version of your WaniKani API token in PostgreSQL.
              </span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ToggleSwitch
                checked={saveToDatabase}
                onChange={(checked) => setSaveToDatabase(checked)}
                color="#FE3365"
              />
            </div>
          </div>

          {saveToDatabase ? (
            <div className="wk-notice-box info">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your token will be symmetrically encrypted prior to storage.</span>
            </div>
          ) : (
            <div className="wk-notice-box cookie">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                Token will be saved locally in browser cookies (<code className="wk-code-tag">WK-User-Token</code>). This requires consent for essential functional cookies.
              </span>
            </div>
          )}

          <div className="wk-actions-group">
            {status.hasToken && (
              <button
                type="button"
                className="wk-btn wk-btn-danger"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                Disconnect Token
              </button>
            )}

            <button
              type="submit"
              className="wk-btn wk-btn-primary"
              disabled={isLoading || !tokenInput.trim()}
            >
              {isLoading ? "Saving..." : "Save WaniKani Token"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
