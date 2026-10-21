import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useInventory } from '../context/InventoryContext';
import { getVehicleUrl } from '../data/inventory';
import { useTheme } from '../context/ThemeContext';
import { Search, SlidersHorizontal, ArrowRight, ShieldCheck, Car, CheckCircle2, MessageSquare, RotateCcw } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function InventoryPage() {
  const { theme } = useTheme();
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
    <div className={`min-h-screen pb-24 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#FAFBFD] text-slate-900'
    }`}>
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
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border mb-10 ${
          theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              theme === 'dark' ? 'text-white/50' : 'text-slate-500'
            }`}>
              Currently Available
            </span>
            <span className="font-serif text-2xl font-bold text-[#2B59FF]">
              {inStockCount} Units
            </span>
          </div>
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              theme === 'dark' ? 'text-white/50' : 'text-slate-500'
            }`}>
              Base Starting Price
            </span>
            <span className="font-serif text-2xl font-bold">
              {minPriceFormatted}
            </span>
          </div>
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              theme === 'dark' ? 'text-white/50' : 'text-slate-500'
            }`}>
              Inspection Standard
            </span>
            <span className="font-semibold text-sm sm:text-base text-emerald-500">
              150-Point Certified
            </span>
          </div>
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              theme === 'dark' ? 'text-white/50' : 'text-slate-500'
            }`}>
              Shipping Coverage
            </span>
            <span className="font-semibold text-sm sm:text-base">
              Lagos & West Africa
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={`p-6 rounded-3xl border mb-10 ${
          theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input
                type="text"
                placeholder="Search by make, model, VIN, or features..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                  theme === 'dark'
                    ? 'bg-black/60 border-white/15 text-white placeholder-white/40'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:border-[#2B59FF] ${
                  theme === 'dark'
                    ? 'bg-black/60 border-white/15 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="newest">Sort: Newest Year</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-200/20">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-[#2B59FF] ${
                theme === 'dark' ? 'bg-black/60 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {makes.map(m => (
                <option key={m} value={m}>Make: {m}</option>
              ))}
            </select>

            <select
              value={selectedBody}
              onChange={(e) => setSelectedBody(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-[#2B59FF] ${
                theme === 'dark' ? 'bg-black/60 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {bodyTypes.map(b => (
                <option key={b} value={b}>Body: {b}</option>
              ))}
            </select>

            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-[#2B59FF] ${
                theme === 'dark' ? 'bg-black/60 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {conditions.map(c => (
                <option key={c} value={c}>Condition: {c}</option>
              ))}
            </select>

            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-[#2B59FF] ${
                theme === 'dark' ? 'bg-black/60 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">Budget: All</option>
              <option value="under-20m">Under ₦20M</option>
              <option value="20m-35m">₦20M - ₦35M</option>
              <option value="35m-60m">₦35M - ₦60M</option>
              <option value="over-60m">₦60M+</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-[#2B59FF] ${
                theme === 'dark' ? 'bg-black/60 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="All">Status: All</option>
              <option value="Available">Available Only</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/20 text-xs">
            <span className="font-mono opacity-70">
              Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length} vehicles
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-[#2B59FF] hover:underline font-bold active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className={`p-16 rounded-3xl border text-center ${
            theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Car size={44} className="mx-auto text-slate-400 mb-4 opacity-70" />
            <h3 className="font-serif text-2xl font-bold mb-2">No Vehicles Match Your Search</h3>
            <p className={`text-sm max-w-md mx-auto mb-6 ${
              theme === 'dark' ? 'text-white/60' : 'text-slate-600'
            }`}>
              Try clearing some filters, or request custom vehicle sourcing directly from Canadian and US auctions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#2B59FF] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-colors"
              >
                Reset Filters
              </button>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                  `Hello LeeAutoX! I am looking for a specific vehicle that is not in your current catalogue. Can you source it from Canadian auctions for me?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare size={14} /> Request Custom Sourcing
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'bg-[#181818] border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Photo container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-900 group">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#2B59FF] text-white text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-md shadow-md">
                      {vehicle.condition}
                    </div>
                    {vehicle.status !== 'Available' && (
                      <div className={`absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider font-bold rounded-md shadow-md ${
                        vehicle.status === 'Reserved' ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
                      }`}>
                        {vehicle.status}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-mono opacity-60 mb-1">
                      <span>{vehicle.year} • {vehicle.make}</span>
                      <span>{vehicle.mileage}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2 leading-snug" title={vehicle.name}>
                      {vehicle.name}
                    </h3>
                    <p className={`text-xs font-mono mb-4 truncate ${
                      theme === 'dark' ? 'text-white/60' : 'text-slate-500'
                    }`}>
                      {vehicle.specs}
                    </p>

                    <div className={`p-3 rounded-xl text-xs mb-4 grid grid-cols-2 gap-2 border ${
                      theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      <div>
                        <span className="text-[10px] uppercase font-mono block opacity-60">Transmission</span>
                        <span className="font-semibold">{vehicle.transmission}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono block opacity-60">Location</span>
                        <span className="font-semibold truncate block">{vehicle.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price and View CTA */}
                <div className={`p-6 pt-0 border-t flex items-center justify-between ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-mono block opacity-60">Estimated Cost</span>
                    <span className="text-[#2B59FF] font-bold text-lg font-serif">
                      {vehicle.price}
                    </span>
                  </div>

                  <Link
                    to={getVehicleUrl(vehicle)}
                    className="px-4 py-2.5 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                  >
                    View Vehicle <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Sourcing Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-black text-white relative overflow-hidden border border-white/20 shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-300 block mb-2">
              Auction Brokerage & Pre-Orders
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              Don't See Your Exact Trim or Model?
            </h3>
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed mb-6">
              Our licensed Canadian buyer reps bid live on Copart and IAA lots every week. We'll run full CarFax reports, inspect on-site, and containerize directly to your destination port.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                  `Hello LeeAutoX! I am requesting a vehicle pre-order quotation from North American auctions.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg"
              >
                <MessageSquare size={16} /> Pre-Order on WhatsApp
              </a>
              <Link
                to="/how-it-works"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-white/20"
              >
                Learn How Bidding Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
