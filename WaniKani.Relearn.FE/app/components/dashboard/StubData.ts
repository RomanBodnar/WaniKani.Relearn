import type { DashboardSummary } from '~/types/dashboard';

export const stubDashboardData: DashboardSummary = {
  srsDistribution: [
    {
      stageGroup: "Apprentice", 
      radicals: 15,
      kanji: 10,
      vocabulary: 25
    },
    {
      stageGroup: "Guru", 
      radicals: 20,
      kanji: 30,
      vocabulary: 45
    },
    {
      stageGroup: "Master",
      radicals: 50,
      kanji: 40,
      vocabulary: 100
    },
    {
      stageGroup: "Enlightened",
      radicals: 80,
      kanji: 60,
      vocabulary: 150
    },
    {
      stageGroup: "Burned",
      radicals: 100,
      kanji: 80,
      vocabulary: 200
    }
  ],
  reviewsAwaiting: {
    total: 35,
    radicals: 5,
    kanji: 10,
    vocabulary: 20
  },
  lessonsReady: {
    total: 17,
    radicals: 2,
    kanji: 5,
    vocabulary: 10
  }
};
