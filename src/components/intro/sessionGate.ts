const INTRO_SESSION_KEY = 'leeautox_intro_seen_v1';

let claimedThisLoad = false;
let dismissedThisLoad = false;

export function isHomeEntryPath(pathname: string): boolean {
  if (!pathname) return true;
  return pathname === '/' || pathname === '/index.html';
}

function safeReadSessionFlag(): boolean {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(INTRO_SESSION_KEY) === '1';
    }
  } catch {
    // Restricted storage contexts (e.g. sandboxed iframes) fall back to memory flags
  }
  return false;
}

export function markIntroSeen(): void {
  dismissedThisLoad = true;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    }
  } catch {
    // Ignore storage write errors in restricted contexts
  }
}

/**
 * Determines synchronously on initial app mount whether the intro should play.
 * Handles React 19 StrictMode double-mounts safely by retaining `claimedThisLoad`
 * within the same JS heap while persisting `sessionStorage` so refreshes or
 * subsequent home visits within the same session never replay.
 */
export function claimIntroSession(initialPathname: string): boolean {
  if (dismissedThisLoad) {
    return false;
  }

  if (claimedThisLoad) {
    return true;
  }

  if (safeReadSessionFlag()) {
    dismissedThisLoad = true;
    return false;
  }

  if (!isHomeEntryPath(initialPathname)) {
    // User landed directly on an internal/vehicle route; mark seen so
    // navigating back to Home later in this session will not trigger the intro.
    markIntroSeen();
    return false;
  }

  claimedThisLoad = true;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    }
  } catch {
    // Ignore storage write errors
  }

  return true;
}

export function finishIntroSession(): void {
  markIntroSeen();
}
