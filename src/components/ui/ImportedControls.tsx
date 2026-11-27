import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Heart, Send } from 'lucide-react';
import { observeOffscreenLoop } from '../../motion/scrollEngine';

/* =========================================================
   1. InkSwitch — Fluid Toggle Switch
   ========================================================= */
interface InkSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export const InkSwitch: React.FC<InkSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel = 'Toggle setting',
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        checked
          ? 'bg-[var(--accent)] border-[var(--accent)]'
          : 'bg-[var(--surface)] border-[var(--line)]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[var(--spring)] ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

/* =========================================================
   2. PullCordLamp — Interactive Theme Pull-Cord Toggle
   ========================================================= */
interface PullCordLampProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const PullCordLamp: React.FC<PullCordLampProps> = ({
  isDark,
  onToggle,
  className = '',
}) => {
  const [pulled, setPulled] = useState(false);

  const handleTrigger = () => {
    setPulled(true);
    onToggle();
    window.setTimeout(() => setPulled(false), 320);
  };

  return (
    <button
      type="button"
      onClick={handleTrigger}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative flex flex-col items-center cursor-pointer rounded-full px-3 py-2.5 lx-glass text-[var(--ink)] transition-transform duration-300 ease-[var(--spring)] hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`.trim()}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] transition-colors duration-300 ${
          isDark
            ? 'bg-[#1C1C22] text-[#F8FAFC]'
            : 'bg-[#F59E0B]/20 text-[#B45309] shadow-[0_0_16px_rgba(245,158,11,0.38)]'
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      </span>
      <span
        className={`mt-1 block w-[1.5px] bg-[var(--ink-2)]/60 transition-all duration-300 ease-[var(--spring)] ${
          pulled ? 'h-4' : 'h-2.5'
        }`}
      />
      <span
        className={`h-2 w-2 rounded-full border border-[var(--line)] bg-[var(--accent)] transition-transform duration-300 ease-[var(--spring)] ${
          pulled ? 'scale-125' : 'scale-100'
        }`}
      />
    </button>
  );
};

/* =========================================================
   3. RippleButton & RippleLink
   ========================================================= */
interface RippleWave {
  id: number;
  x: number;
  y: number;
  size: number;
}

function useRipples() {
  const [ripples, setRipples] = useState<RippleWave[]>([]);
  const nextId = useRef(0);

  const spawnRipple = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = ++nextId.current;
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
    setRipples((prev) => [...prev.slice(-2), { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== id));
    }, 640);
  };

  const renderRipples = () => (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="lx-ripple-ring"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </span>
  );

  return { spawnRipple, renderRipples };
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const { spawnRipple, renderRipples } = useRipples();

  const variantClasses =
    variant === 'primary'
      ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-sm hover:opacity-92'
      : variant === 'secondary'
      ? 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--accent)]'
      : variant === 'outline'
      ? 'bg-transparent text-[var(--ink)] border border-[var(--line)] hover:border-[var(--accent)]'
      : 'bg-transparent text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--surface)] hover:text-[var(--ink)]';

  return (
    <button
      {...rest}
      onClick={(e) => {
        spawnRipple(e);
        onClick?.(e);
      }}
      className={`relative overflow-hidden lx-pill-btn ${variantClasses} ${className}`.trim()}
    >
      {renderRipples()}
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

interface RippleLinkProps {
  to: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const RippleLink: React.FC<RippleLinkProps> = ({
  to,
  variant = 'primary',
  className = '',
  children,
  onClick,
}) => {
  const { spawnRipple, renderRipples } = useRipples();

  const variantClasses =
    variant === 'primary'
      ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-sm hover:opacity-92'
      : variant === 'secondary'
      ? 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--accent)]'
      : 'bg-transparent text-[var(--ink)] border border-[var(--line)] hover:border-[var(--accent)]';

  return (
    <Link
      to={to}
      onClick={(e) => {
        spawnRipple(e);
        onClick?.();
      }}
      className={`relative overflow-hidden lx-pill-btn ${variantClasses} ${className}`.trim()}
    >
      {renderRipples()}
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">{children}</span>
    </Link>
  );
};

/* =========================================================
   4. PaperPlaneButton — Launch Submit CTA
   ========================================================= */
interface PaperPlaneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sending?: boolean;
  sent?: boolean;
  label?: string;
  sentLabel?: string;
}

export const PaperPlaneButton: React.FC<PaperPlaneButtonProps> = ({
  sending = false,
  sent = false,
  label = 'Send Inquiry',
  sentLabel = 'Message Sent',
  className = '',
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`group relative overflow-hidden lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)] shadow-md hover:opacity-95 ${className}`.trim()}
    >
      <span className="relative z-[1] inline-flex items-center gap-2">
        {sent ? (
          <Check size={16} />
        ) : (
          <Send
            size={15}
            className={`transition-transform duration-300 ease-[var(--spring)] ${
              sending ? 'translate-x-1 -translate-y-1' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
            }`}
          />
        )}
        <span>{children || (sent ? sentLabel : label)}</span>
      </span>
    </button>
  );
};

/* =========================================================
   5. CopyButton — Morphing Copy-to-Clipboard Action
   ========================================================= */
interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(value);
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-semibold border transition-all duration-300 cursor-pointer ${
        copied
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
          : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]'
      } ${className}`.trim()}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
};

/* =========================================================
   6. LikeBurstButton — Wishlist / Save Burst Toggle
   ========================================================= */
interface LikeBurstButtonProps {
  active?: boolean;
  onToggle?: () => void;
  ariaLabel?: string;
  className?: string;
}

export const LikeBurstButton: React.FC<LikeBurstButtonProps> = ({
  active = false,
  onToggle,
  ariaLabel = 'Save vehicle',
  className = '',
}) => {
  const [liked, setLiked] = useState(active);
  const [bursting, setBursting] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    if (next) {
      setBursting(true);
      window.setTimeout(() => setBursting(false), 540);
    }
    onToggle?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={liked}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer ${
        liked
          ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-ink)]'
          : 'bg-[var(--card)]/90 border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--accent)]'
      } ${className}`.trim()}
    >
      <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
      {bursting && (
        <>
          <span className="lx-burst-dot" style={{ ['--bx' as string]: '0px', ['--by' as string]: '-18px' }} />
          <span className="lx-burst-dot" style={{ ['--bx' as string]: '16px', ['--by' as string]: '-10px' }} />
          <span className="lx-burst-dot" style={{ ['--bx' as string]: '16px', ['--by' as string]: '10px' }} />
          <span className="lx-burst-dot" style={{ ['--bx' as string]: '-16px', ['--by' as string]: '10px' }} />
          <span className="lx-burst-dot" style={{ ['--bx' as string]: '-16px', ['--by' as string]: '-10px' }} />
        </>
      )}
    </button>
  );
};

/* =========================================================
   7. LeafTabs — Segmented Pill Tabs
   ========================================================= */
export interface TabOption {
  value: string;
  label: React.ReactNode;
  badge?: string | number;
}

interface LeafTabsProps {
  options: TabOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const LeafTabs: React.FC<LeafTabsProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1 ${className}`.trim()}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-xs'
                : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
            }`}
          >
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span className={`text-[10px] tabular-nums ${isActive ? 'opacity-90' : 'opacity-65'}`}>
                ({opt.badge})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* =========================================================
   8. RockerSwitch — Compact View / Mode Rocker
   ========================================================= */
interface RockerSwitchProps {
  options: { value: string; label: React.ReactNode }[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const RockerSwitch: React.FC<RockerSwitchProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-md p-1 shadow-sm ${className}`.trim()}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
              active
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-xs'
                : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

/* =========================================================
   9. StepTrack — Clickable Interactive Process Track
   ========================================================= */
export interface StepTrackItem {
  number?: string;
  title: string;
  caption?: string;
}

interface StepTrackProps {
  steps: StepTrackItem[];
  activeStep: number;
  onSelect?: (index: number) => void;
  className?: string;
}

export const StepTrack: React.FC<StepTrackProps> = ({
  steps,
  activeStep,
  onSelect,
  className = '',
}) => {
  const pct = steps.length > 1 ? Math.round((activeStep / (steps.length - 1)) * 100) : 0;

  return (
    <div className={`w-full ${className}`.trim()}>
      <div className="relative h-1 rounded-full bg-[var(--line)] mb-5 overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-500 ease-[var(--spring)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {steps.map((step, idx) => {
          const active = idx === activeStep;
          const past = idx < activeStep;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect?.(idx)}
              className={`text-left rounded-2xl border px-3 py-2.5 transition-all duration-300 cursor-pointer ${
                active
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] shadow-sm'
                  : past
                  ? 'bg-[var(--accent-soft)] text-[var(--ink)] border-[var(--accent)]/30'
                  : 'bg-[var(--card)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--accent)]/50'
              }`}
            >
              <span className="font-mono text-[10px] font-bold opacity-80 block">
                {step.number || `0${idx + 1}`}
              </span>
              <span className="text-xs font-semibold line-clamp-1">{step.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================
   10. OdometerStepper — Numeric Stepper Control
   ========================================================= */
interface OdometerStepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label?: string;
  onChange: (next: number) => void;
  className?: string;
}

export const OdometerStepper: React.FC<OdometerStepperProps> = ({
  value,
  min,
  max,
  step = 1,
  label = 'Adjust value',
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 ${className}`.trim()}
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label="Decrease"
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] font-mono font-bold hover:border-[var(--accent)] disabled:opacity-35 cursor-pointer"
      >
        -
      </button>
      <span className="font-mono font-bold text-base tabular-nums text-[var(--ink)] px-2">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label="Increase"
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] font-mono font-bold hover:border-[var(--accent)] disabled:opacity-35 cursor-pointer"
      >
        +
      </button>
    </div>
  );
};

/* =========================================================
   11. PlanPicker — Selectable Card Group
   ========================================================= */
export interface PlanOption {
  value: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

interface PlanPickerProps {
  options: PlanOption[];
  value: string;
  onChange: (val: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const PlanPicker: React.FC<PlanPickerProps> = ({
  options,
  value,
  onChange,
  columns = 2,
  className = '',
}) => {
  const colsClass =
    columns === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-2';

  return (
    <div className={`grid ${colsClass} gap-2.5 ${className}`.trim()}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left rounded-2xl border p-3 transition-all duration-300 cursor-pointer ${
              selected
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] shadow-sm'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--accent)]/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold">{opt.title}</span>
              {opt.badge && (
                <span className="text-[10px] font-mono opacity-80">{opt.badge}</span>
              )}
            </div>
            {opt.subtitle && (
              <span className="text-[11px] opacity-80 block mt-0.5">{opt.subtitle}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* =========================================================
   12. PebbleRating — Tactile 1–5 Star Selector
   ========================================================= */
interface PebbleRatingProps {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
}

export const PebbleRating: React.FC<PebbleRatingProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((num) => {
        const active = num <= value;
        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            aria-label={`Rate ${num} out of 5`}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300 ease-[var(--spring)] cursor-pointer ${
              active
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-ink)] scale-105 shadow-sm'
                : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--accent)]'
            }`}
          >
            <span className="font-mono text-xs font-bold">{num}★</span>
          </button>
        );
      })}
    </div>
  );
};

/* =========================================================
   13. StrokeChecklist — Interactive Inspection Checklist
   ========================================================= */
interface StrokeChecklistProps {
  items: string[];
  className?: string;
}

export const StrokeChecklist: React.FC<StrokeChecklistProps> = ({
  items,
  className = '',
}) => {
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(items.map((_, idx) => [idx, true]))
  );

  return (
    <ul className={`space-y-2.5 ${className}`.trim()}>
      {items.map((item, idx) => {
        const isChecked = !!checkedMap[idx];
        return (
          <li key={idx}>
            <button
              type="button"
              onClick={() => setCheckedMap((prev) => ({ ...prev, [idx]: !prev[idx] }))}
              className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-left transition-colors hover:border-[var(--accent)]/50 cursor-pointer"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isChecked
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-ink)]'
                    : 'bg-transparent border-[var(--line)] text-transparent'
                }`}
              >
                <Check size={12} />
              </span>
              <span
                className={`text-xs sm:text-sm transition-opacity ${
                  isChecked ? 'text-[var(--ink)]' : 'text-[var(--ink-2)] opacity-70'
                }`}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

/* =========================================================
   14. CodeShake — PIN Error Shake Wrapper
   ========================================================= */
interface CodeShakeProps {
  error: boolean;
  children: React.ReactNode;
  className?: string;
}

export const CodeShake: React.FC<CodeShakeProps> = ({ error, children, className = '' }) => {
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    if (error) setAnimKey((k) => k + 1);
  }, [error]);

  return (
    <div key={animKey} className={`${error ? 'lx-code-shake' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
};

/* =========================================================
   15. BreathOrb — Soft Radial Atmosphere Accent
   ========================================================= */
export const BreathOrb: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOffscreenLoop(el);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`lx-breath-orb rounded-full pointer-events-none blur-3xl opacity-50 ${className}`.trim()}
      style={{
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
      }}
    />
  );
};

/* =========================================================
   16. TideProgressBar — Scroll Reading Progress Bar
   ========================================================= */
export const TideProgressBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
      setProgress(pct);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div aria-hidden="true" className={`w-full h-[2px] bg-transparent overflow-hidden ${className}`.trim()}>
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

/* =========================================================
   17. OriginalLoader — Kinetic Preloader Ring & Bars
   ========================================================= */
export const OriginalLoader: React.FC<{ label?: string; className?: string }> = ({
  label = 'Loading',
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`.trim()}>
    <div className="lx-loader-tide h-9 w-9" />
    <div className="flex items-center gap-1 h-4">
      <span className="lx-loader-bar w-1 h-full rounded-full bg-[var(--accent)]" style={{ animationDelay: '0ms' }} />
      <span className="lx-loader-bar w-1 h-full rounded-full bg-[var(--accent)]" style={{ animationDelay: '150ms' }} />
      <span className="lx-loader-bar w-1 h-full rounded-full bg-[var(--accent)]" style={{ animationDelay: '300ms' }} />
    </div>
    {label && <span className="text-xs font-mono text-[var(--ink-2)] tracking-wider uppercase">{label}</span>}
  </div>
);
