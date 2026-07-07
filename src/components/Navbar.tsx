import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { cleanPathname } from '../utils/path';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = cleanPathname(location.pathname) === '/';

  const getMenuLinkProps = (label: string, defaultHref: string) => {
    if (!isHome) {
      return { to: defaultHref, isRouterLink: true };
    }
    switch (label) {
      case 'Services':
        return { to: '#services', isRouterLink: false };
      case 'What We Offer':
        return { to: '#services', isRouterLink: false };
      case 'How It Works':
        return { to: '#process', isRouterLink: false };
      case 'Cars For Sale':
        return { to: '#catalogue', isRouterLink: false };
      case 'Parts & Accessories':
        return { to: '#store', isRouterLink: false };
      case 'Testimonials':
        return { to: '#testimonials', isRouterLink: false };
      case 'Contact':
        return { to: '#contact', isRouterLink: false };
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
          scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-black/40 backdrop-blur-sm'
        }`}
      >
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
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
                  {link.children && <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                </div>

                {/* Desktop Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 p-2 shadow-2xl"
                      >
                        {link.children.map((child) => (
                          <div key={child.href}>
                            {renderLink(
                              child.label,
                              child.href,
                              "block px-4 py-3 text-xs font-semibold text-white/60 hover:text-[#2B59FF] hover:bg-white/5 transition-all tracking-widest uppercase"
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            {isHome ? (
              <a
                href="#contact"
                className="text-sm font-bold px-6 py-2.5 bg-[#2B59FF] text-white hover:bg-[#1a41cc] transition-all tracking-widest uppercase shadow-[0_0_20px_rgba(43,89,255,0.3)]"
              >
                Get a Quote
              </a>
            ) : (
              <Link
                to="/contact/"
                className="text-sm font-bold px-6 py-2.5 bg-[#2B59FF] text-white hover:bg-[#1a41cc] transition-all tracking-widest uppercase shadow-[0_0_20px_rgba(43,89,255,0.3)]"
              >
                Get a Quote
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black flex flex-col px-8 pt-24"
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
                        className="flex items-center justify-between w-full text-3xl font-serif font-bold text-white mb-2"
                      >
                        <span>{link.label}</span>
                        <ChevronDown 
                          size={24} 
                          className={`text-[#2B59FF] transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden flex flex-col gap-4 pl-4 border-l border-white/10 mt-2"
                          >
                            {link.children.map((child) => (
                              <div key={child.href}>
                                {renderLink(
                                  child.label,
                                  child.href,
                                  "text-sm font-semibold text-white/60 hover:text-[#2B59FF] transition-all tracking-widest uppercase py-2",
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
                        "text-3xl font-serif font-bold text-white hover:text-[#2B59FF] transition-colors",
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
                  className="text-center font-bold px-8 py-4 bg-[#2B59FF] text-white mt-8 tracking-widest uppercase"
                >
                  Get a Quote
                </a>
              ) : (
                <Link
                  to="/contact/"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold px-8 py-4 bg-[#2B59FF] text-white mt-8 tracking-widest uppercase"
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
