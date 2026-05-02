/**
 * Dashboard-related types
 */

export interface SrsDistributionItem {
  stage: string;
  radicals: number;
  kanji: number;
  vocabulary: number;
}

export interface ReviewsReadySummary {
  total: number;
  radicals: number;
  kanji: number;
  vocabulary: number;
}

export interface LessonsReadySummary {
  total: number;
  radicals: number;
  kanji: number;
  vocabulary: number;
}

export interface DashboardSummary {
  srsDistribution: SrsDistributionItem[];
  reviewsAwaiting: ReviewsReadySummary;
  lessonsReady: LessonsReadySummary;
}
