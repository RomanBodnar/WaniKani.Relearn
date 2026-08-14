import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '~/config/api';

export interface WaniKaniTokenStatus {
  hasToken: boolean;
  storageType: 'Database' | 'Cookie' | 'None';
  maxAllowedLevel?: number | null;
}

export function useWaniKaniToken() {
  const [status, setStatus] = useState<WaniKaniTokenStatus>({
    hasToken: false,
    storageType: 'None',
    maxAllowedLevel: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.wanikaniStatus, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          hasToken: data.hasToken ?? false,
          storageType: data.storageType || 'None',
          maxAllowedLevel: data.maxAllowedLevel ?? null,
        });
      } else if (response.status === 401 || response.status === 404) {
        // 401 = Unauthenticated, 404 = Backend endpoint not implemented yet
        // Fall back to checking local browser cookie silently without throwing error banner
        const hasCookieToken = typeof document !== 'undefined' && document.cookie.includes('WK-User-Token=');
        setStatus({
          hasToken: hasCookieToken,
          storageType: hasCookieToken ? 'Cookie' : 'None',
          maxAllowedLevel: null,
        });
      } else {
        setError('Failed to fetch WaniKani token status.');
      }
    } catch (err: any) {
      console.error('Error fetching WaniKani token status:', err);
      // Fallback check for cookie
      const hasCookieToken = typeof document !== 'undefined' && document.cookie.includes('WK-User-Token=');
      setStatus({
        hasToken: hasCookieToken,
        storageType: hasCookieToken ? 'Cookie' : 'None',
        maxAllowedLevel: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const saveToken = async (token: string, saveToDatabase: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.wanikaniToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token, saveToDatabase }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          hasToken: true,
          storageType: saveToDatabase ? 'Database' : 'Cookie',
          maxAllowedLevel: data.maxAllowedLevel ?? null,
        });

        if (!saveToDatabase && typeof document !== 'undefined') {
          // Set client-side cookie if not saving to DB
          document.cookie = `WK-User-Token=${encodeURIComponent(token)}; path=/; max-age=31536000; SameSite=Lax; Secure`;
        }

        return true;
      } else {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.message || errData.error || 'Failed to validate or save WaniKani API token.';
        setError(msg);
        return false;
      }
    } catch (err: any) {
      console.error('Error saving WaniKani token:', err);
      setError('Network error saving WaniKani token.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectToken = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await fetch(API_ENDPOINTS.wanikaniToken, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (typeof document !== 'undefined') {
        document.cookie = 'WK-User-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      }

      setStatus({
        hasToken: false,
        storageType: 'None',
        maxAllowedLevel: null,
      });
      return true;
    } catch (err: any) {
      console.error('Error disconnecting WaniKani token:', err);
      setError('Failed to disconnect WaniKani token.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    error,
    fetchStatus,
    saveToken,
    disconnectToken,
  };
}
