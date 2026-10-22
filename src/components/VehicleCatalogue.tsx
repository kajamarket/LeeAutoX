import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Search, SlidersHorizontal, ShieldCheck, MapPin, CheckCircle2, RotateCcw, MessageSquare, Car } from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { getVehicleUrl } from "../data/inventory";
import { useTheme } from "../context/ThemeContext";
import { CONTACT_INFO } from "../constants";

export default function VehicleCatalogue() {
  const { theme } = useTheme();
  const { vehicles, inStockCount, minPriceFormatted } = useInventory();

  // Filter state for available Lagos cars
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
                             (v.location && v.location.toLowerCase().includes(q));
      const matchesMake = filterMake === "All" || v.make.toLowerCase() === filterMake.toLowerCase();
      const matchesBody = filterBody === "All" || v.bodyType.toLowerCase() === filterBody.toLowerCase();
      const matchesBudget = v.numericPrice <= Number(filterBudget);

      return matchesKeyword && matchesMake && matchesBody && matchesBudget;
    });
  }, [vehicles, filterMake, filterBody, filterBudget, searchKeyword]);

  const resetFilters = () => {
    setFilterMake("All");
    setFilterBody("All");
    setFilterBudget("100000000");
    setSearchKeyword("");
  };

  return (
    <section
      id="catalogue"
      className={`relative pt-36 pb-24 px-6 md:px-12 transition-colors duration-500 overflow-hidden ${
        theme === "dark" ? "bg-[#090909] text-white" : "bg-slate-950 text-white"
      }`}
    >
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] text-white">
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
            <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs rounded-full uppercase tracking-wider mb-4 font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available For Inspection Now in Lagos, Nigeria</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] text-white mb-4">
              Cars For Sale in Lagos
            </h1>
            
            <p className="text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-2xl">
              These vehicles are <strong>physically on ground in Lagos, Nigeria</strong> — fully customs-cleared with complete port documentation. Reach out to us today for a physical inspection, and test-drive. Or explore custom auction imports next.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href="https://wa.me/16473896162?text=Hello%20LeeAutoX!%20I%20want%20to%20book%20a%20physical%20inspection%20for%20a%20vehicle%20in%20Lagos."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <MessageSquare size={16} /> Book Inspection
            </a>
            <div className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium text-white/80 border border-white/10 rounded-xl bg-white/[0.04] whitespace-nowrap">
              <MapPin size={16} className="text-emerald-400 shrink-0" />
              <span>5 Pepple Street, Ikeja, Lagos</span>
            </div>
          </div>
        </div>

        {/* Working Search & Filter Controls */}
        <div className="p-6 rounded-3xl border mb-12 bg-white/5 border-white/15 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
              <input
                type="text"
                placeholder="Search available Lagos stock by make, model, or specs..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 focus:outline-none focus:border-[#2B59FF] transition-colors"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className="px-4 py-3 text-xs rounded-xl border border-white/20 bg-black/80 text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer"
              >
                {makes.map(m => (
                  <option key={m} value={m} className="bg-zinc-900 text-white">
                    Make: {m}
                  </option>
                ))}
              </select>

              <select
                value={filterBody}
                onChange={(e) => setFilterBody(e.target.value)}
                className="px-4 py-3 text-xs rounded-xl border border-white/20 bg-black/80 text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer"
              >
                {bodyTypes.map(b => (
                  <option key={b} value={b} className="bg-zinc-900 text-white">
                    Body: {b}
                  </option>
                ))}
              </select>

              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className="px-4 py-3 text-xs rounded-xl border border-white/20 bg-black/80 text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer"
              >
                <option value="100000000" className="bg-zinc-900 text-white">Max Budget: Any</option>
                <option value="20000000" className="bg-zinc-900 text-white">Under ₦20M</option>
                <option value="35000000" className="bg-zinc-900 text-white">Under ₦35M</option>
                <option value="50000000" className="bg-zinc-900 text-white">Under ₦50M</option>
                <option value="70000000" className="bg-zinc-900 text-white">Under ₦70M</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-white/60">
            <span className="font-mono">
              Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length} cars available in Lagos
            </span>
            {(filterMake !== "All" || filterBody !== "All" || filterBudget !== "100000000" || searchKeyword.trim()) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-white font-mono font-bold active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw size={13} /> Reset Active Filters
              </button>
            )}
          </div>
        </div>

        {/* Vehicles Grid with Actual Car Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/60 bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
              <Car size={44} className="text-[#2B59FF] mb-3 opacity-80" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">No Matching Cars on Ground in Lagos</h3>
              <p className="text-xs font-mono max-w-md mb-6">
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
            filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-3xl border border-white/10 bg-[#141414] group overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-300"
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
                        <MapPin size={10} /> Lagos
                      </span>
                      <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                        {vehicle.condition}
                      </span>
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
                    <div className="text-[11px] font-mono text-white/50 mb-1 flex items-center justify-between">
                      <span>{vehicle.year} • {vehicle.make}</span>
                      <span>{vehicle.mileage}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white mb-2 truncate" title={vehicle.name}>
                      {vehicle.name}
                    </h3>

                    <p className="text-xs mb-4 font-mono text-white/60 line-clamp-2">
                      {vehicle.specs}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Price and View CTA */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-white/10 mt-auto">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-white/50 block">Price</span>
                    <span className="text-[#2B59FF] font-bold text-base tracking-tight font-serif">
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
            ))
          )}
        </div>

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
