import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Check, Clock, MapPin, Gavel, ShieldAlert, 
  ExternalLink, Key, Zap, AlertTriangle, Eye, X, ChevronLeft, ChevronRight, Car
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { VehicleLotItem } from '../types/auction';
import { getAuctionLotDetails, searchAuctionVehicles } from '../services/auctionService';
import { generateBidWhatsAppUrl, getAuctionLotUrl } from '../utils/auctionBid';
import { MOCK_AUCTION_VEHICLES } from '../data/mockAuctionLots';

export default function AuctionLotPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const lotNumber = searchParams.get('lot') || searchParams.get('lot_number') || '44146026';
  const platform = (searchParams.get('platform') || 'iaai').toLowerCase() as 'copart' | 'iaai';
  const slug = searchParams.get('slug') || searchParams.get('slugVin') || '';

  const [lot, setLot] = useState<VehicleLotItem | null>(null);
  const [relatedLots, setRelatedLots] = useState<VehicleLotItem[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [copiedVin, setCopiedVin] = useState(false);
  const [copiedLot, setCopiedLot] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<number>(Date.now());

  // Real-time ticking timer for countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch lot details
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

          // Fetch similar/related vehicles
          searchAuctionVehicles({ make: data.make, per_page: 4 }).then((sim) => {
            if (isMounted && sim.data) {
              setRelatedLots(sim.data.filter((i) => i.lot_number !== data.lot_number));
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

  const formatCountdown = (dateString?: string) => {
    if (!dateString) return '00h 00m 00s';
    const target = new Date(dateString).getTime();
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    if (diff <= 0) return 'Auction in progress / Finalizing';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen py-24 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-[#090909] text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-white/10 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-[420px] bg-slate-200 dark:bg-white/10 rounded-3xl" />
            <div className="lg:col-span-5 h-[420px] bg-slate-200 dark:bg-white/10 rounded-3xl" />
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
          <h2 className="text-xl font-bold mb-2">Auction Lot Not Found</h2>
          <p className="text-xs font-mono mb-6 opacity-60">The requested lot has concluded or the identifier is invalid.</p>
          <Link to="/auction-search" className="px-5 py-2.5 bg-[#2B59FF] text-white text-xs font-bold uppercase rounded-xl">
            Back to Auction Search
          </Link>
        </div>
      </div>
    );
  }

  const photos = lot.media.photo && lot.media.photo.length > 0
    ? lot.media.photo
    : ['https://images.unsplash.com/photo-1590362891988-f7780479c656?w=1080'];
  const activePhoto = photos[selectedPhotoIndex] || photos[0];
  const whatsappUrl = generateBidWhatsAppUrl(lot);

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${
      theme === 'dark' ? 'bg-[#090909] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Breadcrumb & Navigation */}
      <div className="border-b border-slate-200 dark:border-white/10 py-4 px-4 sm:px-6 md:px-12 bg-white/50 dark:bg-black/30 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/auction-search"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-white/70 hover:text-[#2B59FF] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Search Results
          </Link>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase rounded ${
              lot.platform === 'copart' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {lot.platform.toUpperCase()}
            </span>
            <span className="text-xs font-mono opacity-50 hidden sm:inline">
              Lot #{lot.lot_number}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6">
        {/* Title Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B59FF]">
                {lot.specs.run_and_drive || 'Runs & Drives'}
              </span>
              <span className="text-xs font-mono opacity-40">•</span>
              <span className="text-xs font-mono opacity-70">
                {lot.specs.body_style || 'Vehicle'}
              </span>
              <span className="text-xs font-mono opacity-40">•</span>
              <span className="text-xs font-mono opacity-70">
                {lot.location.city}, {lot.location.state}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              {lot.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy VIN */}
            <button
              onClick={() => copyToClipboard(lot.vin, 'vin')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100 shadow-xs'
              }`}
            >
              {copiedVin ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>VIN: {lot.vin}</span>
            </button>

            {/* Copy Lot */}
            <button
              onClick={() => copyToClipboard(lot.lot_number, 'lot')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100 shadow-xs'
              }`}
            >
              {copiedLot ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>Lot #{lot.lot_number}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Gallery (Left) + Pricing/Bid Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* PHOTO GALLERY (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Hero Main Image with Zoom Trigger */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 group shadow-md">
              <img
                src={activePhoto}
                alt={lot.title}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 hover:bg-black transition-colors cursor-pointer"
              >
                <Eye size={14} /> View Fullscreen ({selectedPhotoIndex + 1}/{photos.length})
              </button>

              {/* Prev / Next controls */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {photos.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {photos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhotoIndex === idx
                        ? 'border-[#2B59FF] scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BIDDING & AUCTION SUMMARY (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 rounded-3xl border shadow-lg ${
              theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200'
            }`}>
              {/* Countdown Bar */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <Clock size={16} />
                  <span>AUCTION TIME:</span>
                </div>
                <span className="font-mono font-bold text-sm tracking-wide">
                  {formatCountdown(lot.auction.auction_date)}
                </span>
              </div>

              {/* Price / Bid Highlights */}
              <div className="space-y-4 mb-6">
                <div className="flex items-baseline justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 block">Current Auction Bid</span>
                    <span className="font-serif text-3xl font-black text-[#2B59FF]">
                      ${(lot.pricing.current_bid || 0).toLocaleString()} <span className="text-xs font-mono font-normal">USD</span>
                    </span>
                  </div>
                  {lot.pricing.buy_now_price && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 block">Buy It Now</span>
                      <span className="font-serif text-xl font-bold text-emerald-500">
                        ${lot.pricing.buy_now_price.toLocaleString()} USD
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="opacity-50 block text-[10px] uppercase">Est. Retail Value</span>
                    <span className="font-semibold text-sm">${(lot.pricing.est_retail_value || 0).toLocaleString()} USD</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="opacity-50 block text-[10px] uppercase">Est. Repair Cost</span>
                    <span className="font-semibold text-sm">${(lot.pricing.repair_cost || 0).toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Shipping Estimate to West Africa */}
                <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  theme === 'dark' ? 'bg-blue-950/20 border-blue-900/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}>
                  <span>Ocean Freight & Logistics Est:</span>
                  <span className="font-bold">
                    ${(lot.pricing.est_shipping_min || 1100).toLocaleString()} - ${(lot.pricing.est_shipping_max || 3850).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* PRIMARY CTA: BID VIA LEEAUTOX */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gavel size={18} />
                  Bid via LeeAutoX (WhatsApp Desk)
                </a>

                <p className="text-[11px] font-mono text-center opacity-60 leading-relaxed">
                  Our registered Ontario export brokerage will place your verified proxy bids, verify titles, handle customs clearance, and arrange container delivery to Lagos, Nigeria or Accra, Ghana.
                </p>
              </div>
            </div>

            {/* Quick Trust Highlights */}
            <div className={`p-5 rounded-2xl border text-xs font-mono space-y-2.5 ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-emerald-500 font-bold">
                <Key size={14} />
                <span>Keys available: {lot.specs.keys || 'Yes'}</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <MapPin size={14} />
                <span>Yard Location: {lot.location.name} ({lot.location.state_name || lot.location.state})</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Primary Damage: {lot.damage.primary || 'Front End'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED SPECIFICATIONS & LOT DATA (Reference Demo Grid) */}
        <div className="mb-14">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">
              Lot Details & Specifications
            </h2>
            <p className="text-xs font-mono opacity-60">
              Technical condition, powertrain specs, title type, and auction yard observations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { label: 'Has Key', value: String(lot.specs.keys || 'Yes') },
              { label: 'Running Condition', value: lot.specs.run_and_drive || 'Runs & Drives' },
              { label: 'Transmission', value: lot.specs.transmission || 'Automatic' },
              { label: 'Fuel Type', value: lot.specs.fuel_type || 'Gasoline' },
              { label: 'Drive Type', value: lot.specs.drive_type || 'FWD' },
              { label: 'Body Style', value: lot.specs.body_style || 'Sedan' },
              { label: 'Exterior Color', value: lot.specs.color || 'Blue' },
              { label: 'Engine Size', value: String(lot.specs.engine_size || '2.0L') },
              { label: 'Cylinders', value: String(lot.specs.cylinders || 4) },
              { label: 'Odometer', value: `${(lot.specs.odometer || 0).toLocaleString()} ${lot.specs.odometer_unit || 'mi'}` },
              { label: 'Primary Damage', value: lot.damage.primary || 'Normal Wear' },
              { label: 'Secondary Damage', value: lot.damage.secondary || 'None' },
              { label: 'Airbags', value: lot.specs.airbags || 'Intact' },
              { label: 'Title / Doc Type', value: lot.sale_document?.type || 'Salvage Certificate' },
              { label: 'Auction Platform', value: lot.platform.toUpperCase() },
              { label: 'Seller', value: lot.seller?.name || 'Insurance Carrier' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-colors ${
                  theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-50 mb-1">
                  {item.label}
                </div>
                <div className="font-medium text-sm truncate" title={item.value}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SALE HISTORY SECTION */}
        <div className={`p-6 rounded-3xl border mb-14 ${
          theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="font-serif text-lg font-bold mb-2">Sale History</h3>
          <p className="text-xs font-mono opacity-60 mb-4">Latest auction observations and bidding updates recorded for this lot.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 opacity-60">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Event</th>
                  <th className="py-2.5">Current Bid</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Auction Yard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td className="py-3">{new Date(lot.auction.auction_date || Date.now()).toLocaleDateString()}</td>
                  <td className="py-3">Auction Scheduled / Lane Observation</td>
                  <td className="py-3 font-bold text-[#2B59FF]">${(lot.pricing.current_bid || 0).toLocaleString()} USD</td>
                  <td className="py-3 text-emerald-500 font-bold">{lot.auction.status || 'Active'}</td>
                  <td className="py-3">{lot.location.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RELATED / SIMILAR VEHICLES */}
        {relatedLots.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">
                  Similar Auction Vehicles
                </h2>
                <p className="text-xs font-mono opacity-60">
                  Other {lot.make} vehicles available for bidding across Copart & IAAI.
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
              {relatedLots.map((rel) => {
                const photo = rel.media.photo?.[0] || 'https://images.unsplash.com/photo-1590362891988-f7780479c656?w=600';
                const relUrl = getAuctionLotUrl(rel);

                return (
                  <div
                    key={rel.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between ${
                      theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="aspect-[16/10] bg-slate-950 overflow-hidden relative">
                      <Link to={relUrl}>
                        <img src={photo} alt={rel.title} className="w-full h-full object-cover" loading="lazy" />
                      </Link>
                      <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded text-white ${
                        rel.platform === 'copart' ? 'bg-blue-600' : 'bg-red-600'
                      }`}>
                        {rel.platform.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-sm truncate mb-1">
                          <Link to={relUrl} className="hover:text-[#2B59FF]">
                            {rel.title}
                          </Link>
                        </h4>
                        <p className="text-[11px] font-mono opacity-60 mb-2 truncate">
                          {rel.location.city}, {rel.location.state}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono uppercase opacity-50 block">Current Bid</span>
                          <span className="font-bold text-sm text-[#2B59FF]">
                            ${(rel.pricing.current_bid || 0).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={relUrl}
                          className="px-3 py-1.5 bg-[#2B59FF] text-white text-[11px] font-bold uppercase rounded-lg"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-5xl w-full h-[75vh] flex items-center justify-center">
            <img
              src={activePhoto}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain"
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-xs font-mono text-white/70">
            Photo {selectedPhotoIndex + 1} of {photos.length} • Press Esc or Close to exit
          </div>
        </div>
      )}
    </div>
  );
}
