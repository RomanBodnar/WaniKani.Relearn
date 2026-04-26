import { useState, useEffect } from "react";
import type { DashboardSummary } from "~/types/dashboard";

interface UseDashboardDataResult {
  data: DashboardSummary | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
          const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5138";
        const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }
        
        const dashboardData: DashboardSummary = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, isLoading, error };
}
