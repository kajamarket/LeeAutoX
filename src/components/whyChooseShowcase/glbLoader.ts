import { useGLTF } from '@react-three/drei';

export const PRIMARY_LEXUS_GLB_URL = '/cars/2025_lexus_lx700h.glb';
export const FALLBACK_LEXUS_GLB_URL =
  'https://raw.githubusercontent.com/kajamarket/LeeAutoX/main/public/cars/2025_lexus_lx700h.glb';

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { alpha: true }) ||
      canvas.getContext('webgl', { alpha: true }) ||
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function isSoftwareWebGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const rendererStr = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return true;
  }
}

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function probeGlbUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      cache: 'force-cache',
      signal: controller.signal,
    });
    if (res.ok) return true;
    if (res.status === 405 || res.status === 501) {
      const rangeRes = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-15' },
        cache: 'force-cache',
        signal: controller.signal,
      });
      return rangeRes.ok || rangeRes.status === 206;
    }
    return false;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Verifies local GLB accessibility with up to 3 retry attempts (exponential backoff),
 * silently falling back to the raw GitHub mirror if needed, or null if all network
 * sources fail so the caller renders the sculpted ProceduralCar fallback.
 */
export async function resolveResilientGlbUrl(): Promise<string | null> {
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await probeGlbUrl(PRIMARY_LEXUS_GLB_URL)) {
      return PRIMARY_LEXUS_GLB_URL;
    }
    if (attempt < maxAttempts - 1) {
      await waitMs(400 * Math.pow(2, attempt));
    }
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    if (await probeGlbUrl(FALLBACK_LEXUS_GLB_URL)) {
      return FALLBACK_LEXUS_GLB_URL;
    }
    if (attempt === 0) {
      await waitMs(600);
    }
  }

  return null;
}

// Module-scope Drei GLTF preload so the 17.3 MB binary glTF begins downloading immediately
if (typeof window !== 'undefined' && isWebGLAvailable()) {
  try {
    useGLTF.preload(PRIMARY_LEXUS_GLB_URL);
  } catch {
    // Silent fallback handled by resilient loader & ProceduralCar
  }
}
