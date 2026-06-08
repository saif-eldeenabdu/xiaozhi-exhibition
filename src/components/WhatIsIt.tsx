"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

const DollarIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
  </svg>
);
const ChipIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);
const ZapIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const stats = [
  { Icon: DollarIcon, stat: t.whatIsIt.stat1, color: "#00f5ff", bg: "rgba(0,245,255,0.08)" },
  { Icon: ChipIcon,  stat: t.whatIsIt.stat2, color: "#a259ff", bg: "rgba(162,89,255,0.08)" },
  { Icon: ZapIcon,   stat: t.whatIsIt.stat3, color: "#00f5ff", bg: "rgba(0,245,255,0.08)" },
];

export function WhatIsIt() {
  const { lang } = useLanguage();

  return (
    <section id="what-is-it" className="py-16 px-6 relative">
      <div className="section-divider mb-16" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-black mb-2 reveal">
            <span className="text-gradient">{tx(t.whatIsIt.title, lang)}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map(({ Icon, stat, color, bg }, i) => (
            <div key={i}
              className={`reveal reveal-delay-${i + 1} card rounded-2xl p-6 text-center group cursor-default`}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: bg, border:`1px solid ${color}30`, color, boxShadow:`0 0 16px ${color}25` }}>
                  <Icon />
                </div>
              </div>
              <p className="font-heading text-base font-bold leading-snug" style={{ color }}>
                {tx(stat, lang)}
              </p>
            </div>
          ))}
        </div>

        <div className="card rounded-2xl p-6 sm:p-8 reveal reveal-delay-4">
          <p className="font-body text-base sm:text-lg text-muted text-center leading-relaxed">
            {tx(t.whatIsIt.body, lang)}
          </p>
        </div>
      </div>
    </section>
  );
}
