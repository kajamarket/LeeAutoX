import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Check, Clock, MapPin, Eye, X, 
  ChevronLeft, ChevronRight, Car, MessageCircle, 
  ShieldAlert, Compass, Download
} from 'lucide-react';
import { downloadImage } from '../utils/downloadImage';
import { VehicleLotItem } from '../types/auction';
import { 
  getAuctionLotDetails, 
  getRelatedAuctionVehicles 
} from '../services/auctionService';
import { generateBidWhatsAppUrl } from '../utils/auctionBid';
import AuctionVehicleCard from '../components/AuctionVehicleCard';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import { OriginalLoader } from '../components/ui/ImportedControls';

export default function AuctionLotPage() {
  const [searchParams] = useSearchParams();

  const lotNumber = searchParams.get('lot') || searchParams.get('lot_number') || '44146026';
  const platform = (searchParams.get('platform') || 'iaai').toLowerCase() as 'copart' | 'iaai';
  const slug = searchParams.get('slug') || searchParams.get('slugVin') || '';
  const fromSearch = searchParams.get('fromSearch') || '';

  const [lot, setLot] = useState<VehicleLotItem | null>(null);
  const [relatedLots, setRelatedLots] = useState<VehicleLotItem[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [is360Active, setIs360Active] = useState<boolean>(false);
  const [copiedVin, setCopiedVin] = useState(false);
  const [copiedLot, setCopiedLot] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<number>(Date.now());

  // Real-time ticking timer for countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch lot details & 4 related vehicles
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, follow');

    getAuctionLotDetails(lotNumber, platform, slug).then((data) => {
      if (isMounted) {
        if (data) {
          setLot(data);
          // Set dynamic page title
          document.title = `${data.year} ${data.make} ${data.model} - ${data.platform.toUpperCase()} Lot #${data.lot_number} | LeeAutoX`;

          // Fetch exactly 4 related vehicles from /related endpoint or fallback
          getRelatedAuctionVehicles(data.slug_vin || data.lot_number, data.make, data.model).then((rel) => {
            if (isMounted) {
              setRelatedLots(rel.filter((r) => r.lot_number !== data.lot_number).slice(0, 4));
            }
          });
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, [lotNumber, platform, slug]);

  // Escape & arrow keys for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen]);

  const copyToClipboard = (text: string, type: 'vin' | 'lot') => {
    navigator.clipboard.writeText(text);
    if (type === 'vin') {
      setCopiedVin(true);
      setTimeout(() => setCopiedVin(false), 2000);
    } else {
      setCopiedLot(true);
      setTimeout(() => setCopiedLot(false), 2000);
    }
  };

  // Compute live countdown from real auction date UTC ISO -> visitor local time with timezone
  const computeTimeLeft = (dateString?: string) => {
    if (!dateString) return null;
    const target = new Date(dateString).getTime();
    if (isNaN(target)) return null;
    const diff = Math.max(0, Math.floor((target - now) / 1000));

    if (diff <= 0) {
      return { expired: true, text: 'Auction In Progress / Concluded' };
    }

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    let text = '';
    if (days > 0) {
      text = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    } else {
      text = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    let localDateStr = '';
    try {
      const d = new Date(dateString);
      localDateStr = new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(d);
    } catch {
      localDateStr = '';
    }

    return { expired: false, text, localDateStr };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-36 pb-24 px-6 md:px-12 flex flex-col items-center justify-center transition-colors">
        <div className="lx-card px-8 py-10 max-w-md w-full text-center">
          <OriginalLoader label="Loading auction lot details" />
          <p className="font-mono text-[11px] text-[var(--ink-2)] mt-2">
            Fetching lot specifications, photos, and live bidding status
          </p>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-36 pb-24 px-6 text-center transition-colors">
        <div className="lx-card max-w-md mx-auto p-8">
          <ShieldAlert size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="font-serif text-2xl font-normal mb-2">Auction Lot Not Found</h2>
          <p className="text-xs font-mono mb-6 text-[var(--ink-2)]">The requested lot has concluded or the identifier is invalid.</p>
          <Link to="/auction-search/" className="lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)] text-xs uppercase">
            Back to Auction Search
          </Link>
        </div>
      </div>
    );
  }

  const photos = (lot.media?.photos && lot.media.photos.length > 0)
    ? lot.media.photos
    : (lot.media?.photo && lot.media.photo.length > 0)
    ? lot.media.photo
    : ['https://images.unsplash.com/photo-1590362891988-f7780479c656?w=1080'];

  const activePhoto = photos[selectedPhotoIndex] || photos[0];
  const whatsappUrl = generateBidWhatsAppUrl(lot);
  const timeLeft = computeTimeLeft(lot.auction?.ad || lot.auction?.auction_date);

  const currentBid = lot.pricing?.current_bid_usd ?? lot.pricing?.current_bid;
  const buyNow = lot.pricing?.buy_now_usd ?? lot.pricing?.buy_now_price;
  const estCost = lot.pricing?.estimated_cost_text || (
    lot.pricing?.estimated_cost_from && lot.pricing?.estimated_cost_to
      ? `$${lot.pricing.estimated_cost_from.toLocaleString()} - $${lot.pricing.estimated_cost_to.toLocaleString()}`
      : null
  );

  const odoMi = lot.specs?.odometer_mi ?? (typeof lot.specs?.odometer === 'number' && lot.specs.odometer > 0 ? lot.specs.odometer : null);
  const odoKm = lot.specs?.odometer_km ?? (odoMi ? Math.round(odoMi * 1.60934) : null);
  const odoFormatted = odoMi !== null 
    ? `${odoMi.toLocaleString()} mi / ${odoKm ? odoKm.toLocaleString() : Math.round(odoMi * 1.60934).toLocaleString()} km`
    : '—';

  const engineFull = lot.specs?.engine_raw || (
    lot.specs?.engine_size ? `${lot.specs.engine_size}L ${lot.specs.engine_type || ''} ${lot.specs.engine_hp ? `${lot.specs.engine_hp}HP` : ''}`.trim() : '—'
  );

  const isCopart = lot.platform.toLowerCase() === 'copart';
  const auctionStatus = (lot.auction?.state || lot.auction?.status || 'Open').toUpperCase();

  const backUrl = fromSearch 
    ? `/auction-search/?${fromSearch}`
    : '/auction-search/';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300 pt-24 sm:pt-28 md:pt-32 pb-20">
      {/* HEADER BAR */}
      <div className="border-b border-[var(--line)] bg-[var(--card)]/75 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Back to search results</span>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Platform Badge */}
              <span className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full text-white ${
                isCopart ? 'bg-blue-600' : 'bg-red-600'
              }`}>
                {isCopart ? 'COPART' : 'IAAI'}
              </span>

              {/* Lot Number */}
              <button
                type="button"
                onClick={() => copyToClipboard(lot.lot_number, 'lot')}
                className="px-3 py-1 bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--ink)] border border-[var(--line)] rounded-full text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors tabular-nums"
                title="Click to copy lot number"
              >
                <span>Lot #{lot.lot_number}</span>
                {copiedLot ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-[var(--ink-2)]" />}
              </button>

              {/* Status Badge */}
              <span className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-full ${
                auctionStatus === 'LIVE'
                  ? 'bg-rose-500 text-white'
                  : auctionStatus === 'ENDED'
                  ? 'bg-zinc-700 text-zinc-200'
                  : 'bg-emerald-600 text-white'
              }`}>
                {auctionStatus}
              </span>

              {/* Copy VIN Button */}
              {lot.vin && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(lot.vin, 'vin')}
                  className="px-3 py-1 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-[var(--accent)]/30"
                  title="Click to copy VIN"
                >
                  <span>VIN: {lot.vin}</span>
                  {copiedVin ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>

          {/* Title & Location / Auction Time */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[var(--ink)]">
                <AnimatedText text={lot.title} variant="blur-in" trigger="mount" />
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs font-mono text-[var(--ink-2)]">
                {lot.location?.display && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[var(--accent)]" />
                    <span>{lot.location.display}</span>
                  </span>
                )}
                {timeLeft?.localDateStr && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-[var(--accent)]" />
                    <span>Auction Date: {timeLeft.localDateStr}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Top WhatsApp Bid button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lx-pill-btn bg-[#25D366] hover:brightness-105 text-black text-xs font-mono font-bold uppercase tracking-wider shadow-md shrink-0"
            >
              <MessageCircle size={16} className="fill-black text-[#25D366]" />
              <span>Bid via LeeAutoX</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-10">
        {/* MAIN BODY: GALLERY (LEFT) + KEY INFO & BID STRIP (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* GALLERY CONTAINER (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 360 or Main Photo View */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-black border border-[var(--line)] shadow-lg group">
              {is360Active && lot.media?.vr360_url ? (
                <iframe
                  src={lot.media.vr360_url}
                  title="360 Interactive View"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activePhoto}
                  alt={lot.title}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
                  onClick={() => setIsLightboxOpen(true)}
                />
              )}

              {/* 360 View Toggle Button (if available in API) */}
              {lot.media?.has_360 && lot.media?.vr360_url && (
                <button
                  type="button"
                  onClick={() => setIs360Active((prev) => !prev)}
                  className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all ${
                    is360Active 
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)]' 
                      : 'bg-black/75 hover:bg-black/90 text-white border border-white/20'
                  }`}
                >
                  <Compass size={14} />
                  <span>{is360Active ? 'Exit 360°' : 'Interactive 360° View'}</span>
                </button>
              )}

              {/* Photo Navigation Arrows */}
              {!is360Active && photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Lightbox Trigger Icon */}
              {!is360Active && (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 border border-white/20 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Expand ({photos.length} photos)</span>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin]">
              {photos.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    setIs360Active(false);
                  }}
                  className={`w-20 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === idx && !is360Active
                      ? 'border-[var(--accent)] scale-105 shadow-md'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* KEY INFO & PRICING PANEL (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal variant="rise" immediate>
              <div className="lx-card p-6">
                {/* Live Countdown Timer */}
                {timeLeft && (
                  <div className={`mb-6 p-3.5 rounded-2xl flex items-center justify-between gap-2 text-xs font-mono ${
                    timeLeft.expired
                      ? 'bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)]'
                      : 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/25'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm tabular-nums">
                      <Clock size={16} />
                      <span>{timeLeft.text}</span>
                    </div>
                    <span className="text-[var(--ink-2)] font-medium text-right">{timeLeft.localDateStr}</span>
                  </div>
                )}

                {/* THREE-CELL PRICING STRIP */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] mb-6 text-center tabular-nums">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] font-medium">Current Bid</span>
                    <span className="font-mono font-bold text-base sm:text-lg text-[var(--accent)]">
                      {currentBid !== null && currentBid !== undefined ? `$${Number(currentBid).toLocaleString()}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] font-medium">Buy Now</span>
                    <span className="font-mono font-bold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                      {buyNow !== null && buyNow !== undefined ? `$${Number(buyNow).toLocaleString()}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] font-medium">Est. Range</span>
                    <span className="font-mono font-bold text-xs sm:text-sm block truncate text-[var(--ink)]" title={estCost || '—'}>
                      {estCost || '—'}
                    </span>
                  </div>
                </div>

                {/* KEY SPECS GRID */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6 pb-6 border-b border-[var(--line)]">
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <span className="block text-[10px] text-[var(--ink-2)] font-medium">Odometer</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">{odoFormatted}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <span className="block text-[10px] text-[var(--ink-2)] font-medium">Run Condition</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {lot.specs?.run_condition_label || lot.specs?.run_and_drive || 'Run and Drive'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <span className="block text-[10px] text-[var(--ink-2)] font-medium">Primary Damage</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{lot.damage?.primary || 'None'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <span className="block text-[10px] text-[var(--ink-2)] font-medium">Drive Line</span>
                    <span className="font-bold text-[var(--ink)]">{lot.specs?.drive_type || 'FWD'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] col-span-2">
                    <span className="block text-[10px] text-[var(--ink-2)] font-medium">Engine</span>
                    <span className="font-bold text-[var(--ink)] truncate block">{engineFull}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] col-span-2">
                    <span className="block text-[10px] text-[var(--ink-2)] font-medium">Fuel / Transmission</span>
                    <span className="font-bold text-[var(--ink)]">{lot.specs?.fuel_type || 'Gasoline'} · {lot.specs?.transmission || 'Automatic'}</span>
                  </div>
                </div>

                {/* PRIMARY WHATSAPP BID ACTION */}
                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lx-pill-btn w-full py-4 bg-[#25D366] hover:brightness-105 text-black text-sm font-mono font-bold uppercase tracking-wider shadow-lg"
                  >
                    <MessageCircle size={18} className="fill-black text-[#25D366]" />
                    <span>Bid via LeeAutoX on WhatsApp</span>
                  </a>

                  <p className="text-[11px] font-mono text-center text-[var(--ink-2)]">
                    We verify title, inspect records, submit proxy bids, handle containerization & Ghanaian/Nigerian customs.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* DETAILED SPECIFICATIONS */}
        <Reveal variant="rise">
          <div className="lx-card p-6 sm:p-8">
            <h2 className="font-serif text-xl sm:text-2xl font-normal mb-6 flex items-center gap-2.5 text-[var(--ink)]">
              <Car size={20} className="text-[var(--accent)]" />
              <span>Complete Vehicle & Auction Lot Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono">
              {[
                { label: 'VIN', val: lot.vin || '—' },
                { label: 'Lot Number', val: lot.lot_number || '—' },
                { label: 'Platform', val: lot.platform?.toUpperCase() || '—' },
                { label: 'Keys', val: lot.specs?.keys || (lot.specs?.has_key ? 'With' : 'No') },
                { label: 'Body Style', val: lot.specs?.body_style || '—' },
                { label: 'Exterior Colour', val: lot.specs?.color || '—' },
                { label: 'Interior Colour', val: lot.specs?.interior_color || 'Unknown' },
                { label: 'Cylinders', val: lot.specs?.cylinders ? `${lot.specs.cylinders} Cylinders` : '—' },
                { label: 'Airbags', val: lot.specs?.airbags || 'Intact' },
                { label: 'Restraint System', val: lot.specs?.restraint_system || '—' },
                { label: 'Secondary Damage', val: lot.damage?.secondary || 'None Reported' },
                { label: 'Sale Document / Title', val: lot.sale_document?.name || 'Salvage Document' },
                { label: 'Seller (Source)', val: lot.seller?.name || 'Insurance / Auto Facility' },
                { label: 'Actual Cash Value (ACV)', val: lot.pricing?.est_retail_value ? `$${lot.pricing.est_retail_value.toLocaleString()} USD` : '—' },
                { label: 'Estimated Repair Cost', val: lot.pricing?.repair_cost ? `$${lot.pricing.repair_cost.toLocaleString()} USD` : '—' },
                { label: 'Auction Facility Location', val: lot.location?.display || lot.location?.city || '—' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] font-medium mb-1">{item.label}</span>
                  <span className="font-bold text-[var(--ink)] truncate block" title={String(item.val)}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* SALE HISTORY */}
        <Reveal variant="rise">
          <div className="lx-card p-6 sm:p-8">
            <h2 className="font-serif text-xl sm:text-2xl font-normal mb-2 flex items-center gap-2.5 text-[var(--ink)]">
              <Clock size={20} className="text-[var(--accent)]" />
              <span>Sale History</span>
            </h2>
            <p className="text-xs font-mono text-[var(--ink-2)] mb-6">
              Latest auction appearances and bidding events recorded for this vehicle.
            </p>

            {lot.history && lot.history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[var(--ink-2)] font-semibold">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Bid / Sale Price</th>
                      <th className="py-3 px-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-[var(--ink)] tabular-nums">
                    {lot.history.map((ev, i) => (
                      <tr key={i} className="hover:bg-[var(--surface)] transition-colors">
                        <td className="py-3 px-3 text-[var(--ink-2)]">{ev.date || '—'}</td>
                        <td className="py-3 px-3 font-bold text-[var(--ink)]">{ev.status || 'Auction Event'}</td>
                        <td className="py-3 px-3 font-bold text-[var(--accent)]">
                          {ev.sale_price ? `$${Number(ev.sale_price).toLocaleString()}` : ev.bid ? `$${Number(ev.bid).toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-[var(--ink-2)]">{ev.location || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 px-4 text-center rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--line)]">
                <p className="text-xs font-mono text-[var(--ink-2)]">No history returned for this lot.</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* RELATED VEHICLES */}
        {relatedLots.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[var(--ink)]">
                  Similar Auction Vehicles
                </h2>
                <p className="text-xs font-mono text-[var(--ink-2)] mt-1">
                  Other live auction lots matching {lot.make} {lot.model}
                </p>
              </div>

              <Link
                to={`/auction-search/?make=${encodeURIComponent(lot.make)}`}
                className="text-xs font-mono font-bold text-[var(--accent)] hover:underline"
              >
                View all {lot.make} lots →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLots.slice(0, 4).map((relLot) => (
                <AuctionVehicleCard
                  key={relLot.id}
                  vehicle={relLot}
                  viewMode="grid"
                  searchQueryContext={fromSearch}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen lot gallery"
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-4 md:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div>
              <h4 className="font-serif text-lg font-normal">{lot.title}</h4>
              <p className="text-xs font-mono opacity-70 tabular-nums">
                {lot.platform.toUpperCase()} Lot #{lot.lot_number} · Photo {selectedPhotoIndex + 1} of {photos.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentUrl = photos[selectedPhotoIndex];
                  const filename = `${lot.year || ''}-${lot.make || ''}-${lot.model || ''}-lot-${lot.lot_number}-${selectedPhotoIndex + 1}.jpg`
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-');
                  downloadImage(currentUrl, filename);
                }}
                aria-label="Download image"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                title="Download current photo"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-mono text-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <X size={14} />
                <span>Close [ESC]</span>
              </button>
            </div>
          </div>

          <div 
            className="relative flex items-center justify-center flex-1 max-w-5xl mx-auto w-full my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedPhotoIndex]}
              alt={lot.title}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                  }}
                  aria-label="Next photo"
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(idx);
                }}
                className={`relative w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === selectedPhotoIndex ? 'border-[var(--accent)] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

