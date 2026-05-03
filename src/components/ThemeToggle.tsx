import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      initial={false}
      animate={{
        backgroundColor: theme === 'light' ? '#000000' : '#ffffff',
        color: theme === 'light' ? '#ffffff' : '#000000',
      }}
      className="fixed bottom-8 left-8 z-[100] w-9 h-9 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-shadow hover:shadow-xl border border-white/10"
      role="button"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 360 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </motion.button>
  );
}
