"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

const icons: ReactNode[] = [
  <svg key="mic" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>,
  <svg key="cpu" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>,
  <svg key="wifi" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>,
  <svg key="brain" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5v9A5.5 5.5 0 0 0 9.5 22h5a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 14.5 2h-5z"/>
    <circle cx="12" cy="11" r="2"/>
  </svg>,
  <svg key="zap" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
  <svg key="vol" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>,
];

export function HowItWorks() {
  const { lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const playedOnce = useRef(false);
  const steps = t.howItWorks.steps;

  const playAnimation = () => {
    if (playing) return;
    setPlaying(true); setActiveStep(-1);
    steps.forEach((_,i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i===steps.length-1) setTimeout(()=>setPlaying(false),600);
      }, i*650+100);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !playedOnce.current) {
        playedOnce.current = true;
        setTimeout(playAnimation, 400);
      }
    }, { threshold:0.35 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-16 px-6 relative">
      <div className="section-divider mb-16" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,245,255,0.04) 0%, transparent 70%)" }}/>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading tracking-widest mb-3 reveal"
            style={{ background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.22)", color:"#00f5ff" }}>
            ARCHITECTURE
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black reveal reveal-delay-1">
            <span className="text-white">{tx(t.howItWorks.title, lang)}</span>
          </h2>
        </div>

        <div className="card rounded-2xl p-6 sm:p-8 reveal reveal-delay-2">
          {/* Desktop */}
          <div className="hidden md:flex items-start justify-center gap-0 mb-6">
            {steps.map((step,i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center" style={{minWidth:"80px"}}>
                  <div className="rounded-full border-2 flex items-center justify-center transition-all duration-500"
                    style={{ width:"50px", height:"50px",
                      borderColor: activeStep>=i?"#00f5ff":"rgba(255,255,255,0.08)",
                      color: activeStep>=i?"#00f5ff":"rgba(255,255,255,0.2)",
                      background: activeStep>=i?"rgba(0,245,255,0.1)":"rgba(255,255,255,0.02)",
                      boxShadow: activeStep===i?"0 0 22px rgba(0,245,255,0.65)":"none" }}>
                    {icons[i]}
                  </div>
                  <p className="mt-2.5 font-body text-xs text-center leading-tight transition-colors duration-500"
                    style={{ maxWidth:"70px", color:activeStep>=i?"#e0e0e0":"#3a3a5a" }}>
                    {tx(step,lang)}
                  </p>
                </div>
                {i<steps.length-1&&(
                  <div className="h-px flex-shrink-0 transition-all duration-500"
                    style={{ width:"28px", marginBottom:"26px",
                      background:activeStep>i?"linear-gradient(90deg,#00f5ff,#a259ff)":"rgba(255,255,255,0.07)",
                      boxShadow:activeStep>i?"0 0 6px rgba(0,245,255,0.5)":"none" }}/>
                )}
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden flex-col gap-4 mb-6">
            {steps.map((step,i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500"
                  style={{ width:"42px", height:"42px",
                    borderColor:activeStep>=i?"#00f5ff":"rgba(255,255,255,0.08)",
                    color:activeStep>=i?"#00f5ff":"rgba(255,255,255,0.2)",
                    background:activeStep>=i?"rgba(0,245,255,0.1)":"rgba(255,255,255,0.02)",
                    boxShadow:activeStep===i?"0 0 18px rgba(0,245,255,0.6)":"none" }}>
                  {icons[i]}
                </div>
                <p className="font-body text-sm transition-colors duration-500"
                  style={{color:activeStep>=i?"#e0e0e0":"#3a3a5a"}}>
                  {tx(step,lang)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <p className="font-body text-sm text-muted italic leading-relaxed max-w-md">
              {tx(t.howItWorks.footer,lang)}
            </p>
            <button onClick={playAnimation} disabled={playing}
              className="flex-shrink-0 px-5 py-2 font-heading text-xs tracking-widest rounded-full transition-all duration-300 disabled:opacity-40"
              style={{ border:"1px solid rgba(0,245,255,0.3)", color:"#00f5ff",
                background:playing?"rgba(0,245,255,0.08)":"transparent" }}>
              {tx(t.howItWorks.playBtn,lang)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
