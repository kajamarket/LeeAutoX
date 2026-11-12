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

  // 1. Check new structured view360 field
  if (vehicle.view360) {
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

  // 2. Backwards-compatibility fallback with legacy '360degree' field
  if (!extConfig && !intConfig && vehicle['360degree']) {
    const legacyExtUrl = extractPanoeeUrl(vehicle['360degree'].exterior);
    const legacyIntUrl = extractPanoeeUrl(vehicle['360degree'].interior);

    if (legacyIntUrl) {
      intConfig = { panoeeUrl: legacyIntUrl };
    }
    // If only legacy exterior was provided and it was a valid Panoee tour, allow it as interior panorama
    if (!intConfig && legacyExtUrl) {
      intConfig = { panoeeUrl: legacyExtUrl };
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
