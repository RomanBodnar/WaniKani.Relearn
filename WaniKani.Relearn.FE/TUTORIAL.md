# Building a Modern React SPA: A Step-by-Step Tutorial

This tutorial walks you through creating a production-ready React single-page application (SPA) using the same stack and patterns as this project. By the end, you'll have a fully functional app with routing, data fetching, authentication, theming, infinite scrolling, and deployment configuration.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Project Scaffolding](#2-project-scaffolding)
3. [Project Structure](#3-project-structure)
4. [Configuration Files](#4-configuration-files)
5. [Root Layout & App Shell](#5-root-layout--app-shell)
6. [Routing](#6-routing)
7. [Styling with Tailwind CSS & Custom CSS](#7-styling-with-tailwind-css--custom-css)
8. [API Configuration & Environment Variables](#8-api-configuration--environment-variables)
9. [TypeScript Types & Data Transformation](#9-typescript-types--data-transformation)
10. [Data Fetching with Client Loaders](#10-data-fetching-with-client-loaders)
11. [Custom Hooks & Caching](#11-custom-hooks--caching)
12. [Infinite Scrolling & Pagination](#12-infinite-scrolling--pagination)
13. [Reusable Components](#13-reusable-components)
14. [Global State with Context API](#14-global-state-with-context-api)
15. [Authentication](#15-authentication)
16. [Error Handling](#16-error-handling)
17. [URL-Based Filtering](#17-url-based-filtering)
18. [Deployment](#18-deployment)

---

## 1. Tech Stack Overview

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| React Router | 7 (framework mode) | Routing + data loading |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| TypeScript | 5.9 | Type safety |
| Recharts | 3 | Data visualization |
| Node.js | 20 | Runtime (for SSR/deployment) |

**Why this stack?**
- **React Router 7 in framework mode** gives you file-based conventions, type-safe loaders, and built-in SSR/SPA toggle — all without needing a separate meta-framework.
- **Vite** provides lightning-fast HMR and an optimized production build.
- **Tailwind CSS 4** offers a zero-config CSS engine with the new `@theme` directive.
- **SPA mode** (`ssr: false`) keeps things simple — the entire app runs in the browser with client-side data fetching.

---

## 2. Project Scaffolding

### Prerequisites
- Node.js 20+
- npm (or pnpm/yarn)

### Create the project

```bash
npx create-react-router@latest my-app
cd my-app
```

When prompted, select the **SPA** template (or manually set `ssr: false` later).

### Install additional dependencies

```bash
npm install recharts
npm install -D @tailwindcss/vite tailwindcss
```

Your `package.json` should look like:

```json
{
  "name": "my-app",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "react-router build",
    "dev": "vite --open --port 3000",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc"
  },
  "dependencies": {
    "@react-router/node": "7.12.0",
    "@react-router/serve": "7.12.0",
    "isbot": "^5.1.31",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router": "7.12.0",
    "recharts": "^3.8.1"
  },
  "devDependencies": {
    "@react-router/dev": "7.12.0",
    "@tailwindcss/vite": "^4.1.13",
    "@types/node": "^22",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "tailwindcss": "^4.1.13",
    "typescript": "^5.9.2",
    "vite": "^7.1.7",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

---

## 3. Project Structure

Organize your app by **feature** (domain) rather than by technical role:

```
app/
├── app.css                  # Global styles + Tailwind import
├── root.tsx                 # Root layout (HTML shell, providers)
├── routes.ts                # Route definitions
├── config/
│   └── api.ts               # API endpoint configuration
├── types/
│   └── subject.ts           # Shared TypeScript interfaces
├── utils/
│   └── transformSubject.ts  # Data transformation helpers
├── hooks/
│   ├── Subject.ts           # Type definitions for hooks
│   ├── useSubjects.ts       # Data fetching + caching hook
│   └── useAppSettings.tsx   # Global settings context
├── components/
│   ├── SubjectCard.tsx      # Reusable card component
│   ├── NavigationBar.tsx    # Nav links
│   ├── LoadingSpinner.tsx   # Loading indicator
│   ├── ErrorDisplay.tsx     # Error UI
│   ├── LevelFilter.tsx      # Filter component
│   └── Footer.tsx           # Footer
├── Header/
│   ├── header.tsx           # App header with search
│   └── header.css
├── routes/
│   ├── home.tsx             # Landing page
│   └── home.css
├── kanji/
│   ├── kanji.tsx            # Kanji list page
│   └── subjects.css
├── subject/
│   ├── subject.tsx          # Subject detail page
│   └── subject.css
├── auth/
│   ├── login.tsx            # Login page
│   ├── register.tsx         # Registration page
│   └── auth.css
└── settings/
    ├── settings.tsx         # Settings page
    └── settings.css
```

**Key principle:** Each feature folder contains its own page component and associated CSS. Shared logic lives in `hooks/`, `components/`, `utils/`, and `config/`.

---

## 4. Configuration Files

### `vite.config.ts`

```ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
```

- `tailwindcss()` — processes Tailwind directives directly in Vite
- `reactRouter()` — enables React Router framework mode (type generation, conventions)
- `tsconfigPaths()` — resolves `~/` path aliases from tsconfig

### `react-router.config.ts`

```ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // SPA mode — all rendering happens client-side
} satisfies Config;
```

Setting `ssr: false` means:
- No server-side rendering
- Use `clientLoader` instead of `loader`
- The app is a static SPA that can be hosted anywhere (Vercel, S3, etc.)

### `tsconfig.json`

```json
{
  "include": ["**/*", "**/.server/**/*", "**/.client/**/*", ".react-router/types/**/*"],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["node", "vite/client"],
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "rootDirs": [".", "./.react-router/types"],
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    },
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

The `paths` alias (`~/*`) lets you write clean imports like `import { API_BASE_URL } from "~/config/api"` instead of relative paths.

---

## 5. Root Layout & App Shell

The root layout (`app/root.tsx`) defines the HTML document structure and wraps the entire app:

```tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./Header/header";
import Footer from "./components/Footer";
import { AppSettingsProvider } from "./hooks/useAppSettings";

// Client loader runs on every navigation — check auth state
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const isLoggedIn = document.cookie.includes("X-User-Claims=");
  return { isLoggedIn };
}

// External fonts
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap",
  },
];

// The Layout component wraps everything — it's the <html> document
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppSettingsProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </AppSettingsProvider>
      </body>
    </html>
  );
}

// The default export renders the matched child route
export default function App() {
  return <Outlet />;
}

// Shows while the app hydrates (SPA loading)
export function HydrateFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  );
}

// Global error boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404
      ? "The requested page could not be found."
      : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
    </main>
  );
}
```

**Key concepts:**
- `Layout` = the HTML shell (rendered once)
- `App` = just renders `<Outlet />` which displays the currently matched route
- `HydrateFallback` = shown while JavaScript loads in SPA mode
- `clientLoader` at the root level = data available to all child routes via `useRouteLoaderData("root")`
- `ScrollRestoration` = preserves scroll position on back/forward navigation

---

## 6. Routing

### `app/routes.ts`

React Router 7 uses a central route configuration file:

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/kanji", "./kanji/kanji.tsx"),
  route("/vocabulary", "./vocabulary/vocabulary.tsx"),
  route("/radicals", "./radicals/radicals.tsx"),
  route("/subject/:id", "./subject/subject.tsx"),
  route("/grammar/:id", "./grammar/grammar.tsx"),
  route("/grammar", "./grammar/grammar-index.tsx"),
  route("/search", "./search/search.tsx"),
  route("/settings", "./settings/settings.tsx"),
  route("/login", "./auth/login.tsx"),
  route("/register", "./auth/register.tsx"),
] satisfies RouteConfig;
```

**How it works:**
- `index(...)` = the route shown at `/`
- `route("/path", "./file.tsx")` = maps a URL to a component file
- `:id` = dynamic parameter (accessed via `params.id`)
- Each route file can export `clientLoader`, `meta`, `ErrorBoundary`, and a default component

### Type-safe route params

React Router 7 auto-generates types based on your route definitions. In a route component:

```tsx
import type { Route } from "./+types/kanji"; // Auto-generated!

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // request, params, etc. are fully typed
}

export default function Kanji({ loaderData }: Route.ComponentProps) {
  // loaderData is typed based on what clientLoader returns
}
```

Run `npm run typecheck` to regenerate types after modifying routes.

---

## 7. Styling with Tailwind CSS & Custom CSS

### `app/app.css` — Global styles entry point

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-jp: "Noto Sans JP", ui-sans-serif, system-ui, sans-serif;
}

html, body {
  @apply bg-white dark:bg-gray-950;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  width: 100%;
}

/* Custom CSS variables for theming */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

**Tailwind CSS 4 approach:**
- No `tailwind.config.js` needed — configuration lives in CSS via `@theme`
- Use `@apply` for frequently repeated utility combinations
- Combine utility classes in JSX with custom CSS files per-component

### Per-component CSS

Each feature has its own CSS file imported directly:

```tsx
// kanji/kanji.tsx
import "./subjects.css";
```

```css
/* kanji/subjects.css */
.subjects-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}
```

**Dark mode** is handled via the `dark:` variant in Tailwind and manual class toggling on `<html>` (see Section 14).

---

## 8. API Configuration & Environment Variables

### `.env` and `.env.example`

```bash
# .env.example
VITE_API_URL=http://localhost:5138
```

Vite exposes env vars prefixed with `VITE_` to client code via `import.meta.env`.

### `app/config/api.ts`

Centralize all API endpoints in one file:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  subjects: (type: string) => `${API_BASE_URL}/api/subjects/${type}`,
  subjectById: (id: string | number) => `${API_BASE_URL}/api/subjects/${id}`,
  assignments: `${API_BASE_URL}/assignments`,

  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  authMe: `${API_BASE_URL}/api/auth/me`,
} as const;

export { API_BASE_URL };
```

**Benefits:**
- Single source of truth for all URLs
- Easy to swap backends by changing one env var
- Type-safe with `as const`

---

## 9. TypeScript Types & Data Transformation

### Define your domain types

```ts
// hooks/Subject.ts
export interface Subject {
  Id: number;
  Object: string;
  Characters: string | null;
  Meanings: Array<{
    Meaning: string;
    Primary: boolean;
    AcceptedAnswer: boolean;
  }>;
  Readings?: Array<{
    Reading: string;
    Primary: boolean;
    AcceptedAnswer: boolean;
    Type?: string;
  }>;
  Level?: number;
  MeaningMnemonic?: string;
  ReadingMnemonic?: string;
  PartsOfSpeech?: string[];
  ComponentSubjectIds?: number[];
  ContextSentences?: Array<{ en: string; ja: string }>;
}
```

### Transform API responses

When your API uses different naming conventions (snake_case, camelCase) than your frontend (PascalCase), create a transformation layer:

```ts
// utils/transformSubject.ts
interface RawSubjectData {
  id: number;
  object: string;
  characters: string | null;
  meanings?: Array<{ meaning: string; primary: boolean; accepted_answer: boolean }>;
  readings?: Array<{ reading: string; primary: boolean; accepted_answer: boolean; type?: string }>;
  level?: number;
  // ... more fields
}

export function transformSubject(apiSubject: RawSubjectData): Subject {
  return {
    Id: apiSubject.id,
    Object: apiSubject.object,
    Characters: apiSubject.characters,
    Meanings: apiSubject.meanings?.map(m => ({
      Meaning: m.meaning,
      Primary: m.primary,
      AcceptedAnswer: m.accepted_answer,
    })) || [],
    Readings: apiSubject.readings?.map(r => ({
      Reading: r.reading,
      Primary: r.primary,
      AcceptedAnswer: r.accepted_answer,
      Type: r.type,
    })),
    Level: apiSubject.level,
    // ... map remaining fields
  };
}
```

**Why?** Keeps the API layer decoupled from the UI layer. If the API changes, only the transform function needs updating.

---

## 10. Data Fetching with Client Loaders

In SPA mode, routes use `clientLoader` to fetch data before the component renders:

```tsx
// kanji/kanji.tsx
import type { Route } from "./+types/kanji";
import { fetchSubjects } from "~/hooks/useSubjects";

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const minLevel = url.searchParams.get("minLevel");
  const maxLevel = url.searchParams.get("maxLevel");

  return await fetchSubjects(
    "kanji",
    1,                                           // page
    100,                                         // perPage
    minLevel ? parseInt(minLevel, 10) : undefined,
    maxLevel ? parseInt(maxLevel, 10) : undefined
  );
}

export default function Kanji({ loaderData: initialData }: Route.ComponentProps) {
  // initialData is already loaded — no loading spinner needed for initial render
  return <div>{/* render subjects */}</div>;
}
```

**How `clientLoader` works:**
1. User navigates to `/kanji?minLevel=1&maxLevel=10`
2. React Router calls `clientLoader` with the request
3. The loader fetches data and returns it
4. The component receives the data as `loaderData`
5. If the loader throws a `Response`, the `ErrorBoundary` catches it

**Advantages over `useEffect`:**
- Data is ready when the component renders (no flicker)
- Integrates with React Router's navigation (pending states, transitions)
- URL search params drive the data fetch (shareable URLs)

---

## 11. Custom Hooks & Caching

### Fetch function

```ts
// hooks/useSubjects.ts
export async function fetchSubjects(
  subjectType: SubjectType,
  page: number = 1,
  perPage: number = 100,
  minLevel?: number,
  maxLevel?: number
): Promise<PaginatedSubjects> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("perPage", String(perPage));
  if (minLevel !== undefined) params.set("minLevel", String(minLevel));
  if (maxLevel !== undefined) params.set("maxLevel", String(maxLevel));

  const url = `${API_BASE_URL}/api/subjects?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${subjectType} data`);
  }

  const apiData = await response.json();

  return {
    data: apiData.data.map(transformSubject),
    page: apiData.page,
    perPage: apiData.perPage,
    totalCount: apiData.totalCount,
  };
}
```

### Simple in-memory cache

For an SPA, a simple `Map` cache preserves state between navigations:

```ts
const subjectCache = new Map<string, { subjects: Subject[]; page: number; totalCount: number }>();

function getCacheKey(subjectType: SubjectType, filters: { minLevel?: number; maxLevel?: number }) {
  return `${subjectType}-${filters.minLevel || 0}-${filters.maxLevel || 0}`;
}
```

When the user navigates away and comes back, data is served from the cache instantly — no refetch needed.

---

## 12. Infinite Scrolling & Pagination

### The hook

```ts
export function useInfiniteSubjects(
  initialData: PaginatedSubjects,
  subjectType: SubjectType,
  filters: { minLevel?: number; maxLevel?: number } = {}
) {
  const [subjects, setSubjects] = useState<Subject[]>(initialData.data);
  const [page, setPage] = useState(initialData.page);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = subjects.length < totalCount;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchSubjects(subjectType, nextPage, 100, filters.minLevel, filters.maxLevel);
      setSubjects(prev => [...prev, ...result.data]);
      setPage(nextPage);
      setTotalCount(result.totalCount);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, subjectType, filters]);

  return { subjects, loadMore, hasMore, isLoading, totalCount };
}
```

### Intersection Observer trigger

```tsx
export default function Kanji({ loaderData: initialData }: Route.ComponentProps) {
  const { subjects, loadMore, hasMore, isLoading } = useInfiniteSubjects(initialData, "kanji");
  const loaderRef = useRef<HTMLDivElement>(null);

  // Auto-load more when the sentinel element becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before reaching the end
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div>
      <div className="subjects-grid">
        {subjects.map(subject => (
          <SubjectCard key={subject.Id} subject={subject} variant="kanji" />
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div ref={loaderRef}>
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
}
```

---

## 13. Reusable Components

### SubjectCard — a typical reusable component

```tsx
// components/SubjectCard.tsx
import type { Subject } from "~/hooks/Subject";
import { Link } from "react-router";
import "./SubjectCard.css";

interface SubjectCardProps {
  subject: Subject;
  variant?: "kanji" | "vocabulary" | "radical";
}

export const SubjectCard = ({ subject, variant }: SubjectCardProps) => {
  const primaryMeaning = subject.Meanings?.find(m => m.Primary);
  const primaryReading = subject.Readings?.find(r => r.Primary);

  return (
    <Link to={`/subject/${subject.Id}`} className="subject-card-link">
      <div className={`subject-card ${variant ? `subject-card-${variant}` : ''}`}>
        <div className="subject-card-character">{subject.Characters}</div>
        <div className="subject-card-content">
          {primaryMeaning && <strong>{primaryMeaning.Meaning}</strong>}
          {primaryReading && <div>{primaryReading.Reading}</div>}
          {subject.Level && <div className="subject-card-level">Level {subject.Level}</div>}
        </div>
      </div>
    </Link>
  );
};
```

**Component design principles used here:**
- Props interface with optional `variant` for visual flexibility
- Uses `Link` from React Router for client-side navigation
- Renders derived data (primary meaning/reading) — not raw arrays
- CSS class composition based on variant

---

## 14. Global State with Context API

For simple global state (theme, user preferences), React Context works well without external libraries:

```tsx
// hooks/useAppSettings.tsx
import { createContext, use, useState, useEffect, type ReactNode } from "react";

interface AppSettings {
  floatingWatermarks: boolean;
  theme: "light" | "dark" | "system";
}

const STORAGE_KEY = "app-settings";
const DEFAULT_SETTINGS: AppSettings = { floatingWatermarks: true, theme: "system" };

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

const AppSettingsContext = createContext<{
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}>({ settings: DEFAULT_SETTINGS, updateSetting: () => {} });

export const useAppSettings = () => use(AppSettingsContext);

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => { setSettings(loadSettings()); }, []);

  // Apply theme to document
  useEffect(() => {
    const isDark = settings.theme === "dark" ||
      (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, [settings.theme]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppSettingsContext value={{ settings, updateSetting }}>
      {children}
    </AppSettingsContext>
  );
};
```

**Usage in components:**

```tsx
const { settings, updateSetting } = useAppSettings();
// Toggle dark mode
updateSetting("theme", "dark");
```

**When to use Context vs. other solutions:**
- Context API — simple, low-frequency updates (theme, locale, auth state)
- URL search params — filter states, pagination (shareable URLs)
- In-memory cache (Map) — fetched data between navigations
- External library (Zustand, Jotai) — complex state with many subscribers

---

## 15. Authentication

### Cookie-based auth flow

This app uses HTTP-only cookies set by the backend. The frontend:
1. Sends credentials to the API
2. The API sets a cookie in the response
3. Subsequent requests include the cookie automatically (`credentials: 'include'`)

### Login page

```tsx
// auth/login.tsx
import { useNavigate, useRevalidator } from "react-router";
import { useActionState } from "react";
import { API_ENDPOINTS } from "~/config/api";

export default function Login() {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const response = await fetch(API_ENDPOINTS.login, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",  // Important! Sends/receives cookies
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Login failed");

        revalidate();  // Re-runs root clientLoader to update isLoggedIn
        navigate("/");
        return null;
      } catch {
        return "Login failed. Please check your credentials.";
      }
    },
    null
  );

  return (
    <form action={submitAction}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
```

**Key patterns:**
- `useActionState` (React 19) — manages form submission state
- `credentials: "include"` — required for cross-origin cookie handling
- `revalidate()` — triggers the root `clientLoader` to re-check auth status
- The root loader reads `document.cookie` to determine login state

### Checking auth status globally

The root `clientLoader` returns `{ isLoggedIn }`, accessible anywhere:

```tsx
const rootData = useRouteLoaderData("root") as { isLoggedIn: boolean };
```

---

## 16. Error Handling

### Route-level error boundaries

Each route can export an `ErrorBoundary`:

```tsx
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="error-container">
      <ErrorDisplay
        title="Error loading data"
        description="Make sure the API is running and accessible."
      />
    </div>
  );
}
```

If `clientLoader` throws, this boundary catches it — the rest of the app still works.

### Throwing Response objects

```tsx
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await fetch(API_ENDPOINTS.subjectById(params.id));
  if (!response.ok) {
    throw new Response("Not found", { status: 404 });
  }
  return await response.json();
}
```

React Router treats thrown `Response` objects specially — `isRouteErrorResponse(error)` returns true and you can inspect `error.status`.

---

## 17. URL-Based Filtering

Store filter state in URL search params to make filters shareable and bookmarkable:

```tsx
import { useSearchParams } from "react-router";

export default function Kanji({ loaderData: initialData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current filters from URL
  const minLevel = searchParams.get("minLevel");
  const maxLevel = searchParams.get("maxLevel");

  // Update filters by modifying the URL
  const handleRangeChange = (range: [number, number] | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (range) {
        next.set("minLevel", String(range[0]));
        next.set("maxLevel", String(range[1]));
      } else {
        next.delete("minLevel");
        next.delete("maxLevel");
      }
      return next;
    }, { replace: true }); // replace: true avoids polluting browser history
  };

  return (
    <div>
      <LevelFilter selectedRange={[minLevel, maxLevel]} onChange={handleRangeChange} />
      {/* ... render filtered subjects */}
    </div>
  );
}
```

**Why URL params?**
- Shareable: `example.com/kanji?minLevel=1&maxLevel=10`
- Bookmarkable
- Back/forward navigation preserves filters
- `clientLoader` can read them to fetch the right data

---

## 18. Deployment

### Docker

```dockerfile
# Multi-stage build for minimal production image
FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t my-app .
docker run -p 3000:3000 -e VITE_API_URL=https://api.example.com my-app
```

### Vercel (Static SPA)

Create `vercel.json` for API proxying:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-api-server.com/api/:path*"
    }
  ]
}
```

This proxies `/api/*` requests to your backend, avoiding CORS issues in production.

Deploy:
```bash
npx vercel
```

### Environment variables per environment

| Environment | How to set `VITE_API_URL` |
|---|---|
| Local dev | `.env` file |
| Docker | `-e` flag or docker-compose |
| Vercel | Project settings → Environment Variables |
| GCP Cloud Run | Service configuration |

---

## Summary of Patterns

| Pattern | Implementation |
|---|---|
| Routing | React Router 7 framework mode with `routes.ts` |
| Data loading | `clientLoader` per route |
| State management | URL params (filters), Context (settings), Map cache (fetched data) |
| Styling | Tailwind CSS 4 + per-component CSS files |
| Auth | Cookie-based with `credentials: 'include'` |
| Pagination | Infinite scroll with Intersection Observer |
| Error handling | Route-level `ErrorBoundary` exports |
| Types | Strict TypeScript with auto-generated route types |
| API layer | Centralized endpoints + transform functions |
| Deployment | Multi-stage Docker + Vercel with rewrites |

---

## Quick Start Checklist

1. ☐ Scaffold with `create-react-router`
2. ☐ Set `ssr: false` in `react-router.config.ts`
3. ☐ Configure Vite plugins (Tailwind, tsconfigPaths)
4. ☐ Create `app/config/api.ts` with your endpoints
5. ☐ Define TypeScript interfaces for your data
6. ☐ Build the root layout with providers
7. ☐ Add routes in `routes.ts`
8. ☐ Implement `clientLoader` in each route for data fetching
9. ☐ Create reusable components (cards, filters, spinners)
10. ☐ Add infinite scrolling with Intersection Observer
11. ☐ Implement auth (login form → cookie → revalidate)
12. ☐ Set up `.env` for API URL
13. ☐ Add Dockerfile for production
14. ☐ Deploy to Vercel/Docker/Cloud Run
