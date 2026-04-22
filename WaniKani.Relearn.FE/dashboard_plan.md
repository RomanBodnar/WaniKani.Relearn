# Dashboard Implementation Plan

## Goal Description
Implement a dashboard page acting as the home page of the WaniKani Relearn front-end application. The dashboard will visualize the user's progress and current tasks (lessons and reviews) using various column and stacked column charts. We will use a simple and popular charting library like **Recharts** (if using React) or **Chart.js** to render these visualizations.

## Required Features & Charts
The dashboard will include the following visualizations:
1. **Radicals per SRS Stage:** A column chart displaying the count of Radicals across the 5 major SRS groups (Apprentice, Guru, Master, Enlightened, Burned).
2. **Vocabulary per SRS Stage:** A column chart displaying the count of Vocabulary (including Kana Vocabulary) across the 5 major SRS groups.
3. **Kanji per SRS Stage:** A column chart displaying the count of Kanji across the 5 major SRS groups.
4. **Overall SRS Stage Distribution:** A stacked column chart combining Radicals, Vocabulary/Kana, and Kanji across the 5 major SRS groups.
5. **Awaiting Reviews (Now):** A stacked column chart represented as a single stacked bar for items currently available for review, stacked by item type (Radicals, Kanji, Vocabulary).
6. **Upcoming Reviews (Timeline):** A separate stacked column chart showing the future timeline of items awaiting review (e.g., Next Hour, Next 24 Hours, etc.), stacked by item type.
7. **Ready to Study (Lessons):** A stacked column chart represented as a single bar showing items ready to be studied (lessons), stacked by item type.

## Proposed Backend Contracts

We will provide a unified `GET /api/dashboard/summary` endpoint to supply all the necessary data for the dashboard without requiring multiple round-trips.

### Endpoint: `GET /api/dashboard/summary`

#### Response Model (JSON)
```json
{
  "srsDistribution": [
    {
      "stageGroup": "Apprentice", 
      "radicals": 15,
      "kanji": 10,
      "vocabulary": 25
    },
    {
      "stageGroup": "Guru", 
      "radicals": 20,
      "kanji": 30,
      "vocabulary": 45
    },
    // ... continues for Master, Enlightened, Burned
    {
      "stageGroup": "Burned",
      "radicals": 100,
      "kanji": 80,
      "vocabulary": 200
    }
  ],
  "reviewsAwaiting": {
    "total": 35,
    "radicals": 5,
    "kanji": 10,
    "vocabulary": 20
  },
  "upcomingReviews": [
    {
      "timeLabel": "Next Hour",
      "radicals": 2,
      "kanji": 5,
      "vocabulary": 10
    },
    {
      "timeLabel": "Next 24 Hours",
      "radicals": 10,
      "kanji": 15,
      "vocabulary": 30
    }
  ],
  "lessonsReady": {
    "total": 17,
    "radicals": 2,
    "kanji": 5,
    "vocabulary": 10
  }
}
```

## Component Structure (Frontend)
- **`DashboardPage`**: Main container fetching data and distributing it to chart components.
- **`SrsStageChart`**: Reusable column chart component for Radicals, Kanji, and Vocab individual charts (grouped by the 5 major SRS groups).
- **`SrsStageStackedChart`**: Stacked column chart for overall distribution across the 5 major SRS groups.
- **`CurrentQueueStackedChart`**: Reusable single-bar stacked column chart for both "Awaiting Reviews (Now)" and "Lessons Ready" queues.
- **`UpcomingReviewsChart`**: Stacked column chart rendering the future review timeline on the X-axis.

## Backend Implementation Steps

To implement the `GET /api/dashboard/summary` endpoint, the backend (`WaniKani.Relearn`) will need to aggregate data from the WaniKani API (or local data store).

### 1. Fetching SRS Distribution (Assignments)
- **API Dependency**: `GET https://api.wanikani.com/v2/assignments`
- **Logic**:
  1. Fetch all assignments for the user.
  2. Group the assignments by `srs_stage` and map the integer stages (1-9) to the 5 major SRS groups:
     - **Apprentice**: Stages 1-4
     - **Guru**: Stages 5-6
     - **Master**: Stage 7
     - **Enlightened**: Stage 8
     - **Burned**: Stage 9
  3. Count the number of each `subject_type` (radical, kanji, vocabulary) within each group to build the `srsDistribution` array.

### 2. Fetching Reviews and Lessons (Summary)
- **API Dependency**: `GET https://api.wanikani.com/v2/summary`
- **Logic**:
  1. Fetch the summary to get a list of available `lessons` and upcoming/current `reviews`.
  2. The summary response returns lists of `subject_ids` (e.g., `lessons[0].subject_ids`). Since it doesn't return the `subject_type` directly, the backend must resolve these IDs against its `Subjects` collection (e.g., `GET /v2/subjects?ids=...` or local JSON cache like `static/radical-2.json`).
  3. **Lessons Ready**: Count the resolved subject types for all IDs listed in the `lessons` array where `available_at` is in the past or now.
  4. **Awaiting Reviews (Now)**: Filter the `reviews` array for entries where `available_at <= DateTime.UtcNow`. Map their `subject_ids` to their `subject_types` and count them.
  5. **Upcoming Reviews (Timeline)**: Filter the `reviews` array for entries where `available_at > DateTime.UtcNow`. Bucket them into timeline labels (e.g., "Next Hour", "Next 24 Hours") based on their `available_at` timestamp. Map their `subject_ids` to `subject_types` to build the `upcomingReviews` array.

## Verification Plan
1. **API Validation:** Verify backend implements `GET /api/dashboard/summary` matching the JSON contract exactly, including grouping SRS distributions by the 5 major categories.
2. **Component Testing:** Ensure the chosen simple charting library (e.g., Recharts) renders the correct single-bar and multi-bar charts with mock data.
3. **Integration:** Hook up the API response to the charts and verify the accuracy of the displayed counts.
