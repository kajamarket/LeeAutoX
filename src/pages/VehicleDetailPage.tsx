import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { getVehicleSlug, getVehicleUrl } from '../data/inventory';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO } from '../constants';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle, 
  MessageSquare, 
  HelpCircle, 
  Share2, 
  Check, 
  MapPin, 
  Truck, 
  Calendar, 
  Gauge, 
  Fuel, 
  Car,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Compass,
  Image as ImageIcon
} from 'lucide-react';
import SoldWatermark from '../components/SoldWatermark';
import Icon360 from '../components/Icon360';
import { extractPanoeeUrl } from '../utils/panoee';
import { downloadImage } from '../utils/downloadImage';

interface PaymentPlannerProps {
  fullPrice: number;
  initialDeposit: string;
  theme: string;
  isCanadaUSA?: boolean;
  isSold?: boolean;
}

function PaymentPlanner({ fullPrice, initialDeposit, theme, isCanadaUSA = false, isSold = false }: PaymentPlannerProps) {
  // Parse initial numeric deposit or default to 30% of fullPrice
  const parsedDefault = useMemo(() => {
    const raw = Number(String(initialDeposit).replace(/[^0-9]/g, ''));
    return raw > 0 && raw < fullPrice ? raw : Math.round(fullPrice * 0.3);
  }, [initialDeposit, fullPrice]);

  const [depositAmount, setDepositAmount] = useState<number>(parsedDefault);
  const [selectedSplits, setSelectedSplits] = useState<number>(1);
  const [isEditingDeposit, setIsEditingDeposit] = useState<boolean>(false);
  const [depositInput, setDepositInput] = useState<string>(String(parsedDefault));
  const [hasError, setHasError] = useState<boolean>(false);

  // Currency formatting utility with comma thousand-separators and ₦ symbol prefix
  const formatNaira = (val: number): string => {
    if (isNaN(val) || !isFinite(val)) return '₦0';
    return `₦${Math.round(val).toLocaleString('en-US')}`;
  };

  // Core Mathematical Mechanics
  const balanceAfterDeposit = Math.max(0, fullPrice - depositAmount);
  const installmentAmount = selectedSplits > 0 ? balanceAfterDeposit / selectedSplits : balanceAfterDeposit;

  // Constraint: minimum installment amount is ₦10,000
  const MIN_INSTALLMENT = 10000;
  const isInvalid = installmentAmount < MIN_INSTALLMENT || balanceAfterDeposit < MIN_INSTALLMENT;

  // Check split availability (disable if balance / s < 10,000)
  const isSplitAvailable = (s: number) => {
    if (s <= 0) return false;
    return (balanceAfterDeposit / s) >= MIN_INSTALLMENT;
  };

  // Handlers for deposit changes
  const handleDepositChange = (newVal: number) => {
    if (isNaN(newVal) || newVal < 0) return;
    const prospectiveBalance = Math.max(0, fullPrice - newVal);
    const prospectiveInstallment = prospectiveBalance / selectedSplits;
    if (prospectiveInstallment < MIN_INSTALLMENT) {
      setHasError(true);
    } else {
      setHasError(false);
    }
    setDepositAmount(newVal);
    setDepositInput(String(newVal));
  };

  const handleDepositSubmit = () => {
    const parsed = Number(depositInput.replace(/[^0-9]/g, ''));
    if (!isNaN(parsed) && parsed > 0 && parsed <= fullPrice) {
      const prospectiveBalance = Math.max(0, fullPrice - parsed);
      const prospectiveInstallment = prospectiveBalance / selectedSplits;
      if (prospectiveInstallment < MIN_INSTALLMENT) {
        setHasError(true);
      } else {
        setHasError(false);
      }
      setDepositAmount(parsed);
    } else {
      setDepositInput(String(depositAmount));
    }
    setIsEditingDeposit(false);
  };

  // Auto-adjust selectedSplits if currently chosen split becomes invalid
  useEffect(() => {
    if (!isSplitAvailable(selectedSplits) && selectedSplits > 1) {
      for (let s = selectedSplits - 1; s >= 1; s--) {
        if (isSplitAvailable(s)) {
          setSelectedSplits(s);
          setHasError(false);
          return;
        }
      }
      setSelectedSplits(1);
    }
  }, [balanceAfterDeposit, selectedSplits]);

  return (
    <div className={`p-6 rounded-3xl border mb-6 transition-all relative overflow-hidden ${
      theme === 'dark' ? 'bg-[#181818] border-zinc-800' : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Target 2: Metadata display field for static full price */}
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-zinc-400 font-medium">
          Full Price (Static)
        </span>
        <span className="text-2xl sm:text-3xl font-bold font-serif text-[#2B59FF]">
          {formatNaira(fullPrice)}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-200/20 dark:border-zinc-800 space-y-3">
        {/* Target 1: Display field for active deposit value */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-zinc-300 font-mono font-medium">Active Deposit:</span>
            {!isEditingDeposit && (
              <button
                type="button"
                onClick={() => setIsEditingDeposit(true)}
                className="text-[10px] text-[#2B59FF] hover:underline cursor-pointer font-mono"
              >
                ({isCanadaUSA ? 'Change' : 'Customise'})
              </button>
            )}
          </div>
          {!isEditingDeposit ? (
            <span className="font-mono font-bold text-emerald-500 text-sm">
              {formatNaira(depositAmount)}
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={depositInput}
                onChange={(e) => setDepositInput(e.target.value)}
                onBlur={handleDepositSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleDepositSubmit()}
                autoFocus
                className="w-28 px-2 py-1 text-xs rounded bg-black/60 border border-[#2B59FF] text-white font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={handleDepositSubmit}
                className="px-2 py-1 bg-[#2B59FF] text-white text-[10px] rounded font-mono font-bold cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Deposit Quick Adjustment Slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={10000}
            max={Math.max(10000, fullPrice - 10000)}
            step={50000}
            value={depositAmount}
            onChange={(e) => handleDepositChange(Number(e.target.value))}
            className="w-full accent-[#2B59FF] cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg"
          />
        </div>

        {/* Target 3: Calculated display field for remaining balance */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200/20 dark:border-zinc-800 text-xs">
          <span className="text-slate-600 dark:text-zinc-300 font-mono font-medium">
            Calculated Remaining Balance:
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {formatNaira(balanceAfterDeposit)}
          </span>
        </div>

        {/* Target 4: 4-way toggle option array (1, 2, 3, 4) for active split configuration */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-zinc-400 font-medium">
              Payment Splits:
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              Min. ₦10,000 / split
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((split) => {
              const available = isSplitAvailable(split);
              const isSelected = selectedSplits === split;

              return (
                <button
                  key={split}
                  type="button"
                  disabled={!available}
                  onClick={() => {
                    if (available) {
                      setSelectedSplits(split);
                      setHasError(false);
                    }
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2B59FF] text-white border-[#2B59FF] shadow-md shadow-[#2B59FF]/20 scale-[1.02]'
                      : available
                      ? theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white hover:border-[#2B59FF]/50 hover:bg-white/10'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#2B59FF]/50 hover:bg-white'
                      : 'opacity-30 cursor-not-allowed border-dashed bg-black/20 text-slate-500'
                  }`}
                >
                  <div>{split} {split === 1 ? 'Stage' : 'Stages'}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {available ? formatNaira(balanceAfterDeposit / split) : 'Locked'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Warning visual cues when constraint is reached */}
        {(hasError || isInvalid) && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-amber-400" />
            <span>Installment amount cannot fall below ₦10,000 minimum.</span>
          </div>
        )}

        {/* Target 5: Prominent callout output for single installment amount */}
        <div className="mt-4 p-4 rounded-2xl bg-[#2B59FF]/10 border border-[#2B59FF]/25 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#2B59FF] font-bold block mb-1">
            {selectedSplits === 1 ? 'Single Installment Amount' : `Installment Amount (${selectedSplits} Equal Splits)`}
          </span>
          <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2B59FF]">
            {formatNaira(installmentAmount)}
            <span className="text-xs font-mono font-normal opacity-70 ml-1 text-slate-600 dark:text-zinc-300">
              / installment
            </span>
          </div>
          <p className="text-[11px] font-light mt-1.5 opacity-80 text-slate-600 dark:text-zinc-300">
            Shipped upon deposit confirmation. Balance spread across container shipping and port clearing.
          </p>
        </div>
      </div>

      {/* Frosted glass overlay for sold vehicles */}
      {isSold && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 dark:bg-black/55 backdrop-blur-[3.5px] rounded-3xl select-none cursor-not-allowed"
          aria-hidden="true"
        >
          <div
            className="transform rotate-[14deg] font-serif font-black tracking-[0.28em] text-white uppercase px-8 sm:px-10 py-2 sm:py-2.5 bg-black/40 backdrop-blur-[2px] border-y border-white/35 shadow-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] text-xl sm:text-2xl"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)',
            }}
          >
            SOLD
          </div>
        </div>
      )}
    </div>
  );
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { vehicles, getVehicleById } = useInventory();

  const vehicle = id ? getVehicleById(id) : undefined;
  const [copied, setCopied] = useState(false);
  const [sourcingModalOpen, setSourcingModalOpen] = useState(false);

  const isOverseas = vehicle?.location === 'Canada & USA';
  const isSold = vehicle?.status?.toLowerCase() === 'sold';

  // Task 1 & 2: Panoee 360 Virtual Tour URLs
  const exterior360Url = useMemo(() => extractPanoeeUrl(vehicle?.['360degree']?.exterior), [vehicle]);
  const interior360Url = useMemo(() => extractPanoeeUrl(vehicle?.['360degree']?.interior), [vehicle]);
  const has360 = Boolean(exterior360Url || interior360Url);

  const galleryImages = useMemo(() => {
    if (!vehicle) return [];
    return vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image];
  }, [vehicle]);

  type SlideItem =
    | { type: '360-exterior'; url: string; label: string }
    | { type: '360-interior'; url: string; label: string }
    | { type: 'photo'; url: string; photoIndex: number; label: string };

  // Unified sequence: Exterior 360 -> Interior 360 -> Photos
  const slideItems = useMemo<SlideItem[]>(() => {
    const items: SlideItem[] = [];
    if (exterior360Url) {
      items.push({ type: '360-exterior', url: exterior360Url, label: 'Exterior 360' });
    }
    if (interior360Url) {
      items.push({ type: '360-interior', url: interior360Url, label: 'Interior 360' });
    }
    galleryImages.forEach((img, idx) => {
      items.push({ type: 'photo', url: img, photoIndex: idx, label: `Photo ${idx + 1}` });
    });
    return items;
  }, [exterior360Url, interior360Url, galleryImages]);

  // Default to first photo on load for fast critical paint without heavy iframe loading
  const firstPhotoIndex = useMemo(() => {
    const idx = slideItems.findIndex((s) => s.type === 'photo');
    return idx >= 0 ? idx : 0;
  }, [slideItems]);

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  useEffect(() => {
    setActiveSlideIndex(firstPhotoIndex);
  }, [firstPhotoIndex, vehicle?.id]);

  // 360 Viewer lazy-preloading & mounting states
  const [preloadExterior, setPreloadExterior] = useState(false);
  const [preloadInterior, setPreloadInterior] = useState(false);
  const [extLoaded, setExtLoaded] = useState(false);
  const [intLoaded, setIntLoaded] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);

  // Lightbox overlay state (photos only)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Mobile touch swipe state for prominent card
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Lazy-prepare exterior iframe in background when browser is idle (respecting connection.saveData)
  useEffect(() => {
    if (!exterior360Url) return;
    const connection = (navigator as any).connection;
    if (connection?.saveData) return;

    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(() => {
        setPreloadExterior(true);
      }, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => {
        setPreloadExterior(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [exterior360Url]);

  // Auto-hide 360 drag hint after 3.5s
  useEffect(() => {
    const current = slideItems[activeSlideIndex];
    if (current && (current.type === '360-exterior' || current.type === '360-interior')) {
      setShowDragHint(true);
      const timer = setTimeout(() => {
        setShowDragHint(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeSlideIndex, slideItems]);

  // Lock body scroll while lightbox is open and restore focus on close
  useEffect(() => {
    if (isLightboxOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
        lightboxTriggerRef.current?.focus();
      };
    }
  }, [isLightboxOpen]);

  // Task 4: Cyclical Slider Navigation
  const goToPrevSlide = () => {
    if (slideItems.length <= 1) return;
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slideItems.length - 1));
  };

  const goToNextSlide = () => {
    if (slideItems.length <= 1) return;
    setActiveSlideIndex((prev) => (prev < slideItems.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        } else if (e.key === 'ArrowLeft') {
          setLightboxPhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
        } else if (e.key === 'ArrowRight') {
          setLightboxPhotoIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
        }
        return;
      }

      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, slideItems.length, galleryImages.length]);

  // Touch Swipe on Prominent Card
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  useEffect(() => {
    if (vehicle) {
      const pageTitle = isOverseas
        ? `${vehicle.year} ${vehicle.make} ${vehicle.model} For Sale | Canada & USA Sourcing | LeeAutoX`
        : `${vehicle.year} ${vehicle.make} ${vehicle.model} For Sale | Lagos Nigeria Import | LeeAutoX`;
      const metaDescription = isOverseas
        ? `Buy verified ${vehicle.year} ${vehicle.make} ${vehicle.model} located in ${vehicle.currentLocation || 'Canada & USA'}. Shipped to Nigeria upon your request once deposit is made.`
        : `Buy verified ${vehicle.year} ${vehicle.make} ${vehicle.model} on ground in Lagos, Nigeria. Fully customs cleared, 100% duty paid, available for physical inspection and test drive.`;
      const canonicalUrl = `https://leeautox.com${getVehicleUrl(vehicle)}`;

      document.title = pageTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', metaDescription);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }
  }, [vehicle, isOverseas]);

  if (vehicle && id && id.toLowerCase() !== getVehicleSlug(vehicle).toLowerCase()) {
    return <Navigate to={getVehicleUrl(vehicle)} replace />;
  }

  if (!vehicle) {
    return (
      <div className={`min-h-screen pt-36 pb-20 px-6 text-center transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#FAFBFD] text-slate-900'
      }`}>
        <div className="max-w-md mx-auto">
          <Car size={48} className="mx-auto text-[#2B59FF] mb-4 opacity-75" />
          <h1 className="font-serif text-3xl font-bold mb-3">Vehicle Not Found</h1>
          <p className="text-sm opacity-70 mb-6">
            The vehicle you are looking for may have been sold or removed from the active catalogue.
          </p>
          <Link
            to="/inventory"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const activeSlide = slideItems[activeSlideIndex] || slideItems[0];
  const activePhotoIndex = activeSlide?.type === 'photo' ? activeSlide.photoIndex : 0;
  const currentPhotoUrl = galleryImages[activePhotoIndex] || vehicle.image;

  const relatedVehicles = vehicles
    .filter(v => String(v.id) !== String(vehicle.id) && (v.bodyType === vehicle.bodyType || v.make === vehicle.make))
    .slice(0, 3);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    isOverseas
      ? `Hello LeeAutoX! I am inquiring about the ${vehicle.name} (Year: ${vehicle.year}, VIN: ${vehicle.vin || 'N/A'}, Price: ${vehicle.price}) located in ${vehicle.currentLocation || 'Canada & USA'}. I would like to make a deposit and arrange shipping to Nigeria.`
      : `Hello LeeAutoX! I am inquiring about the ${vehicle.name} (Year: ${vehicle.year}, VIN: ${vehicle.vin || 'N/A'}, Price: ${vehicle.price}) currently in Lagos. I would like to book a physical inspection and test drive.`
  );

  return (
    <div className={`min-h-screen pt-32 pb-24 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#FAFBFD] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/20">
          <Link
            to="/inventory"
            className="group inline-flex items-center gap-2 text-sm font-semibold opacity-70 hover:opacity-100 hover:text-[#2B59FF] transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to All Inventory
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 ${
                theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share Vehicle'}</span>
            </button>
            <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-[#2B59FF]/15 text-[#2B59FF] font-bold">
              {isOverseas ? "Located Overseas" : vehicle.condition}
            </span>
          </div>
        </div>

        {/* Main Vehicle Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column (7 cols): Photo Gallery & 360 Viewer */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Featured Image & 360 Display Card */}
            <div
              className={`aspect-[16/10] w-full rounded-3xl overflow-hidden relative border shadow-lg bg-black ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-200'
              }`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Photo Display Layer */}
              <img
                src={currentPhotoUrl}
                alt={vehicle.name}
                onClick={() => {
                  if (activeSlide?.type === 'photo') {
                    setLightboxPhotoIndex(activePhotoIndex);
                    setIsLightboxOpen(true);
                  }
                }}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  activeSlide?.type === 'photo' ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
                }`}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('leeautox.com/cars/')) {
                    target.src = target.src.replace('https://leeautox.com/cars/', '/cars/');
                  }
                }}
              />

              {/* Task 3: 360 Exterior View Iframe Layer (Mounted & Persistent) */}
              {exterior360Url && (preloadExterior || activeSlide?.type === '360-exterior') && (
                <div
                  className={`absolute inset-0 z-10 w-full h-full bg-black transition-opacity duration-300 ${
                    activeSlide?.type === '360-exterior' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {!extLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-10">
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#2B59FF] animate-spin mb-2" />
                      <span className="text-xs font-mono text-zinc-400">Loading 360° Exterior Tour...</span>
                    </div>
                  )}
                  <iframe
                    src={exterior360Url}
                    title={`${vehicle.name} 360 Exterior Tour`}
                    loading="lazy"
                    allowFullScreen
                    allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
                    onLoad={() => setExtLoaded(true)}
                    className="w-full h-full border-0"
                    style={{ touchAction: 'pan-y' }}
                  />
                </div>
              )}

              {/* Task 3: 360 Interior View Iframe Layer (Mounted & Persistent) */}
              {interior360Url && (preloadInterior || activeSlide?.type === '360-interior') && (
                <div
                  className={`absolute inset-0 z-10 w-full h-full bg-black transition-opacity duration-300 ${
                    activeSlide?.type === '360-interior' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {!intLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-10">
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#2B59FF] animate-spin mb-2" />
                      <span className="text-xs font-mono text-zinc-400">Loading 360° Interior Tour...</span>
                    </div>
                  )}
                  <iframe
                    src={interior360Url}
                    title={`${vehicle.name} 360 Interior Tour`}
                    loading="lazy"
                    allowFullScreen
                    allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
                    onLoad={() => setIntLoaded(true)}
                    className="w-full h-full border-0"
                    style={{ touchAction: 'pan-y' }}
                  />
                </div>
              )}

              {/* Top Left Status Tags */}
              <div className="absolute top-4 left-4 flex gap-2 z-30 pointer-events-none">
                <span className="px-3 py-1 bg-[#2B59FF] text-white text-xs font-mono font-bold uppercase rounded-md shadow-md">
                  {isOverseas ? "Located Overseas" : vehicle.condition}
                </span>
                {vehicle.status !== 'Available' && (
                  <span className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-md shadow-md ${
                    vehicle.status === 'Reserved' ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
                  }`}>
                    {vehicle.status}
                  </span>
                )}
              </div>

              {/* Task 2: 360° Quick-Switch Button / Segmented Toggle */}
              {has360 && (
                <div className="absolute top-4 right-4 z-30 flex items-center bg-black/75 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg text-white">
                  {exterior360Url && interior360Url ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setPreloadExterior(true);
                          const extIdx = slideItems.findIndex((s) => s.type === '360-exterior');
                          if (extIdx >= 0) setActiveSlideIndex(extIdx);
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeSlide?.type === '360-exterior'
                            ? 'bg-[#2B59FF] text-white shadow-sm'
                            : 'hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <Icon360 size={14} />
                        <span>Exterior</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPreloadInterior(true);
                          const intIdx = slideItems.findIndex((s) => s.type === '360-interior');
                          if (intIdx >= 0) setActiveSlideIndex(intIdx);
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeSlide?.type === '360-interior'
                            ? 'bg-[#2B59FF] text-white shadow-sm'
                            : 'hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <Icon360 size={14} />
                        <span>Interior</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = slideItems.findIndex((s) => s.type.startsWith('360'));
                        if (idx >= 0) {
                          if (slideItems[idx].type === '360-exterior') setPreloadExterior(true);
                          if (slideItems[idx].type === '360-interior') setPreloadInterior(true);
                          setActiveSlideIndex(idx);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeSlide?.type.startsWith('360') ? 'bg-[#2B59FF] text-white' : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <Icon360 size={14} />
                      <span>360° Tour</span>
                    </button>
                  )}
                </div>
              )}

              {/* Task 3: Subtle One-time Drag Hint */}
              {showDragHint && (activeSlide?.type === '360-exterior' || activeSlide?.type === '360-interior') && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-mono flex items-center gap-2 border border-white/20 shadow-lg animate-pulse">
                  <Compass size={14} className="text-[#2B59FF]" />
                  <span>Drag to rotate 360°</span>
                </div>
              )}

              {/* Task 4: Prev and Next Slider Arrows */}
              {slideItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevSlide();
                    }}
                    aria-label="Previous slide"
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg active:scale-95"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextSlide();
                    }}
                    aria-label="Next slide"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Task 5: Restyled Gallery Image Count Button (Pill at bottom-right) */}
              <button
                ref={lightboxTriggerRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxPhotoIndex(activePhotoIndex);
                  setIsLightboxOpen(true);
                }}
                aria-label="Open photo gallery overlay"
                className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-[#2B59FF] backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider flex items-center gap-2 border border-white/20 shadow-lg cursor-pointer transition-all z-30"
              >
                <ImageIcon size={14} className="text-[#2B59FF]" />
                <span>
                  {activeSlide?.type === 'photo'
                    ? `${activePhotoIndex + 1}/${galleryImages.length}`
                    : `Photos (${galleryImages.length})`}
                </span>
              </button>

              {/* Sold Watermark Overlay */}
              {vehicle.status?.toLowerCase() === 'sold' && (
                <SoldWatermark size="hero" />
              )}
            </div>

            {/* Task 2: Thumbnail Strip (360 entries first, then photos) */}
            {slideItems.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {slideItems.map((item, idx) => {
                  const isActive = activeSlideIndex === idx;

                  if (item.type === '360-exterior' || item.type === '360-interior') {
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          if (item.type === '360-exterior') setPreloadExterior(true);
                          if (item.type === '360-interior') setPreloadInterior(true);
                          setActiveSlideIndex(idx);
                        }}
                        onMouseEnter={() => {
                          if (item.type === '360-exterior') setPreloadExterior(true);
                          if (item.type === '360-interior') setPreloadInterior(true);
                        }}
                        onFocus={() => {
                          if (item.type === '360-exterior') setPreloadExterior(true);
                          if (item.type === '360-interior') setPreloadInterior(true);
                        }}
                        className={`relative w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-zinc-900 flex flex-col items-center justify-center p-1 text-white group ${
                          isActive
                            ? 'border-[#2B59FF] ring-2 ring-[#2B59FF]/30 scale-102'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#2B59FF]/20 text-[#2B59FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon360 size={18} />
                        </div>
                        <span className="text-[10px] font-mono font-bold mt-1 text-white truncate max-w-full">
                          {item.label}
                        </span>
                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={`photo-${item.photoIndex}`}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`relative w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#2B59FF] ring-2 ring-[#2B59FF]/30 scale-102'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={`View ${item.photoIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('leeautox.com/cars/')) {
                            target.src = target.src.replace('https://leeautox.com/cars/', '/cars/');
                          }
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Verification Guarantee Card */}
            <div className={`p-6 rounded-2xl border flex items-start gap-4 mt-2 ${
              theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold mb-1">
                  {isOverseas ? 'LeeAutoX Overseas Sourcing Guarantee' : 'LeeAutoX Verified Status Guarantee'}
                </h4>
                <p className={`text-xs leading-relaxed font-light ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                  {isOverseas
                    ? "This vehicle is located in Canada & USA and will be containerized and shipped to Nigeria upon the owner's request once a deposit is made. Full title verification and pre-shipping inspection guaranteed."
                    : "Every vehicle displayed in our catalogue is currently available in Nigeria, with local availability confirmed."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Pricing, Specs & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">
                <span>{vehicle.year}</span>
                <span>•</span>
                <span>{vehicle.make}</span>
                <span>•</span>
                <span>{vehicle.bodyType}</span>
              </div>

              <h1 
                className={`font-serif text-3xl sm:text-4xl font-bold leading-tight mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}
                style={{ color: theme === 'dark' ? '#ffffff' : '#0a0a0a' }}
              >
                {vehicle.name}
              </h1>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-zinc-300 mb-6 font-medium">
                <MapPin size={14} className="text-[#2B59FF]" />
                <span>Current Location: {vehicle.currentLocation || vehicle.location}</span>
              </div>

              {/* Price & Deposit Box: Interactive Payment Planner for Canada & USA, Static for Nigeria */}
              {isOverseas ? (
                <PaymentPlanner
                  fullPrice={vehicle.numericPrice}
                  initialDeposit={vehicle.deposit}
                  theme={theme}
                  isCanadaUSA={isOverseas}
                  isSold={isSold}
                />
              ) : (
                <div className={`p-6 rounded-3xl border mb-6 ${
                  theme === 'dark' ? 'bg-[#181818] border-zinc-800' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-zinc-400 font-medium">Price</span>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-[#2B59FF]">{vehicle.price}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/20 dark:border-zinc-800 text-xs">
                    <span className="text-slate-600 dark:text-zinc-300 font-mono font-medium">Commitment Deposit:</span>
                    <span className="font-mono font-bold text-emerald-500">{vehicle.deposit}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                    <span>Balance terms:</span>
                    <span>Based on agreement</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                {/* Enquire on WhatsApp CTA pre-filled with vehicle details */}
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <MessageSquare size={18} />
                  Enquire on WhatsApp
                </a>

                {/* Request Sourcing Similar to This CTA */}
                <button
                  type="button"
                  onClick={() => setSourcingModalOpen(true)}
                  className={`w-full py-3.5 px-6 rounded-2xl border text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                      : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
                  }`}
                >
                  <Car size={16} />
                  Request Sourcing Similar to This
                </button>
              </div>
            </div>

            {/* Quick Sourcing Highlights */}
            <div className={`p-5 rounded-2xl border text-xs space-y-2.5 ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>
                  {isOverseas ? 'Vehicle located in Canada & USA — ready for export' : 'Vehicle available locally in Nigeria'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>
                  {isOverseas ? "Shipped directly to Nigeria upon owner's deposit confirmation" : 'Port cleared at Apapa / Tin Can Island'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>
                  {isOverseas ? 'Full vehicle identification, title verification and inspection report supplied' : 'Vehicle identification and documentation verification supplied'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Specifications Table */}
        <section className={`rounded-3xl border p-8 sm:p-12 mb-16 ${
          theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/20">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] block mb-1">
                Technical Blueprint
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Vehicle Specifications
              </h2>
            </div>
            <FileText size={24} className="opacity-40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Make</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.make}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Model</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.model}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Model Year</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.year}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Mileage / Odometer</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.mileage}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Transmission</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.transmission}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Fuel Type</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.fuelType}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Body Style</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.bodyType}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Exterior Colour</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.colour}</span>
            </div>
            {!isOverseas && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Condition Status</span>
                <span className="font-serif text-lg font-bold text-emerald-500">{vehicle.condition}</span>
              </div>
            )}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Vehicle VIN</span>
              <span className="font-mono text-sm font-bold tracking-wider text-slate-900 dark:text-zinc-100">{vehicle.vin || 'Available on request'}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 sm:col-span-2">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400 font-medium block mb-1">Hub Location</span>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">{vehicle.currentLocation || vehicle.location}</span>
            </div>
          </div>
        </section>

        {/* Related Vehicles Section */}
        {relatedVehicles.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] block mb-1">
                  Alternative Options
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                  Similar Vehicles in Stock
                </h3>
              </div>
              <Link to="/inventory" className="text-xs font-bold uppercase tracking-wider text-[#2B59FF] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedVehicles.map(rel => (
                <div
                  key={rel.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-black">
                    <img 
                      src={rel.image} 
                      alt={rel.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('leeautox.com/cars/')) {
                          target.src = target.src.replace('https://leeautox.com/cars/', '/cars/');
                        }
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-[#2B59FF] text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      {rel.location === "Canada & USA" ? "Located Overseas" : rel.condition}
                    </span>
                    {rel.status?.toLowerCase() === 'sold' && (
                      <SoldWatermark size="card" />
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold mb-1 truncate">{rel.name}</h4>
                      <p className="text-xs font-mono opacity-60 mb-3">{rel.specs}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/20 flex items-center justify-between">
                      <span className="text-[#2B59FF] font-bold text-base font-serif">{rel.price}</span>
                      <Link
                        to={getVehicleUrl(rel)}
                        className="px-3 py-1.5 bg-[#2B59FF] text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sourcing Modal */}
      {sourcingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`max-w-lg w-full rounded-3xl p-6 sm:p-8 border shadow-2xl relative ${
            theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-serif text-2xl font-bold mb-2">Request Similar Vehicle</h3>
            <p className="text-xs opacity-70 mb-6 font-mono">
              Vehicle reference: {vehicle.name} ({vehicle.year})
            </p>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Our Canadian desk bids directly on Copart and IAA auction yards. We can source the same make and model within your targeted year range and budget.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                  `Hello LeeAutoX! I am looking for a vehicle similar to ${vehicle.name} (Year: ${vehicle.year}, Make: ${vehicle.make}). Please share similar auction options and estimated landed prices.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Contact Desk on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setSourcingModalOpen(false)}
                className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASK 5: FULLSCREEN PHOTO GALLERY OVERLAY */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photo gallery"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div>
              <h4 className="font-serif text-lg font-bold">{vehicle.name}</h4>
              <p className="text-xs font-mono opacity-70">
                Photo {lightboxPhotoIndex + 1} of {galleryImages.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentUrl = galleryImages[lightboxPhotoIndex];
                  const filename = `${vehicle.year}-${vehicle.make}-${vehicle.model}-${lightboxPhotoIndex + 1}.jpg`
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-');
                  downloadImage(currentUrl, filename);
                }}
                aria-label="Download current photo"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                title="Download current photo"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close gallery"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <X size={14} />
                <span>Close [ESC]</span>
              </button>
            </div>
          </div>

          {/* Center Display Image with Arrows */}
          <div
            className="relative flex items-center justify-center flex-1 max-w-5xl mx-auto w-full my-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxPhotoIndex]}
              alt={`${vehicle.name} photo ${lightboxPhotoIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxPhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxPhotoIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip for Lightbox */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-5xl mx-auto w-full [scrollbar-width:thin]"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxPhotoIndex(idx);
                }}
                className={`relative w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === lightboxPhotoIndex
                    ? 'border-[#2B59FF] scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
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
