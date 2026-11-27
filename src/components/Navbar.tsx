import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Search, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "../constants";
import { useInventory } from "../context/InventoryContext";
import { INITIAL_AUCTION_VEHICLES } from "../data/auctionVehicles";
import { RippleLink, TideProgressBar } from "./ui/ImportedControls";

export default function Navbar() {
  const { vehicles } = useInventory();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Preserved search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

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

  const lagosResults = q
    ? vehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          (v.vin && v.vin.toLowerCase().includes(q)) ||
          (v.specs && v.specs.toLowerCase().includes(q)) ||
          (v.location && v.location.toLowerCase().includes(q)) ||
          String(v.year).includes(q)
      )
    : [];

  const auctionResults = q
    ? INITIAL_AUCTION_VEHICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.lotNumber.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.condition.toLowerCase().includes(q) ||
          a.damage.toLowerCase().includes(q) ||
          q.includes("auction") ||
          q.includes("copart") ||
          q.includes("iaa")
      )
    : [];

  const getMenuLinkProps = (label: string, defaultHref: string) => {
    switch (label) {
      case "Home":
        return { to: "/", isRouterLink: true };
      case "About":
        return { to: "/about/", isRouterLink: true };
      case "Services":
        return { to: "/services/", isRouterLink: true };
      case "Cars For Sale":
        return { to: "/inventory/", isRouterLink: true };
      case "Parts & Accessories":
        return { to: "/vehicles/pre-order/", isRouterLink: true };
      case "How It Works":
        return { to: "/how-it-works/", isRouterLink: true };
      case "FAQ":
        return { to: "/faq/", isRouterLink: true };
      case "Testimonials":
        return { to: "/testimonials/", isRouterLink: true };
      case "Contact":
        return { to: "/contact/", isRouterLink: true };
      default:
        return {
          to: defaultHref,
          isRouterLink: defaultHref.startsWith("/") && !defaultHref.startsWith("/#"),
        };
    }
  };

  const renderLink = (label: string, defaultHref: string, className: string, onClick?: () => void) => {
    const props = getMenuLinkProps(label, defaultHref);
    const active = props.isRouterLink && location.pathname === props.to;
    if (props.isRouterLink) {
      return (
        <Link to={props.to} data-active={active ? "true" : "false"} className={className} onClick={onClick}>
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
      <header className="lx-nav-entrance fixed top-3 left-0 right-0 z-[var(--z-nav)] px-3 sm:px-6 pointer-events-none">
        <nav
          aria-label="Primary navigation"
          className={`pointer-events-auto relative mx-auto max-w-7xl rounded-full px-4 sm:px-6 transition-all duration-300 ${
            scrolled ? "lx-glass py-2.5" : "lx-glass py-3"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="lx-logo-link group flex items-center gap-2.5 font-serif text-lg sm:text-xl font-normal tracking-tight text-[var(--ink)] shrink-0"
            >
              <img
                src="https://leeplugshub.com/wp-content/uploads/2026/05/LeeAutoX-lcon-1-scaled.png"
                alt="LeeAutoX Icon"
                className="lx-logo-mark h-[1.15em] w-auto object-contain"
              />
              <span>LeeAutoX</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
                      "lx-nav-link text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors py-1.5 whitespace-nowrap"
                    )}
                    {link.children && (
                      <ChevronDown
                        size={14}
                        className={`text-[var(--ink-2)] transition-transform duration-300 ${
                          activeDropdown === link.label ? "rotate-180 text-[var(--accent)]" : ""
                        }`}
                      />
                    )}
                  </div>

                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 pt-2 w-56 z-[var(--z-dropdown)]">
                      <div className="lx-card p-2">
                        {link.children.map((child) => (
                          <div key={child.href}>
                            {renderLink(
                              child.label,
                              child.href,
                              "block px-4 py-2.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors tracking-wider uppercase rounded-xl"
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Internal Search State Preserved */}
              <div className="relative hidden" style={{ display: "none" }} ref={searchRef}>
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search Inventory"
                  style={{ display: "none" }}
                >
                  <Search size={15} />
                </button>
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 md:w-96 lx-card p-4 z-[var(--z-dropdown)]">
                    <input
                      type="text"
                      placeholder="Search Lagos cars, Copart lots, VIN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--line)] px-4 py-2 text-xs rounded-xl"
                    />
                    {searchQuery.trim() && (
                      <div className="mt-2 max-h-60 overflow-y-auto space-y-1">
                        {lagosResults.map((v) => (
                          <Link key={v.id} to={`/vehicle/${v.id}`} className="block text-xs py-1">
                            {v.name} <ArrowRight size={12} className="inline" />
                          </Link>
                        ))}
                        {auctionResults.map((a) => (
                          <a key={a.id} href="#auction-listings" className="block text-xs py-1">
                            {a.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isHome ? (
                <a
                  href="#contact"
                  className="lx-pill-btn !min-h-[40px] !px-5 bg-[var(--accent)] text-[var(--accent-ink)] text-xs tracking-wider uppercase shadow-sm hover:opacity-92 whitespace-nowrap"
                >
                  Get a Quote
                </a>
              ) : (
                <RippleLink
                  to="/contact/"
                  variant="primary"
                  className="!min-h-[40px] !px-5 text-xs tracking-wider uppercase whitespace-nowrap"
                >
                  Get a Quote
                </RippleLink>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)]/80 text-[var(--ink)] cursor-pointer active:scale-95"
                aria-label="Toggle Menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>

          <div className="absolute left-6 right-6 -bottom-[1px] overflow-hidden rounded-full pointer-events-none">
            <TideProgressBar />
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-x-3 top-20 z-[var(--z-dropdown)] md:hidden lx-drawer-wrap`}
        data-open={isOpen ? "true" : "false"}
      >
        <div className="lx-drawer-inner">
          <div className="lx-card p-6 max-h-[calc(100dvh-100px)] overflow-y-auto space-y-5 shadow-2xl">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="border-b border-[var(--line)] pb-4 last:border-b-0 last:pb-0">
                {link.children ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                      className="flex items-center justify-between w-full font-serif text-xl text-[var(--ink)] cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={18}
                        className={`text-[var(--accent)] transition-transform duration-300 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className="lx-accordion-body"
                      data-open={activeDropdown === link.label ? "true" : "false"}
                    >
                      <div className="lx-accordion-inner pt-3 pl-4 border-l border-[var(--line)] space-y-2.5">
                        {link.children.map((child) => (
                          <div key={child.href}>
                            {renderLink(
                              child.label,
                              child.href,
                              "text-xs font-mono font-semibold text-[var(--ink-2)] hover:text-[var(--accent)] tracking-wider uppercase py-1 block",
                              () => setIsOpen(false)
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  renderLink(
                    link.label,
                    link.href,
                    "font-serif text-xl text-[var(--ink)] hover:text-[var(--accent)] transition-colors block",
                    () => setIsOpen(false)
                  )
                )}
              </div>
            ))}

            <div className="pt-2">
              {isHome ? (
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="lx-pill-btn w-full bg-[var(--accent)] text-[var(--accent-ink)] text-xs uppercase tracking-widest"
                >
                  Get a Quote
                </a>
              ) : (
                <RippleLink
                  to="/contact/"
                  variant="primary"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-xs uppercase tracking-widest"
                >
                  Get a Quote
                </RippleLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
