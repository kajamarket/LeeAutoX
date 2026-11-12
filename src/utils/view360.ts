import { View360Config, NormalizedView360 } from '../types/view360';
import { extractPanoeeUrl } from './panoee';

interface LegacyVehicle360 {
  id?: string | number;
  name?: string;
  view360?: View360Config;
  '360degree'?: {
    exterior?: string;
    interior?: string;
  };
  exterior360?: string;
}

/**
 * Safely parses the raw exterior 360 HTML snippet according to Cloudimage 360 View specs:
 * - Uses DOMParser (client-side only; never during server rendering).
 * - Enforces that the snippet contains only a single <div> element.
 * - Enforces whitelist of allowed attributes (class, id, data-*).
 * - Enforces data-folder must start with 'https://'.
 * - Validates autoplay behavior (defaults 'spin-x' for single-axis sequences).
 * - Returns sanitized attributes and parsed config; logs warnings on invalid data without throwing.
 */
export function parseExterior360Snippet(
  snippet: unknown,
  vehicleId?: string | number
): NormalizedView360['exterior'] | null {
  if (typeof snippet !== 'string' || !snippet.trim()) {
    return null;
  }

  // Never run DOMParser or create elements during server-side execution
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(snippet.trim(), 'text/html');

    // Only accept a single <div> element
    const children = doc.body.children;
    if (children.length !== 1 || children[0].tagName.toLowerCase() !== 'div') {
      console.warn(
        `[view360] Invalid exterior 360 snippet for vehicle ${vehicleId || 'unknown'}: snippet must contain exactly one <div> element.`
      );
      return null;
    }

    const sourceEl = children[0] as HTMLDivElement;

    // Allowed attributes strictly based on @cloudimage/360-view documentation
    const allowedAttrNames = new Set([
      'class',
      'id',
      'data-folder',
      'data-api-version',
      'data-filename-x',
      'data-filename-y',
      'data-filename-grid',
      'data-filename',
      'data-image-list-x',
      'data-image-list-y',
      'data-image-list-grid',
      'data-index-zero-base',
      'data-amount-x',
      'data-amount-y',
      'data-amount',
      'data-draggable',
      'data-swipeable',
      'data-keys',
      'data-keys-reverse',
      'data-bottom-circle-offset',
      'data-autoplay',
      'data-autoplay-behavior',
      'data-play-once',
      'data-speed',
      'data-autoplay-reverse',
      'data-fullscreen',
      'data-zoom-max',
      'data-zoom-step',
      'data-zoom-controls',
      'data-zoom-controls-position',
      'data-scroll-hint',
      'data-drag-speed',
      'data-drag-reverse',
      'data-stop-at-edges',
      'data-stop-at-edges-x',
      'data-stop-at-edges-y',
      'data-inertia',
      'data-pinch-zoom',
      'data-hints',
      'data-theme',
      'data-aspect-ratio',
      'data-lazyload',
    ]);

    const sanitizedAttrs: Record<string, string> = {};
    for (let i = 0; i < sourceEl.attributes.length; i++) {
      const attr = sourceEl.attributes[i];
      const lower = attr.name.toLowerCase();
      if (allowedAttrNames.has(lower)) {
        sanitizedAttrs[lower] = attr.value;
      } else {
        console.warn(`[view360] Disallowed attribute "${attr.name}" stripped from 360 snippet.`);
      }
    }

    // Validate data-folder: must be a secure https URL
    const folder = sanitizedAttrs['data-folder'];
    if (!folder || !folder.startsWith('https://')) {
      console.warn(
        `[view360] Invalid data-folder in 360 snippet for vehicle ${vehicleId || 'unknown'}: data-folder must be a secure https:// URL.`
      );
      return null;
    }

    // Ensure class includes 'cloudimage-360'
    let className = sanitizedAttrs['class'] || '';
    if (!className.includes('cloudimage-360')) {
      className = (className + ' cloudimage-360').trim();
    }
    sanitizedAttrs['class'] = className;

    // Ensure unique ID per instance
    const elementId = sanitizedAttrs['id'] || `cloudimage-360-${vehicleId || 'viewer'}`;
    sanitizedAttrs['id'] = elementId;

    // Resolve autoplay behavior: single axis uses 'spin-x' unless grid or multi-axis is configured
    let autoplayBehavior = sanitizedAttrs['data-autoplay-behavior'] || 'spin-x';
    if (
      autoplayBehavior === 'spin-xy' &&
      !sanitizedAttrs['data-filename-y'] &&
      !sanitizedAttrs['data-filename-grid']
    ) {
      autoplayBehavior = 'spin-x';
      sanitizedAttrs['data-autoplay-behavior'] = 'spin-x';
    }

    const filenameX = sanitizedAttrs['data-filename-x'] || sanitizedAttrs['data-filename'] || '{index}.jpg';
    const amountX = parseInt(sanitizedAttrs['data-amount-x'] || sanitizedAttrs['data-amount'] || '36', 10) || 36;
    const speed = parseInt(sanitizedAttrs['data-speed'] || '100', 10) || 100;
    const dragSpeed = parseInt(sanitizedAttrs['data-drag-speed'] || '100', 10) || 100;
    const zoomMax = parseFloat(sanitizedAttrs['data-zoom-max'] || '5') || 5;

    return {
      folder,
      filename: filenameX,
      amount: amountX,
      demo: false,
      autoplay: sanitizedAttrs['data-autoplay'] === 'true' || sanitizedAttrs['data-autoplay'] === '',
      speed,
      dragSpeed,
      zoomMax,
      draggable: sanitizedAttrs['data-draggable'] !== 'false',
      swipeable: sanitizedAttrs['data-swipeable'] !== 'false',
      keys: sanitizedAttrs['data-keys'] === 'true',
      autoplayBehavior,
      autoplayReverse: sanitizedAttrs['data-autoplay-reverse'] === 'true',
      fullscreen: sanitizedAttrs['data-fullscreen'] === 'true' || sanitizedAttrs['data-fullscreen'] === '',
      zoomControls: sanitizedAttrs['data-zoom-controls'] !== 'false',
      pinchZoom: sanitizedAttrs['data-pinch-zoom'] !== 'false',
      elementId,
      className,
      attributes: sanitizedAttrs,
      rawSnippet: snippet,
    };
  } catch (err) {
    console.warn(`[view360] Failed to parse 360 snippet for vehicle ${vehicleId || 'unknown'}:`, err);
    return null;
  }
}

/**
 * Validates and normalizes vehicle 360 data.
 * Adheres strictly to the missing-data rule:
 * - Both exterior and interior exist and valid -> returns both
 * - Only exterior exists and valid -> returns exterior only
 * - Only interior exists and valid -> returns interior only
 * - Neither exists or invalid -> returns null (graceful fail with warning)
 */
export function normalizeView360(vehicle?: LegacyVehicle360 | null): NormalizedView360 | null {
  if (!vehicle) return null;

  let extConfig: NormalizedView360['exterior'] | undefined = undefined;
  let intConfig: NormalizedView360['interior'] | undefined = undefined;

  // --- EXTERIOR RESOLUTION ---
  // 1. Check if vehicle has explicit exterior360 snippet
  if (vehicle.exterior360) {
    const parsedSnippet = parseExterior360Snippet(vehicle.exterior360, vehicle.id);
    if (parsedSnippet) {
      extConfig = parsedSnippet;
    }
  }

  // 2. Check structured view360.exterior field if not already set from snippet
  if (!extConfig && vehicle.view360?.exterior) {
    const rawExt = vehicle.view360.exterior;
    if (rawExt && typeof rawExt.folder === 'string' && rawExt.folder.trim().length > 0) {
      let folder = rawExt.folder.trim();
      if (!folder.endsWith('/')) {
        folder += '/';
      }

      const amount = Number(rawExt.amount || rawExt.amountX) || 36;
      if (amount <= 0) {
        console.warn(`[view360] Invalid exterior frame amount: ${amount} for vehicle ${vehicle.id || vehicle.name || 'unknown'}`);
      } else {
        const ext = rawExt.ext ? rawExt.ext.replace(/^\./, '') : 'jpg';
        const filename = rawExt.filename && rawExt.filename.trim().length > 0
          ? rawExt.filename.trim()
          : `{index}.${ext}`;

        extConfig = {
          folder,
          filename,
          amount,
          demo: Boolean(rawExt.demo),
          autoplay: Boolean(rawExt.autoplay),
          speed: typeof rawExt.speed === 'number' && rawExt.speed > 0 ? rawExt.speed : 80,
          dragSpeed: typeof rawExt.dragSpeed === 'number' && rawExt.dragSpeed > 0 ? rawExt.dragSpeed : 60,
          zoomMax: typeof rawExt.zoomMax === 'number' && rawExt.zoomMax > 0 ? rawExt.zoomMax : 3,
        };
      }
    }
  }

  // --- INTERIOR RESOLUTION (Completely independent of exterior) ---
  // 1. Check structured view360.interior
  if (vehicle.view360?.interior) {
    const rawInt = vehicle.view360.interior;
    let embedSnippet: string | undefined = undefined;

    if (typeof rawInt === 'string' && rawInt.trim().length > 0) {
      embedSnippet = rawInt.trim();
    } else if (rawInt && typeof rawInt === 'object') {
      const candidate = rawInt.embed || rawInt.html || rawInt.panoeeEmbed || rawInt.panoeeUrl;
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        embedSnippet = candidate.trim();
      }
    }

    if (embedSnippet) {
      const validUrl = extractPanoeeUrl(embedSnippet);
      if (validUrl) {
        intConfig = { panoeeUrl: validUrl };
      } else {
        console.warn(`[view360] Disallowed or invalid Panoee embed snippet for vehicle ${vehicle.id || vehicle.name || 'unknown'}`);
      }
    }
  }

  // 2. Check legacy '360degree' field if interior not already resolved
  if (!intConfig && vehicle['360degree']) {
    const legacyIntUrl = extractPanoeeUrl(vehicle['360degree'].interior);
    if (legacyIntUrl) {
      intConfig = { panoeeUrl: legacyIntUrl };
    } else {
      // If only legacy exterior was provided and it was a valid Panoee tour, allow it as interior panorama
      const legacyExtUrl = extractPanoeeUrl(vehicle['360degree'].exterior);
      if (legacyExtUrl) {
        intConfig = { panoeeUrl: legacyExtUrl };
      }
    }
  }

  if (!extConfig && !intConfig) {
    return null;
  }

  return {
    exterior: extConfig,
    interior: intConfig,
  };
}
