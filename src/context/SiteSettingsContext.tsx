import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, getDocFromServer, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';

export interface SiteSettingsContextType {
  preloaderEnabled: boolean | null;
  settingsLoaded: boolean;
  isSavingSettings: boolean;
  settingsError: string | null;
  updatePreloaderEnabled: (enabled: boolean) => Promise<{ ok: boolean; error?: string }>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const SETTINGS_DOC_PATH = 'settings/site';

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, currentUser } = useAuth();
  const [preloaderEnabled, setPreloaderEnabled] = useState<boolean | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const siteSettingsRef = doc(db, 'settings', 'site');

    // Safety timeout so unreachable/blocked Firestore never stalls homepage or crawlers
    const fallbackTimer = window.setTimeout(() => {
      if (!active) return;
      setPreloaderEnabled((prev) => (prev === null ? false : prev));
      setSettingsLoaded(true);
    }, 1800);

    // Fetch authoritative server state first (never rely on local/sessionStorage for global toggle)
    getDocFromServer(siteSettingsRef)
      .then((snap) => {
        if (!active) return;
        window.clearTimeout(fallbackTimer);
        if (snap.exists()) {
          const data = snap.data();
          setPreloaderEnabled(typeof data?.preloaderEnabled === 'boolean' ? data.preloaderEnabled : true);
        } else {
          // Preserve default enabled behavior when document has not yet been initialized by an admin
          setPreloaderEnabled(true);
        }
        setSettingsLoaded(true);
        setSettingsError(null);
      })
      .catch((err) => {
        if (!active) return;
        window.clearTimeout(fallbackTimer);
        setPreloaderEnabled(false);
        setSettingsLoaded(true);
        console.warn('Unable to read global site settings from server:', err);
      });

    // Subscribe to real-time updates so admin changes invalidate/refresh active clients cleanly
    const unsubscribe = onSnapshot(
      siteSettingsRef,
      (snap) => {
        if (!active) return;
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data?.preloaderEnabled === 'boolean') {
            setPreloaderEnabled(data.preloaderEnabled);
            setSettingsLoaded(true);
            setSettingsError(null);
          }
        }
      },
      (error) => {
        if (!active) return;
        console.warn('Firestore site settings listener error:', error);
        try {
          handleFirestoreError(error, OperationType.GET, SETTINGS_DOC_PATH);
        } catch {
          // Keep app functional if Firestore listener fails
        }
      }
    );

    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const updatePreloaderEnabled = useCallback(
    async (enabled: boolean): Promise<{ ok: boolean; error?: string }> => {
      if (typeof enabled !== 'boolean') {
        const error = 'Invalid setting value.';
        setSettingsError(error);
        return { ok: false, error };
      }

      if (!isAdmin || !currentUser || !auth.currentUser) {
        const error = 'Administrator Google Sign-In is required to modify global site settings.';
        setSettingsError(error);
        return { ok: false, error };
      }

      setIsSavingSettings(true);
      setSettingsError(null);

      try {
        const siteSettingsRef = doc(db, 'settings', 'site');
        await setDoc(siteSettingsRef, {
          preloaderEnabled: enabled,
          updatedAt: serverTimestamp(),
          updatedByUid: auth.currentUser.uid,
        });
        setPreloaderEnabled(enabled);
        setSettingsLoaded(true);
        return { ok: true };
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to save setting to database.';
        setSettingsError(msg);
        try {
          handleFirestoreError(error, OperationType.WRITE, SETTINGS_DOC_PATH);
        } catch {
          // Surface clean feedback via state
        }
        return { ok: false, error: msg };
      } finally {
        setIsSavingSettings(false);
      }
    },
    [isAdmin, currentUser]
  );

  return (
    <SiteSettingsContext.Provider
      value={{
        preloaderEnabled,
        settingsLoaded,
        isSavingSettings,
        settingsError,
        updatePreloaderEnabled,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return ctx;
}
