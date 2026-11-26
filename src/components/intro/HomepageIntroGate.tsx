import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './intro.css';
import Phase1Preloader, { type PreloadedIntroAssets } from './Phase1Preloader';
import { claimIntroSession, finishIntroSession, isAdminPath, isHomeEntryPath } from './sessionGate';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Phase2StartingGrid = lazy(() => import('./Phase2StartingGrid'));

type IntroStage = 'pending' | 'admin_bypass' | 'phase1' | 'phase2' | 'done';

export default function HomepageIntroGate() {
  const { pathname } = useLocation();
  const { preloaderEnabled, settingsLoaded } = useSiteSettings();
  const [stage, setStage] = useState<IntroStage>('pending');
  const [preloadedAssets, setPreloadedAssets] = useState<PreloadedIntroAssets>({
    glbBuffer: null,
    hdrBuffer: null,
  });

  // Resolve stage once authoritative backend site setting is loaded
  useEffect(() => {
    if (isAdminPath(pathname)) {
      setStage('admin_bypass');
      return;
    }

    if (!isHomeEntryPath(pathname)) {
      finishIntroSession();
      setStage('done');
      return;
    }

    if (!settingsLoaded) {
      return;
    }

    if (preloaderEnabled !== true) {
      setStage('done');
      return;
    }

    setStage((currentStage) => {
      if (currentStage !== 'pending' && currentStage !== 'admin_bypass') {
        return currentStage;
      }
      return claimIntroSession(pathname) ? 'phase1' : 'done';
    });
  }, [pathname, settingsLoaded, preloaderEnabled]);

  // Pre-warm the heavy Phase 2 3D chunk only when Phase 1 actually starts
  useEffect(() => {
    if (stage === 'phase1') {
      void import('./Phase2StartingGrid');
    }
  }, [stage]);

  // Dismiss immediately if user navigates off '/' or admin disables preloader while active
  useEffect(() => {
    if (stage === 'phase1' || stage === 'phase2') {
      if (!isHomeEntryPath(pathname) || preloaderEnabled === false) {
        finishIntroSession();
        setStage('done');
      }
    }
  }, [pathname, preloaderEnabled, stage]);

  // Lock body scroll only while the intro overlay is visibly active; restore cleanly afterwards
  useEffect(() => {
    if ((stage !== 'phase1' && stage !== 'phase2') || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [stage]);

  if (stage === 'pending' || stage === 'admin_bypass' || stage === 'done' || preloaderEnabled !== true) {
    return null;
  }

  const handleSkipOrFinish = () => {
    finishIntroSession();
    setStage('done');
  };

  return (
    <>
      {stage === 'phase1' && (
        <Phase1Preloader
          onComplete={(assets) => {
            setPreloadedAssets(assets);
            setStage('phase2');
          }}
          onSkip={handleSkipOrFinish}
        />
      )}
      {stage === 'phase2' && (
        <Suspense fallback={<div className="fixed inset-0 z-[9999] bg-[#cfdbe6]" aria-hidden="true" />}>
          <Phase2StartingGrid
            preloadedAssets={preloadedAssets}
            onRevealComplete={handleSkipOrFinish}
          />
        </Suspense>
      )}
    </>
  );
}
