import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  name: string;
  item: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className={`relative pt-36 pb-20 px-6 md:px-12 overflow-hidden border-b transition-colors duration-500 ${
      theme === 'dark' ? 'bg-black text-white border-zinc-900' : 'bg-[#FAFBFD] text-slate-950 border-slate-200'
    }`}>
      {/* Background Graffiti Accent */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.02] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        <div className="absolute top-1/2 -left-10 text-[12vw] font-black leading-none tracking-tight rotate-[-5deg] whitespace-nowrap">
          LEEAUTOX // LOGISTICS
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 font-mono text-xs tracking-wider" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            // Map the absolute URL to a relative react-router link
            const path = crumb.item.replace('https://leeautox.com', '') || '/';
            
            return (
              <div key={crumb.item} className="flex items-center gap-2">
                {idx > 0 && <ChevronRight size={12} className={theme === 'dark' ? 'text-zinc-700' : 'text-slate-300'} />}
                {isLast ? (
                  <span className={theme === 'dark' ? 'text-[#2B59FF]' : 'text-[#2B59FF] font-semibold'}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link 
                    to={path} 
                    className={`hover:underline transition-all ${
                      theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase max-w-4xl leading-tight font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-6 text-sm md:text-lg max-w-2xl font-sans tracking-wide leading-relaxed ${
            theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
