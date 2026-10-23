import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, ArrowUpDown, Grid, List, X, Clock, 
  MapPin, Gavel, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import { VehicleLotItem, AuctionFilterValues } from '../types/auction';
import { searchAuctionVehicles, buildFilterQuery } from '../services/auctionService';
import { STATIC_FILTER_METADATA } from '../data/auctionFilters';
import { generateBidWhatsAppUrl, getAuctionLotUrl } from '../utils/auctionBid';

export default function AuctionSearchPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // View state: grid vs list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse filters from URL
  const filters: AuctionFilterValues = useMemo(() => {
    return {
      s: searchParams.get('s') || '',
      lot_status: searchParams.get('lot_status') || 'All',
      lot_sub_status: searchParams.get('lot_sub_status') || 'All',
      auction_type: searchParams.get('auction_type') || '0',
      platform: searchParams.get('platform') || '',
      make: searchParams.get('make') || 'All',
      series: searchParams.get('series') || 'All',
      model: searchParams.get('model') || 'All',
      generation_id: searchParams.get('generation_id') || 'All',
      type_id: searchParams.get('type_id') || 'All',
      body_style: searchParams.get('body_style') || 'All',
      year_from: searchParams.get('year_from') || '',
      year_to: searchParams.get('year_to') || '',
      price_min: searchParams.get('price_min') || '',
      price_max: searchParams.get('price_max') || '',
      odometer_from: searchParams.get('odometer_from') || '',
      odometer_to: searchParams.get('odometer_to') || '',
      running_condition: searchParams.get('run_cond') || searchParams.get('running_condition') || 'All',
      has_key: searchParams.get('has_key') || 'All',
      loc_state: searchParams.get('loc_state') || 'All',
      sort: searchParams.get('sort') || 'auction_date_asc',
      per_page: Number(searchParams.get('per_page')) || 12,
    };
  }, [searchParams]);

  // Results state
  const [vehicles, setVehicles] = useState<VehicleLotItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'fallback'>('live');
  const [now, setNow] = useState<number>(Date.now());

  // Local filter draft state for sidebar
  const [draftKeyword, setDraftKeyword] = useState(filters.s || '');

  // Keep countdown ticking
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch results whenever URL filters change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    searchAuctionVehicles(filters).then((res) => {
      if (isMounted) {
        setVehicles(res.data);
        setTotalCount(res.meta.total || res.data.length);
        setDataSource(res.source);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Update a single filter in the URL
  const updateFilter = (key: string, value: string) => {
    const updated = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === '0') {
      updated.delete(key);
    } else {
      updated.set(key, value);
    }
    setSearchParams(updated, { replace: true });
  };

  const handleMakeChange = (newMake: string) => {
    const updated = new URLSearchParams(searchParams);
    if (!newMake || newMake === 'All') {
      updated.delete('make');
      updated.delete('model');
      updated.delete('series');
    } else {
      updated.set('make', newMake);
      updated.delete('model');
      updated.delete('series');
    }
    setSearchParams(updated, { replace: true });
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('s', draftKeyword.trim());
  };

  const clearAllFilters = () => {
    setDraftKeyword('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Active filter chips list
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (filters.s) chips.push({ key: 's', label: `Search: "${filters.s}"` });
    if (filters.make && filters.make !== 'All') chips.push({ key: 'make', label: `Make: ${filters.make}` });
    if (filters.model && filters.model !== 'All') chips.push({ key: 'model', label: `Model: ${filters.model}` });
    if (filters.auction_type && filters.auction_type !== '0') {
      chips.push({ key: 'auction_type', label: filters.auction_type === '1' ? 'Copart Only' : 'IAAI Only' });
    }
    if (filters.platform) chips.push({ key: 'platform', label: `Platform: ${filters.platform.toUpperCase()}` });
    if (filters.lot_status && filters.lot_status !== 'All') chips.push({ key: 'lot_status', label: `Status: ${filters.lot_status}` });
    if (filters.lot_sub_status && filters.lot_sub_status !== 'All') chips.push({ key: 'lot_sub_status', label: `Auction: ${filters.lot_sub_status}` });
    if (filters.body_style && filters.body_style !== 'All') chips.push({ key: 'body_style', label: `Body: ${filters.body_style}` });
    if (filters.running_condition && filters.running_condition !== 'All') chips.push({ key: 'run_cond', label: `Condition: ${filters.running_condition}` });
    if (filters.has_key && filters.has_key !== 'All') chips.push({ key: 'has_key', label: `Keys: ${filters.has_key}` });
    if (filters.loc_state && filters.loc_state !== 'All') chips.push({ key: 'loc_state', label: `State: ${filters.loc_state}` });
    if (filters.year_from) chips.push({ key: 'year_from', label: `Year >= ${filters.year_from}` });
    if (filters.year_to) chips.push({ key: 'year_to', label: `Year <= ${filters.year_to}` });
    return chips;
  }, [filters]);

  // Compute models for selected make
  const availableModels = useMemo(() => {
    if (!filters.make || filters.make === 'All') return [];
    return STATIC_FILTER_METADATA.modelsByMake[filters.make.toUpperCase()] || [];
  }, [filters.make]);

  const formatCountdown = (dateString?: string) => {
    if (!dateString) return '00h 00m 00s';
    const target = new Date(dateString).getTime();
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    if (diff <= 0) return 'Live / Ended';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#090909] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <PageHeader
        title="Live Auction Vehicles"
        subtitle="Search and bid on live Copart & IAAI salvage, repairable, and clean title auction lots in North America with full export logistics."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Auction Search', item: '/auction-search' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8">
        {/* Source status banner */}
        <div className={`mb-6 p-3 px-4 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors ${
          dataSource === 'live'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300'
            : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dataSource === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
            <span>
              {dataSource === 'live'
                ? 'Connected to live Apibara Copart & IAAI inventory feeds.'
                : 'Showing active auction catalog lots. Instant WhatsApp proxy bidding active.'}
            </span>
          </div>
          <span className="opacity-70 hidden sm:inline">North American Feeds</span>
        </div>

        {/* Layout Grid: Sidebar Filters + Results Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
              className="px-4 py-2.5 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <SlidersHorizontal size={14} />
              {isMobileFiltersOpen ? 'Close Filter Menu' : `Filter Lots (${activeChips.length})`}
            </button>
            <span className="text-xs font-mono opacity-70">
              {totalCount} vehicles found
            </span>
          </div>

          {/* SIDEBAR FILTERS (Reference Demo Match) */}
          <aside className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
            <div className={`p-5 rounded-2xl border transition-colors ${
              theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-serif text-base font-bold flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#2B59FF]" />
                  Filters
                </h3>
                {activeChips.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-mono text-[#2B59FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={12} /> Clear all
                  </button>
                )}
              </div>

              {/* 1. Keyword search */}
              <form onSubmit={handleKeywordSubmit} className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="VIN, lot #, keyword"
                    value={draftKeyword}
                    onChange={(e) => setDraftKeyword(e.target.value)}
                    className={`w-full text-xs rounded-xl border pl-3 pr-8 py-2.5 outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-black/50 border-white/15 text-white placeholder-white/30 focus:border-[#2B59FF]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#2B59FF]'
                    }`}
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2B59FF]"
                  >
                    <Search size={14} />
                  </button>
                </div>
              </form>

              {/* 2. Platform / Auction Type */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Auction Platform
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: '0', label: 'All' },
                    { id: '1', label: 'Copart' },
                    { id: '2', label: 'IAAI' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateFilter('auction_type', p.id)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        filters.auction_type === p.id
                          ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                          : theme === 'dark'
                          ? 'border-white/10 hover:bg-white/5 text-white/70'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Lot Status (All, Buy Now, Timed) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Lot Status
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {['All', 'Buy Now', 'Timed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateFilter('lot_status', st)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        filters.lot_status === st
                          ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                          : theme === 'dark'
                          ? 'border-white/10 hover:bg-white/5 text-white/70'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Sub Status (Open, Live, Ended) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Auction State
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {['All', 'Open', 'Live', 'Ended'].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => updateFilter('lot_sub_status', sub)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        filters.lot_sub_status === sub
                          ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                          : theme === 'dark'
                          ? 'border-white/10 hover:bg-white/5 text-white/70'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Make */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Make
                </label>
                <select
                  value={filters.make || 'All'}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className={`w-full text-xs rounded-xl border p-2.5 outline-none transition-colors cursor-pointer ${
                    theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="All">All Makes</option>
                  {STATIC_FILTER_METADATA.makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Model */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Model
                </label>
                <select
                  value={filters.model || 'All'}
                  onChange={(e) => updateFilter('model', e.target.value)}
                  disabled={!filters.make || filters.make === 'All'}
                  className={`w-full text-xs rounded-xl border p-2.5 outline-none transition-colors cursor-pointer disabled:opacity-40 ${
                    theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="All">{!filters.make || filters.make === 'All' ? 'Select Make First' : 'All Models'}</option>
                  {availableModels.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Year Range */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Year Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.year_from || ''}
                    onChange={(e) => updateFilter('year_from', e.target.value)}
                    className={`w-full text-xs rounded-xl border p-2.5 outline-none text-center ${
                      theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="opacity-40">-</span>
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.year_to || ''}
                    onChange={(e) => updateFilter('year_to', e.target.value)}
                    className={`w-full text-xs rounded-xl border p-2.5 outline-none text-center ${
                      theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* 8. Vehicle Type */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Vehicle Type
                </label>
                <select
                  value={filters.body_style || 'All'}
                  onChange={(e) => updateFilter('body_style', e.target.value)}
                  className={`w-full text-xs rounded-xl border p-2.5 outline-none transition-colors cursor-pointer ${
                    theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="All">All Types</option>
                  {STATIC_FILTER_METADATA.types.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Running Condition */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Running Condition
                </label>
                <select
                  value={filters.running_condition || 'All'}
                  onChange={(e) => updateFilter('run_cond', e.target.value)}
                  className={`w-full text-xs rounded-xl border p-2.5 outline-none transition-colors cursor-pointer ${
                    theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="All">All Conditions</option>
                  <option value="RUNS AND DRIVES">Runs & Drives</option>
                  <option value="ENGINE START PROGRAM">Vehicle Starts</option>
                  <option value="STATIONARY / NO INFORMATION">Stationary / No Info</option>
                </select>
              </div>

              {/* 10. Location / State */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Location / Yard
                </label>
                <select
                  value={filters.loc_state || 'All'}
                  onChange={(e) => updateFilter('loc_state', e.target.value)}
                  className={`w-full text-xs rounded-xl border p-2.5 outline-none transition-colors cursor-pointer ${
                    theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="All">All US & Canada Locations</option>
                  {STATIC_FILTER_METADATA.states.map((st) => (
                    <option key={st} value={st.split(' ')[0]}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 11. Has Key */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-60">
                  Has Key
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {['All', 'With', 'No'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => updateFilter('has_key', k)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        filters.has_key === k
                          ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                          : theme === 'dark'
                          ? 'border-white/10 hover:bg-white/5 text-white/70'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* RESULTS CONTENT */}
          <main className="lg:col-span-3">
            {/* Top Toolbar: Count, Active Chips, View Mode, Sort */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-col gap-4 ${
              theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold tracking-tight">
                    {isLoading ? 'Searching vehicle auctions...' : `${totalCount} vehicles found`}
                  </h2>
                  <p className="text-xs font-mono opacity-60">
                    Copart & IAAI Live Lot Inventory
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        viewMode === 'grid' ? 'bg-[#2B59FF] text-white' : 'opacity-60 hover:opacity-100'
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        viewMode === 'list' ? 'bg-[#2B59FF] text-white' : 'opacity-60 hover:opacity-100'
                      }`}
                      aria-label="List view"
                    >
                      <List size={16} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown size={14} className="opacity-50" />
                    <select
                      value={filters.sort || 'auction_date_asc'}
                      onChange={(e) => updateFilter('sort', e.target.value)}
                      className={`text-xs rounded-xl border p-2 pr-6 outline-none transition-colors cursor-pointer ${
                        theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      <option value="auction_date_asc">Ending Soonest</option>
                      <option value="auction_date_desc">Sale Date (Latest)</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="year_desc">Year: Newest First</option>
                      <option value="odometer_asc">Lowest Mileage</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[11px] font-mono opacity-50 uppercase">Active:</span>
                  {activeChips.map((chip) => (
                    <span
                      key={chip.key}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#2B59FF]/10 text-[#2B59FF] border border-[#2B59FF]/30"
                    >
                      <span>{chip.label}</span>
                      <button
                        onClick={() => updateFilter(chip.key, 'All')}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-mono text-[#2B59FF] hover:underline cursor-pointer ml-2"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS GRID / LIST */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className={`rounded-2xl border p-4 animate-pulse ${
                      theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="aspect-[16/10] bg-slate-200 dark:bg-white/10 rounded-xl mb-4" />
                    <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2 mb-4" />
                    <div className="h-16 bg-slate-200 dark:bg-white/10 rounded mb-4" />
                    <div className="h-10 bg-slate-200 dark:bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${
                theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <AlertCircle size={40} className="mx-auto text-amber-500 mb-3" />
                <h3 className="font-serif text-xl font-bold mb-2">No auction vehicles matched your criteria</h3>
                <p className="text-xs font-mono max-w-md mx-auto mb-6 opacity-70">
                  Try broadening your search by clearing specific filters, widening the year range, or switching between Copart and IAAI.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              // GRID VIEW
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => {
                  const mainPhoto = v.media.photo?.[0] || 'https://images.unsplash.com/photo-1590362891988-f7780479c656?w=800';
                  const lotUrl = getAuctionLotUrl(v);
                  const whatsappUrl = generateBidWhatsAppUrl(v);
                  const isBuyNow = !!v.pricing.buy_now_price;

                  return (
                    <div
                      key={v.id}
                      className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Photo + Badges */}
                      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden group">
                        <Link to={lotUrl}>
                          <img
                            src={mainPhoto}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </Link>
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded text-white ${
                            v.platform === 'copart' ? 'bg-blue-600' : 'bg-red-600'
                          }`}>
                            {v.platform.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-black/75 backdrop-blur-md text-emerald-400 border border-white/10">
                            {v.specs.run_and_drive || 'RUNS AND DRIVES'}
                          </span>
                        </div>

                        {/* Countdown */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2.5 flex items-center justify-between text-white text-xs font-mono">
                          <span className="flex items-center gap-1 text-amber-300">
                            <Clock size={12} /> {formatCountdown(v.auction.auction_date)}
                          </span>
                          <span className="text-[10px] opacity-70">Lot #{v.lot_number}</span>
                        </div>
                      </div>

                      {/* Info & Specs */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-base font-bold truncate mb-1" title={v.title}>
                            <Link to={lotUrl} className="hover:text-[#2B59FF] transition-colors">
                              {v.title}
                            </Link>
                          </h3>
                          <p className="text-xs font-mono opacity-60 truncate mb-3 flex items-center gap-1">
                            <MapPin size={12} />
                            {v.location.city ? `${v.location.city}, ${v.location.state}` : v.location.name}
                          </p>

                          {/* 2x2 Specs Grid */}
                          <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-xl mb-4 border text-xs font-mono ${
                            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                          }`}>
                            <div>
                              <span className="text-[9px] uppercase opacity-50 block">
                                {isBuyNow ? 'Buy Now' : 'Current Bid'}
                              </span>
                              <span className="font-bold text-[#2B59FF]">
                                ${(isBuyNow ? v.pricing.buy_now_price : v.pricing.current_bid || 0).toLocaleString()} USD
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase opacity-50 block">Odometer</span>
                              <span className="font-semibold">
                                {(v.specs.odometer || 0).toLocaleString()} {v.specs.odometer_unit || 'mi'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase opacity-50 block">Damage</span>
                              <span className="truncate block" title={v.damage.primary}>
                                {v.damage.primary || 'Normal Wear'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase opacity-50 block">VIN</span>
                              <span className="truncate block font-mono" title={v.vin}>
                                {v.vin ? v.vin.slice(0, 8) + '...' : '—'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Gavel size={13} />
                            Bid via LeeAutoX
                          </a>
                          <Link
                            to={lotUrl}
                            className={`p-2 rounded-xl border text-xs font-semibold hover:border-[#2B59FF] transition-colors ${
                              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                            }`}
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // LIST VIEW
              <div className="space-y-4">
                {vehicles.map((v) => {
                  const mainPhoto = v.media.photo?.[0] || 'https://images.unsplash.com/photo-1590362891988-f7780479c656?w=800';
                  const lotUrl = getAuctionLotUrl(v);
                  const whatsappUrl = generateBidWhatsAppUrl(v);
                  const isBuyNow = !!v.pricing.buy_now_price;

                  return (
                    <div
                      key={v.id}
                      className={`rounded-2xl border p-4 flex flex-col md:flex-row items-center gap-5 transition-all hover:shadow-md ${
                        theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="relative w-full md:w-56 h-40 shrink-0 rounded-xl overflow-hidden bg-slate-950">
                        <Link to={lotUrl}>
                          <img src={mainPhoto} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                        </Link>
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded text-white ${
                          v.platform === 'copart' ? 'bg-blue-600' : 'bg-red-600'
                        }`}>
                          {v.platform.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 w-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-serif text-lg font-bold">
                              <Link to={lotUrl} className="hover:text-[#2B59FF] transition-colors">
                                {v.title}
                              </Link>
                            </h3>
                            <span className="text-xs font-mono text-amber-500 font-bold flex items-center gap-1">
                              <Clock size={12} /> {formatCountdown(v.auction.auction_date)}
                            </span>
                          </div>

                          <p className="text-xs font-mono opacity-60 mb-3 flex items-center gap-1">
                            <MapPin size={12} /> {v.location.city}, {v.location.state} • Lot #{v.lot_number} • VIN: {v.vin}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-4">
                            <div>
                              <span className="opacity-50 block text-[9px] uppercase">Odometer</span>
                              <span>{(v.specs.odometer || 0).toLocaleString()} {v.specs.odometer_unit || 'mi'}</span>
                            </div>
                            <div>
                              <span className="opacity-50 block text-[9px] uppercase">Damage</span>
                              <span>{v.damage.primary || 'Normal Wear'}</span>
                            </div>
                            <div>
                              <span className="opacity-50 block text-[9px] uppercase">Transmission</span>
                              <span>{v.specs.transmission || 'Automatic'}</span>
                            </div>
                            <div>
                              <span className="opacity-50 block text-[9px] uppercase">Run Status</span>
                              <span className="text-emerald-500 font-bold">{v.specs.run_and_drive || 'Runs & Drives'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                          <div>
                            <span className="text-[10px] uppercase font-mono opacity-50 block">
                              {isBuyNow ? 'Buy Now Price' : 'Current Bid'}
                            </span>
                            <span className="font-bold text-lg text-[#2B59FF]">
                              ${(isBuyNow ? v.pricing.buy_now_price : v.pricing.current_bid || 0).toLocaleString()} USD
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Gavel size={14} /> Bid via LeeAutoX
                            </a>
                            <Link
                              to={lotUrl}
                              className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${
                                theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              View Lot
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
