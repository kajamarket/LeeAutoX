import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PullCordLamp } from './ui/ImportedControls';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[var(--z-sticky)]">
      {/* Desktop interactive Pull Cord Lamp */}
      <div className="hidden sm:block">
        <PullCordLamp isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* Compact mobile toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="sm:hidden flex h-11 w-11 items-center justify-center rounded-full lx-glass text-[var(--ink)] cursor-pointer transition-transform active:scale-90"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
