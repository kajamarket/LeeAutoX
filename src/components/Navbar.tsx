import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, Search, ArrowRight, MapPin, Gavel } from "lucide-react";
import { NAV_LINKS } from "../constants";
import { useInventory } from "../context/InventoryContext";
import { INITIAL_AUCTION_VEHICLES } from "../data/auctionVehicles";

export default function Navbar() {
  const { vehicles } = useInventory();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Navbar search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = searchQuery.trim().toLowerCase();
  
  // Available cars on ground in Lagos
  const lagosResults = q ? vehicles.filter(v => 
    v.name.toLowerCase().includes(q) ||
    v.make.toLowerCase().includes(q) ||
    v.model.toLowerCase().includes(q) ||
    (v.vin && v.vin.toLowerCase().includes(q)) ||
    (v.specs && v.specs.toLowerCase().includes(q)) ||
    (v.location && v.location.toLowerCase().includes(q)) ||
    String(v.year).includes(q)
  ) : [];

  // Copart and IAA auction vehicles
  const auctionResults = q ? INITIAL_AUCTION_VEHICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.lotNumber.toLowerCase().includes(q) ||
    a.source.toLowerCase().includes(q) ||
    a.location.toLowerCase().includes(q) ||
    a.condition.toLowerCase().includes(q) ||
    a.damage.toLowerCase().includes(q) ||
    q.includes("auction") || q.includes("copart") || q.includes("iaa")
  ) : [];

  const getMenuLinkProps = (label: string, defaultHref: string) => {
    switch (label) {
      case "Home":
        return { to: "/", isRouterLink: true };
      case "About":
        return { to: "/about/", isRouterLink: true };
      case "How It Works":
        return { to: "/how-it-works/", isRouterLink: true };
      case "Catalogue":
      case "Cars for Sale":
        return { to: "/inventory/", isRouterLink: true };
      case "FAQ":
        return { to: "/faq/", isRouterLink: true };
      case "Contact":
        return { to: "/contact/", isRouterLink: true };
      case "Testimonials":
        return { to: "/testimonials/", isRouterLink: true };
      case "Lee Auto Lagos":
        return { to: "/lee-auto/", isRouterLink: true };
      case "Nigeria Hub":
        return { to: "/nigeria/", isRouterLink: true };
      case "Ghana Hub":
        return { to: "/ghana/", isRouterLink: true };
      case "Canada Hub":
        return { to: "/canada/", isRouterLink: true };
      case "All Vehicles":
      case "Luxury Fleet":
      case "Commercial Trucks":
      case "Auction Sourced":
      case "Shipping Services":
        return { to: "/inventory/", isRouterLink: true };
      default:
        return { to: defaultHref, isRouterLink: true };
    }
  };

  const renderLink = (label: string, defaultHref: string, className: string, onClick?: () => void) => {
    const props = getMenuLinkProps(label, defaultHref);
    if (props.isRouterLink) {
      return (
        <Link to={props.to} className={className} onClick={onClick}>
          {label}
        </Link>
      );
    }
    return (
      <a href={props.to} className={className} onClick={onClick}>
        {label}
      </a>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-5 flex items-center justify-between ${
          scrolled ? "bg-black/95 backdrop-blur-lg border-b border-white/10" : "bg-black/70 backdrop-blur-sm"
        }`}
      >
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between w-full"
        >
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-[#2B59FF]">
            <img 
              src="https://leeplugshub.com/wp-content/uploads/2026/05/LeeAutoX-lcon-1-scaled.png" 
              alt="LeeAutoX Icon" 
              className="h-[1.1em] w-auto object-contain"
            />
            LeeAutoX
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.label} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  {renderLink(
                    link.label,
                    link.href,
                    "text-sm font-medium text-white/70 hover:text-white transition-colors tracking-wide py-2"
                  )}
                  {link.children && <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${activeDropdown === link.label ? "rotate-180" : ""}`} />}
                </div>

                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 p-2 shadow-2xl rounded-xl"
                      >
                        {link.children.map((child) => (
                          <div key={child.href}>
                            {renderLink(
                              child.label,
                              child.href,
                              "block px-4 py-3 text-xs font-semibold text-white/60 hover:text-[#2B59FF] hover:bg-white/5 transition-all tracking-widest uppercase rounded-lg"
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Navbar Dual Search Box (Lagos Stock & Copart Lots) */}
            <div className="relative" ref={searchRef}>
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white/80 hover:text-[#2B59FF] transition-colors flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3.5 cursor-pointer active:scale-[0.98]"
                aria-label="Search Inventory"
              >
                <Search size={15} />
                <span className="text-xs font-mono hidden lg:inline">Search cars & lots...</span>
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 md:w-96 bg-black/95 backdrop-blur-2xl border border-white/20 p-4 shadow-2xl z-50 rounded-2xl"
                  >
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search Lagos cars, Copart lots, VIN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#2B59FF] rounded-xl"
                      />
                    </div>

                    {searchQuery.trim() && (
                      <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1 [scrollbar-width:thin]">
                        {lagosResults.length === 0 && auctionResults.length === 0 ? (
                          <p className="text-xs text-white/50 text-center py-4 font-mono">No matching Lagos cars or auction lots found.</p>
                        ) : (
                          <>
                            {lagosResults.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 px-1">
                                  <span>📍 On Ground in Lagos ({lagosResults.length})</span>
                                  <span className="text-[9px] text-white/40">Inspection Ready</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {lagosResults.map(vehicle => (
                                    <Link
                                      key={vehicle.id}
                                      to={`/vehicle/${vehicle.id}`}
                                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                      className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl border border-transparent hover:border-emerald-500/20 transition-all group"
                                    >
                                      <img src={vehicle.image} alt={vehicle.name} className="w-12 h-9 object-cover rounded-lg bg-black shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400">{vehicle.name}</h4>
                                        <div className="flex items-center gap-2 text-[10px] font-mono">
                                          <span className="text-emerald-400 font-bold">{vehicle.price}</span>
                                          <span className="text-white/40">• Ikeja Lot</span>
                                        </div>
                                      </div>
                                      <ArrowRight size={14} className="text-white/40 group-hover:text-emerald-400" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            {auctionResults.length > 0 && (
                              <div className="pt-2 border-t border-white/10">
                                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#2B59FF] uppercase tracking-wider mb-2 px-1">
                                  <span>🔨 Copart & IAA Lots ({auctionResults.length})</span>
                                  <span className="text-[9px] text-white/40">USA & Canada</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {auctionResults.map(lot => (
                                    <a
                                      key={lot.id}
                                      href="#auction-listings"
                                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                      className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl border border-transparent hover:border-[#2B59FF]/20 transition-all group"
                                    >
                                      <img src={lot.image} alt={lot.title} className="w-12 h-9 object-cover rounded-lg bg-black shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase text-white ${
                                            lot.source === "Copart" ? "bg-blue-600" : "bg-red-600"
                                          }`}>
                                            {lot.source}
                                          </span>
                                          <span className="text-[10px] font-mono text-white/50">Lot #{lot.lotNumber}</span>
                                        </div>
                                        <h4 className="text-xs font-bold text-white truncate group-hover:text-[#2B59FF]">{lot.title}</h4>
                                        <span className="text-[10px] font-mono text-amber-300 font-semibold">{lot.isBuyItNow ? lot.buyItNowPrice : `Bid: ${lot.currentBid}`}</span>
                                      </div>
                                      <ArrowRight size={14} className="text-white/40 group-hover:text-[#2B59FF]" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isHome ? (
              <a
                href="#contact"
                className="text-sm font-bold px-6 py-2.5 bg-[#2B59FF] text-white hover:bg-[#1a41cc] active:scale-[0.98] transition-all tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(43,89,255,0.3)]"
              >
                Get a Quote
              </a>
            ) : (
              <Link
                to="/contact/"
                className="text-sm font-bold px-6 py-2.5 bg-[#2B59FF] text-white hover:bg-[#1a41cc] active:scale-[0.98] transition-all tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(43,89,255,0.3)]"
              >
                Get a Quote
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white p-2 bg-white/10 rounded-lg active:scale-95"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="text-white p-2 active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-50 px-6 md:hidden"
          >
            <div className="bg-black/95 backdrop-blur-xl border border-white/20 p-4 shadow-2xl rounded-2xl">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Lagos cars or Copart lots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 pl-10 pr-10 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#2B59FF] rounded-xl"
                />
                <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                  <X size={16} />
                </button>
              </div>

              {searchQuery.trim() && (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                  {lagosResults.length === 0 && auctionResults.length === 0 ? (
                    <p className="text-xs text-white/50 text-center py-4 font-mono">No matching vehicles found.</p>
                  ) : (
                    <>
                      {lagosResults.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                            📍 In Lagos ({lagosResults.length})
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {lagosResults.map(vehicle => (
                              <Link
                                key={vehicle.id}
                                to={`/vehicle/${vehicle.id}`}
                                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 p-2 bg-white/5 rounded-xl"
                              >
                                <img src={vehicle.image} alt="" className="w-10 h-8 object-cover rounded-lg bg-black shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate">{vehicle.name}</h4>
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{vehicle.price}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {auctionResults.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <span className="text-[10px] font-mono font-bold text-[#2B59FF] uppercase tracking-wider block mb-1">
                            🔨 Copart / IAA Lots ({auctionResults.length})
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {auctionResults.map(lot => (
                              <a
                                key={lot.id}
                                href="#auction-listings"
                                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 p-2 bg-white/5 rounded-xl"
                              >
                                <img src={lot.image} alt="" className="w-10 h-8 object-cover rounded-lg bg-black shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate">{lot.title}</h4>
                                  <span className="text-[10px] font-mono text-amber-300 font-semibold">{lot.source} Lot #{lot.lotNumber}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black flex flex-col px-8 pt-24 overflow-y-auto pb-12"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-7 right-6 text-white p-2"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="flex flex-col">
                  {link.children ? (
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full text-2xl font-serif font-bold text-white mb-2"
                      >
                        <span>{link.label}</span>
                        <ChevronDown 
                          size={22} 
                          className={`text-[#2B59FF] transition-transform duration-300 ${activeDropdown === link.label ? "rotate-180" : ""}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden flex flex-col gap-3 pl-4 border-l border-white/10 mt-2"
                          >
                            {link.children.map((child) => (
                              <div key={child.href}>
                                {renderLink(
                                  child.label,
                                  child.href,
                                  "text-xs font-semibold text-white/60 hover:text-[#2B59FF] transition-all tracking-widest uppercase py-2 block",
                                  () => setIsOpen(false)
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div key={link.label}>
                      {renderLink(
                        link.label,
                        link.href,
                        "text-2xl font-serif font-bold text-white hover:text-[#2B59FF] transition-colors block",
                        () => setIsOpen(false)
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isHome ? (
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold px-8 py-4 bg-[#2B59FF] text-white mt-4 tracking-widest uppercase text-sm rounded-xl"
                >
                  Get a Quote
                </a>
              ) : (
                <Link
                  to="/contact/"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold px-8 py-4 bg-[#2B59FF] text-white mt-4 tracking-widest uppercase text-sm rounded-xl"
                >
                  Get a Quote
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
