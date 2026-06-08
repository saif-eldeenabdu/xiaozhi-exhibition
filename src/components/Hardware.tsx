"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

type CompKey = "comp1" | "comp2" | "comp3" | "comp4";

interface Comp {
  id: number; key: CompKey;
  rx: number; ry: number; rw: number; rh: number;
  chipLabel: string; color: string;
  lineX: number; lineY: number; side: "left" | "right";
}

const comps: Comp[] = [
  { id:1, key:"comp1", rx:142, ry:108, rw:86, rh:52, chipLabel:"ESP32-S3", color:"#00f5ff", lineX:72,  lineY:134, side:"left"  },
  { id:2, key:"comp2", rx:144, ry:192, rw:52, rh:32, chipLabel:"INMP441",  color:"#a259ff", lineX:72,  lineY:208, side:"left"  },
  { id:3, key:"comp3", rx:222, ry:192, rw:62, rh:32, chipLabel:"MAX98357", color:"#00f5ff", lineX:348, lineY:208, side:"right" },
  { id:4, key:"comp4", rx:152, ry:258, rw:66, rh:42, chipLabel:"OLED",     color:"#a259ff", lineX:348, lineY:279, side:"right" },
];

export function Hardware() {
  const { lang } = useLanguage();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="hardware" className="py-16 px-6 relative overflow-hidden">
      <div className="section-divider mb-16" />
      <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 60% 40% at 50% 60%, rgba(162,89,255,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading tracking-widest mb-3 reveal"
            style={{ background:"rgba(162,89,255,0.1)", border:"1px solid rgba(162,89,255,0.25)", color:"#a259ff" }}>
            HARDWARE
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black reveal reveal-delay-1">
            <span className="text-white">{tx(t.hardware.title, lang)}</span>
          </h2>
        </div>

        <div className="reveal flex justify-center">
          <div className="card rounded-2xl p-4 sm:p-6" style={{ width:"100%", maxWidth:"480px" }}>
            <div className="relative">
              <svg viewBox="0 0 420 360" className="w-full"
                style={{ filter:"drop-shadow(0 0 30px rgba(0,245,255,0.12))" }}>
                {/* Board */}
                <rect x="96" y="76" width="228" height="248" rx="8"
                  fill="#080818" stroke="rgba(0,245,255,0.14)" strokeWidth="1"/>
                {/* Gradient overlay on board */}
                <defs>
                  <radialGradient id="boardGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0,245,255,0.06)"/>
                    <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                  </radialGradient>
                </defs>
                <rect x="96" y="76" width="228" height="248" rx="8" fill="url(#boardGlow)"/>
                {/* Rails */}
                <rect x="104" y="84" width="212" height="7" rx="2"
                  fill="rgba(0,245,255,0.05)" stroke="rgba(0,245,255,0.15)" strokeWidth="0.5"/>
                <rect x="104" y="309" width="212" height="7" rx="2"
                  fill="rgba(255,80,80,0.05)" stroke="rgba(255,80,80,0.12)" strokeWidth="0.5"/>
                {/* Pin holes */}
                {Array.from({length:9}).map((_,row) =>
                  Array.from({length:16}).map((_,col) => (
                    <circle key={`${row}-${col}`}
                      cx={114+col*12.5} cy={106+row*20} r="1.8"
                      fill="rgba(0,245,255,0.12)"/>
                  ))
                )}
                {/* Traces */}
                <path d="M185 160 L185 192" stroke="rgba(0,245,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3"/>
                <path d="M185 224 L185 258" stroke="rgba(162,89,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3"/>
                <path d="M284 208 L296 208" stroke="rgba(0,245,255,0.3)" strokeWidth="1.5"/>
                <path d="M252 228 L230 258" stroke="rgba(162,89,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3"/>

                {comps.map((c,i) => (
                  <g key={c.id} style={{cursor:"pointer"}}
                    onMouseEnter={()=>setActive(c.id)}
                    onMouseLeave={()=>setActive(null)}
                    onClick={()=>setActive(active===c.id?null:c.id)}>
                    {active===c.id&&(
                      <rect x={c.rx-5} y={c.ry-5} width={c.rw+10} height={c.rh+10} rx="9"
                        fill={`${c.color}10`} style={{filter:`blur(8px)`}}/>
                    )}
                    <rect x={c.rx} y={c.ry} width={c.rw} height={c.rh} rx="4"
                      fill={`${c.color}12`} stroke={c.color}
                      strokeWidth={active===c.id?2:0.9}
                      style={{ filter:active===c.id?`drop-shadow(0 0 6px ${c.color})`:"none", transition:"all 0.2s" }}/>
                    {[0,1,2,3].map(p=>(
                      <rect key={p} x={c.rx+8+p*(c.rw-16)/3} y={c.ry-5}
                        width="4" height="5" fill={c.color} opacity="0.5" rx="1"/>
                    ))}
                    {[0,1,2,3].map(p=>(
                      <rect key={p} x={c.rx+8+p*(c.rw-16)/3} y={c.ry+c.rh}
                        width="4" height="5" fill={c.color} opacity="0.5" rx="1"/>
                    ))}
                    <text x={c.rx+c.rw/2} y={c.ry+c.rh/2+4} textAnchor="middle"
                      fill={c.color} fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                      style={{userSelect:"none"}}>{c.chipLabel}</text>
                    {/* Callout */}
                    <line x1={c.side==="left"?c.rx:c.rx+c.rw} y1={c.ry+c.rh/2}
                      x2={c.lineX} y2={c.lineY}
                      stroke={c.color} strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2"/>
                    <circle cx={c.lineX} cy={c.lineY} r="3" fill={c.color} opacity="0.85"/>
                    <text x={c.side==="left"?c.lineX-7:c.lineX+7} y={c.lineY+4}
                      textAnchor={c.side==="left"?"end":"start"}
                      fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="monospace"
                      style={{userSelect:"none"}}>
                      {tx(t.hardware[c.key].label, lang)}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip */}
              {active!==null&&(()=>{
                const c=comps.find(x=>x.id===active)!;
                return (
                  <div className="absolute z-20 pointer-events-none px-4 py-3 rounded-xl text-xs font-body max-w-52"
                    style={{ top:`${(c.ry/360)*100}%`,
                      [c.side==="left"?"left":"right"]:"0%",
                      transform:"translateY(-50%)",
                      background:"rgba(11,11,26,0.97)",
                      border:`1px solid ${c.color}40`,
                      boxShadow:`0 0 24px ${c.color}20` }}>
                    <div className="font-bold mb-1" style={{color:c.color}}>
                      {tx(t.hardware[c.key].label,lang)}
                    </div>
                    <div className="text-white/65 leading-relaxed">
                      {tx(t.hardware[c.key].tooltip,lang)}
                    </div>
                  </div>
                );
              })()}
            </div>
            <p className="text-center text-xs text-muted mt-3 font-body">
              {lang==="en" ? "Hover or tap a component to learn more" : "مرر أو اضغط على مكوّن لمعرفة المزيد"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
