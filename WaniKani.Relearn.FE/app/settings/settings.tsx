import type { Route } from "./+types/settings";
import { useAppSettings } from "~/hooks/useAppSettings";
import "./settings.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | WaniKani:Relearn" },
    { name: "description", content: "Configure app preferences" },
  ];
}

export default function Settings() {
  const { settings, updateSetting } = useAppSettings();

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-card">
        <div className="settings-group">
          <h2 className="settings-group-title">Appearance</h2>

          <div className="settings-row" onClick={(e) => e.preventDefault()}>
            <div className="settings-row-text">
              <span className="settings-label">App Theme</span>
              <span className="settings-description">
                Switch between light and dark modes
              </span>
            </div>
            <div className="theme-selector">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  className={`theme-option ${settings.theme === t ? "active" : ""}`}
                  onClick={() => updateSetting("theme", t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <label className="settings-row" htmlFor="toggle-watermarks">
            <div className="settings-row-text">
              <span className="settings-label">Floating Watermarks</span>
              <span className="settings-description">
                Show drifting kanji characters in the background on list pages
              </span>
            </div>
            <div className="toggle-wrapper">
              <input
                id="toggle-watermarks"
                type="checkbox"
                className="toggle-input"
                checked={settings.floatingWatermarks}
                onChange={(e) => updateSetting("floatingWatermarks", e.target.checked)}
              />
              <span className="toggle-slider" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
