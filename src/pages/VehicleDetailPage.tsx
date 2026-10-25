import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface PaymentPlannerProps {
  fullPrice: number;
  initialDeposit: string;
  theme: string;
  isCanadaUSA?: boolean;
}

function PaymentPlanner({ fullPrice, initialDeposit, theme, isCanadaUSA = false }: PaymentPlannerProps) {
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
    <div className={`p-6 rounded-3xl border mb-6 transition-all ${
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
    </div>
  );
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { vehicles, getVehicleById } = useInventory();

  const vehicle = id ? getVehicleById(id) : undefined;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sourcingModalOpen, setSourcingModalOpen] = useState(false);

  const isOverseas = vehicle?.location === 'Canada & USA';

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

  const galleryImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [vehicle.image];

  const currentImage = galleryImages[activeImageIndex] || vehicle.image;

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
          {/* Left Column (7 cols): Photo Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Featured Image Display */}
            <div className={`aspect-[16/10] w-full rounded-3xl overflow-hidden relative border shadow-lg bg-black ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <img
                src={currentImage}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
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

              {/* Gallery Image Count Badge (Pill at bottom-right) */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 border border-white/20 shadow-md pointer-events-none z-10">
                <span>{activeImageIndex + 1}/{galleryImages.length}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#2B59FF] ring-2 ring-[#2B59FF]/30 scale-102'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
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

              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">
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
                    <img src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#2B59FF] text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      {rel.location === "Canada & USA" ? "Located Overseas" : rel.condition}
                    </span>
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
    </div>
  );
}
