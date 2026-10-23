import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Grid, List, X, Clock, 
  MapPin, Gavel, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, 
  ShieldCheck, RefreshCw, MessageCircle, ChevronDown, Check, Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import { VehicleLotItem, AuctionFilterValues, FilterOptionsMetadata } from '../types/auction';
import { 
  searchAuctionVehicles, 
  getAuctionFilterOptions, 
  buildFilterQuery,
  getAuctionDiagnostics,
  checkRelayStatus,
  RelayDiagnostics 
} from '../services/auctionService';
import { STATIC_FILTER_METADATA } from '../data/auctionFilters';
import { CONTACT_INFO } from '../constants';
import AuctionVehicleCard from '../components/AuctionVehicleCard';

export default function AuctionSearchPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // View state: grid vs list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Parse filters from URL
  const filters: AuctionFilterValues = useMemo(() => {
    return {
      s: searchParams.get('s') || '',
      lot_status: searchParams.get('lot_status') || 'All',
      lot_sub_status: searchParams.get('lot_sub_status') || 'Open',
      auction_type: searchParams.get('auction_type') || '0',
      platform: searchParams.get('platform') || '',
      make: searchParams.get('make') || 'All',
      series: searchParams.get('series') || 'All',
      model: searchParams.get('model') || 'All',
      generation: searchParams.get('generation') || 'All',
      type_id: searchParams.get('type') || searchParams.get('type_id') || 'All',
      year_from: searchParams.get('year_from') || '',
      year_to: searchParams.get('year_to') || '',
      price_min: searchParams.get('price_min') || '',
      price_max: searchParams.get('price_max') || '',
      odometer_from: searchParams.get('odometer_from') || '',
      odometer_to: searchParams.get('odometer_to') || '',
      engine_size_from: searchParams.get('engine_size_from') || '',
      engine_size_to: searchParams.get('engine_size_to') || '',
      running_condition: searchParams.get('run_cond') || searchParams.get('running_condition') || 'All',
      has_key: searchParams.get('has_key') || 'All',
      loc_state: searchParams.get('loc_state') || 'All',
      color: searchParams.getAll('color[]').length > 0 ? searchParams.getAll('color[]') : undefined,
      fuel_type: searchParams.getAll('fuel_type[]').length > 0 ? searchParams.getAll('fuel_type[]') : undefined,
      transmission: searchParams.getAll('transmission[]').length > 0 ? searchParams.getAll('transmission[]') : undefined,
      drive_type: searchParams.getAll('drive_type[]').length > 0 ? searchParams.getAll('drive_type[]') : undefined,
      damage: searchParams.getAll('damage[]').length > 0 ? searchParams.getAll('damage[]') : undefined,
      cylinders: searchParams.getAll('cylinders[]').length > 0 ? searchParams.getAll('cylinders[]') : undefined,
      engine_type: searchParams.getAll('engine_type[]').length > 0 ? searchParams.getAll('engine_type[]') : (searchParams.get('engine_type') ? [searchParams.get('engine_type')!] : undefined),
      cursor: searchParams.get('cursor') || undefined,
      per_page: Number(searchParams.get('per_page')) || 20,
      include_total: searchParams.get('include_total') === 'true',
    };
  }, [searchParams]);

  // Results state
  const [vehicles, setVehicles] = useState<VehicleLotItem[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [isExactTotal, setIsExactTotal] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'fallback'>('live');
  const [diagnostics, setDiagnostics] = useState<RelayDiagnostics>(getAuctionDiagnostics());

  // Cursor stack for Prev navigation
  const [cursorHistory, setCursorHistory] = useState<Array<string | null>>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Local input states for search bar & comboboxes
  const [draftKeyword, setDraftKeyword] = useState(filters.s || '');
  const [makeSearchText, setMakeSearchText] = useState('');
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const makeDropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic filter facet options from API
  const [metadata, setMetadata] = useState<FilterOptionsMetadata>({
    makes: STATIC_FILTER_METADATA.makes,
    modelsByMake: STATIC_FILTER_METADATA.modelsByMake,
    seriesOptionsByMake: {},
    generationOptionsByMakeAndModel: {},
    types: STATIC_FILTER_METADATA.types.map((t, idx) => ({ id: idx + 1, name: t.name })),
    colors: STATIC_FILTER_METADATA.colors,
    fuels: STATIC_FILTER_METADATA.fuels,
    transmissions: STATIC_FILTER_METADATA.transmissions,
    driveTypes: STATIC_FILTER_METADATA.driveTypes.map((d) => ({ value: d, label: d })),
    runConditions: [
      { value: 'RUNS AND DRIVES', label: 'Run and Drive' },
      { value: 'ENGINE START PROGRAM', label: 'Vehicle starts' },
      { value: 'STATIONARY / NO INFORMATION', label: 'Stationary / No information' },
    ],
    damageTypes: ['Mechanical', 'Hail', 'Fire', 'Water', 'Theft', 'Repossession', 'Rollover', 'Vandalized', 'Chemical'],
    cylinderOptions: [1, 2, 3, 4, 5, 6, 8, 10, 12],
    engineTypes: [
      { value: 'I', label: 'I - Inline' },
      { value: 'V', label: 'V - Engine' },
      { value: 'W', label: 'W - Engine' },
      { value: 'B', label: 'B - Boxer' },
    ],
    hasKeyOptions: ['With', 'No', 'All'],
    ranges: {
      price_usd: { min: 0, max: 250000, min_default: 0, max_default: 100000 },
      year: { min: 1900, max: 2027, from_default: 1900, to_default: 2026 },
      odometer_mi: { min: 0, max: 500000, from_default: 0, to_default: 250000 },
      engine_size_l: { min: 0, max: 20, from_default: 0, to_default: 10, step: 0.1 },
    },
  });

  const [seriesList, setSeriesList] = useState<Array<{ key: string; name: string; label: string }>>([]);
  const [generationList, setGenerationList] = useState<Array<{ id: number; label: string; generation: string }>>([]);

  // Load filter facets
  useEffect(() => {
    let isMounted = true;
    getAuctionFilterOptions().then((data) => {
      if (isMounted && data) {
        setMetadata(data);
      }
    });

    // Initial relay health check
    checkRelayStatus().then(() => {
      if (isMounted) setDiagnostics(getAuctionDiagnostics());
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync draftKeyword when URL changes
  useEffect(() => {
    setDraftKeyword(filters.s || '');
  }, [filters.s]);

  // Click outside for make dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(e.target as Node)) {
        setIsMakeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic series & generation when Make / Model changes
  useEffect(() => {
    if (!filters.make || filters.make === 'All') {
      setSeriesList([]);
      setGenerationList([]);
      return;
    }

    let isMounted = true;
    getAuctionFilterOptions(filters.make, filters.series !== 'All' ? filters.series : undefined, filters.model !== 'All' ? filters.model : undefined).then((res) => {
      if (isMounted) {
        if (res.seriesOptionsByMake[filters.make!]) {
          setSeriesList(res.seriesOptionsByMake[filters.make!]);
        }
        if (res.generationOptionsByMakeAndModel[filters.make!]) {
          setGenerationList(res.generationOptionsByMakeAndModel[filters.make!]);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters.make, filters.series, filters.model]);

  // Search execution
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    searchAuctionVehicles(filters).then((res) => {
      if (isMounted) {
        setVehicles(res.data);
        setTotalCount(res.meta.total);
        setIsExactTotal(Boolean(res.meta.total_is_exact));
        setNextCursor(res.meta.next_cursor || null);
        setHasMore(Boolean(res.meta.has_more));
        setDataSource(res.source);
        if (res.diagnostics) {
          setDiagnostics(res.diagnostics);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Update a single filter parameter in the URL
  const updateFilter = (key: string, value: string | null) => {
    const updated = new URLSearchParams(searchParams);
    // When changing non-pagination filters, reset cursor to page 1
    if (key !== 'cursor') {
      updated.delete('cursor');
      setCursorHistory([null]);
      setCurrentPageIndex(0);
    }

    if (!value || value === 'All' || value === '0') {
      updated.delete(key);
    } else {
      updated.set(key, value);
    }
    setSearchParams(updated, { replace: true });
  };

  // Toggle multi-select array parameter in URL
  const toggleArrayFilter = (paramName: string, item: string) => {
    const updated = new URLSearchParams(searchParams);
    updated.delete('cursor');
    setCursorHistory([null]);
    setCurrentPageIndex(0);

    const fullKey = `${paramName}[]`;
    const currentValues = updated.getAll(fullKey);

    updated.delete(fullKey);
    if (currentValues.includes(item)) {
      currentValues.filter((v) => v !== item).forEach((v) => updated.append(fullKey, v));
    } else {
      [...currentValues, item].forEach((v) => updated.append(fullKey, v));
    }

    setSearchParams(updated, { replace: true });
  };

  // Handle Make change (resets model, series, generation)
  const handleMakeChange = (newMake: string) => {
    const updated = new URLSearchParams(searchParams);
    updated.delete('cursor');
    setCursorHistory([null]);
    setCurrentPageIndex(0);

    if (!newMake || newMake === 'All') {
      updated.delete('make');
    } else {
      updated.set('make', newMake);
    }
    updated.delete('model');
    updated.delete('series');
    updated.delete('generation');
    setIsMakeDropdownOpen(false);
    setMakeSearchText('');
    setSearchParams(updated, { replace: true });
  };

  // Clear all filters back to defaults
  const clearAllFilters = () => {
    setDraftKeyword('');
    setCursorHistory([null]);
    setCurrentPageIndex(0);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Pagination Next
  const handleNextPage = () => {
    if (!nextCursor) return;
    const nextIdx = currentPageIndex + 1;
    const newStack = [...cursorHistory.slice(0, nextIdx), nextCursor];
    setCursorHistory(newStack);
    setCurrentPageIndex(nextIdx);

    const updated = new URLSearchParams(searchParams);
    updated.set('cursor', nextCursor);
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination Prev
  const handlePrevPage = () => {
    if (currentPageIndex <= 0) return;
    const prevIdx = currentPageIndex - 1;
    const prevCursor = cursorHistory[prevIdx];
    setCurrentPageIndex(prevIdx);

    const updated = new URLSearchParams(searchParams);
    if (prevCursor) {
      updated.set('cursor', prevCursor);
    } else {
      updated.delete('cursor');
    }
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Models available for selected make
  const availableModels = useMemo(() => {
    if (!filters.make || filters.make === 'All') return [];
    return metadata.modelsByMake[filters.make.toUpperCase()] || [];
  }, [filters.make, metadata.modelsByMake]);

  // Filtered makes for combobox
  const filteredMakes = useMemo(() => {
    if (!makeSearchText.trim()) return metadata.makes;
    const q = makeSearchText.toLowerCase();
    return metadata.makes.filter((m) => m.toLowerCase().includes(q));
  }, [makeSearchText, metadata.makes]);

  // Year options list: 2027 down to 1900
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = 2027; y >= 1980; y--) {
      years.push(y);
    }
    return years;
  }, []);

  // Compute active chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (filters.s) {
      chips.push({ key: 's', label: `Search: "${filters.s}"`, onRemove: () => updateFilter('s', null) });
    }
    if (filters.auction_type && filters.auction_type !== '0') {
      chips.push({
        key: 'auction_type',
        label: filters.auction_type === '1' ? 'Copart Only' : 'IAAI Only',
        onRemove: () => updateFilter('auction_type', null),
      });
    }
    if (filters.lot_status && filters.lot_status !== 'All') {
      chips.push({ key: 'lot_status', label: `Status: ${filters.lot_status}`, onRemove: () => updateFilter('lot_status', null) });
    }
    if (filters.lot_sub_status && filters.lot_sub_status !== 'Open') {
      chips.push({ key: 'lot_sub_status', label: `Auction: ${filters.lot_sub_status}`, onRemove: () => updateFilter('lot_sub_status', 'Open') });
    }
    if (filters.make && filters.make !== 'All') {
      chips.push({ key: 'make', label: `Make: ${filters.make}`, onRemove: () => handleMakeChange('All') });
    }
    if (filters.model && filters.model !== 'All') {
      chips.push({ key: 'model', label: `Model: ${filters.model}`, onRemove: () => updateFilter('model', null) });
    }
    if (filters.series && filters.series !== 'All') {
      chips.push({ key: 'series', label: `Series: ${filters.series}`, onRemove: () => updateFilter('series', null) });
    }
    if (filters.generation && filters.generation !== 'All') {
      chips.push({ key: 'generation', label: `Gen: ${filters.generation}`, onRemove: () => updateFilter('generation', null) });
    }
    if (filters.type_id && filters.type_id !== 'All') {
      const tObj = metadata.types.find((t) => String(t.id) === filters.type_id);
      chips.push({ key: 'type', label: `Type: ${tObj ? tObj.name : filters.type_id}`, onRemove: () => updateFilter('type', null) });
    }
    if (filters.year_from) {
      chips.push({ key: 'year_from', label: `From: ${filters.year_from}`, onRemove: () => updateFilter('year_from', null) });
    }
    if (filters.year_to) {
      chips.push({ key: 'year_to', label: `To: ${filters.year_to}`, onRemove: () => updateFilter('year_to', null) });
    }
    if (filters.price_min) {
      chips.push({ key: 'price_min', label: `Min $: ${Number(filters.price_min).toLocaleString()}`, onRemove: () => updateFilter('price_min', null) });
    }
    if (filters.price_max) {
      chips.push({ key: 'price_max', label: `Max $: ${Number(filters.price_max).toLocaleString()}`, onRemove: () => updateFilter('price_max', null) });
    }
    if (filters.odometer_from) {
      chips.push({ key: 'odometer_from', label: `Odo >= ${Number(filters.odometer_from).toLocaleString()} mi`, onRemove: () => updateFilter('odometer_from', null) });
    }
    if (filters.odometer_to) {
      chips.push({ key: 'odometer_to', label: `Odo <= ${Number(filters.odometer_to).toLocaleString()} mi`, onRemove: () => updateFilter('odometer_to', null) });
    }
    if (filters.running_condition && filters.running_condition !== 'All') {
      chips.push({ key: 'running_condition', label: `Condition: ${filters.running_condition}`, onRemove: () => updateFilter('run_cond', null) });
    }
    if (filters.has_key && filters.has_key !== 'All') {
      chips.push({ key: 'has_key', label: `Keys: ${filters.has_key}`, onRemove: () => updateFilter('has_key', null) });
    }
    if (Array.isArray(filters.damage)) {
      filters.damage.forEach((d) => {
        chips.push({ key: `damage_${d}`, label: `Damage: ${d}`, onRemove: () => toggleArrayFilter('damage', d) });
      });
    }
    if (Array.isArray(filters.fuel_type)) {
      filters.fuel_type.forEach((f) => {
        chips.push({ key: `fuel_${f}`, label: `Fuel: ${f}`, onRemove: () => toggleArrayFilter('fuel_type', f) });
      });
    }
    if (Array.isArray(filters.transmission)) {
      filters.transmission.forEach((t) => {
        chips.push({ key: `trans_${t}`, label: `Trans: ${t}`, onRemove: () => toggleArrayFilter('transmission', t) });
      });
    }
    if (Array.isArray(filters.drive_type)) {
      filters.drive_type.forEach((dt) => {
        chips.push({ key: `drive_${dt}`, label: `Drive: ${dt}`, onRemove: () => toggleArrayFilter('drive_type', dt) });
      });
    }
    if (Array.isArray(filters.color)) {
      filters.color.forEach((c) => {
        chips.push({ key: `color_${c}`, label: `Color: ${c}`, onRemove: () => toggleArrayFilter('color', c) });
      });
    }

    return chips;
  }, [filters, metadata.types]);

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
        {/* TASK 0 DIAGNOSTICS & SOURCE STATUS BANNER */}
        <div className={`mb-6 p-3.5 px-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono transition-colors ${
          dataSource === 'live'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300'
            : dataSource === 'cached'
            ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-300'
            : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${
              dataSource === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`} />
            <span>
              {dataSource === 'live'
                ? 'Connected to live Apibara Copart & IAAI auction feeds.'
                : dataSource === 'cached'
                ? 'Showing saved results. Proxy feed cached.'
                : 'Feed synchronizing. Showing verified local catalog inventory.'}
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {dataSource === 'fallback' && (
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('Hello LeeAutoX, I need help checking live auction lot inventory on Copart / IAAI.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-[#25D366] text-black font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-[11px]"
              >
                <MessageCircle size={13} />
                <span>Ask on WhatsApp</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowDiagnostics((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg border border-current opacity-80 hover:opacity-100 flex items-center gap-1.5 cursor-pointer text-[11px]"
            >
              <Activity size={12} />
              <span>{showDiagnostics ? 'Hide Diagnostics' : 'Relay Diagnostics'}</span>
            </button>
          </div>
        </div>

        {/* TEMPORARY DIAGNOSTICS PANEL (Task 0 requirement - shows status, error class, endpoint, key present yes/no, never prints key) */}
        {showDiagnostics && (
          <div className={`mb-6 p-4 rounded-2xl border font-mono text-xs space-y-2 animate-fadeIn ${
            theme === 'dark' ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-800 shadow-md'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="font-bold flex items-center gap-2 text-[#2B59FF]">
                <Activity size={14} /> Task 0 Relay Diagnostics Panel
              </span>
              <span className="text-[10px] opacity-60">No secret keys are ever logged or exposed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <span className="block opacity-60 text-[10px]">HTTP Status:</span>
                <span className={`font-bold ${diagnostics.status === 200 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {diagnostics.status || '200 OK'}
                </span>
              </div>
              <div>
                <span className="block opacity-60 text-[10px]">Error Class:</span>
                <span className="font-bold">{diagnostics.error_class || 'None'}</span>
              </div>
              <div>
                <span className="block opacity-60 text-[10px]">Key Configured:</span>
                <span className="font-bold text-emerald-500">
                  {diagnostics.key_configured ? 'Yes (Server Secret)' : 'No'}
                </span>
              </div>
              <div>
                <span className="block opacity-60 text-[10px]">Relay URL:</span>
                <span className="font-bold truncate block">{diagnostics.relay_url || '/api/auction'}</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="block opacity-60 text-[10px]">Last Endpoint Called:</span>
              <code className="text-[11px] p-1.5 rounded bg-slate-100 dark:bg-black/50 block truncate">
                {diagnostics.endpoint || '/vehicles?per_page=20'}
              </code>
            </div>
          </div>
        )}

        {/* TOP CONTROLS: Mobile Filter Button, View Mode, Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
              className="lg:hidden px-4 py-2.5 bg-[#2B59FF] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
            </button>

            <span className="text-xs font-mono opacity-80">
              {totalCount !== null 
                ? `${totalCount.toLocaleString()}${isExactTotal ? ' vehicles' : '+ vehicles'} available`
                : `${vehicles.length} vehicles on this page`}
            </span>
          </div>

          {/* Grid / List View Toggle & Reset */}
          <div className="flex items-center gap-2">
            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#2B59FF] hover:underline cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            )}

            <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/10 border border-slate-300 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-black text-[#2B59FF] shadow-xs'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-black text-[#2B59FF] shadow-xs'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-mono opacity-60">Active:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2B59FF] dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-xs font-mono"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-mono text-[#2B59FF] hover:underline cursor-pointer ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* MAIN LAYOUT: SIDEBAR FILTER PANEL + RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTER PANEL (Task 2 complete specification) */}
          <aside className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-5`}>
            <div className={`p-5 rounded-3xl border transition-colors ${
              theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-serif text-base font-bold flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#2B59FF]" />
                  Filters
                </h3>
                {activeChips.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-mono text-[#2B59FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>

              {/* 1. Keyword search (VIN, lot, text) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                  Search Text (VIN, Lot or Keyword)
                </label>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateFilter('s', draftKeyword.trim());
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={draftKeyword}
                    onChange={(e) => setDraftKeyword(e.target.value)}
                    placeholder="Search VIN, Lot, Model..."
                    className={`w-full min-h-[40px] px-3 pr-8 text-xs rounded-xl border outline-none font-medium ${
                      theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2B59FF]"
                  >
                    <Search size={14} />
                  </button>
                </form>
              </div>

              {/* 2. Platform / Auction Type (All, Copart, IAAI) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Auction Platform</label>
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
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Lot Status</label>
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
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Auction Stage</label>
                <div className="grid grid-cols-3 gap-1">
                  {['Open', 'Live', 'Ended'].map((sub) => (
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

              {/* 5. Make (Combobox) */}
              <div className="mb-4 relative" ref={makeDropdownRef}>
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Make</label>
                <button
                  type="button"
                  onClick={() => setIsMakeDropdownOpen((prev) => !prev)}
                  className={`w-full min-h-[40px] px-3 py-2 text-xs font-mono rounded-xl border flex items-center justify-between cursor-pointer ${
                    theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="truncate font-bold">
                    {filters.make === 'All' ? 'All Makes' : filters.make}
                  </span>
                  <ChevronDown size={14} className="opacity-60" />
                </button>

                {isMakeDropdownOpen && (
                  <div className={`absolute left-0 top-full mt-1 w-full max-h-64 rounded-2xl border shadow-2xl z-50 overflow-hidden flex flex-col ${
                    theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <div className="p-2 border-b border-slate-200 dark:border-white/10">
                      <input
                        type="text"
                        value={makeSearchText}
                        onChange={(e) => setMakeSearchText(e.target.value)}
                        placeholder="Search makes..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none bg-transparent"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 max-h-52">
                      <button
                        type="button"
                        onClick={() => handleMakeChange('All')}
                        className="w-full px-3 py-1.5 text-left text-xs font-mono hover:bg-[#2B59FF] hover:text-white rounded-lg"
                      >
                        All Makes
                      </button>
                      {filteredMakes.slice(0, 100).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleMakeChange(m)}
                          className={`w-full px-3 py-1.5 text-left text-xs font-mono rounded-lg ${
                            filters.make?.toUpperCase() === m.toUpperCase()
                              ? 'bg-[#2B59FF] text-white'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Model (Populated by Make) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Model</label>
                <select
                  value={filters.model || 'All'}
                  onChange={(e) => updateFilter('model', e.target.value)}
                  disabled={!filters.make || filters.make === 'All'}
                  className={`w-full min-h-[40px] px-3 py-2 text-xs font-mono rounded-xl border outline-none disabled:opacity-40 cursor-pointer ${
                    theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="All">{!filters.make || filters.make === 'All' ? 'Select Make First' : 'All Models'}</option>
                  {availableModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* 7. Series (Needs Make) */}
              {seriesList.length > 0 && (
                <div className="mb-4">
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Series</label>
                  <select
                    value={filters.series || 'All'}
                    onChange={(e) => updateFilter('series', e.target.value)}
                    className={`w-full min-h-[40px] px-3 py-2 text-xs font-mono rounded-xl border outline-none cursor-pointer ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="All">All Series</option>
                    {seriesList.map((s) => (
                      <option key={s.key} value={s.name}>{s.label || s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 8. Generation (Needs Make) */}
              {generationList.length > 0 && (
                <div className="mb-4">
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Generation</label>
                  <select
                    value={filters.generation || 'All'}
                    onChange={(e) => updateFilter('generation', e.target.value)}
                    className={`w-full min-h-[40px] px-3 py-2 text-xs font-mono rounded-xl border outline-none cursor-pointer ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="All">All Generations</option>
                    {generationList.map((g) => (
                      <option key={g.id} value={g.generation}>{g.label || g.generation}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 9. Vehicle Type (1 to 30) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Vehicle Type</label>
                <select
                  value={filters.type_id || 'All'}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className={`w-full min-h-[40px] px-3 py-2 text-xs font-mono rounded-xl border outline-none cursor-pointer ${
                    theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="All">All Vehicle Types</option>
                  {metadata.types.map((vt) => (
                    <option key={vt.id} value={String(vt.id)}>
                      {vt.id} - {vt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 10. Year From & To (Dropdowns) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Year Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.year_from || ''}
                    onChange={(e) => updateFilter('year_from', e.target.value || null)}
                    className={`w-full min-h-[40px] px-2 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="">Year From</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <select
                    value={filters.year_to || ''}
                    onChange={(e) => updateFilter('year_to', e.target.value || null)}
                    className={`w-full min-h-[40px] px-2 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="">Year To</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 11. Price (USD) Range (0 to 250,000, step 50) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Price USD (0 - 250,000)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    step="50"
                    min="0"
                    value={filters.price_min || ''}
                    onChange={(e) => updateFilter('price_min', e.target.value || null)}
                    className={`w-1/2 min-h-[40px] px-3 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Max $"
                    step="50"
                    max="250000"
                    value={filters.price_max || ''}
                    onChange={(e) => updateFilter('price_max', e.target.value || null)}
                    className={`w-1/2 min-h-[40px] px-3 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* 12. Odometer Range (0 to 500,000 mi, step 500) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Odometer mi (0 - 500,000)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min mi"
                    step="500"
                    min="0"
                    value={filters.odometer_from || ''}
                    onChange={(e) => updateFilter('odometer_from', e.target.value || null)}
                    className={`w-1/2 min-h-[40px] px-3 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Max mi"
                    step="500"
                    max="500000"
                    value={filters.odometer_to || ''}
                    onChange={(e) => updateFilter('odometer_to', e.target.value || null)}
                    className={`w-1/2 min-h-[40px] px-3 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* 13. Engine Size Range (0 to 20 L, step 0.1) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Engine Size Litres (0 - 20L)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min L"
                    step="0.1"
                    min="0"
                    value={filters.engine_size_from || ''}
                    onChange={(e) => updateFilter('engine_size_from', e.target.value || null)}
                    className={`w-1/2 min-h-[40px] px-3 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Max L"
                    step="0.1"
                    max="20"
                    value={filters.engine_size_to || ''}
                    onChange={(e) => updateFilter('engine_size_to', e.target.value || null)}
                    className={`w-1/2 min-h-[40px] px-3 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* 14. Running condition */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Running Condition</label>
                <div className="space-y-1">
                  {[
                    { val: 'All', label: 'All Conditions' },
                    { val: 'RUNS AND DRIVES', label: 'Run and Drive' },
                    { val: 'ENGINE START PROGRAM', label: 'Vehicle starts' },
                    { val: 'STATIONARY / NO INFORMATION', label: 'Stationary / No information' },
                  ].map((rc) => (
                    <button
                      key={rc.val}
                      type="button"
                      onClick={() => updateFilter('run_cond', rc.val)}
                      className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        filters.running_condition === rc.val
                          ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                          : theme === 'dark'
                          ? 'border-white/10 hover:bg-white/5 text-white/70'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{rc.label}</span>
                      {filters.running_condition === rc.val && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 15. Has Key (With, No, All) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Has Key</label>
                <div className="grid grid-cols-3 gap-1">
                  {['With', 'No', 'All'].map((hk) => (
                    <button
                      key={hk}
                      type="button"
                      onClick={() => updateFilter('has_key', hk)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        filters.has_key === hk
                          ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                          : theme === 'dark'
                          ? 'border-white/10 hover:bg-white/5 text-white/70'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {hk}
                    </button>
                  ))}
                </div>
              </div>

              {/* 16. Damage Types */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Damage Category</label>
                <div className="flex flex-wrap gap-1">
                  {metadata.damageTypes.map((dmg) => {
                    const active = Array.isArray(filters.damage) && filters.damage.includes(dmg);
                    return (
                      <button
                        key={dmg}
                        type="button"
                        onClick={() => toggleArrayFilter('damage', dmg)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {dmg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 17. Transmission */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Transmission</label>
                <div className="grid grid-cols-3 gap-1">
                  {['Automatic', 'Manual', 'Unknown'].map((tr) => {
                    const active = Array.isArray(filters.transmission) && filters.transmission.includes(tr);
                    return (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => toggleArrayFilter('transmission', tr)}
                        className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {tr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 18. Drive Type (FWD, RWD, AWD) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Drive Type</label>
                <div className="grid grid-cols-3 gap-1">
                  {['FWD', 'RWD', 'AWD'].map((dt) => {
                    const active = Array.isArray(filters.drive_type) && filters.drive_type.includes(dt);
                    return (
                      <button
                        key={dt}
                        type="button"
                        onClick={() => toggleArrayFilter('drive_type', dt)}
                        className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {dt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 19. Fuel Type */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Fuel</label>
                <div className="flex flex-wrap gap-1">
                  {metadata.fuels.map((fuel) => {
                    const active = Array.isArray(filters.fuel_type) && filters.fuel_type.includes(fuel);
                    return (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => toggleArrayFilter('fuel_type', fuel)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {fuel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 20. Colors */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Color</label>
                <div className="flex flex-wrap gap-1">
                  {metadata.colors.map((c) => {
                    const active = Array.isArray(filters.color) && filters.color.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleArrayFilter('color', c)}
                        className={`px-2 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 21. Cylinders (1, 2, 3, 4, 5, 6, 8, 10, 12) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Cylinders</label>
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((cyl) => {
                    const active = Array.isArray(filters.cylinders) && filters.cylinders.includes(String(cyl));
                    return (
                      <button
                        key={cyl}
                        type="button"
                        onClick={() => toggleArrayFilter('cylinders', String(cyl))}
                        className={`w-8 h-8 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cyl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 22. Engine Type (I, V, W, B) */}
              <div className="mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Engine Type</label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { id: 'I', label: 'I - Inline' },
                    { id: 'V', label: 'V - Engine' },
                    { id: 'W', label: 'W - Engine' },
                    { id: 'B', label: 'B - Boxer' },
                  ].map((et) => {
                    const active = Array.isArray(filters.engine_type) && filters.engine_type.includes(et.id);
                    return (
                      <button
                        key={et.id}
                        type="button"
                        onClick={() => toggleArrayFilter('engine_type', et.id)}
                        className={`py-1.5 px-2 text-xs font-mono rounded-lg border text-left transition-all cursor-pointer truncate ${
                          active
                            ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                            : theme === 'dark'
                            ? 'border-white/10 text-white/70 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {et.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 23. Option: "Include exact total count" */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={Boolean(filters.include_total)}
                    onChange={(e) => updateFilter('include_total', e.target.checked ? 'true' : null)}
                    className="rounded text-[#2B59FF] focus:ring-[#2B59FF]"
                  />
                  <span>Include exact total count</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RESULTS CONTENT */}
          <section className="lg:col-span-3">
            {isLoading ? (
              // Loading Skeletons
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className={`rounded-2xl border p-4 animate-pulse ${
                      theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="h-56 bg-slate-200 dark:bg-white/10 rounded-xl mb-4" />
                    <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2 mb-4" />
                    <div className="h-12 bg-slate-200 dark:bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              // Empty State
              <div className={`py-20 px-6 text-center rounded-3xl border ${
                theme === 'dark' ? 'bg-[#121212] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <ShieldCheck size={48} className="mx-auto text-[#2B59FF] mb-4 opacity-80" />
                <h3 className="font-serif text-2xl font-bold mb-2">No vehicles match your active filters</h3>
                <p className="text-xs font-mono max-w-md mx-auto mb-6 opacity-70">
                  Try broadening your search by clearing specific filters such as damage, price, or exact series.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#2B59FF] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              // Vehicle Cards
              <div>
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' 
                    : 'flex flex-col gap-5'
                }>
                  {vehicles.map((vehicle) => (
                    <AuctionVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      viewMode={viewMode}
                      searchQueryContext={searchParams.toString()}
                    />
                  ))}
                </div>

                {/* CURSOR-BASED PAGINATION (Task 2 specification) */}
                <div className="mt-12 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-mono">
                  <div className="opacity-75">
                    <span>Page {currentPageIndex + 1}</span>
                    {totalCount !== null && (
                      <span className="ml-2">· {totalCount.toLocaleString()} lots total</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={currentPageIndex <= 0}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-black font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      <ChevronLeft size={14} />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={!nextCursor || !hasMore}
                      className="px-4 py-2 rounded-xl bg-[#2B59FF] text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 shadow-sm"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
