import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useDashboardData } from "../hooks/useDashboardData";
import { SrsStageChart } from "../components/dashboard/SrsStageChart";
import { SrsStageStackedChart } from "../components/dashboard/SrsStageStackedChart";
import { CurrentQueueStackedChart } from "../components/dashboard/CurrentQueueStackedChart";
import { UpcomingReviewsChart } from "../components/dashboard/UpcomingReviewsChart";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "WaniKani:Relearn Dashboard" },
    { name: "description", content: "Your WaniKani progress dashboard" },
  ];
}

export function DashboardSkeleton({ error }: { error?: Error | null }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-white/50 dark:bg-slate-950/50 mt-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl text-center border border-red-200 dark:border-red-900 max-w-md">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Data</h3>
            <p className="text-slate-600 dark:text-slate-300">There is a problem with loading data.</p>
          </div>
        </div>
      )}

      <header className="mb-8 border-b border-slate-300 dark:border-slate-700 pb-4">
        <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-3"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="chart-card h-[300px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
        <div className="chart-card h-[300px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
      </div>

      <div className="mb-8">
        <div className="chart-card h-[350px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
      </div>

      <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="chart-card h-[250px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
        <div className="chart-card h-[250px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
        <div className="chart-card h-[250px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
      </div>

      <div className="mb-8">
        <div className="chart-card h-[350px] animate-pulse bg-slate-200 dark:bg-slate-800/50 border-none"></div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading || error || !dashboardData) {
    return <DashboardSkeleton error={error} />;
  }

  const { srsDistribution, reviewsAwaiting, upcomingReviews = [], lessonsReady } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 border-b border-slate-300 dark:border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back! Here's your current progress.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CurrentQueueStackedChart data={reviewsAwaiting} title="Awaiting Reviews" />
        <CurrentQueueStackedChart data={lessonsReady} title="Ready to Study (Lessons)" />
      </div>

      <div className="mb-8">
        <UpcomingReviewsChart data={upcomingReviews} />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">SRS Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SrsStageChart
          data={srsDistribution}
          dataKey="radicals"
          color="var(--color-wk-radical)"
          title="Radicals Progress"
        />
        <SrsStageChart
          data={srsDistribution}
          dataKey="kanji"
          color="var(--color-wk-kanji)"
          title="Kanji Progress"
        />
        <SrsStageChart
          data={srsDistribution}
          dataKey="vocabulary"
          color="var(--color-wk-vocabulary)"
          title="Vocabulary Progress"
        />
      </div>

      <div className="mb-8">
        <SrsStageStackedChart data={srsDistribution} />
      </div>

    </div>
  );
}
