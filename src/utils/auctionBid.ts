import { VehicleLotItem } from '../types/auction';
import { CONTACT_INFO } from '../constants';

export function getAuctionLotUrl(lot: VehicleLotItem): string {
  const platform = lot.platform;
  const lotNumber = lot.lot_number;
  const slug = lot.slug_vin || `${lot.year}-${lot.make.toLowerCase()}-${lot.model.toLowerCase()}-${lot.vin || lotNumber}`;
  
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auction-lot.html?platform=${platform}&lot=${lotNumber}&slug=${encodeURIComponent(slug)}`;
  }
  return `https://leeautox.com/auction-lot.html?platform=${platform}&lot=${lotNumber}&slug=${encodeURIComponent(slug)}`;
}

export function generateBidWhatsAppUrl(lot: VehicleLotItem): string {
  const phone = CONTACT_INFO.whatsappRaw || '16473896162';
  const lotUrl = getAuctionLotUrl(lot);

  const lines: string[] = ['Hello LeeAutoX, I want to bid on this vehicle:'];

  if (lot.year) {
    lines.push(`Year: ${lot.year}`);
  }

  const makeModel = [lot.make, lot.model].filter(Boolean).join(' ').trim();
  if (makeModel) {
    lines.push(`Make/Model: ${makeModel}`);
  }

  if (lot.platform) {
    const platformLabel = lot.platform.toLowerCase() === 'iaai' ? 'IAAI' : 'Copart';
    lines.push(`Platform: ${platformLabel}`);
  }

  if (lot.lot_number) {
    lines.push(`Lot #: ${lot.lot_number}`);
  }

  if (lot.pricing && lot.pricing.current_bid !== null && lot.pricing.current_bid !== undefined) {
    lines.push(`Current bid: $${Number(lot.pricing.current_bid).toLocaleString()}`);
  }

  lines.push(`Link: ${lotUrl}`);

  const message = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
