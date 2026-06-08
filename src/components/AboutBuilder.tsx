"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

const badges = [
  { obj: t.about.badge1, color: "#00f5ff" },
  { obj: t.about.badge2, color: "#a259ff" },
  { obj: t.about.badge3, color: "#00f5ff" },
];

export function AboutBuilder() {
  const { lang } = useLanguage();

  return (
    <section id="about" className="py-16 px-6 relative">
      <div className="section-divider mb-16" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading tracking-widest mb-3 reveal"
            style={{ background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.22)", color:"#00f5ff" }}>
            THE BUILDER
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black reveal reveal-delay-1">
            <span className="text-gradient">{tx(t.about.title, lang)}</span>
          </h2>
        </div>

        <div className="card rounded-2xl p-6 sm:p-8 text-center reveal reveal-delay-2">
          <p className="font-body text-base sm:text-lg text-muted leading-relaxed mb-8">
            {tx(t.about.body, lang)}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {badges.map(({ obj, color }, i) => (
              <div key={i}
                className="px-5 py-2.5 rounded-full font-heading text-xs tracking-widest transition-all duration-300 hover:scale-105"
                style={{
                  border: `1px solid ${color}38`,
                  color,
                  background: `${color}0a`,
                  boxShadow: `0 0 14px ${color}12`,
                }}>
                {tx(obj, lang)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
