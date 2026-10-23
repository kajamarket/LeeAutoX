import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Check, Clock, MapPin, Gavel, 
  ExternalLink, Key, Zap, AlertTriangle, Eye, X, 
  ChevronLeft, ChevronRight, Car, MessageCircle, 
  ShieldCheck, Gauge, ShieldAlert, Sparkles, Compass
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { VehicleLotItem } from '../types/auction';
import { 
  getAuctionLotDetails, 
  getRelatedAuctionVehicles 
} from '../services/auctionService';
import { generateBidWhatsAppUrl, getAuctionLotUrl } from '../utils/auctionBid';
import AuctionVehicleCard from '../components/AuctionVehicleCard';

export default function AuctionLotPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
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

    getAuctionLotDetails(lotNumber, platform, slug).then((data) => {
      if (isMounted) {
        if (data) {
          setLot(data);
          // Set dynamic page title & noindex
          document.title = `${data.year} ${data.make} ${data.model} - ${data.platform.toUpperCase()} Lot #${data.lot_number} | LeeAutoX`;
          let robots = document.querySelector('meta[name="robots"]');
          if (!robots) {
            robots = document.createElement('meta');
            robots.setAttribute('name', 'robots');
            document.head.appendChild(robots);
          }
          robots.setAttribute('content', 'noindex, follow');

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
    };
  }, [lotNumber, platform, slug]);

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
      <div className={`min-h-screen py-24 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-[#090909] text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-white/10 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-[460px] bg-slate-200 dark:bg-white/10 rounded-3xl" />
            <div className="lg:col-span-5 h-[460px] bg-slate-200 dark:bg-white/10 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className={`min-h-screen py-24 px-6 text-center ${
        theme === 'dark' ? 'bg-[#090909] text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="max-w-md mx-auto p-8 rounded-3xl border border-slate-200 dark:border-white/10">
          <ShieldAlert size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Auction Lot Not Found</h2>
          <p className="text-xs font-mono mb-6 opacity-60">The requested lot has concluded or the identifier is invalid.</p>
          <Link to="/auction-search" className="px-5 py-2.5 bg-[#2B59FF] text-white text-xs font-bold uppercase rounded-xl">
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
    ? `/auction-search?${fromSearch}`
    : '/auction-search';

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${
      theme === 'dark' ? 'bg-[#090909] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* HEADER BAR (Task 4 specification: Platform, Lot #, Status, Title, Auction Date/Time, Location, Back to results, Copy VIN) */}
      <div className={`border-b transition-colors ${
        theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#2B59FF] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Back to search results</span>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Platform Badge */}
              <span className={`px-2.5 py-1 text-xs font-mono font-black uppercase tracking-wider rounded-lg text-white ${
                isCopart ? 'bg-blue-600' : 'bg-red-600'
              }`}>
                {isCopart ? 'COPART' : 'IAAI'}
              </span>

              {/* Lot Number */}
              <button
                type="button"
                onClick={() => copyToClipboard(lot.lot_number, 'lot')}
                className="px-3 py-1 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                title="Click to copy lot number"
              >
                <span>Lot #{lot.lot_number}</span>
                {copiedLot ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="opacity-60" />}
              </button>

              {/* Status Badge */}
              <span className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-lg ${
                auctionStatus === 'LIVE'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : auctionStatus === 'ENDED'
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'bg-emerald-600 text-white'
              }`}>
                {auctionStatus}
              </span>

              {/* Copy VIN Button */}
              {lot.vin && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(lot.vin, 'vin')}
                  className="px-3 py-1 bg-[#2B59FF]/10 text-[#2B59FF] hover:bg-[#2B59FF]/20 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-[#2B59FF]/30"
                  title="Click to copy VIN"
                >
                  <span>VIN: {lot.vin}</span>
                  {copiedVin ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>

          {/* Title & Location / Auction Time */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                {lot.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-mono opacity-75">
                {lot.location?.display && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#2B59FF]" />
                    {lot.location.display}
                  </span>
                )}
                {timeLeft?.localDateStr && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-[#2B59FF]" />
                    Auction Date: {timeLeft.localDateStr}
                  </span>
                )}
              </div>
            </div>

            {/* Top WhatsApp Bid button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:brightness-110 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0"
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
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-black/60 border border-slate-200 dark:border-white/10 group">
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
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all ${
                    is360Active 
                      ? 'bg-[#2B59FF] text-white' 
                      : 'bg-black/70 hover:bg-black/90 text-white border border-white/20'
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
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
                  className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
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
                      ? 'border-[#2B59FF] scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* KEY INFO & PRICING PANEL (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 rounded-3xl border transition-colors ${
              theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {/* Live Countdown Timer */}
              {timeLeft && (
                <div className={`mb-6 p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono ${
                  timeLeft.expired
                    ? 'bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400'
                    : 'bg-[#2B59FF]/10 text-[#2B59FF] border border-[#2B59FF]/20'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Clock size={16} />
                    <span>{timeLeft.text}</span>
                  </div>
                  <span className="opacity-75">{timeLeft.localDateStr}</span>
                </div>
              )}

              {/* THREE-CELL PRICING STRIP */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/5 mb-6 text-center">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider opacity-60">Current Bid</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#2B59FF]">
                    {currentBid !== null && currentBid !== undefined ? `$${Number(currentBid).toLocaleString()}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider opacity-60">Buy Now</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                    {buyNow !== null && buyNow !== undefined ? `$${Number(buyNow).toLocaleString()}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider opacity-60">Est. Range</span>
                  <span className="font-mono font-bold text-xs sm:text-sm block truncate" title={estCost || '—'}>
                    {estCost || '—'}
                  </span>
                </div>
              </div>

              {/* KEY SPECS GRID */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="block text-[10px] opacity-60">Odometer</span>
                  <span className="font-bold">{odoFormatted}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="block text-[10px] opacity-60">Run Condition</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {lot.specs?.run_condition_label || lot.specs?.run_and_drive || 'Run and Drive'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="block text-[10px] opacity-60">Primary Damage</span>
                  <span className="font-bold text-amber-500">{lot.damage?.primary || 'None'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="block text-[10px] opacity-60">Drive Line</span>
                  <span className="font-bold">{lot.specs?.drive_type || 'FWD'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 col-span-2">
                  <span className="block text-[10px] opacity-60">Engine</span>
                  <span className="font-bold truncate block">{engineFull}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 col-span-2">
                  <span className="block text-[10px] opacity-60">Fuel / Transmission</span>
                  <span className="font-bold">{lot.specs?.fuel_type || 'Gasoline'} · {lot.specs?.transmission || 'Automatic'}</span>
                </div>
              </div>

              {/* PRIMARY WHATSAPP BID ACTION */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-[#25D366] hover:brightness-110 text-black text-sm font-mono font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 transition-all cursor-pointer"
                >
                  <MessageCircle size={18} className="fill-black text-[#25D366]" />
                  <span>Bid via LeeAutoX on WhatsApp</span>
                </a>

                <p className="text-[11px] font-mono text-center opacity-60">
                  We verify title, inspect records, submit proxy bids, handle containerization & Nigerian customs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED SPECIFICATIONS (Task 4 specification: All fields returned by the API) */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
          theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
            <Car size={20} className="text-[#2B59FF]" />
            Complete Vehicle & Auction Lot Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">VIN</span>
              <span className="font-bold">{lot.vin || '—'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Lot Number</span>
              <span className="font-bold">{lot.lot_number || '—'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Platform</span>
              <span className="font-bold uppercase">{lot.platform}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Keys</span>
              <span className="font-bold">{lot.specs?.keys || (lot.specs?.has_key ? 'With' : 'No')}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Body Style</span>
              <span className="font-bold">{lot.specs?.body_style || '—'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Exterior Colour</span>
              <span className="font-bold">{lot.specs?.color || '—'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Interior Colour</span>
              <span className="font-bold">{lot.specs?.interior_color || 'Unknown'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Cylinders</span>
              <span className="font-bold">{lot.specs?.cylinders ? `${lot.specs.cylinders} Cylinders` : '—'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Airbags</span>
              <span className="font-bold">{lot.specs?.airbags || 'Intact'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Restraint System</span>
              <span className="font-bold truncate block" title={lot.specs?.restraint_system || '—'}>
                {lot.specs?.restraint_system || '—'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Secondary Damage</span>
              <span className="font-bold">{lot.damage?.secondary || 'None Reported'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Sale Document / Title</span>
              <span className="font-bold truncate block">{lot.sale_document?.name || 'Salvage Document'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Seller (Source)</span>
              <span className="font-bold truncate block">{lot.seller?.name || 'Insurance / Auto Facility'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Actual Cash Value (ACV)</span>
              <span className="font-bold">
                {lot.pricing?.est_retail_value ? `$${lot.pricing.est_retail_value.toLocaleString()} USD` : '—'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Estimated Repair Cost</span>
              <span className="font-bold">
                {lot.pricing?.repair_cost ? `$${lot.pricing.repair_cost.toLocaleString()} USD` : '—'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="block opacity-60 text-[10px]">Auction Facility Location</span>
              <span className="font-bold truncate block">{lot.location?.display || lot.location?.city || '—'}</span>
            </div>
          </div>
        </div>

        {/* SALE HISTORY (Task 4 specification: Latest events returned for this lot) */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
          theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-[#2B59FF]" />
            Sale History
          </h2>
          <p className="text-xs font-mono opacity-60 mb-6">Latest auction appearances and bidding events recorded for this vehicle.</p>

          {lot.history && lot.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 opacity-70">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Bid / Sale Price</th>
                    <th className="py-2.5 px-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {lot.history.map((ev, i) => (
                    <tr key={i}>
                      <td className="py-3 px-3">{ev.date || '—'}</td>
                      <td className="py-3 px-3 font-bold">{ev.status || 'Auction Event'}</td>
                      <td className="py-3 px-3 font-bold text-[#2B59FF]">
                        {ev.sale_price ? `$${Number(ev.sale_price).toLocaleString()}` : ev.bid ? `$${Number(ev.bid).toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-3">{ev.location || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 px-4 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
              <p className="text-xs font-mono opacity-60">No history returned for this lot.</p>
            </div>
          )}
        </div>

        {/* RELATED VEHICLES (Task 4 specification: Exactly 4 cards at the bottom, linking to lot page) */}
        {relatedLots.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  Similar Auction Vehicles
                </h2>
                <p className="text-xs font-mono opacity-60 mt-0.5">
                  Other live auction lots matching {lot.make} {lot.model}
                </p>
              </div>

              <Link
                to={`/auction-search?make=${encodeURIComponent(lot.make)}`}
                className="text-xs font-mono font-bold text-[#2B59FF] hover:underline"
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
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div>
              <h4 className="font-serif text-lg font-bold">{lot.title}</h4>
              <p className="text-xs font-mono opacity-70">
                {lot.platform.toUpperCase()} Lot #{lot.lot_number} · Photo {selectedPhotoIndex + 1} of {photos.length}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-mono text-xs cursor-pointer"
            >
              Close [ESC]
            </button>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(idx);
                }}
                className={`relative w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === selectedPhotoIndex ? 'border-[#2B59FF] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
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
