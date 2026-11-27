import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Clock,
  MapPin,
  ExternalLink,
  Maximize2,
  MessageCircle,
  Gauge,
  X,
} from 'lucide-react';
import { VehicleLotItem } from '../types/auction';
import { generateBidWhatsAppUrl } from '../utils/auctionBid';

interface AuctionVehicleCardProps {
  key?: React.Key;
  vehicle: VehicleLotItem;
  viewMode?: 'grid' | 'list';
  searchQueryContext?: string;
}

export default function AuctionVehicleCard({
  vehicle,
  viewMode = 'grid',
  searchQueryContext = '',
}: AuctionVehicleCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [copiedVin, setCopiedVin] = useState(false);
  const [copiedLot, setCopiedLot] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen]);

  const photos =
    vehicle.media?.photos && vehicle.media.photos.length > 0
      ? vehicle.media.photos
      : vehicle.media?.thumbs && vehicle.media.thumbs.length > 0
      ? vehicle.media.thumbs
      : ['https://images.unsplash.com/photo-1590362891988-f7780479c656?w=800'];

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const copyVin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (vehicle.vin) {
      navigator.clipboard?.writeText(vehicle.vin);
      setCopiedVin(true);
      setTimeout(() => setCopiedVin(false), 2000);
    }
  };

  const copyLot = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (vehicle.lot_number) {
      navigator.clipboard?.writeText(String(vehicle.lot_number));
      setCopiedLot(true);
      setTimeout(() => setCopiedLot(false), 2000);
    }
  };

  const computeTimeLeft = (dateString?: string) => {
    if (!dateString) return null;
    const target = new Date(dateString).getTime();
    if (isNaN(target)) return null;
    const diff = Math.max(0, Math.floor((target - now) / 1000));

    if (diff <= 0) {
      return { expired: true, text: 'Auction In Progress / Ended', localDateStr: '' };
    }

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const text =
      days > 0
        ? `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
        : `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

    let localDateStr = '';
    try {
      const d = new Date(dateString);
      localDateStr = new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(d);
    } catch {
      localDateStr = '';
    }

    return { expired: false, text, localDateStr };
  };

  const timeLeft = computeTimeLeft(vehicle.auction?.ad || vehicle.auction?.auction_date);

  const auctionStatus = (vehicle.auction?.state || vehicle.auction?.status || 'Open').toLowerCase();
  const statusLabel = auctionStatus === 'live' ? 'Live Now' : auctionStatus === 'ended' ? 'Ended' : 'Open';

  const isCopart = vehicle.platform.toLowerCase() === 'copart';
  const isRunAndDrive =
    vehicle.specs?.run_and_drive === 'RUNS AND DRIVES' ||
    vehicle.specs?.run_condition_label?.toLowerCase().includes('run');
  const isStarts =
    vehicle.specs?.run_and_drive === 'ENGINE START PROGRAM' ||
    vehicle.specs?.run_condition_label?.toLowerCase().includes('starts');

  const currentBid = vehicle.pricing?.current_bid_usd ?? vehicle.pricing?.current_bid;
  const buyNow = vehicle.pricing?.buy_now_usd ?? vehicle.pricing?.buy_now_price;
  const estCost =
    vehicle.pricing?.estimated_cost_text ||
    (vehicle.pricing?.estimated_cost_from && vehicle.pricing?.estimated_cost_to
      ? `$${vehicle.pricing.estimated_cost_from.toLocaleString()} - $${vehicle.pricing.estimated_cost_to.toLocaleString()}`
      : null);

  const lotUrl = `/auction-lot?platform=${vehicle.platform}&lot=${vehicle.lot_number}&slug=${encodeURIComponent(
    vehicle.slug_vin || vehicle.lot_number
  )}${searchQueryContext ? `&fromSearch=${encodeURIComponent(searchQueryContext)}` : ''}`;
  const whatsappUrl = generateBidWhatsAppUrl(vehicle);

  const odoMi =
    vehicle.specs?.odometer_mi ??
    (typeof vehicle.specs?.odometer === 'number' && vehicle.specs.odometer > 0 ? vehicle.specs.odometer : null);
  const odoKm = vehicle.specs?.odometer_km ?? (odoMi ? Math.round(odoMi * 1.60934) : null);
  const odoString =
    odoMi !== null ? `${odoMi.toLocaleString()} mi ${odoKm ? `/ ${odoKm.toLocaleString()} km` : ''}` : null;

  const engineString =
    vehicle.specs?.engine_raw ||
    (vehicle.specs?.engine_size ? `${vehicle.specs.engine_size}L ${vehicle.specs.engine_type || ''}`.trim() : null);

  const isList = viewMode === 'list';

  return (
    <>
      <div className={`group lx-card overflow-hidden flex flex-col ${isList ? 'md:flex-row' : ''}`}>
        {/* IMAGE SLIDER CONTAINER */}
        <div
          className={`relative overflow-hidden bg-black shrink-0 ${
            isList ? 'w-full md:w-80 h-64 md:h-auto min-h-[240px]' : 'w-full h-56 sm:h-64'
          }`}
        >
          <img
            src={photos[photoIndex]}
            alt={vehicle.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
            loading="lazy"
          />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                  statusLabel === 'Live Now'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : statusLabel === 'Ended'
                    ? 'bg-zinc-800/90 text-zinc-300 border border-white/10'
                    : 'bg-emerald-600/95 text-white'
                }`}
              >
                {statusLabel}
              </span>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                  isCopart ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isCopart ? 'COPART' : 'IAAI'}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              aria-label="Open photo gallery"
              className="pointer-events-auto px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Maximize2 size={11} />
              <span className="tabular-nums">
                {photoIndex + 1}/{photos.length}
              </span>
            </button>
          </div>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevPhoto}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextPhoto}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
              >
                <ChevronRight size={16} />
              </button>

              <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1 pointer-events-none">
                {photos.slice(0, 8).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === photoIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {vehicle.damage?.primary && (
              <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-mono border border-amber-400/20 truncate max-w-[55%]">
                {vehicle.damage.primary}
              </span>
            )}
            {vehicle.specs?.run_condition_label && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono backdrop-blur-md border ${
                  isRunAndDrive
                    ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/30'
                    : isStarts
                    ? 'bg-amber-950/85 text-amber-300 border-amber-500/30'
                    : 'bg-zinc-900/85 text-zinc-300 border-zinc-700/40'
                }`}
              >
                {vehicle.specs.run_condition_label}
              </span>
            )}
          </div>
        </div>

        {/* CARD CONTENT */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {timeLeft && (
              <div
                className={`mb-2.5 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-mono ${
                  timeLeft.expired
                    ? 'bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)]'
                    : 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/25'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold tabular-nums">
                  <Clock size={13} />
                  <span>{timeLeft.text}</span>
                </div>
                {timeLeft.localDateStr && (
                  <span className="opacity-80 text-[11px] truncate ml-2">{timeLeft.localDateStr}</span>
                )}
              </div>
            )}

            <Link
              to={lotUrl}
              className="block font-serif text-lg sm:text-xl font-normal leading-snug tracking-tight text-[var(--ink)] hover:text-[var(--accent)] transition-colors line-clamp-1 mb-2"
            >
              {vehicle.title}
            </Link>

            <div className="space-y-1 text-xs mb-4 text-[var(--ink-2)]">
              {vehicle.location?.display && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="shrink-0 text-[var(--accent)]" />
                  <span className="truncate">{vehicle.location.display}</span>
                </div>
              )}

              {odoString && (
                <div className="flex items-center gap-1.5 font-mono tabular-nums">
                  <Gauge size={12} className="shrink-0 text-[var(--ink-2)]" />
                  <span>{odoString}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]">
                {vehicle.specs?.fuel_type && <span>{vehicle.specs.fuel_type}</span>}
                {vehicle.specs?.transmission && (
                  <>
                    <span>·</span>
                    <span>{vehicle.specs.transmission}</span>
                  </>
                )}
                {vehicle.specs?.drive_type && (
                  <>
                    <span>·</span>
                    <span>{vehicle.specs.drive_type}</span>
                  </>
                )}
              </div>

              {engineString && (
                <div className="font-mono text-[11px] truncate" title={engineString}>
                  Engine: {engineString}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--line)] text-[11px] font-mono">
              {vehicle.vin && (
                <button
                  type="button"
                  onClick={copyVin}
                  className="px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--accent)] flex items-center gap-1.5 transition-colors cursor-pointer text-[var(--ink)]"
                  title="Click to copy VIN"
                >
                  <span className="text-[var(--ink-2)]">VIN:</span>
                  <span className="font-bold">{vehicle.vin.slice(0, 10)}...</span>
                  {copiedVin ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="opacity-60" />}
                </button>
              )}

              {vehicle.lot_number && (
                <button
                  type="button"
                  onClick={copyLot}
                  className="px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--accent)] flex items-center gap-1.5 transition-colors cursor-pointer text-[var(--ink)]"
                  title="Click to copy Lot Number"
                >
                  <span className="text-[var(--ink-2)]">Lot:</span>
                  <span className="font-bold">{vehicle.lot_number}</span>
                  {copiedLot ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="opacity-60" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] mb-3 text-center">
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--ink-2)]">Current Bid</span>
                <span className="font-mono font-bold text-xs sm:text-sm tabular-nums text-[var(--accent)]">
                  {currentBid !== null && currentBid !== undefined ? `$${Number(currentBid).toLocaleString()}` : '—'}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--ink-2)]">Buy Now</span>
                <span className="font-mono font-bold text-xs sm:text-sm tabular-nums text-emerald-600 dark:text-emerald-400">
                  {buyNow !== null && buyNow !== undefined ? `$${Number(buyNow).toLocaleString()}` : '—'}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--ink-2)]">Est. Range</span>
                <span className="font-mono font-bold text-xs tabular-nums truncate block text-[var(--ink)]" title={estCost || '—'}>
                  {estCost || '—'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to={lotUrl}
                className="py-2.5 px-3 rounded-full border border-[var(--line)] text-xs font-mono font-bold uppercase tracking-wider text-center text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Details</span>
                <ExternalLink size={12} />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-full bg-[#25D366] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle size={14} className="fill-black text-[#25D366]" />
                <span className="truncate">Bid Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-4 md:p-8"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Vehicle lot photos"
        >
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div>
              <h4 className="font-serif text-lg font-normal">{vehicle.title}</h4>
              <p className="text-xs font-mono opacity-70 tabular-nums">
                {vehicle.platform.toUpperCase()} Lot #{vehicle.lot_number} · Photo {photoIndex + 1} of {photos.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-mono text-xs cursor-pointer flex items-center gap-1.5"
            >
              <X size={14} /> Close
            </button>
          </div>

          <div
            className="relative flex items-center justify-center flex-1 max-w-5xl mx-auto w-full my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[photoIndex]}
              alt={vehicle.title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  aria-label="Previous gallery photo"
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  aria-label="Next gallery photo"
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-5xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {photos.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPhotoIndex(idx)}
                className={`relative w-16 h-12 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === photoIndex ? 'border-[var(--accent)] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
