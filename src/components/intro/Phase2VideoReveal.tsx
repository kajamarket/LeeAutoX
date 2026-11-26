import { useEffect, useRef, useState } from 'react';

const REVEAL_VIDEO_SRC = '/cars/LeeAutoX_Cinematic_Car_Reveal.mp4';
const INITIAL_READY_TIMEOUT_MS = 5000;
const POST_CANPLAY_START_TIMEOUT_MS = 3000;
const STALL_RECOVERY_TIMEOUT_MS = 2500;
const WATCHDOG_INTERVAL_MS = 400;
const DEFAULT_MAX_PHASE2_MS = 26000;
const FADE_OUT_MS = 450;

interface Phase2VideoRevealProps {
  active: boolean;
  onRevealComplete: () => void;
}

export default function Phase2VideoReveal({ active, onRevealComplete }: Phase2VideoRevealProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  const onRevealCompleteRef = useRef(onRevealComplete);
  onRevealCompleteRef.current = onRevealComplete;

  const activateRef = useRef<(() => void) | null>(null);

  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      activateRef.current = () => {
        if (!completedRef.current) {
          completedRef.current = true;
          onRevealCompleteRef.current();
        }
      };
      if (activeRef.current) {
        activateRef.current();
      }
      return;
    }

    let disposed = false;
    let activated = false;
    let fatalError = false;
    let hasStartedPlaying = false;
    let playInFlight = false;
    let lastTime = 0;
    let lastProgressAt = Date.now();

    let initialTimer: number | null = null;
    let postCanplayTimer: number | null = null;
    let stallTimer: number | null = null;
    let maxPhase2Timer: number | null = null;
    let fadeTimer: number | null = null;
    let watchdogInterval: number | null = null;

    const clearAllTimers = () => {
      if (initialTimer !== null) {
        window.clearTimeout(initialTimer);
        initialTimer = null;
      }
      if (postCanplayTimer !== null) {
        window.clearTimeout(postCanplayTimer);
        postCanplayTimer = null;
      }
      if (stallTimer !== null) {
        window.clearTimeout(stallTimer);
        stallTimer = null;
      }
      if (maxPhase2Timer !== null) {
        window.clearTimeout(maxPhase2Timer);
        maxPhase2Timer = null;
      }
      if (fadeTimer !== null) {
        window.clearTimeout(fadeTimer);
        fadeTimer = null;
      }
      if (watchdogInterval !== null) {
        window.clearInterval(watchdogInterval);
        watchdogInterval = null;
      }
    };

    const releaseMedia = () => {
      try {
        video.pause();
      } catch {
        // Ignore media pause errors during teardown
      }
      try {
        video.removeAttribute('src');
        video.load();
      } catch {
        // Ignore media reset errors during teardown
      }
    };

    const triggerFallback = () => {
      if (completedRef.current || disposed) return;
      completedRef.current = true;
      clearAllTimers();
      releaseMedia();
      onRevealCompleteRef.current();
    };

    const finishSmoothly = () => {
      if (completedRef.current || disposed) return;
      completedRef.current = true;
      clearAllTimers();
      setIsFadingOut(true);
      fadeTimer = window.setTimeout(() => {
        releaseMedia();
        if (!disposed) {
          onRevealCompleteRef.current();
        }
      }, FADE_OUT_MS);
    };

    // Enforce muted inline pre-buffering properties; do NOT autoplay until Phase 2 activates
    video.setAttribute('fetchpriority', 'high');
    if (!video.getAttribute('src')) {
      video.setAttribute('src', REVEAL_VIDEO_SRC);
      video.load();
    }
    video.autoplay = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Verify MP4 playback support on this device/browser
    const canPlayGeneric =
      typeof video.canPlayType === 'function' ? video.canPlayType('video/mp4') : '';
    const canPlayH264 =
      typeof video.canPlayType === 'function'
        ? video.canPlayType('video/mp4; codecs="avc1.42E01E"')
        : '';

    if ((!canPlayGeneric && !canPlayH264) || video.error) {
      fatalError = true;
    }

    const markPlaying = () => {
      if (completedRef.current || disposed || !activeRef.current) return;
      if (!hasStartedPlaying) {
        hasStartedPlaying = true;
        if (initialTimer !== null) {
          window.clearTimeout(initialTimer);
          initialTimer = null;
        }
        if (postCanplayTimer !== null) {
          window.clearTimeout(postCanplayTimer);
          postCanplayTimer = null;
        }
      }
      if (stallTimer !== null) {
        window.clearTimeout(stallTimer);
        stallTimer = null;
      }
      lastProgressAt = Date.now();
    };

    const armStallRecovery = () => {
      if (!activeRef.current || !hasStartedPlaying || completedRef.current || disposed) return;
      if (stallTimer !== null) return;
      stallTimer = window.setTimeout(() => {
        stallTimer = null;
        triggerFallback();
      }, STALL_RECOVERY_TIMEOUT_MS);
    };

    const armMaxPhase2Timer = () => {
      if (maxPhase2Timer !== null) {
        window.clearTimeout(maxPhase2Timer);
      }
      const ceilingMs =
        Number.isFinite(video.duration) && video.duration > 0
          ? Math.max(22000, Math.ceil(video.duration * 1000) + 6000)
          : DEFAULT_MAX_PHASE2_MS;
      maxPhase2Timer = window.setTimeout(triggerFallback, ceilingMs);
    };

    const armPostCanplayTimer = () => {
      if (!activeRef.current || hasStartedPlaying || postCanplayTimer !== null) return;
      postCanplayTimer = window.setTimeout(() => {
        postCanplayTimer = null;
        if (!hasStartedPlaying) {
          triggerFallback();
        }
      }, POST_CANPLAY_START_TIMEOUT_MS);
    };

    const tryStartPlayback = () => {
      if (!activeRef.current || completedRef.current || disposed || playInFlight) return;
      if (fatalError || video.error) {
        triggerFallback();
        return;
      }
      if (!video.paused && !video.ended && video.readyState >= 2) {
        markPlaying();
        return;
      }

      video.muted = true;
      playInFlight = true;
      try {
        const playResult = video.play();
        if (playResult && typeof playResult.then === 'function') {
          playResult
            .then(() => {
              playInFlight = false;
              if (completedRef.current || disposed || !activeRef.current) return;
              if (!video.paused && !video.ended && video.readyState >= 2) {
                markPlaying();
              }
            })
            .catch(() => {
              playInFlight = false;
              triggerFallback();
            });
        } else {
          playInFlight = false;
          if (!video.paused && !video.ended && video.readyState >= 2) {
            markPlaying();
          }
        }
      } catch {
        playInFlight = false;
        triggerFallback();
      }
    };

    const handleLoadedMetadata = () => {
      if (completedRef.current || disposed) return;
      if (!activeRef.current) return;

      armMaxPhase2Timer();
      if (video.readyState >= 2) {
        tryStartPlayback();
      }
    };

    const handleLoadedData = () => {
      if (completedRef.current || disposed || !activeRef.current) return;
      tryStartPlayback();
    };

    const handleCanPlay = () => {
      if (completedRef.current || disposed || !activeRef.current) return;
      tryStartPlayback();
      armPostCanplayTimer();
    };

    const handlePlaying = () => {
      if (completedRef.current || disposed) return;
      if (!activeRef.current) {
        try {
          video.pause();
        } catch {
          // Ignore pause errors during pre-buffer
        }
        return;
      }
      if (!video.paused && !video.ended) {
        markPlaying();
      }
    };

    const handleTimeUpdate = () => {
      if (completedRef.current || disposed || !activeRef.current) return;
      if (video.currentTime > lastTime + 0.01) {
        lastTime = video.currentTime;
        markPlaying();
      }
    };

    const handleWaitingOrStalled = () => {
      armStallRecovery();
    };

    const handlePause = () => {
      if (activeRef.current && hasStartedPlaying && !video.ended && !completedRef.current && !disposed) {
        armStallRecovery();
      }
    };

    const handleError = () => {
      fatalError = true;
      if (activeRef.current) {
        triggerFallback();
      }
    };

    const handleEnded = () => {
      if (!activeRef.current) return;
      finishSmoothly();
    };

    const activatePlayback = () => {
      if (activated || completedRef.current || disposed) return;
      activated = true;
      lastProgressAt = Date.now();

      if (fatalError || video.error) {
        triggerFallback();
        return;
      }

      if (video.ended) {
        finishSmoothly();
        return;
      }

      // Hard cap waiting for initial playback start once Phase 2 is visibly shown
      initialTimer = window.setTimeout(() => {
        initialTimer = null;
        if (!hasStartedPlaying) {
          triggerFallback();
        }
      }, INITIAL_READY_TIMEOUT_MS);

      armMaxPhase2Timer();

      // Watchdog detects silent freezes if browser fails to emit waiting/stalled
      watchdogInterval = window.setInterval(() => {
        if (completedRef.current || disposed || !activeRef.current) return;
        if (!hasStartedPlaying) return;
        if (video.ended) {
          finishSmoothly();
          return;
        }
        if (video.currentTime > lastTime + 0.01) {
          lastTime = video.currentTime;
          lastProgressAt = Date.now();
          if (stallTimer !== null) {
            window.clearTimeout(stallTimer);
            stallTimer = null;
          }
          return;
        }
        if (Date.now() - lastProgressAt >= STALL_RECOVERY_TIMEOUT_MS) {
          triggerFallback();
        }
      }, WATCHDOG_INTERVAL_MS);

      if (video.readyState >= 2) {
        tryStartPlayback();
        if (video.readyState >= 3) {
          armPostCanplayTimer();
        }
      }
    };

    activateRef.current = activatePlayback;

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaitingOrStalled);
    video.addEventListener('stalled', handleWaitingOrStalled);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    if (activeRef.current) {
      activatePlayback();
    }

    return () => {
      disposed = true;
      activateRef.current = null;
      clearAllTimers();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaitingOrStalled);
      video.removeEventListener('stalled', handleWaitingOrStalled);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      releaseMedia();
    };
  }, []);

  useEffect(() => {
    if (active) {
      activateRef.current?.();
    }
  }, [active]);

  const visibilityClass = isFadingOut
    ? 'z-[9999] opacity-0 pointer-events-none transition-opacity duration-500 ease-out'
    : active
      ? 'z-[9999] opacity-100'
      : 'z-[9998] opacity-0 pointer-events-none';

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center overflow-hidden select-none ${visibilityClass}`}
      aria-label="LeeAutoX Cinematic Car Reveal"
      aria-hidden={!active}
    >
      <video
        ref={videoRef}
        src={REVEAL_VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        className="w-full h-full max-w-full max-h-full object-contain pointer-events-none"
      />
    </div>
  );
}
