import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, MapPin, RotateCcw, MessageSquare, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { getVehicleUrl } from "../data/inventory";
import SoldWatermark from "./SoldWatermark";
import AnimatedText from "./ui/AnimatedText";
import Reveal from "./ui/Reveal";
import { RippleLink, LikeBurstButton } from "./ui/ImportedControls";
import { prefersReducedMotion } from "../motion/scrollEngine";

export default function VehicleCatalogue() {
  const { vehicles } = useInventory();

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

  const carouselRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [isUserPaused, setIsUserPaused] = useState(false);

  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isTouchedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const checkOverflow = () => {
    if (!carouselRef.current) return;
    const { scrollWidth, clientWidth } = carouselRef.current;
    setHasOverflow(scrollWidth > clientWidth + 8);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkOverflow();
    const ro = new ResizeObserver(() => checkOverflow());
    ro.observe(el);
    return () => ro.disconnect();
  }, [filteredVehicles]);

  useEffect(() => {
    const handleVis = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      el.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    } else {
      el.scrollBy({ left: getCardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const slidePrev = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft <= 15) {
      el.scrollTo({ left: maxScroll, behavior: reducedMotion ? 'auto' : 'smooth' });
    } else {
      el.scrollBy({ left: -getCardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleManualNav = (dir: 'prev' | 'next') => {
    pauseTemporarily();
    if (dir === 'next') slideNext();
    else slidePrev();
  };

  useEffect(() => {
    if (!isInView || !isTabVisible || isUserPaused || reducedMotion || !hasOverflow) return;
    const interval = setInterval(() => slideNext(), 3500);
    return () => clearInterval(interval);
  }, [isInView, isTabVisible, isUserPaused, reducedMotion, hasOverflow, filteredVehicles]);

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
      setTimeout(() => { dragMovedRef.current = false; }, 100);
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
      className="lx-band-white relative pt-16 pb-14 px-4 sm:px-6 md:px-12 border-t border-[var(--line)] transition-colors duration-500 overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-grid absolute inset-0 opacity-35" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 15% 15%, var(--accent-soft) 0%, transparent 70%)',
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <Reveal variant="rise">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
            <div className="max-w-3xl">
              <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 font-mono font-bold text-xs rounded-full uppercase tracking-wider mb-4 border border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available For Inspection Now in Lagos, Nigeria</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.06] mb-4 text-[var(--ink)]">
                <AnimatedText text="Leeautox Cars For Sale" variant="blur-in" />
              </h2>

              <p className="text-sm sm:text-base font-light leading-relaxed max-w-2xl text-[var(--ink-2)]">
                <AnimatedText
                  text="Beyond auction sourcing, we also own vehicles in our inventory — available physically in Lagos and across Canada & USA. Contact us today for direct inspection, local pickup, or fast overseas delivery."
                  variant="fade-up"
                />
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <a
                href="https://wa.me/16473896162?text=Hello%20LeeAutoX!%20I%20want%20to%20book%20a%20physical%20inspection%20for%20a%20vehicle."
                target="_blank"
                rel="noopener noreferrer"
                className="lx-pill-btn bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs font-mono uppercase tracking-wider shadow-md"
              >
                <MessageSquare size={15} /> Book Inspection
              </a>
            </div>
          </div>
        </Reveal>

        {/* Working Search & Filter Controls */}
        <div className="lx-card-padded mb-10">
          <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center">
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" size={16} />
              <input
                type="text"
                placeholder="Search available stock by make, model, or specs..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="relative flex items-center">
                <MapPin size={15} className="absolute left-3.5 pointer-events-none z-10 text-emerald-500" />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="pl-9 pr-4 py-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer font-medium"
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Canada & USA">Canada &amp; USA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className="px-4 py-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {makes.map(m => (
                  <option key={m} value={m}>Make: {m}</option>
                ))}
              </select>

              <select
                value={filterBody}
                onChange={(e) => setFilterBody(e.target.value)}
                className="px-4 py-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {bodyTypes.map(b => (
                  <option key={b} value={b}>Body: {b}</option>
                ))}
              </select>

              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className="px-4 py-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="100000000">Max Budget: Any</option>
                <option value="20000000">Under ₦20M</option>
                <option value="35000000">Under ₦35M</option>
                <option value="50000000">Under ₦50M</option>
                <option value="70000000">Under ₦70M</option>
              </select>
            </div>

            <div className="sm:hidden relative flex items-center w-full">
              <MapPin size={15} className="absolute left-3.5 pointer-events-none z-10 text-emerald-500" />
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer font-medium"
              >
                <option value="All Locations">All Locations</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Canada & USA">Canada &amp; USA</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--line)] text-xs text-[var(--ink-2)]">
            <span className="font-mono tabular-nums">
              Showing <strong className="text-[var(--ink)]">{filteredVehicles.length}</strong> of {vehicles.length} cars{' '}
              {filterLocation === "All Locations" ? "across All Locations" : `in ${filterLocation}`}
            </span>
            {(filterLocation !== "All Locations" || filterMake !== "All" || filterBody !== "All" || filterBudget !== "100000000" || searchKeyword.trim()) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 font-mono font-bold text-[var(--accent)] hover:underline cursor-pointer"
              >
                <RotateCcw size={13} /> Reset Active Filters
              </button>
            )}
          </div>
        </div>

        {/* Navigation Buttons Row */}
        {hasOverflow && filteredVehicles.length > 0 && (
          <div className="flex items-center justify-end gap-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleManualNav('prev')}
              aria-label="Previous cars"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleManualNav('next')}
              aria-label="Next cars"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Cars Carousel / Empty State */}
        {filteredVehicles.length === 0 ? (
          <div className="lx-card-padded flex flex-col items-center justify-center py-20 text-center">
            <Car size={44} className="text-[var(--accent)] mb-3 opacity-80" />
            <h3 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
              No Matching Cars on Ground in Lagos
            </h3>
            <p className="text-xs font-mono max-w-md mb-6 text-[var(--ink-2)]">
              No vehicles matched your current filter criteria. You can clear filters to see all available inventory, or pre-order directly from Canadian auctions.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)] px-6 py-2.5 text-xs font-mono uppercase tracking-wider"
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
            className="flex flex-row overflow-x-auto gap-6 pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50"
          >
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClickCapture={handleCardClickCapture}
                className="w-[84vw] max-w-[320px] md:max-w-none md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)] shrink-0 snap-start lx-card group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden relative bg-black">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('leeautox.com/cars/')) {
                          target.src = target.src.replace('https://leeautox.com/cars/', '/cars/');
                        }
                      }}
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="bg-emerald-600 text-white text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-full shadow-md flex items-center gap-1">
                        <MapPin size={10} /> {vehicle.location === "Canada & USA" ? "Canada & USA" : "Lagos"}
                      </span>
                      <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {vehicle.location === "Canada & USA" ? "Located Overseas" : vehicle.condition}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      {vehicle.status !== "Available" && (
                        <div className={`text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-full shadow-md ${
                          vehicle.status === "Reserved" ? "bg-amber-500 text-black" : "bg-red-600 text-white"
                        }`}>
                          {vehicle.status}
                        </div>
                      )}
                      <LikeBurstButton ariaLabel={`Save ${vehicle.name}`} />
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 border border-white/20 shadow-sm pointer-events-none z-10">
                      <span>1/{vehicle.images && vehicle.images.length > 0 ? vehicle.images.length : 1}</span>
                    </div>

                    {vehicle.status?.toLowerCase() === 'sold' && <SoldWatermark size="card" />}
                  </div>

                  <div className="p-5">
                    <div className="text-[11px] font-mono mb-1 flex items-center justify-between text-[var(--ink-2)]">
                      <span>{vehicle.year} · {vehicle.make}</span>
                      <span className="tabular-nums">{vehicle.mileage}</span>
                    </div>

                    <h3 className="font-serif text-lg font-normal mb-2 truncate text-[var(--ink)]" title={vehicle.name}>
                      {vehicle.name}
                    </h3>

                    <p className="text-xs mb-4 font-mono line-clamp-2 text-[var(--ink-2)]">
                      {vehicle.location === "Canada & USA" ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Reserve Deposit: {vehicle.deposit || '₦10,000 min'}
                        </span>
                      ) : (
                        vehicle.specs
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-4 flex items-center justify-between border-t border-[var(--line)] mt-auto">
                  <div>
                    <span className="text-[10px] font-mono uppercase block text-[var(--ink-2)]">Price</span>
                    <span className="font-bold text-base tracking-tight font-serif tabular-nums text-[var(--accent)]">
                      {vehicle.price}
                    </span>
                  </div>

                  <Link
                    to={getVehicleUrl(vehicle)}
                    className="lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)] px-4 py-2 text-xs font-mono uppercase tracking-wider shadow-sm hover:opacity-92"
                  >
                    View <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <RippleLink
            to="/inventory/"
            variant="primary"
            className="px-9 py-4 text-xs sm:text-sm font-mono uppercase tracking-widest shadow-lg"
          >
            Shop Available Cars <ArrowRight size={17} />
          </RippleLink>
        </div>
      </div>
    </section>
  );
}
