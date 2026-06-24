import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function InstagramFeed() {
  const { theme } = useTheme();

  useEffect(() => {
    // Dynamically load the Fouita Widget external script
    const script = document.createElement('script');
    script.src = "https://wdg.fouita.com/widgets/0x46bce9.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className={`py-20 px-6 md:px-12 border-t ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-slate-50 border-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
              SOCIAL FEED
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              FOLLOW US ON INSTAGRAM
            </h2>
          </div>
          <a
            href={`https://instagram.com/${CONTACT_INFO.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[#2B59FF] hover:text-[#1a41cc] transition-colors"
          >
            <Instagram size={18} />
            @{CONTACT_INFO.instagram}
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Dynamic Widget Container */}
        <div className={`p-4 border rounded-lg ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div data-key="Grid Instagram Feed " className="ft" id="ftk8stveb"></div>
        </div>
      </div>
    </section>
  );
}
