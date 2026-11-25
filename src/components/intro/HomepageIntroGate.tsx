import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './intro.css';
import type { PreloadedIntroAssets } from './Phase1Preloader';
import { claimIntroSession, finishIntroSession, isHomeEntryPath } from './sessionGate';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Phase1Preloader = lazy(() => import('./Phase1Preloader'));
const Phase2StartingGrid = lazy(() => import('./Phase2StartingGrid'));

type IntroStage = 'pending' | 'phase1' | 'phase2' | 'done';

export default function HomepageIntroGate() {
  const { pathname } = useLocation();
  const { preloaderEnabled, settingsLoaded } = useSiteSettings();
  const [stage, setStage] = useState<IntroStage>('pending');
  const [preloadedAssets, setPreloadedAssets] = useState<PreloadedIntroAssets>({
    glbBuffer: null,
    hdrBuffer: null,
  });

  // Resolve initial stage once authoritative backend site setting is loaded
  useEffect(() => {
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
      if (currentStage !== 'pending') return currentStage;
      return claimIntroSession(pathname) ? 'phase1' : 'done';
    });
  }, [pathname, settingsLoaded, preloaderEnabled]);

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

  if (stage === 'pending' || stage === 'done' || preloaderEnabled !== true) {
    return null;
  }

  const handleSkipOrFinish = () => {
    finishIntroSession();
    setStage('done');
  };

  return (
    <Suspense fallback={null}>
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
        <Phase2StartingGrid
          preloadedAssets={preloadedAssets}
          onRevealComplete={handleSkipOrFinish}
        />
      )}
    </Suspense>
  );
}
