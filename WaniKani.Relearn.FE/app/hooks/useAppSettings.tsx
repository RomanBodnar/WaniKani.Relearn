import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AppSettings {
  floatingWatermarks: boolean;
  theme: "light" | "dark" | "system";
}

interface AppSettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const STORAGE_KEY = "wk-relearn-settings";

const DEFAULT_SETTINGS: AppSettings = {
  floatingWatermarks: true,
  theme: "system",
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

const AppSettingsContext = createContext<AppSettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        settings.theme === "dark" ||
        (settings.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.classList.toggle("light", settings.theme === "light");
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };

    applyTheme();

    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings.theme]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
