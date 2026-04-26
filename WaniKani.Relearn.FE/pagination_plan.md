# Pagination Implementation Plan for Subject Grids

This document outlines the steps required to implement pagination for the various subject grid pages (Vocabulary, Kanji, Radicals, Kana-Vocabulary) in the WaniKani Relearn application. 

## Part 1: Backend Implementation (Human Tasks)

The backend needs to be updated to support offset/limit based pagination to prevent overwhelming the client and the database when rendering thousands of subject cards.

**1. Update the API Endpoint:**
Modify the `GET /api/subjects` (or equivalent) endpoint to accept optional query parameters for pagination:
- `page` (integer, default: 1)
- `limit` (integer, default: 50 or 100)

**2. Modify the Database Query:**
Implement `Skip()` and `Take()` (if using Entity Framework/LINQ) or the equivalent offset/limit SQL clauses to fetch only the requested slice of data.
- Ensure the query has a deterministic `OrderBy` clause (e.g., sort by Level ascending, then ID or Subject Name) so that pagination remains consistent across pages.
- Execute a `Count()` query to determine the total number of items that match the filters.

**3. Update the Response Payload Structure:**
Instead of returning a flat JSON array `[ {...}, {...} ]`, wrap the results in a paginated object structure containing both the data and the metadata.

*Example Response Contract:*
```json
{
  "data": [
    { "Id": 1, "Object": "vocabulary", "Characters": "...", ... }
  ],
  "meta": {
    "totalCount": 8500,
    "currentPage": 1,
    "totalPages": 170,
    "limit": 50
  }
}
```

---

## Part 2: Frontend Implementation (AI Agent Instructions)

**Agent Objective:** Update the React frontend to consume the new paginated backend endpoints and render a functional pagination UI below the subject grids.

**Step 1: Update API Interfaces and Hooks**
- Locate the API fetch logic (e.g., `useSubjects` hook and `API_ENDPOINTS` config).
- Update the interface definitions to expect the new response payload (`{ data: Subject[], meta: PaginationMeta }`).
- Modify the fetch URL to append the `page` query parameter (e.g., `?type=vocabulary&page=${page}`).

**Step 2: Build a Pagination Component**
- Create a reusable `Pagination.tsx` component in the `app/components/` directory.
- It should accept props: `currentPage` (number), `totalPages` (number), and `onPageChange` (function).
- Render "Previous" and "Next" buttons. Disable "Previous" if `currentPage === 1` and disable "Next" if `currentPage === totalPages`.
- Optionally render page number buttons (or just a "Page X of Y" text indicator) between the controls.
- Style the buttons cleanly using existing design tokens.

**Step 3: Update the Subject Pages**
- Modify `app/vocabulary/vocabulary.tsx`, `app/kanji/kanji.tsx`, `app/radicals/radicals.tsx`, and `app/kana-vocabulary/kana-vocabulary.tsx`.
- Add a local state hook: `const [page, setPage] = useState(1);`.
- Pass the `page` state into the `useSubjects` hook.
- Update the subtitle text. Previously it said `Total: ${subjects.length}`. It should now read from `data.meta.totalCount` (e.g., `Total: ${meta.totalCount} subjects`).
- Render the new `<Pagination />` component immediately below the `.subjects-grid`.
- *UX Polish:* When `onPageChange` is triggered, scroll the user back to the top of the `.subjects-container` so they aren't left looking at the bottom of the page when the new items load.
