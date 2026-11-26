import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, getDocFromServer, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

export interface SiteSettingsContextType {
  preloaderEnabled: boolean | null;
  settingsLoaded: boolean;
  isSavingSettings: boolean;
  settingsError: string | null;
  updatePreloaderEnabled: (enabled: boolean) => Promise<{ ok: boolean; error?: string }>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const SETTINGS_DOC_PATH = 'settings/site';
const SETTINGS_TIMEOUT_MS = 4500;
const SETTINGS_REST_URL =
  `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(firebaseConfig.projectId)}` +
  `/databases/${encodeURIComponent(firebaseConfig.firestoreDatabaseId)}` +
  `/documents/settings/site?key=${encodeURIComponent(firebaseConfig.apiKey)}`;

async function fetchSiteSettingsViaRest(signal: AbortSignal): Promise<{ ok: true; enabled: boolean } | { ok: false }> {
  try {
    const res = await fetch(SETTINGS_REST_URL, {
      method: 'GET',
      cache: 'no-store',
      signal,
    });

    if (res.status === 404) {
      // Document not yet created by admin; preserve default enabled state
      return { ok: true, enabled: true };
    }

    if (!res.ok) {
      return { ok: false };
    }

    const payload = await res.json();
    const boolVal = payload?.fields?.preloaderEnabled?.booleanValue;
    return { ok: true, enabled: typeof boolVal === 'boolean' ? boolVal : true };
  } catch {
    return { ok: false };
  }
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, currentUser } = useAuth();
  const [preloaderEnabled, setPreloaderEnabled] = useState<boolean | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let resolvedFromServer = false;
    let failedAttempts = 0;
    const abortController = new AbortController();
    const siteSettingsRef = doc(db, 'settings', 'site');

    const resolveFallback = () => {
      if (!active || resolvedFromServer) return;
      window.clearTimeout(fallbackTimer);
      setPreloaderEnabled((prev) => (prev === null ? false : prev));
      setSettingsLoaded(true);
    };

    const resolveServerValue = (enabled: boolean) => {
      if (!active) return;
      resolvedFromServer = true;
      window.clearTimeout(fallbackTimer);
      setPreloaderEnabled(enabled);
      setSettingsLoaded(true);
      setSettingsError(null);
    };

    const recordAttemptFailure = () => {
      failedAttempts += 1;
      // Only fall back early if both REST GET and Firestore SDK getDocFromServer failed
      if (failedAttempts >= 2) {
        resolveFallback();
      }
    };

    // Safety timeout so unreachable/blocked Firestore never stalls homepage or crawlers
    const fallbackTimer = window.setTimeout(() => {
      resolveFallback();
    }, SETTINGS_TIMEOUT_MS);

    // 1. Fast stateless REST GET (bypasses WebChannel handshake and IndexedDB startup)
    void fetchSiteSettingsViaRest(abortController.signal).then((result) => {
      if (!active || resolvedFromServer) return;
      if (result.ok) {
        resolveServerValue(result.enabled);
      } else {
        recordAttemptFailure();
      }
    });

    // 2. Authoritative Firestore SDK server fetch (runs concurrently as backup)
    getDocFromServer(siteSettingsRef)
      .then((snap) => {
        if (!active || resolvedFromServer) return;
        if (snap.exists()) {
          const data = snap.data();
          resolveServerValue(typeof data?.preloaderEnabled === 'boolean' ? data.preloaderEnabled : true);
        } else {
          resolveServerValue(true);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Unable to read global site settings from Firestore SDK:', err);
        recordAttemptFailure();
      });

    // 3. Real-time updates so admin changes propagate cleanly across active clients
    const unsubscribe = onSnapshot(
      siteSettingsRef,
      (snap) => {
        if (!active) return;
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data?.preloaderEnabled === 'boolean') {
            resolveServerValue(data.preloaderEnabled);
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
      abortController.abort();
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
