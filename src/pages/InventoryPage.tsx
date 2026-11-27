import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { useInventory } from '../context/InventoryContext';
import { getVehicleUrl } from '../data/inventory';
import { Search, ArrowRight, Car, MessageSquare, RotateCcw } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import SoldWatermark from '../components/SoldWatermark';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import { BreathOrb, LeafTabs, LikeBurstButton, RippleButton, RippleLink } from '../components/ui/ImportedControls';

export default function InventoryPage() {
  const { vehicles, inStockCount, minPriceFormatted } = useInventory();

  const [keyword, setKeyword] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedBody, setSelectedBody] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const makes = useMemo(() => ['All', ...Array.from(new Set(vehicles.map(v => v.make)))], [vehicles]);
  const bodyTypes = useMemo(() => ['All', ...Array.from(new Set(vehicles.map(v => v.bodyType)))], [vehicles]);
  const conditions = useMemo(() => ['All', ...Array.from(new Set(vehicles.map(v => v.condition)))], [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        const matchesKeyword =
          !keyword.trim() ||
          v.name.toLowerCase().includes(keyword.toLowerCase()) ||
          v.make.toLowerCase().includes(keyword.toLowerCase()) ||
          v.model.toLowerCase().includes(keyword.toLowerCase()) ||
          v.specs.toLowerCase().includes(keyword.toLowerCase()) ||
          (v.vin && v.vin.toLowerCase().includes(keyword.toLowerCase()));

        const matchesMake = selectedMake === 'All' || v.make.toLowerCase() === selectedMake.toLowerCase();
        const matchesBody = selectedBody === 'All' || v.bodyType.toLowerCase() === selectedBody.toLowerCase();
        const matchesCondition = selectedCondition === 'All' || v.condition.toLowerCase() === selectedCondition.toLowerCase();
        const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;

        let matchesBudget = true;
        if (selectedBudget === 'under-20m') matchesBudget = v.numericPrice <= 20000000;
        else if (selectedBudget === '20m-35m') matchesBudget = v.numericPrice > 20000000 && v.numericPrice <= 35000000;
        else if (selectedBudget === '35m-60m') matchesBudget = v.numericPrice > 35000000 && v.numericPrice <= 60000000;
        else if (selectedBudget === 'over-60m') matchesBudget = v.numericPrice > 60000000;

        return matchesKeyword && matchesMake && matchesBody && matchesCondition && matchesStatus && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
        if (sortBy === 'price-desc') return b.numericPrice - a.numericPrice;
        return b.year - a.year;
      });
  }, [vehicles, keyword, selectedMake, selectedBody, selectedCondition, selectedStatus, selectedBudget, sortBy]);

  const resetFilters = () => {
    setKeyword('');
    setSelectedMake('All');
    setSelectedBody('All');
    setSelectedCondition('All');
    setSelectedBudget('all');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pb-24 transition-colors duration-300">
      <PageHeader
        title="Verified Vehicle Catalogue"
        subtitle="Browse our active stock of verified SUVs, sedans, and trucks physically on ground for immediate inspection in Lagos, Nigeria, or pre-order custom units directly from North American auctions."
        breadcrumbs={[
          { name: 'Home', item: 'https://leeautox.com/' },
          { name: 'Catalogue', item: 'https://leeautox.com/inventory/' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        {/* Inventory Quick Stats Bar */}
        <Reveal variant="rise" immediate>
          <div className="lx-card grid grid-cols-2 sm:grid-cols-4 gap-5 p-6 mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink-2)] block mb-1">
                Currently Available
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-normal text-[var(--accent)] tabular-nums">
                <AnimatedText text={`${inStockCount} Units`} variant="counter" trigger="mount" />
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink-2)] block mb-1">
                Base Starting Price
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-normal text-[var(--ink)] tabular-nums">
                {minPriceFormatted}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink-2)] block mb-1">
                Inspection Standard
              </span>
              <span className="font-sans font-semibold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                150-Point Certified
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink-2)] block mb-1">
                Shipping Coverage
              </span>
              <span className="font-sans font-semibold text-sm sm:text-base text-[var(--ink)]">
                Lagos & West Africa
              </span>
            </div>
          </div>
        </Reveal>

        {/* Filter Controls Bar */}
        <Reveal variant="rise" immediate delay={70}>
          <div className="lx-card p-6 sm:p-7 mb-10">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" size={18} />
                <input
                  type="text"
                  placeholder="Search by make, model, VIN, or features..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full min-h-[46px] pl-12 pr-4 py-3 rounded-2xl text-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/70 focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="w-full lg:w-56">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc')}
                  aria-label="Sort vehicles"
                  className="w-full min-h-[46px] px-4 py-3 rounded-2xl text-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  <option value="newest">Sort: Newest Year</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--line)]">
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                aria-label="Filter by make"
                className="min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {makes.map(m => (
                  <option key={m} value={m}>Make: {m}</option>
                ))}
              </select>

              <select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
                aria-label="Filter by body type"
                className="min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {bodyTypes.map(b => (
                  <option key={b} value={b}>Body: {b}</option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                aria-label="Filter by condition"
                className="min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {conditions.map(c => (
                  <option key={c} value={c}>Condition: {c}</option>
                ))}
              </select>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                aria-label="Filter by budget"
                className="min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="all">Budget: All</option>
                <option value="under-20m">Under ₦20M</option>
                <option value="20m-35m">₦20M - ₦35M</option>
                <option value="35m-60m">₦35M - ₦60M</option>
                <option value="over-60m">₦60M+</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-[var(--line)]">
              <div className="flex flex-wrap items-center gap-3">
                <LeafTabs
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Available', label: 'Available' },
                    { value: 'Reserved', label: 'Reserved' },
                    { value: 'Sold', label: 'Sold' },
                  ]}
                />
                <span className="text-xs font-mono text-[var(--ink-2)] tabular-nums">
                  Showing <strong className="text-[var(--ink)]">{filteredVehicles.length}</strong> of {vehicles.length}
                </span>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent)] hover:underline cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            </div>
          </div>
        </Reveal>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="lx-card p-12 sm:p-16 text-center">
            <Car size={44} className="mx-auto text-[var(--accent)] mb-4 opacity-80" />
            <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-2 text-[var(--ink)]">
              No Vehicles Match Your Search
            </h3>
            <p className="text-sm max-w-md mx-auto mb-7 text-[var(--ink-2)]">
              Try clearing some filters, or request custom vehicle sourcing directly from Canadian and US auctions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <RippleButton type="button" onClick={resetFilters}>
                Reset Filters
              </RippleButton>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                  `Hello LeeAutoX! I am looking for a specific vehicle that is not in your current catalogue. Can you source it from Canadian auctions for me?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="lx-pill-btn bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <MessageSquare size={15} /> Request Custom Sourcing
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, idx) => (
              <Reveal key={vehicle.id} variant="rise" delay={(idx % 6) * 45} className="h-full">
                <article className="lx-card h-full overflow-hidden flex flex-col justify-between group hover:-translate-y-1">
                  <div>
                    {/* Photo container */}
                    <div className="aspect-[16/10] overflow-hidden relative bg-black/90">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('leeautox.com/cars/')) {
                            target.src = target.src.replace('https://leeautox.com/cars/', '/cars/');
                          }
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[var(--accent)] text-[var(--accent-ink)] text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-full shadow-md">
                        {vehicle.location === "Canada & USA" ? "Located Overseas" : vehicle.condition}
                      </div>
                      {vehicle.status !== 'Available' && (
                        <div className={`absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-full shadow-md ${
                          vehicle.status === 'Reserved' ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
                        }`}>
                          {vehicle.status}
                        </div>
                      )}

                      {/* Sold Watermark Overlay */}
                      {vehicle.status?.toLowerCase() === 'sold' && (
                        <SoldWatermark size="card" />
                      )}

                      <div className="absolute bottom-3 left-3 z-10">
                        <LikeBurstButton ariaLabel={`Save ${vehicle.name}`} />
                      </div>

                      {/* Gallery Image Count Indicator */}
                      <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 border border-white/20 shadow-sm pointer-events-none z-10 tabular-nums">
                        <span>1/{vehicle.images && vehicle.images.length > 0 ? vehicle.images.length : 1}</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-2)] mb-1.5 tabular-nums">
                        <span>{vehicle.year} • {vehicle.make}</span>
                        <span>{vehicle.mileage}</span>
                      </div>
                      <h3 className="font-serif text-xl font-normal text-[var(--ink)] mb-2 leading-snug" title={vehicle.name}>
                        {vehicle.name}
                      </h3>
                      <p className="text-xs font-mono text-[var(--ink-2)] mb-4 truncate">
                        {vehicle.location === "Canada & USA" ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Reserve Deposit: {vehicle.deposit || '₦10,000 min'}
                          </span>
                        ) : (
                          vehicle.specs
                        )}
                      </p>

                      <div className="p-3.5 rounded-2xl text-xs mb-2 grid grid-cols-2 gap-2 border border-[var(--line)] bg-[var(--surface)]">
                        <div>
                          <span className="text-[10px] uppercase font-mono block text-[var(--ink-2)]">Transmission</span>
                          <span className="font-semibold text-[var(--ink)]">{vehicle.transmission}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono block text-[var(--ink-2)]">Location</span>
                          <span className="font-semibold text-[var(--ink)] truncate block">{vehicle.currentLocation || vehicle.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Price and View CTA */}
                  <div className="px-6 py-4 border-t border-[var(--line)] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono block text-[var(--ink-2)]">Estimated Cost</span>
                      <span className="text-[var(--accent)] font-normal text-lg font-serif tabular-nums">
                        {vehicle.price}
                      </span>
                    </div>

                    <RippleLink to={getVehicleUrl(vehicle)} className="px-4 py-2 text-xs">
                      View Vehicle <ArrowRight size={14} />
                    </RippleLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {/* Custom Sourcing Banner */}
        <Reveal variant="rise" className="mt-16">
          <div className="lx-band-dark relative overflow-hidden rounded-[28px] border border-[var(--line)] p-8 sm:p-12 shadow-xl">
            <BreathOrb className="w-72 h-72 -top-20 -right-12" />
            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--accent)] block mb-2">
                Auction Brokerage & Pre-Orders
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal mb-3">
                Don&apos;t See Your Exact Trim or Model?
              </h3>
              <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed mb-7">
                Our licensed Canadian buyer reps bid live on Copart and IAA lots every week. We&apos;ll run full CarFax reports, inspect on-site, and containerize directly to your destination port.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello LeeAutoX! I am requesting a vehicle pre-order quotation from North American auctions.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)]"
                >
                  <MessageSquare size={15} /> Pre-Order on WhatsApp
                </a>
                <RippleLink
                  to="/how-it-works/"
                  variant="outline"
                  className="!text-white !border-white/25 hover:!border-white"
                >
                  Learn How Bidding Works
                </RippleLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

