import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Search, SlidersHorizontal, ShieldCheck, MapPin, CheckCircle2, RotateCcw, MessageSquare, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { getVehicleUrl } from "../data/inventory";
import { useTheme } from "../context/ThemeContext";
import { CONTACT_INFO } from "../constants";

export default function VehicleCatalogue() {
  const { theme } = useTheme();
  const { vehicles, inStockCount, minPriceFormatted } = useInventory();

  // Filter state for available cars
  const [filterLocation, setFilterLocation] = useState<string>("All Locations");
  const [filterMake, setFilterMake] = useState("All");
  const [filterBody, setFilterBody] = useState("All");
  const [filterBudget, setFilterBudget] = useState("100000000");
  const [searchKeyword, setSearchKeyword] = useState("");

  const makes = useMemo(() => ["All", ...Array.from(new Set(vehicles.map(v => v.make)))], [vehicles]);
  const bodyTypes = useMemo(() => ["All", ...Array.from(new Set(vehicles.map(v => v.bodyType)))], [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = searchKeyword.toLowerCase().trim();
      const matchesKeyword = !q ||
                             v.name.toLowerCase().includes(q) ||
                             (v.specs && v.specs.toLowerCase().includes(q)) ||
                             v.make.toLowerCase().includes(q) ||
                             v.model.toLowerCase().includes(q) ||
                             (v.vin && v.vin.toLowerCase().includes(q)) ||
                             (v.location && v.location.toLowerCase().includes(q)) ||
                             (v.currentLocation && v.currentLocation.toLowerCase().includes(q));
      const matchesLocation = !filterLocation || filterLocation === "All Locations" || v.location === filterLocation;
      const matchesMake = filterMake === "All" || v.make.toLowerCase() === filterMake.toLowerCase();
      const matchesBody = filterBody === "All" || v.bodyType.toLowerCase() === filterBody.toLowerCase();
      const matchesBudget = v.numericPrice <= Number(filterBudget);

      return matchesKeyword && matchesLocation && matchesMake && matchesBody && matchesBudget;
    });
  }, [vehicles, filterLocation, filterMake, filterBody, filterBudget, searchKeyword]);

  const resetFilters = () => {
    setFilterLocation("All Locations");
    setFilterMake("All");
    setFilterBody("All");
    setFilterBudget("100000000");
    setSearchKeyword("");
  };

  // Carousel refs & state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);

  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isTouchedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Check overflow / container resize
  const checkOverflow = () => {
    if (!carouselRef.current) return;
    const { scrollWidth, clientWidth } = carouselRef.current;
    setHasOverflow(scrollWidth > clientWidth + 8);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkOverflow();
    const ro = new ResizeObserver(() => {
      checkOverflow();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [filteredVehicles]);

  // Tab visibility
  useEffect(() => {
    const handleVis = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // Viewport intersection observer (threshold ~0.4)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause helper: pause auto-sliding and resume after 5s of inactivity
  const pauseTemporarily = () => {
    setIsUserPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isFocusedRef.current && !isTouchedRef.current && !isDraggingRef.current) {
        setIsUserPaused(false);
      }
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const getCardStep = () => {
    if (!carouselRef.current) return 300;
    const children = carouselRef.current.children;
    if (children.length > 1) {
      const first = children[0] as HTMLElement;
      const second = children[1] as HTMLElement;
      const diff = second.offsetLeft - first.offsetLeft;
      if (diff > 0) return diff;
    }
    const first = children[0] as HTMLElement;
    return first ? first.offsetWidth + 32 : 300;
  };

  const slideNext = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 15) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      const step = getCardStep();
      el.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const slidePrev = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft <= 15) {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      const step = getCardStep();
      el.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const handleManualNav = (dir: 'prev' | 'next') => {
    pauseTemporarily();
    if (dir === 'next') {
      slideNext();
    } else {
      slidePrev();
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isInView || !isTabVisible || isUserPaused || reducedMotion || !hasOverflow) {
      return;
    }

    const interval = setInterval(() => {
      slideNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isInView, isTabVisible, isUserPaused, reducedMotion, hasOverflow, filteredVehicles]);

  // Event handlers for pause, touch, drag and keyboard
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsUserPaused(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    pauseTemporarily();
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    setIsUserPaused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (carouselRef.current?.contains(e.relatedTarget as Node)) return;
    isFocusedRef.current = false;
    pauseTemporarily();
  };

  const handleTouchStart = () => {
    isTouchedRef.current = true;
    setIsUserPaused(true);
  };

  const handleTouchEnd = () => {
    isTouchedRef.current = false;
    pauseTemporarily();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    pauseTemporarily();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    const deltaX = e.pageX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      dragMovedRef.current = true;
      carouselRef.current.scrollLeft = scrollLeftRef.current - deltaX;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (dragMovedRef.current) {
      setTimeout(() => {
        dragMovedRef.current = false;
      }, 100);
    }
    pauseTemporarily();
  };

  const handleCardClickCapture = (e: React.MouseEvent) => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleManualNav('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleManualNav('prev');
    }
  };

  return (
    <section
      id="catalogue"
      className={`relative pt-14 pb-12 px-6 md:px-12 transition-colors duration-500 overflow-hidden ${
        theme === "dark" ? "bg-[#090909] text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* Background Graphic Elements */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden transition-opacity ${
        theme === "dark" ? "opacity-[0.03] text-white" : "opacity-[0.03] text-slate-900"
      }`}>
        <div className="absolute top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-10deg] whitespace-nowrap">
          LAGOS STOCK
        </div>
        <div className="absolute bottom-10 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          ON GROUND
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Lagos Inspection Copy */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="max-w-3xl">
            <div className={`hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 font-bold text-xs rounded-full uppercase tracking-wider mb-4 font-mono shadow-sm border transition-colors ${
              theme === "dark"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-emerald-50 border-emerald-300 text-emerald-800"
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${theme === "dark" ? "bg-emerald-400" : "bg-emerald-600"}`} />
              <span>Available For Inspection Now in Lagos, Nigeria</span>
            </div>
            
            <h1 className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-4 transition-colors ${
              theme === "dark" ? "text-white" : "text-slate-950"
            }`}>
              Leeautox Cars For Sale
            </h1>
            
            <p className={`text-sm sm:text-base font-light leading-relaxed max-w-2xl transition-colors ${
              theme === "dark" ? "text-white/75" : "text-slate-600"
            }`}>
              Beyond auction sourcing, we also <strong className={theme === "dark" ? "text-white font-semibold" : "text-slate-900 font-semibold"}>own vehicles in our inventory</strong> — available <strong className={theme === "dark" ? "text-white font-semibold" : "text-slate-900 font-semibold"}>physically in Lagos and across Canada & USA</strong>. Contact us today for direct inspection, local pickup, or fast overseas delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href="https://wa.me/16473896162?text=Hello%20LeeAutoX!%20I%20want%20to%20book%20a%20physical%20inspection%20for%20a%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <MessageSquare size={16} /> Book Inspection
            </a>
          </div>
        </div>

        {/* Working Search & Filter Controls */}
        <div className={`p-6 rounded-3xl border mb-12 backdrop-blur-xl shadow-xl transition-colors ${
          theme === "dark"
            ? "bg-white/5 border-white/15 shadow-black/40"
            : "bg-slate-50 border-slate-200 shadow-slate-200/50"
        }`}>
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search Input - reduced width on desktop and tablet to accommodate location dropdown */}
            <div className="relative w-full lg:flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                theme === "dark" ? "text-white/50" : "text-slate-400"
              }`} size={16} />
              <input
                type="text"
                placeholder="Search available stock by make, model, or specs..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl border transition-colors focus:outline-none focus:border-[#2B59FF] ${
                  theme === "dark"
                    ? "border-white/20 bg-black/60 text-white placeholder-white/40"
                    : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            {/* Location Dropdown with MapPin SVG (Desktop and Tablet in same row) */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="relative flex items-center">
                <MapPin size={16} className={`absolute left-3.5 pointer-events-none z-10 ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`} />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className={`pl-9 pr-4 py-3 text-xs rounded-xl border transition-colors focus:outline-none focus:border-[#2B59FF] cursor-pointer font-medium ${
                    theme === "dark"
                      ? "border-white/20 bg-black/80 text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  }`}
                >
                  <option value="All Locations" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>All Locations</option>
                  <option value="Nigeria" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Nigeria</option>
                  <option value="Canada & USA" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Canada & USA</option>
                </select>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className={`px-4 py-3 text-xs rounded-xl border transition-colors focus:outline-none focus:border-[#2B59FF] cursor-pointer ${
                  theme === "dark"
                    ? "border-white/20 bg-black/80 text-white"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                {makes.map(m => (
                  <option key={m} value={m} className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>
                    Make: {m}
                  </option>
                ))}
              </select>

              <select
                value={filterBody}
                onChange={(e) => setFilterBody(e.target.value)}
                className={`px-4 py-3 text-xs rounded-xl border transition-colors focus:outline-none focus:border-[#2B59FF] cursor-pointer ${
                  theme === "dark"
                    ? "border-white/20 bg-black/80 text-white"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                {bodyTypes.map(b => (
                  <option key={b} value={b} className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>
                    Body: {b}
                  </option>
                ))}
              </select>

              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className={`px-4 py-3 text-xs rounded-xl border transition-colors focus:outline-none focus:border-[#2B59FF] cursor-pointer ${
                  theme === "dark"
                    ? "border-white/20 bg-black/80 text-white"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <option value="100000000" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Max Budget: Any</option>
                <option value="20000000" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Under ₦20M</option>
                <option value="35000000" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Under ₦35M</option>
                <option value="50000000" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Under ₦50M</option>
                <option value="70000000" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Under ₦70M</option>
              </select>
            </div>

            {/* Mobile-only Location Dropdown (stacks below existing dropdowns) */}
            <div className="sm:hidden relative flex items-center w-full">
              <MapPin size={16} className={`absolute left-3.5 pointer-events-none z-10 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`} />
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className={`w-full pl-9 pr-4 py-3 text-xs rounded-xl border transition-colors focus:outline-none focus:border-[#2B59FF] cursor-pointer font-medium ${
                  theme === "dark"
                    ? "border-white/20 bg-black/80 text-white"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <option value="All Locations" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>All Locations</option>
                <option value="Nigeria" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Nigeria</option>
                <option value="Canada & USA" className={theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-slate-900"}>Canada & USA</option>
              </select>
            </div>
          </div>

          <div className={`flex items-center justify-between mt-4 pt-3 border-t text-xs transition-colors ${
            theme === "dark" ? "border-white/10 text-white/60" : "border-slate-200 text-slate-500"
          }`}>
            <span className="font-mono">
              Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length} cars {filterLocation === "All Locations" ? "across All Locations" : `in ${filterLocation}`}
            </span>
            {(filterLocation !== "All Locations" || filterMake !== "All" || filterBody !== "All" || filterBudget !== "100000000" || searchKeyword.trim()) && (
              <button
                type="button"
                onClick={resetFilters}
                className={`inline-flex items-center gap-1.5 font-mono font-bold active:scale-[0.98] cursor-pointer transition-colors ${
                  theme === "dark" ? "text-emerald-400 hover:text-white" : "text-emerald-600 hover:text-emerald-800"
                }`}
              >
                <RotateCcw size={13} /> Reset Active Filters
              </button>
            )}
          </div>
        </div>

        {/* Navigation Buttons Row — Placed at TOP RIGHT directly above the card carousel */}
        {hasOverflow && filteredVehicles.length > 0 && (
          <div className="flex items-center justify-end gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleManualNav('prev')}
              aria-label="Previous cars"
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF] ${
                theme === 'dark'
                  ? 'border-white/20 bg-white/5 hover:bg-white/15 text-white active:bg-white/25'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm active:bg-slate-200'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleManualNav('next')}
              aria-label="Next cars"
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF] ${
                theme === 'dark'
                  ? 'border-white/20 bg-white/5 hover:bg-white/15 text-white active:bg-white/25'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm active:bg-slate-200'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Cars for Sale Carousel / Empty State */}
        {filteredVehicles.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 border rounded-3xl p-8 text-center transition-colors ${
            theme === "dark"
              ? "text-white/60 bg-white/5 border-white/10"
              : "text-slate-600 bg-slate-50 border-slate-200"
          }`}>
            <Car size={44} className="text-[#2B59FF] mb-3 opacity-80" />
            <h3 className={`font-serif text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              No Matching Cars on Ground in Lagos
            </h3>
            <p className={`text-xs font-mono max-w-md mb-6 ${theme === "dark" ? "text-white/60" : "text-slate-500"}`}>
              No vehicles matched your current filter criteria. You can clear filters to see all available inventory, or pre-order directly from Canadian auctions.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            ref={carouselRef}
            tabIndex={0}
            role="region"
            aria-label="Cars for sale carousel"
            onKeyDown={handleKeyDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex flex-row overflow-x-auto gap-8 pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF]/50"
          >
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClickCapture={handleCardClickCapture}
                className={`w-[84vw] max-w-[320px] md:max-w-none md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)] shrink-0 snap-start rounded-3xl border group overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-black border-white/10 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-black/60"
                    : "bg-white border-slate-200 shadow-sm hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-200"
                }`}
              >
                <div>
                  {/* Real Image Container */}
                  <div className="aspect-[4/3] overflow-hidden relative bg-black">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Location & Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="bg-emerald-600 text-white text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-md shadow-md flex items-center gap-1">
                        <MapPin size={10} /> {vehicle.location === "Canada & USA" ? "Overseas" : "Lagos"}
                      </span>
                      <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                        {vehicle.condition}
                      </span>
                    </div>

                    {/* Gallery Image Count Badge (Pill at bottom-right) */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 border border-white/20 shadow-sm pointer-events-none z-10">
                      <span>1/{vehicle.images && vehicle.images.length > 0 ? vehicle.images.length : 1}</span>
                    </div>

                    {vehicle.status !== "Available" && (
                      <div className={`absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-md shadow-md ${
                        vehicle.status === "Reserved" ? "bg-amber-500 text-black" : "bg-red-600 text-white"
                      }`}>
                        {vehicle.status}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className={`text-[11px] font-mono mb-1 flex items-center justify-between transition-colors ${
                      theme === "dark" ? "text-white/50" : "text-slate-500"
                    }`}>
                      <span>{vehicle.year} • {vehicle.make}</span>
                      <span>{vehicle.mileage}</span>
                    </div>

                    <h3 className={`font-serif text-lg font-bold mb-2 truncate transition-colors ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`} title={vehicle.name}>
                      {vehicle.name}
                    </h3>

                    {/* Feature tags line replaced with reserve deposit price for Canada & USA */}
                    <p className={`text-xs mb-4 font-mono line-clamp-2 transition-colors ${
                      theme === "dark" ? "text-white/60" : "text-slate-600"
                    }`}>
                      {vehicle.location === "Canada & USA" ? (
                        <span className="text-emerald-500 font-semibold">
                          Reserve Deposit: {vehicle.deposit || '₦10,000 min'}
                        </span>
                      ) : (
                        vehicle.specs
                      )}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Price and View CTA */}
                <div className={`p-5 pt-0 flex items-center justify-between border-t mt-auto transition-colors ${
                  theme === "dark" ? "border-white/10" : "border-slate-100"
                }`}>
                  <div>
                    <span className={`text-[10px] font-mono uppercase block ${
                      theme === "dark" ? "text-white/50" : "text-slate-400"
                    }`}>Price</span>
                    <span className={`font-bold text-base tracking-tight font-serif ${
                      theme === "dark" ? "text-[#2B59FF]" : "text-blue-600"
                    }`}>
                      {vehicle.price}
                    </span>
                  </div>

                  <Link
                    to={getVehicleUrl(vehicle)}
                    className="px-4 py-2 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                  >
                    View Vehicle <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Full Catalogue CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/inventory"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(43,89,255,0.4)]"
          >
            Shop Available Cars <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
