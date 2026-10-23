import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  RotateCcw, 
  Car, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { 
  getAuctionFilterOptions, 
  buildFilterQuery 
} from '../services/auctionService';
import { STATIC_FILTER_METADATA } from '../data/auctionFilters';
import { AuctionFilterValues, FilterOptionsMetadata } from '../types/auction';

const LAST_SEARCH_KEY = 'leeautox_last_hero_search';

export default function HeroSearchWidget() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Primary Row state
  const [keyword, setKeyword] = useState('');

  // Quick Filter Row state
  const [platform, setPlatform] = useState<'All' | 'Copart' | 'IAAI'>('All');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [vehicleTypeId, setVehicleTypeId] = useState<string>('All');

  // More Filters state
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [series, setSeries] = useState<string>('All');
  const [generation, setGeneration] = useState<string>('All');
  const [lotStatus, setLotStatus] = useState<string>('All');
  const [subStatus, setSubStatus] = useState<string>('Open');
  const [runningCondition, setRunningCondition] = useState<string>('All');
  const [hasKey, setHasKey] = useState<string>('All');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [odometerFrom, setOdometerFrom] = useState<string>('');
  const [odometerTo, setOdometerTo] = useState<string>('');
  const [engineSizeFrom, setEngineSizeFrom] = useState<string>('');
  const [engineSizeTo, setEngineSizeTo] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedDriveTypes, setSelectedDriveTypes] = useState<string[]>([]);
  const [selectedDamages, setSelectedDamages] = useState<string[]>([]);
  const [selectedCylinders, setSelectedCylinders] = useState<string[]>([]);
  const [engineType, setEngineType] = useState<string>('All');

  // Searchable combobox for Make
  const [makeSearchText, setMakeSearchText] = useState('');
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const makeDropdownRef = useRef<HTMLDivElement>(null);

  // Metadata facets from API
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

  // Series and Generation options for selected make
  const [seriesList, setSeriesList] = useState<Array<{ key: string; name: string; label: string }>>([]);
  const [generationList, setGenerationList] = useState<Array<{ id: number; label: string; generation: string }>>([]);

  // Load metadata on mount & restore last search
  useEffect(() => {
    let isMounted = true;
    getAuctionFilterOptions().then((data) => {
      if (isMounted && data) {
        setMetadata(data);
      }
    });

    // Restore last remembered search
    try {
      const saved = sessionStorage.getItem(LAST_SEARCH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.keyword) setKeyword(parsed.keyword);
        if (parsed.platform) setPlatform(parsed.platform);
        if (parsed.make) setSelectedMake(parsed.make);
        if (parsed.model) setSelectedModel(parsed.model);
        if (parsed.yearFrom) setYearFrom(parsed.yearFrom);
        if (parsed.yearTo) setYearTo(parsed.yearTo);
        if (parsed.vehicleTypeId) setVehicleTypeId(parsed.vehicleTypeId);
      }
    } catch {
      // Ignore parse errors
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Close make dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(e.target as Node)) {
        setIsMakeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch dynamic Series & Generation when Make changes
  useEffect(() => {
    if (!selectedMake || selectedMake === 'All') {
      setSeriesList([]);
      setGenerationList([]);
      setSeries('All');
      setGeneration('All');
      return;
    }

    let isMounted = true;
    getAuctionFilterOptions(selectedMake, series !== 'All' ? series : undefined, selectedModel !== 'All' ? selectedModel : undefined).then((res) => {
      if (isMounted) {
        if (res.seriesOptionsByMake[selectedMake]) {
          setSeriesList(res.seriesOptionsByMake[selectedMake]);
        }
        if (res.generationOptionsByMakeAndModel[selectedMake]) {
          setGenerationList(res.generationOptionsByMakeAndModel[selectedMake]);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedMake, series, selectedModel]);

  // Models available for selected make
  const availableModels = useMemo(() => {
    if (!selectedMake || selectedMake === 'All') return [];
    return metadata.modelsByMake[selectedMake.toUpperCase()] || [];
  }, [selectedMake, metadata.modelsByMake]);

  // Filtered makes for combobox
  const filteredMakes = useMemo(() => {
    if (!makeSearchText.trim()) return metadata.makes;
    const q = makeSearchText.toLowerCase();
    return metadata.makes.filter((m) => m.toLowerCase().includes(q));
  }, [makeSearchText, metadata.makes]);

  // Handle Make selection & reset dependents
  const handleSelectMake = (makeName: string) => {
    setSelectedMake(makeName);
    setSelectedModel('All');
    setSeries('All');
    setGeneration('All');
    setIsMakeDropdownOpen(false);
    setMakeSearchText('');
  };

  // Year options: newest first (from next year 2027 down to 1980)
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = nextYear; y >= 1980; y--) {
      years.push(y);
    }
    return years;
  }, [nextYear]);

  // Count active filters (excluding defaults)
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (platform !== 'All') {
      chips.push({ id: 'platform', label: `Platform: ${platform}`, onRemove: () => setPlatform('All') });
    }
    if (selectedMake !== 'All') {
      chips.push({ id: 'make', label: `Make: ${selectedMake}`, onRemove: () => handleSelectMake('All') });
    }
    if (selectedModel !== 'All') {
      chips.push({ id: 'model', label: `Model: ${selectedModel}`, onRemove: () => setSelectedModel('All') });
    }
    if (yearFrom) {
      chips.push({ id: 'yearFrom', label: `Year >= ${yearFrom}`, onRemove: () => setYearFrom('') });
    }
    if (yearTo) {
      chips.push({ id: 'yearTo', label: `Year <= ${yearTo}`, onRemove: () => setYearTo('') });
    }
    if (vehicleTypeId !== 'All') {
      const typeObj = metadata.types.find((t) => String(t.id) === vehicleTypeId);
      chips.push({ id: 'type', label: `Type: ${typeObj ? typeObj.name : vehicleTypeId}`, onRemove: () => setVehicleTypeId('All') });
    }
    if (series !== 'All') {
      chips.push({ id: 'series', label: `Series: ${series}`, onRemove: () => setSeries('All') });
    }
    if (generation !== 'All') {
      chips.push({ id: 'generation', label: `Gen: ${generation}`, onRemove: () => setGeneration('All') });
    }
    if (lotStatus !== 'All') {
      chips.push({ id: 'lotStatus', label: `Status: ${lotStatus}`, onRemove: () => setLotStatus('All') });
    }
    if (subStatus !== 'Open') {
      chips.push({ id: 'subStatus', label: `Auction: ${subStatus}`, onRemove: () => setSubStatus('Open') });
    }
    if (runningCondition !== 'All') {
      chips.push({ id: 'runCond', label: `Condition: ${runningCondition}`, onRemove: () => setRunningCondition('All') });
    }
    if (hasKey !== 'All') {
      chips.push({ id: 'hasKey', label: `Keys: ${hasKey}`, onRemove: () => setHasKey('All') });
    }
    if (priceMin) {
      chips.push({ id: 'priceMin', label: `Min $: ${Number(priceMin).toLocaleString()}`, onRemove: () => setPriceMin('') });
    }
    if (priceMax) {
      chips.push({ id: 'priceMax', label: `Max $: ${Number(priceMax).toLocaleString()}`, onRemove: () => setPriceMax('') });
    }
    if (odometerFrom) {
      chips.push({ id: 'odoFrom', label: `Odo >= ${Number(odometerFrom).toLocaleString()} mi`, onRemove: () => setOdometerFrom('') });
    }
    if (odometerTo) {
      chips.push({ id: 'odoTo', label: `Odo <= ${Number(odometerTo).toLocaleString()} mi`, onRemove: () => setOdometerTo('') });
    }
    if (selectedDamages.length > 0) {
      chips.push({ id: 'damage', label: `Damage: ${selectedDamages.join(', ')}`, onRemove: () => setSelectedDamages([]) });
    }
    if (selectedFuels.length > 0) {
      chips.push({ id: 'fuel', label: `Fuel: ${selectedFuels.join(', ')}`, onRemove: () => setSelectedFuels([]) });
    }
    if (selectedTransmissions.length > 0) {
      chips.push({ id: 'trans', label: `Transmission: ${selectedTransmissions.join(', ')}`, onRemove: () => setSelectedTransmissions([]) });
    }
    if (selectedDriveTypes.length > 0) {
      chips.push({ id: 'drive', label: `Drive: ${selectedDriveTypes.join(', ')}`, onRemove: () => setSelectedDriveTypes([]) });
    }
    if (selectedColors.length > 0) {
      chips.push({ id: 'color', label: `Color: ${selectedColors.join(', ')}`, onRemove: () => setSelectedColors([]) });
    }

    return chips;
  }, [
    platform, selectedMake, selectedModel, yearFrom, yearTo, vehicleTypeId,
    series, generation, lotStatus, subStatus, runningCondition, hasKey,
    priceMin, priceMax, odometerFrom, odometerTo, selectedDamages, selectedFuels,
    selectedTransmissions, selectedDriveTypes, selectedColors, metadata.types
  ]);

  const resetAllFilters = () => {
    setKeyword('');
    setPlatform('All');
    setSelectedMake('All');
    setSelectedModel('All');
    setYearFrom('');
    setYearTo('');
    setVehicleTypeId('All');
    setSeries('All');
    setGeneration('All');
    setLotStatus('All');
    setSubStatus('Open');
    setRunningCondition('All');
    setHasKey('All');
    setPriceMin('');
    setPriceMax('');
    setOdometerFrom('');
    setOdometerTo('');
    setEngineSizeFrom('');
    setEngineSizeTo('');
    setSelectedColors([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedDriveTypes([]);
    setSelectedDamages([]);
    setSelectedCylinders([]);
    setEngineType('All');
    try {
      sessionStorage.removeItem(LAST_SEARCH_KEY);
    } catch {}
  };

  // Submit search and navigate to /auction-search
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const filters: AuctionFilterValues = {};

    if (keyword.trim()) filters.s = keyword.trim();

    if (platform === 'Copart') filters.auction_type = '1';
    else if (platform === 'IAAI') filters.auction_type = '2';

    if (selectedMake !== 'All') filters.make = selectedMake;
    if (selectedModel !== 'All') filters.model = selectedModel;
    if (series !== 'All') filters.series = series;
    if (generation !== 'All') filters.generation = generation;

    if (vehicleTypeId !== 'All') filters.type_id = vehicleTypeId;

    if (yearFrom) filters.year_from = yearFrom;
    if (yearTo) filters.year_to = yearTo;

    if (priceMin && Number(priceMin) > 0) filters.price_min = priceMin;
    if (priceMax && Number(priceMax) < 250000) filters.price_max = priceMax;

    if (odometerFrom && Number(odometerFrom) > 0) filters.odometer_from = odometerFrom;
    if (odometerTo && Number(odometerTo) < 500000) filters.odometer_to = odometerTo;

    if (engineSizeFrom && Number(engineSizeFrom) > 0) filters.engine_size_from = engineSizeFrom;
    if (engineSizeTo && Number(engineSizeTo) < 20) filters.engine_size_to = engineSizeTo;

    if (lotStatus !== 'All') filters.lot_status = lotStatus;
    if (subStatus !== 'Open') filters.lot_sub_status = subStatus;

    if (runningCondition !== 'All') filters.running_condition = runningCondition;
    if (hasKey !== 'All') filters.has_key = hasKey;

    if (selectedColors.length > 0) filters.color = selectedColors;
    if (selectedFuels.length > 0) filters.fuel_type = selectedFuels;
    if (selectedTransmissions.length > 0) filters.transmission = selectedTransmissions;
    if (selectedDriveTypes.length > 0) filters.drive_type = selectedDriveTypes;
    if (selectedDamages.length > 0) filters.damage = selectedDamages;
    if (selectedCylinders.length > 0) filters.cylinders = selectedCylinders;
    if (engineType !== 'All') filters.engine_type = [engineType];

    // Save to remember last search
    try {
      sessionStorage.setItem(
        LAST_SEARCH_KEY,
        JSON.stringify({
          keyword,
          platform,
          make: selectedMake,
          model: selectedModel,
          yearFrom,
          yearTo,
          vehicleTypeId,
        })
      );
    } catch {}

    const queryString = buildFilterQuery(filters);
    navigate(`/auction-search${queryString ? `?${queryString}` : ''}`);
  };

  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div id="auction-search" className="w-full relative z-20">
      <div className={`p-4 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-zinc-950/85 border-white/15 shadow-black/80 text-white' 
          : 'bg-white/95 border-slate-200/80 shadow-slate-300/40 text-slate-900'
      }`}>
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* PRIMARY ROW: ALWAYS VISIBLE ON ALL BREAKPOINTS (Input + Search Button) */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="VIN, lot number, make or model (e.g. 2021 RX 350, WBAVL...)"
                className={`w-full min-h-[48px] px-4 pl-11 text-sm sm:text-base rounded-2xl border outline-none font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-[#2B59FF] focus:bg-white/10'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#2B59FF] focus:bg-white'
                }`}
              />
              <Search 
                size={18} 
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                }`} 
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Prominent Search Button - NEVER hidden on mobile */}
            <button
              type="submit"
              className="min-h-[48px] px-8 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-sm sm:text-base font-mono font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer shrink-0"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>

          {/* QUICK-FILTER ROW: Platform, Make (Combobox), Model, Years, Type */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
            {/* 1. Platform Segmented Control (All / Copart / IAAI) */}
            <div className="col-span-2 sm:col-span-1 flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 min-h-[44px]">
              {(['All', 'Copart', 'IAAI'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    platform === p
                      ? 'bg-[#2B59FF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 2. Make: Searchable Combobox */}
            <div className="relative col-span-1" ref={makeDropdownRef}>
              <button
                type="button"
                onClick={() => setIsMakeDropdownOpen((prev) => !prev)}
                className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/15 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="truncate font-bold">
                  {selectedMake === 'All' ? 'Make: All' : selectedMake}
                </span>
                <ChevronDown size={14} className="opacity-60 shrink-0 ml-1" />
              </button>

              {/* Combobox Dropdown Panel */}
              {isMakeDropdownOpen && (
                <div className={`absolute left-0 top-full mt-1.5 w-64 max-h-72 rounded-2xl border shadow-2xl z-50 overflow-hidden flex flex-col ${
                  theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="p-2 border-b border-slate-200 dark:border-white/10">
                    <input
                      type="text"
                      value={makeSearchText}
                      onChange={(e) => setMakeSearchText(e.target.value)}
                      placeholder="Filter makes..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border outline-none bg-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto p-1 max-h-56">
                    <button
                      type="button"
                      onClick={() => handleSelectMake('All')}
                      className={`w-full px-3 py-2 text-left text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                        selectedMake === 'All' ? 'bg-[#2B59FF] text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>All Makes</span>
                      {selectedMake === 'All' && <Check size={12} />}
                    </button>
                    {filteredMakes.slice(0, 80).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMake(m)}
                        className={`w-full px-3 py-2 text-left text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                          selectedMake.toUpperCase() === m.toUpperCase()
                            ? 'bg-[#2B59FF] text-white'
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{m}</span>
                        {selectedMake.toUpperCase() === m.toUpperCase() && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Model: Populated by Make, disabled otherwise */}
            <div className="col-span-1">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={selectedMake === 'All' || availableModels.length === 0}
                className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono font-bold rounded-xl border outline-none transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-[#181818] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="All">{selectedMake === 'All' ? 'Model (Choose Make)' : 'All Models'}</option>
                {availableModels.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            {/* 4. Year From (Dropdown, newest first) */}
            <div className="col-span-1">
              <select
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#181818] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="">Year From</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* 5. Year To (Dropdown, newest first) */}
            <div className="col-span-1">
              <select
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#181818] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="">Year To</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* 6. Vehicle Type Dropdown */}
            <div className="col-span-2 sm:col-span-1">
              <select
                value={vehicleTypeId}
                onChange={(e) => setVehicleTypeId(e.target.value)}
                className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#181818] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="All">All Vehicle Types</option>
                {metadata.types.map((vt) => (
                  <option key={vt.id} value={String(vt.id)}>
                    {vt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* MORE FILTERS TOGGLE & ACTIVE CHIPS ROW */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isMoreOpen || activeChips.length > 0
                    ? 'bg-[#2B59FF]/10 text-[#2B59FF] border-[#2B59FF]/30'
                    : theme === 'dark'
                    ? 'border-white/10 text-white/70 hover:bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>More Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Removable Active Filter Chips */}
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2B59FF] dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-[11px] font-mono"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                    aria-label={`Remove ${chip.label}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-2 py-1 text-[11px] font-mono text-slate-500 hover:text-red-500 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>

            <span className="text-[11px] font-mono opacity-60 hidden sm:inline">
              50,000+ Real North American Salvage & Clean Title Lots
            </span>
          </div>

          {/* MORE FILTERS PANEL (Desktop inline expander / Mobile bottom sheet) */}
          {isMoreOpen && (
            <div className={`mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-4 animate-fadeIn ${
              // Mobile bottom-sheet wrapper styling when on small screen
              'block'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Series (if available for Make) */}
                {seriesList.length > 0 && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Series</label>
                    <select
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
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

                {/* Generation (if available) */}
                {generationList.length > 0 && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Generation</label>
                    <select
                      value={generation}
                      onChange={(e) => setGeneration(e.target.value)}
                      className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
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

                {/* Lot Status (Buy Now / Timed) */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Lot Status</label>
                  <select
                    value={lotStatus}
                    onChange={(e) => setLotStatus(e.target.value)}
                    className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="All">All Lot Statuses</option>
                    <option value="Buy Now">Buy Now</option>
                    <option value="Timed">Timed</option>
                  </select>
                </div>

                {/* Sub Status (Open / Live / Ended) */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Auction Stage</label>
                  <select
                    value={subStatus}
                    onChange={(e) => setSubStatus(e.target.value)}
                    className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Open">Open (Default)</option>
                    <option value="Live">Live</option>
                    <option value="Ended">Ended</option>
                    <option value="All">All Stages</option>
                  </select>
                </div>

                {/* Running Condition */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Running Condition</label>
                  <select
                    value={runningCondition}
                    onChange={(e) => setRunningCondition(e.target.value)}
                    className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="All">All Conditions</option>
                    <option value="RUNS AND DRIVES">Run and Drive</option>
                    <option value="ENGINE START PROGRAM">Vehicle starts</option>
                    <option value="STATIONARY / NO INFORMATION">Stationary / No information</option>
                  </select>
                </div>

                {/* Has Key */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Keys</label>
                  <select
                    value={hasKey}
                    onChange={(e) => setHasKey(e.target.value)}
                    className={`w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="All">All (With or No Key)</option>
                    <option value="With">With Key</option>
                    <option value="No">No Key</option>
                  </select>
                </div>

                {/* Price Min / Max (USD) */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Price USD (Min - Max)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      step="50"
                      min="0"
                      className={`w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      step="50"
                      max="250000"
                      className={`w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Odometer Min / Max */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 opacity-70">Odometer (mi)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min mi"
                      value={odometerFrom}
                      onChange={(e) => setOdometerFrom(e.target.value)}
                      step="500"
                      min="0"
                      className={`w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                    <input
                      type="number"
                      placeholder="Max mi"
                      value={odometerTo}
                      onChange={(e) => setOdometerTo(e.target.value)}
                      step="500"
                      max="500000"
                      className={`w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Multi-select check chips: Damage, Fuel, Transmission, Drive */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 space-y-3">
                {/* Damage Types */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-70">Damage Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {metadata.damageTypes.map((dmg) => {
                      const active = selectedDamages.includes(dmg);
                      return (
                        <button
                          key={dmg}
                          type="button"
                          onClick={() => toggleArrayItem(selectedDamages, setSelectedDamages, dmg)}
                          className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
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

                {/* Fuel & Transmission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-70">Fuel</label>
                    <div className="flex flex-wrap gap-1.5">
                      {metadata.fuels.map((fuel) => {
                        const active = selectedFuels.includes(fuel);
                        return (
                          <button
                            key={fuel}
                            type="button"
                            onClick={() => toggleArrayItem(selectedFuels, setSelectedFuels, fuel)}
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

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 opacity-70">Transmission</label>
                    <div className="flex flex-wrap gap-1.5">
                      {metadata.transmissions.map((t) => {
                        const active = selectedTransmissions.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleArrayItem(selectedTransmissions, setSelectedTransmissions, t)}
                            className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                              active
                                ? 'bg-[#2B59FF] text-white border-[#2B59FF]'
                                : theme === 'dark'
                                ? 'border-white/10 text-white/70 hover:bg-white/5'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
