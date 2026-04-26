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

export default function Home() {
  const { data: dashboardData } = useDashboardData();
  
  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  const { srsDistribution, reviewsAwaiting, upcomingReviews, lessonsReady } = dashboardData;

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
