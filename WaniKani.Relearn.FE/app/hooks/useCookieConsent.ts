import { useState, useEffect, useCallback } from 'react';

export type CookieConsentStatus = 'granted' | 'declined' | 'pending';

const STORAGE_KEY = 'bonpom_cookie_consent';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentStatus>('pending');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'granted' || stored === 'declined') {
        setConsent(stored as CookieConsentStatus);
      } else {
        setConsent('pending');
      }
    } catch {
      setConsent('pending');
    }
  }, []);

  const acceptAll = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'granted');
    } catch {}
    setConsent('granted');
  }, []);

  const declineFunctional = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    setConsent('declined');
  }, []);

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setConsent('pending');
  }, []);

  return {
    consent,
    acceptAll,
    declineFunctional,
    resetConsent,
    isPolicyModalOpen,
    openPolicyModal: () => setIsPolicyModalOpen(true),
    closePolicyModal: () => setIsPolicyModalOpen(false),
  };
}
