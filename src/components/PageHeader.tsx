import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AnimatedText from './ui/AnimatedText';
import { BreathOrb } from './ui/ImportedControls';

export interface Breadcrumb {
  name?: string;
  label?: string;
  item?: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({ title, subtitle, breadcrumbs = [] }: PageHeaderProps) {
  const safeBreadcrumbs = Array.isArray(breadcrumbs) ? breadcrumbs : [];

  return (
    <div className="relative pt-32 md:pt-36 pb-16 md:pb-20 px-6 md:px-12 overflow-hidden border-b border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-500">
      <BreathOrb className="absolute -top-24 right-[-6%] h-[360px] w-[360px] opacity-60" />

      <div className="relative z-[1] max-w-7xl mx-auto">
        {safeBreadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-2 mb-5 font-mono text-xs tracking-wider" aria-label="Breadcrumb">
            {safeBreadcrumbs.map((crumb, idx) => {
              const isLast = idx === safeBreadcrumbs.length - 1;
              const name = crumb?.name || crumb?.label || '';
              const rawPath = crumb?.item || crumb?.href || '/';
              const path = rawPath.replace('https://leeautox.com', '') || '/';

              return (
                <div key={`${rawPath}-${idx}`} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight size={12} className="text-[var(--ink-2)] opacity-50" />}
                  {isLast ? (
                    <span className="text-[var(--accent)] font-semibold">{name}</span>
                  ) : (
                    <Link
                      to={path}
                      className="text-[var(--ink-2)] hover:text-[var(--ink)] hover:underline transition-colors"
                    >
                      {name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        <h1 className="font-serif text-[clamp(2rem,4.4vw,3.75rem)] font-normal tracking-tight max-w-4xl leading-[1.08] text-[var(--ink)]">
          <AnimatedText text={title} variant="blur-in" trigger="mount" />
        </h1>

        {subtitle && (
          <p className="mt-5 text-sm md:text-lg max-w-2xl font-sans tracking-wide leading-relaxed text-[var(--ink-2)] lx-prose">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
