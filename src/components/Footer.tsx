import { NAV_LINKS } from '../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 md:px-12 py-16 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand Column */}
          <div className="max-w-xs">
            <a href="#" className="font-serif text-2xl font-bold block mb-4">
              LeeAutoX
            </a>
            <p className="text-sm text-background/60 leading-relaxed">
              Premium vehicle procurement and international shipping from North America to Nigeria and Africa. Based in Ontario, Canada.
            </p>
            <div className="text-xs text-background/40 mt-4 leading-relaxed">
              Gadgets & tech imports?{' '}
              <a 
                href="https://leeplugshub.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-background/70"
              >
                Visit Leeplugshub.com
              </a>
            </div>
          </div>

          {/* Link Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-background/40 mb-4">
                Services
              </h4>
              <ul className="space-y-2">
                <li><a href="#services" className="text-sm text-background/70 hover:text-background transition-colors">Car Sourcing</a></li>
                <li><a href="#services" className="text-sm text-background/70 hover:text-background transition-colors">Pre-Orders</a></li>
                <li><a href="#services" className="text-sm text-background/70 hover:text-background transition-colors">Shipping & Logistics</a></li>
                <li><a href="#services" className="text-sm text-background/70 hover:text-background transition-colors">Installment Plans</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-background/40 mb-4">
                Imports
              </h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-background/70">Luxury Vehicles</span></li>
                <li><span className="text-sm text-background/70">Commercial Vehicles</span></li>
                <li><a href="https://leeplugshub.com" className="text-sm text-background/70 hover:text-background">Gadgets & Phones</a></li>
                <li><span className="text-sm text-background/70">Heavy Duty Trucks</span></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-background/40 mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li><button className="text-sm text-background/70 hover:text-background transition-colors">Privacy Policy</button></li>
                <li><button className="text-sm text-background/70 hover:text-background transition-colors">Terms of Use</button></li>
                <li><button className="text-sm text-background/70 hover:text-background transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-background/40 font-mono">
            © {currentYear} LeeAutoX. All rights reserved. Ontario, Canada.
          </div>
          <div className="text-xs text-background/40 font-mono">
            Trusted vehicle sourcing across Africa.
          </div>
        </div>
      </div>
    </footer>
  );
}
