import { MARQUEE_ITEMS } from '../constants';

export default function Marquee() {
  // Triple the items for seamless loop
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="border-y border-border py-5 overflow-hidden bg-foreground text-background">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, index) => (
          <div key={index} className="inline-flex items-center gap-6 px-8 text-sm font-mono tracking-[0.2em] uppercase">
            <span>{item}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-background/40 inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
}
