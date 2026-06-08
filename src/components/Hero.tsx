"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

export function Hero() {
  const { lang } = useLanguage();

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-16"
    >
      {/* Vivid radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 65%)" }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(162,89,255,0.10) 0%, transparent 60%)" }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* Decorative corner lines */}
      <svg className="absolute top-20 left-8 opacity-20 pointer-events-none" width="80" height="80" viewBox="0 0 80 80">
        <path d="M0 40 L40 0" stroke="#00f5ff" strokeWidth="0.5"/>
        <path d="M0 60 L60 0" stroke="#a259ff" strokeWidth="0.5"/>
        <path d="M0 80 L80 0" stroke="#00f5ff" strokeWidth="0.5"/>
      </svg>
      <svg className="absolute top-20 right-8 opacity-20 pointer-events-none" width="80" height="80" viewBox="0 0 80 80" style={{transform:"scaleX(-1)"}}>
        <path d="M0 40 L40 0" stroke="#00f5ff" strokeWidth="0.5"/>
        <path d="M0 60 L60 0" stroke="#a259ff" strokeWidth="0.5"/>
        <path d="M0 80 L80 0" stroke="#00f5ff" strokeWidth="0.5"/>
      </svg>

      {/* Orb + orbit rings */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="orbit-ring absolute rounded-full border border-cyan/20" style={{ width: "360px", height: "360px" }} />
        <div className="orbit-ring absolute rounded-full border border-violet/12" style={{ width: "420px", height: "420px" }} />

        {/* Orbiting cyan dot */}
        <div className="orbit-ring absolute pointer-events-none" style={{ width: "360px", height: "360px" }}>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{ marginTop:"-4px", marginLeft:"-4px", background:"#00f5ff",
              boxShadow:"0 0 12px 3px rgba(0,245,255,0.9)", animation:"orbit 8s linear infinite" }} />
        </div>
        {/* Orbiting violet dot */}
        <div className="orbit-ring absolute pointer-events-none" style={{ width: "420px", height: "420px" }}>
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
            style={{ marginTop:"-3px", marginLeft:"-3px", background:"#a259ff",
              boxShadow:"0 0 10px 2px rgba(162,89,255,0.9)", animation:"orbit 13s linear infinite reverse" }} />
        </div>

        <div className="hero-orb-scale orb-glow relative">
          <SiriOrb size="300px" animationDuration={15}
            colors={{ c1:"oklch(80% 0.2 190)", c2:"oklch(75% 0.18 210)", c3:"oklch(78% 0.22 170)" }} />
        </div>
      </div>

      {/* Label chip */}
      <div className="reveal mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading tracking-widest"
        style={{ background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.25)", color:"#00f5ff" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan" style={{ boxShadow:"0 0 6px #00f5ff" }} />
        ESP32-S3 · VOICE AI
      </div>

      <h1 className="font-heading font-black text-white reveal max-w-3xl leading-tight mb-4"
        style={{ fontSize:"clamp(1.9rem, 5vw, 3.6rem)", lineHeight:1.1 }}>
        Meet the AI that{" "}
        <span className="text-gradient">lives in your pocket.</span>
      </h1>

      <p className="font-body text-base sm:text-lg text-muted reveal reveal-delay-2 max-w-lg mb-8 leading-relaxed">
        {tx(t.hero.subheadline, lang)}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 reveal reveal-delay-3">
        <button onClick={scrollToDemo}
          className="px-8 py-3.5 font-heading text-sm font-bold tracking-widest text-bg bg-cyan rounded-full transition-all duration-300 hover:scale-105 active:scale-100"
          style={{ boxShadow:"0 0 28px rgba(0,245,255,0.45), 0 4px 16px rgba(0,0,0,0.4)" }}>
          {tx(t.hero.cta, lang)}
        </button>
        <button onClick={() => document.getElementById("what-is-it")?.scrollIntoView({behavior:"smooth"})}
          className="px-8 py-3.5 font-heading text-sm font-bold tracking-widest text-cyan rounded-full transition-all duration-300 hover:bg-cyan/10"
          style={{ border:"1px solid rgba(0,245,255,0.35)" }}>
          {lang === "en" ? "Learn More" : "اعرف أكثر"}
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background:"linear-gradient(transparent, #06060e)" }} />
    </section>
  );
}
