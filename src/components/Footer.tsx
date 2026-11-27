import { Link } from 'react-router-dom';
import Reveal from './ui/Reveal';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lx-band-dark relative border-t border-[var(--line)] px-6 md:px-12 py-16 md:py-20 overflow-hidden transition-colors duration-500">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-grid absolute inset-0 opacity-55" />
      </div>
      <div className="relative z-[1] max-w-7xl mx-auto">
        <Reveal variant="rise">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">
            {/* Brand Column */}
            <div className="max-w-xs">
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 font-serif text-2xl text-[var(--ink)] mb-4"
              >
                <img
                  src="https://leeplugshub.com/wp-content/uploads/2026/05/LeeAutoX-lcon-1-scaled.png"
                  alt="LeeAutoX Icon"
                  className="lx-logo-mark h-[1.15em] w-auto object-contain"
                />
                <span>LeeAutoX</span>
              </Link>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                Premium vehicle procurement and international shipping from North America to Nigeria and Africa.
              </p>
              <div className="text-xs text-[var(--ink-2)] mt-4 leading-relaxed">
                Gadgets &amp; tech imports?{' '}
                <a
                  href="https://leeplugshub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline hover:opacity-80"
                >
                  Visit Leeplugshub.com
                </a>
              </div>
            </div>

            {/* Link Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
              <div>
                <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] mb-4">
                  Services
                </h4>
                <ul className="space-y-2.5">
                  <li><Link to="/services/vehicle-sourcing/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Car Sourcing</Link></li>
                  <li><Link to="/vehicles/pre-order/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Pre-Orders</Link></li>
                  <li><Link to="/services/shipping-containerization/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Logistics</Link></li>
                  <li><Link to="/services/installment-plans/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Installment Plans</Link></li>
                  <li><Link to="/lee-auto/" className="text-sm text-[var(--accent)] font-semibold hover:underline transition-colors">Lee Auto Lagos</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] mb-4">
                  Resources
                </h4>
                <ul className="space-y-2.5">
                  <li><Link to="/about/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">About Us</Link></li>
                  <li><Link to="/guides/why-import-cars-from-canada/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Why Canada?</Link></li>
                  <li><Link to="/guides/import-car-canada-to-nigeria/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Import Guide</Link></li>
                  <li><Link to="/guides/shipping-cost-canada-to-nigeria/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Shipping Costs</Link></li>
                  <li><Link to="/guides/roro-vs-container-shipping-canada-to-nigeria/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">RoRo vs Container</Link></li>
                  <li><Link to="/faq/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">FAQ Hub</Link></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] mb-4">
                  Regional Hubs
                </h4>
                <ul className="space-y-2.5">
                  <li><Link to="/nigeria/lagos/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Lagos, Nigeria</Link></li>
                  <li><Link to="/ghana/accra/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Accra, Ghana</Link></li>
                  <li><Link to="/canada/toronto/" className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">Toronto, Canada</Link></li>
                  <li><Link to="/nigeria/import-duty-calculator/" className="text-sm text-[var(--accent)] font-semibold hover:underline transition-colors">Customs Calculator</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Corporate Trust & Physical Presence Bar */}
        <div className="border-t border-[var(--line)] py-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--ink-2)]">
          <div>
            <span className="font-semibold text-[var(--ink)] block mb-0.5">
              Canada Headquarters (Corporation No: 1761065-3):
            </span>
            <span>109 Slan Ave, Scarborough, ON M1G 3B7, Canada</span>
          </div>
          <div>
            <span className="font-semibold text-[var(--ink)] block mb-0.5">
              Nigeria Operations &amp; Handover Office:
            </span>
            <span>5 Pepple Street, Computer Village, Ikeja, Lagos, Nigeria</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--line)] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-[var(--ink-2)] font-mono">
            © {currentYear} LeeAutoX. All rights reserved. | Licensed Canadian Dealer Wholesale Sourcing
          </div>
          <div className="text-xs text-[var(--ink-2)] font-mono">
            Trusted vehicle sourcing across Africa.
          </div>
        </div>
      </div>
    </footer>
  );
}
