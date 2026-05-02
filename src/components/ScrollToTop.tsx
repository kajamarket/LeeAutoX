import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Smooth the progress for the circular indicator
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] group"
          role="button"
          aria-label="Scroll to top"
        >
          <div className="relative flex items-center justify-center w-14 h-14">
            {/* Circular Progress Indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-white/10"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                style={{
                  pathLength: smoothProgress,
                }}
                className="text-white"
              />
            </svg>

            {/* Inner Button Circle */}
            <div 
              className="absolute w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shadow-lg"
              style={{ backgroundColor: 'rgb(89, 94, 224)' }}
            >
              <ArrowUp size={20} />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
