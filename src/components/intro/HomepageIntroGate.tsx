import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './intro.css';
import Phase1Preloader from './Phase1Preloader';
import Phase2VideoReveal from './Phase2VideoReveal';
import { claimIntroSession, finishIntroSession, isAdminPath, isHomeEntryPath } from './sessionGate';
import { useSiteSettings } from '../../context/SiteSettingsContext';

type IntroStage = 'pending' | 'admin_bypass' | 'phase1' | 'phase2' | 'done';

export default function HomepageIntroGate() {
  const { pathname } = useLocation();
  const { preloaderEnabled, settingsLoaded } = useSiteSettings();
  const [stage, setStage] = useState<IntroStage>('pending');

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
      {(stage === 'phase1' || stage === 'phase2') && (
        <Phase2VideoReveal
          active={stage === 'phase2'}
          onRevealComplete={handleSkipOrFinish}
        />
      )}
      {stage === 'phase1' && (
        <Phase1Preloader
          onComplete={() => {
            setStage('phase2');
          }}
          onSkip={handleSkipOrFinish}
        />
      )}
    </>
  );
}
