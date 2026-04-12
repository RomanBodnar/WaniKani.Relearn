# Front-End Code Review: WaniKani Relearn

**Date:** April 12, 2026  
**Project:** WaniKani Relearn Frontend (React + TypeScript + Vite)

---

## Executive Summary

The application is a React-based frontend for the WaniKani learning platform with a clean structure and modern tooling. However, there are several areas for improvement including code duplication, hardcoded configuration, type safety issues, and missing error handling patterns. Below is a detailed analysis organized by category.

---

## 🔴 Critical Issues

### 1. Hardcoded API URLs
**Location:** Multiple files
- `app/hooks/useSubjects.ts` line 56
- `app/subject/subject.tsx` lines 16, 37
- `app/assignments/assignments.tsx` line 9

**Issue:** All API endpoints are hardcoded to `http://localhost:5138`, making the application non-portable and difficult to deploy to different environments.

**Recommendation:**
```typescript
// Create app/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5138';
```

Then create `.env` and `.env.example` files:
```
VITE_API_URL=http://localhost:5138
```

### 2. Code Duplication in Subject List Pages
**Location:** Similar code in 4 files
- `app/radicals/radicals.tsx`
- `app/kanji/kanji.tsx`
- `app/vocabulary/vocabulary.tsx`
- `app/kana-vocabulary/kana-vocabulary.tsx`

**Issue:** These files have 95% identical code with only the subject type and labels changing. This violates DRY principle.

**Recommendation:** Refactor into a reusable component:
```typescript
// app/components/SubjectsPage.tsx
interface SubjectsPageProps {
  subjectType: SubjectType;
  title: string;
  description: string;
  subtitle: (count: number) => string;
}

export function SubjectsPage({ subjectType, title, ...props }: SubjectsPageProps) {
  const { data, isLoading, error } = useSubjects(subjectType);
  // Shared rendering logic
}
```

### 3. Duplicate Transformation Functions
**Location:** 
- `app/hooks/useSubjects.ts` lines 13-40 (transformSubject function)
- `app/subject/subject.tsx` lines 116-140 (transformSubject function)

**Issue:** The same data transformation logic is duplicated.

**Recommendation:** Move to shared utility `app/utils/transformSubject.ts` and import in both places.

---

## 🟡 High Priority Issues

### 4. Unused Hook with Unused Code Path
**Location:** `app/hooks/useSubjects.ts`

**Issue:** The `useSubjects` hook is created but not used anywhere. Instead, all pages directly call `fetchSubjects()`. The hook should be standardized across the application.

**Impact:** Inconsistent patterns - the hook enforces proper state management but it's not being used.

### 5. Type Safety - Excessive Use of `any`
**Location:** Multiple files
- `app/subject/subject.tsx` lines 18, 63, 80, 84, 120-125
- `app/assignments/assignments.tsx` lines 13, 15

**Example Issue:**
```typescript
async function fetchSubjectById(id: number | string): Promise<any> {  // ❌
```

**Recommendation:** Create proper TypeScript interfaces for all API responses.

### 6. Missing Error Handling and Loading States
**Location:** `app/subject/subject.tsx` loader function

**Issue:** 
- No loading indicator while fetching related subjects (components and amalgamations)
- N+1 query problem: fetches related subjects one by one in a loop
- No timeout handling for slow API responses

**Current Code:**
```typescript
for (const componentId of subject.ComponentSubjectIds) {
  const componentData = await fetchSubjectById(componentId);  // ❌ Sequential requests
}
```

**Recommendation:**
```typescript
const componentSubjects = await Promise.all(
  subject.ComponentSubjectIds.map(id => fetchSubjectById(id))
);
```

### 7. Debug Logs in Production Code
**Location:** `app/assignments/assignments.tsx` lines 8, 9, 16

**Issue:**
```typescript
console.log("test");
console.log("response from api", response);
console.log(assignments);
```

**Recommendation:** Remove all `console.log` statements from production code.

---

## 🟠 Medium Priority Issues

### 8. Typos and Naming Issues
**Location:**
1. `app/assignments/assignments.tsx` line 13: Component named `Assingnements` (misspelled)
2. `app/hooks/Subject.ts` line 18: `AmalgationSubjectIds` (should be `AmalgamationSubjectIds`)
3. `app/subject/subject.tsx` line 83: `AmalgationSubjectIds` (same typo)

**Recommendation:** Rename component to `Assignments` and fix the property name to match the correct spelling.

### 9. Missing Fetch Cancellation
**Location:** `app/hooks/useSubjects.ts` and subject pages

**Issue:** When component unmounts while fetching, the request is not cancelled, potentially causing memory leaks.

**Recommendation:**
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  const loadData = async () => {
    try {
      const response = await fetch(url, { signal: controller.signal });
      // ...
    } catch (err) {
      if (err instanceof AbortError) return; // Ignore abort errors
      // Handle other errors
    }
  };

  loadData();
  return () => controller.abort(); // Cleanup
}, [subjectType]);
```

### 10. Type Definition Allows Any Property
**Location:** `app/hooks/Subject.ts` line 27

**Issue:**
```typescript
[key: string]: any;  // ❌ Too permissive
```

This undermines TypeScript's type safety. The interface should only define actual properties.

**Recommendation:** Remove the `[key: string]: any` line entirely.

### 11. Missing Environment Variable Type Safety
**Issue:** No typed access to import.meta.env variables.

**Recommendation:** Create `app/types/env.d.ts`:
```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 🔵 Low Priority Issues / Code Quality

### 12. Unused NavLink Import
**Location:** `app/Header/header.tsx` line 1

**Issue:**
```typescript
import { Link, NavLink } from "react-router";  // ❌ NavLink not used
```

**Recommendation:** Remove unused `NavLink` import.

### 13. Incomplete Home Page
**Location:** `app/routes/home.tsx`

**Issue:** Home page is mostly empty with placeholder content. Consider:
- Adding a welcome message
- Quick navigation links
- Statistics or summary
- User guidance

### 14. Missing Accessibility Features
**Issue:** Several components lack proper ARIA labels and semantic HTML.

**Examples:**
- Loading spinner should use `aria-live` and `aria-busy`
- Back button in subject detail could have better context
- Navigation could use `aria-current` more consistently

**Recommendation:** Add ARIA attributes to interactive elements:
```typescript
<div 
  className="loading-spinner" 
  role="status" 
  aria-live="polite" 
  aria-busy="true"
>
  <p>Loading...</p>
</div>
```

### 15. Inline Styles Present
**Location:** Multiple files
- `app/routes/home.tsx` line 11: `style={{ color: "cyan", textAlign: "center" }}`
- `app/radicals/radicals.tsx` line 51: `style={{ color: "#d32f2f" }}`

**Recommendation:** Move to CSS modules or Tailwind utility classes for consistency with the rest of the project (which uses Tailwind).

---

## 📊 Architecture Observations

### Positive Aspects
✅ Modern stack: React 19, React Router 7, TypeScript 5, Vite  
✅ Component-based structure with proper separation of concerns  
✅ Tailwind CSS for styling (though not fully utilized)  
✅ Type safety enabled with strict mode  
✅ Proper error boundary implementation  
✅ Use of React Router loader pattern for data fetching  

### Areas for Improvement
- No state management solution (might need Redux/Zustand if app grows)
- No testing framework set up (Jest, Vitest, React Testing Library)
- No API response validation (consider Zod or Yup)
- No logging/error tracking solution
- No loading/skeleton UI component library

---

## 📋 Suggested Refactoring Checklist

### Priority 1 (Do First)
- [ ] Create API configuration file with environment variables
- [ ] Remove all hardcoded `localhost:5138` URLs
- [ ] Standardize to use `useSubjects` hook across all subject list pages
- [ ] Remove `console.log` statements
- [ ] Fix typos in component/property names

### Priority 2 (Do Soon)
- [ ] Consolidate duplicate transformation functions
- [ ] Create reusable `SubjectsPage` component to eliminate duplication
- [ ] Replace `any` types with proper interfaces
- [ ] Implement fetch cancellation in useSubjects hook
- [ ] Remove `[key: string]: any` from Subject interface

### Priority 3 (Nice to Have)
- [ ] Add proper loading/error states to subject detail page
- [ ] Implement ARIA attributes for accessibility
- [ ] Move inline styles to CSS/Tailwind
- [ ] Complete the home page
- [ ] Add integration tests
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

---

## 📝 Example: Refactored Subject Pages

Here's how the radicals, kanji, vocabulary, and kana-vocabulary pages could be consolidated:

```typescript
// app/routes/subjects/[type].tsx
import { useSubjects, type SubjectType } from "~/hooks/useSubjects";
import { SubjectCard } from "~/components/SubjectCard";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import "./subjects.css";
import type { Route } from "~/+types/root";

interface SubjectPageConfig {
  title: string;
  subtitle: (count: number) => string;
  description: string;
}

const CONFIG: Record<SubjectType, SubjectPageConfig> = {
  radical: {
    title: "Radicals",
    subtitle: (count) => `Total: ${count} radicals`,
    description: "Browse and review radical components",
  },
  kanji: {
    title: "Kanji",
    subtitle: (count) => `Total: ${count} kanji`,
    description: "Browse and review kanji characters",
  },
  vocabulary: {
    title: "Vocabulary",
    subtitle: (count) => `Total: ${count} vocabulary words`,
    description: "Browse and review vocabulary words",
  },
  kana_vocabulary: {
    title: "Kana Vocabulary",
    subtitle: (count) => `Total: ${count} kana vocabulary items`,
    description: "Browse and review kana vocabulary",
  },
};

export function meta({ params }: Route.MetaArgs) {
  const subjectType = params.type as SubjectType;
  const config = CONFIG[subjectType];
  
  return [
    { title: `${config.title} | WaniKani:Relearn` },
    { name: "description", content: config.description },
  ];
}

export default function SubjectsPage({ params }: Route.ComponentProps) {
  const subjectType = params.type as SubjectType;
  const config = CONFIG[subjectType];
  const { data, isLoading, error } = useSubjects(subjectType);

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">{config.title}</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="subjects-subtitle">
            {data && data.length > 0
              ? config.subtitle(data.length)
              : `No ${config.title.toLowerCase()} data available`}
          </p>

          {error ? (
            <div className="subjects-empty">
              <p role="alert" className="error-message">{error.message}</p>
            </div>
          ) : data && data.length > 0 ? (
            <div className="subjects-grid">
              {data.map((subject) => (
                <SubjectCard key={subject.Id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="subjects-empty">
              <p>No {config.title.toLowerCase()} data available</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

Then update `routes.ts`:
```typescript
route("/radicals", "./routes/subjects/[type].tsx", { params: { type: "radical" } }),
route("/kanji", "./routes/subjects/[type].tsx", { params: { type: "kanji" } }),
// etc...
```

---

## 🔐 Security Notes

1. **API Base URL Exposure:** Currently localhost, but in production ensure CORS is properly configured
2. **Input Validation:** No validation of user inputs (ID parameter in subject route)
3. **XSS Prevention:** Content is from a trusted API, but consider DOMPurify if displaying user-generated content
4. **HTTPS:** Ensure production API uses HTTPS only

---

## 📚 Resources & Recommendations

- **Environment Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Error Boundaries:** https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- **Fetch Cancellation:** https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- **React Router:** https://reactrouter.com/
- **TypeScript Best Practices:** https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html

---

## Conclusion

The application has a solid foundation with modern tooling and reasonable structure. The main improvements needed are around eliminating code duplication, improving type safety, and proper configuration management. Implementing the Priority 1 items will significantly improve code quality and maintainability.

**Estimated effort to address all issues:** 4-6 hours of focused refactoring.
