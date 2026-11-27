import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  getAuctionFilterOptions,
  buildFilterQuery,
} from '../services/auctionService';
import { STATIC_FILTER_METADATA } from '../data/auctionFilters';
import { AuctionFilterValues, FilterOptionsMetadata } from '../types/auction';
import { RippleButton } from './ui/ImportedControls';

const LAST_SEARCH_KEY = 'leeautox_last_hero_search';

export default function HeroSearchWidget() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState<'All' | 'Copart' | 'IAAI'>('All');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [vehicleTypeId, setVehicleTypeId] = useState<string>('All');

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

  const [makeSearchText, setMakeSearchText] = useState('');
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const makeDropdownRef = useRef<HTMLDivElement>(null);

  const [metadata, setMetadata] = useState<FilterOptionsMetadata>({
    makes: STATIC_FILTER_METADATA.makes,
    modelsByMake: STATIC_FILTER_METADATA.modelsByMake,
    seriesOptionsByMake: {},
    generationOptionsByMakeAndModel: {},
    types: STATIC_FILTER_METADATA.types.map((t, idx) => ({ id: t.id ?? idx + 1, name: t.name })),
    colors: STATIC_FILTER_METADATA.colors,
    fuels: STATIC_FILTER_METADATA.fuels,
    transmissions: STATIC_FILTER_METADATA.transmissions,
    driveTypes: STATIC_FILTER_METADATA.driveTypes.map((d: any) =>
      typeof d === 'string' ? { value: d, label: d } : { value: d.value, label: d.label || d.value }
    ),
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

  useEffect(() => {
    let isMounted = true;
    getAuctionFilterOptions().then((data) => {
      if (isMounted && data) {
        setMetadata(data);
      }
    });

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
    } catch {}

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(e.target as Node)) {
        setIsMakeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedMake || selectedMake === 'All') {
      setSeriesList([]);
      setGenerationList([]);
      setSeries('All');
      setGeneration('All');
      return;
    }

    let isMounted = true;
    getAuctionFilterOptions(
      selectedMake,
      series !== 'All' ? series : undefined,
      selectedModel !== 'All' ? selectedModel : undefined
    ).then((res) => {
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

  const availableModels = useMemo(() => {
    if (!selectedMake || selectedMake === 'All') return [];
    return metadata.modelsByMake[selectedMake.toUpperCase()] || [];
  }, [selectedMake, metadata.modelsByMake]);

  const filteredMakes = useMemo(() => {
    if (!makeSearchText.trim()) return metadata.makes;
    const q = makeSearchText.toLowerCase();
    return metadata.makes.filter((m) => m.toLowerCase().includes(q));
  }, [makeSearchText, metadata.makes]);

  const handleSelectMake = (makeName: string) => {
    setSelectedMake(makeName);
    setSelectedModel('All');
    setSeries('All');
    setGeneration('All');
    setIsMakeDropdownOpen(false);
    setMakeSearchText('');
  };

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = nextYear; y >= 1980; y--) {
      years.push(y);
    }
    return years;
  }, [nextYear]);

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (platform !== 'All') chips.push({ id: 'platform', label: `Platform: ${platform}`, onRemove: () => setPlatform('All') });
    if (selectedMake !== 'All') chips.push({ id: 'make', label: `Make: ${selectedMake}`, onRemove: () => handleSelectMake('All') });
    if (selectedModel !== 'All') chips.push({ id: 'model', label: `Model: ${selectedModel}`, onRemove: () => setSelectedModel('All') });
    if (yearFrom) chips.push({ id: 'yearFrom', label: `Year >= ${yearFrom}`, onRemove: () => setYearFrom('') });
    if (yearTo) chips.push({ id: 'yearTo', label: `Year <= ${yearTo}`, onRemove: () => setYearTo('') });
    if (vehicleTypeId !== 'All') {
      const typeObj = metadata.types.find((t) => String(t.id) === vehicleTypeId);
      chips.push({ id: 'type', label: `Type: ${typeObj ? typeObj.name : vehicleTypeId}`, onRemove: () => setVehicleTypeId('All') });
    }
    if (series !== 'All') chips.push({ id: 'series', label: `Series: ${series}`, onRemove: () => setSeries('All') });
    if (generation !== 'All') chips.push({ id: 'generation', label: `Gen: ${generation}`, onRemove: () => setGeneration('All') });
    if (lotStatus !== 'All') chips.push({ id: 'lotStatus', label: `Status: ${lotStatus}`, onRemove: () => setLotStatus('All') });
    if (subStatus !== 'Open') chips.push({ id: 'subStatus', label: `Auction: ${subStatus}`, onRemove: () => setSubStatus('Open') });
    if (runningCondition !== 'All') chips.push({ id: 'runCond', label: `Condition: ${runningCondition}`, onRemove: () => setRunningCondition('All') });
    if (hasKey !== 'All') chips.push({ id: 'hasKey', label: `Keys: ${hasKey}`, onRemove: () => setHasKey('All') });
    if (priceMin) chips.push({ id: 'priceMin', label: `Min $: ${Number(priceMin).toLocaleString()}`, onRemove: () => setPriceMin('') });
    if (priceMax) chips.push({ id: 'priceMax', label: `Max $: ${Number(priceMax).toLocaleString()}`, onRemove: () => setPriceMax('') });
    if (odometerFrom) chips.push({ id: 'odoFrom', label: `Odo >= ${Number(odometerFrom).toLocaleString()} mi`, onRemove: () => setOdometerFrom('') });
    if (odometerTo) chips.push({ id: 'odoTo', label: `Odo <= ${Number(odometerTo).toLocaleString()} mi`, onRemove: () => setOdometerTo('') });
    if (selectedDamages.length > 0) chips.push({ id: 'damage', label: `Damage: ${selectedDamages.join(', ')}`, onRemove: () => setSelectedDamages([]) });
    if (selectedFuels.length > 0) chips.push({ id: 'fuel', label: `Fuel: ${selectedFuels.join(', ')}`, onRemove: () => setSelectedFuels([]) });
    if (selectedTransmissions.length > 0) chips.push({ id: 'trans', label: `Transmission: ${selectedTransmissions.join(', ')}`, onRemove: () => setSelectedTransmissions([]) });
    if (selectedDriveTypes.length > 0) chips.push({ id: 'drive', label: `Drive: ${selectedDriveTypes.join(', ')}`, onRemove: () => setSelectedDriveTypes([]) });
    if (selectedColors.length > 0) chips.push({ id: 'color', label: `Color: ${selectedColors.join(', ')}`, onRemove: () => setSelectedColors([]) });

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
    navigate(`/auction-search/${queryString ? `?${queryString}` : ''}`);
  };

  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) setList(list.filter((x) => x !== item));
    else setList([...list, item]);
  };

  const selectClass =
    'w-full min-h-[44px] px-3 py-2 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer';

  return (
    <div id="auction-search" className="w-full relative z-20">
      <div className="lx-card-padded">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* PRIMARY ROW */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="VIN, lot number, make or model (e.g. 2021 RX 350, WBAVL...)"
                className="w-full min-h-[48px] px-4 pl-11 text-sm sm:text-base rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 outline-none font-medium focus:border-[var(--accent)] transition-colors"
              />
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ink-2)]" />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  aria-label="Clear search text"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <RippleButton
              type="submit"
              variant="primary"
              className="min-h-[48px] px-8 text-sm font-mono uppercase tracking-wider shrink-0"
            >
              <Search size={17} />
              <span>Search</span>
            </RippleButton>
          </div>

          {/* QUICK-FILTER ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
            {/* 1. Platform */}
            <div className="col-span-2 sm:col-span-1 flex items-center p-1 rounded-2xl bg-[var(--surface)] border border-[var(--line)] min-h-[44px]">
              {(['All', 'Copart', 'IAAI'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                    platform === p
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-xs'
                      : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 2. Make Combobox */}
            <div className="relative col-span-1" ref={makeDropdownRef}>
              <button
                type="button"
                onClick={() => setIsMakeDropdownOpen((prev) => !prev)}
                className={`${selectClass} flex items-center justify-between font-bold`}
              >
                <span className="truncate">{selectedMake === 'All' ? 'Make: All' : selectedMake}</span>
                <ChevronDown size={14} className="opacity-60 shrink-0 ml-1" />
              </button>

              {isMakeDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-64 max-h-72 rounded-2xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] shadow-2xl z-[50] overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-[var(--line)]">
                    <input
                      type="text"
                      value={makeSearchText}
                      onChange={(e) => setMakeSearchText(e.target.value)}
                      placeholder="Filter makes..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto p-1 max-h-56">
                    <button
                      type="button"
                      onClick={() => handleSelectMake('All')}
                      className={`w-full px-3 py-2 text-left text-xs font-mono rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                        selectedMake === 'All' ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'hover:bg-[var(--surface)]'
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
                        className={`w-full px-3 py-2 text-left text-xs font-mono rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                          selectedMake.toUpperCase() === m.toUpperCase()
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'hover:bg-[var(--surface)]'
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

            {/* 3. Model */}
            <div className="col-span-1">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={selectedMake === 'All' || availableModels.length === 0}
                className={`${selectClass} font-bold disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <option value="All">{selectedMake === 'All' ? 'Model (Choose Make)' : 'All Models'}</option>
                {availableModels.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            {/* 4. Year From */}
            <div className="col-span-1">
              <select value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className={selectClass}>
                <option value="">Year From</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* 5. Year To */}
            <div className="col-span-1">
              <select value={yearTo} onChange={(e) => setYearTo(e.target.value)} className={selectClass}>
                <option value="">Year To</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* 6. Vehicle Type */}
            <div className="col-span-2 sm:col-span-1">
              <select value={vehicleTypeId} onChange={(e) => setVehicleTypeId(e.target.value)} className={selectClass}>
                <option value="All">All Vehicle Types</option>
                {metadata.types.map((vt) => (
                  <option key={vt.id} value={String(vt.id)}>{vt.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* MORE FILTERS TOGGLE & ACTIVE CHIPS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={`min-h-[42px] px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isMoreOpen || activeChips.length > 0
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/40'
                    : 'border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--accent)]/40'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>More Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 text-[11px] font-mono"
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
                  className="px-2.5 py-1 text-[11px] font-mono text-[var(--ink-2)] hover:text-red-500 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>

            <span className="text-[11px] font-mono text-[var(--ink-2)] hidden sm:inline">
              50,000+ Real North American Salvage &amp; Clean Title Lots
            </span>
          </div>

          {/* MORE FILTERS PANEL */}
          {isMoreOpen && (
            <div className="mt-4 pt-4 border-t border-[var(--line)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {seriesList.length > 0 && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Series</label>
                    <select value={series} onChange={(e) => setSeries(e.target.value)} className={selectClass}>
                      <option value="All">All Series</option>
                      {seriesList.map((s) => (
                        <option key={s.key} value={s.name}>{s.label || s.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {generationList.length > 0 && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Generation</label>
                    <select value={generation} onChange={(e) => setGeneration(e.target.value)} className={selectClass}>
                      <option value="All">All Generations</option>
                      {generationList.map((g) => (
                        <option key={g.id} value={g.generation}>{g.label || g.generation}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Lot Status</label>
                  <select value={lotStatus} onChange={(e) => setLotStatus(e.target.value)} className={selectClass}>
                    <option value="All">All Lot Statuses</option>
                    <option value="Buy Now">Buy Now</option>
                    <option value="Timed">Timed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Auction Stage</label>
                  <select value={subStatus} onChange={(e) => setSubStatus(e.target.value)} className={selectClass}>
                    <option value="Open">Open (Default)</option>
                    <option value="Live">Live</option>
                    <option value="Ended">Ended</option>
                    <option value="All">All Stages</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Running Condition</label>
                  <select value={runningCondition} onChange={(e) => setRunningCondition(e.target.value)} className={selectClass}>
                    <option value="All">All Conditions</option>
                    <option value="RUNS AND DRIVES">Run and Drive</option>
                    <option value="ENGINE START PROGRAM">Vehicle starts</option>
                    <option value="STATIONARY / NO INFORMATION">Stationary / No information</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Keys</label>
                  <select value={hasKey} onChange={(e) => setHasKey(e.target.value)} className={selectClass}>
                    <option value="All">All (With or No Key)</option>
                    <option value="With">With Key</option>
                    <option value="No">No Key</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Price USD (Min - Max)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      step="50"
                      min="0"
                      className="w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      step="50"
                      max="250000"
                      className="w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-[var(--ink-2)]">Odometer (mi)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min mi"
                      value={odometerFrom}
                      onChange={(e) => setOdometerFrom(e.target.value)}
                      step="500"
                      min="0"
                      className="w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                    />
                    <input
                      type="number"
                      placeholder="Max mi"
                      value={odometerTo}
                      onChange={(e) => setOdometerTo(e.target.value)}
                      step="500"
                      max="500000"
                      className="w-1/2 min-h-[44px] px-3 text-xs font-mono rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)] space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 text-[var(--ink-2)]">Damage Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {metadata.damageTypes.map((dmg) => {
                      const active = selectedDamages.includes(dmg);
                      return (
                        <button
                          key={dmg}
                          type="button"
                          onClick={() => toggleArrayItem(selectedDamages, setSelectedDamages, dmg)}
                          className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-all cursor-pointer ${
                            active
                              ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)]'
                              : 'border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--accent)]/40'
                          }`}
                        >
                          {dmg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 text-[var(--ink-2)]">Fuel</label>
                    <div className="flex flex-wrap gap-1.5">
                      {metadata.fuels.map((fuel) => {
                        const active = selectedFuels.includes(fuel);
                        return (
                          <button
                            key={fuel}
                            type="button"
                            onClick={() => toggleArrayItem(selectedFuels, setSelectedFuels, fuel)}
                            className={`px-3 py-1 text-xs font-mono rounded-full border transition-all cursor-pointer ${
                              active
                                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)]'
                                : 'border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]'
                            }`}
                          >
                            {fuel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1.5 text-[var(--ink-2)]">Transmission</label>
                    <div className="flex flex-wrap gap-1.5">
                      {metadata.transmissions.map((t) => {
                        const active = selectedTransmissions.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleArrayItem(selectedTransmissions, setSelectedTransmissions, t)}
                            className={`px-3 py-1 text-xs font-mono rounded-full border transition-all cursor-pointer ${
                              active
                                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)]'
                                : 'border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]'
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
