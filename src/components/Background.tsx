"use client";

// Pure decorative background — no logic, no content impact.
export function Background() {
  return (
    <>
      <style>{`
        /* Drifting gradient orbs */
        @keyframes drift-1 {
          0%,100% { transform: translate(0,    0)    scale(1);   }
          33%      { transform: translate(60px, -80px) scale(1.15); }
          66%      { transform: translate(-40px, 50px) scale(0.9);  }
        }
        @keyframes drift-2 {
          0%,100% { transform: translate(0,    0)    scale(1);   }
          33%      { transform: translate(-70px, 60px) scale(1.1);  }
          66%      { transform: translate(50px,-40px) scale(1.2);  }
        }
        @keyframes drift-3 {
          0%,100% { transform: translate(0, 0)    scale(1);   }
          50%      { transform: translate(40px,80px) scale(1.18); }
        }
        @keyframes drift-4 {
          0%,100% { transform: translate(0, 0)     scale(1);    }
          40%      { transform: translate(-50px,-60px) scale(0.85); }
          80%      { transform: translate(30px, 30px)  scale(1.1);  }
        }

        /* Floating particles */
        @keyframes float-up {
          0%   { transform: translateY(0)   translateX(0)   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-120vh) translateX(var(--drift, 20px)); opacity: 0; }
        }

        /* Horizontal scan line sweep */
        @keyframes scan {
          0%   { top: -4px; opacity: 0; }
          5%   { opacity: 0.6; }
          95%  { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }

        /* Slow rotating ring */
        @keyframes spin-slow {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes spin-slow-rev {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(-360deg); }
        }

        /* Pulse glow for orbs */
        @keyframes orb-pulse {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 0.85; }
        }

        .bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: orb-pulse 6s ease-in-out infinite;
        }

        .bg-particle {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: float-up linear infinite;
          opacity: 0;
        }

        .bg-scan {
          position: fixed;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.15) 20%, rgba(0,245,255,0.35) 50%, rgba(0,245,255,0.15) 80%, transparent 100%);
          pointer-events: none;
          z-index: 0;
          animation: scan 14s linear infinite;
        }

        .bg-ring {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          top: 50%; left: 50%;
        }
      `}</style>

      {/* ── Large drifting colour orbs ────────────────────────────── */}
      <div className="bg-orb" style={{
        width:"700px", height:"700px",
        top:"-200px", left:"-150px",
        background:"radial-gradient(circle, rgba(0,245,255,0.18) 0%, transparent 70%)",
        animation:"drift-1 22s ease-in-out infinite, orb-pulse 8s ease-in-out infinite",
      }}/>
      <div className="bg-orb" style={{
        width:"600px", height:"600px",
        top:"30%", right:"-180px",
        background:"radial-gradient(circle, rgba(162,89,255,0.22) 0%, transparent 70%)",
        animation:"drift-2 26s ease-in-out infinite, orb-pulse 7s ease-in-out 2s infinite",
      }}/>
      <div className="bg-orb" style={{
        width:"500px", height:"500px",
        bottom:"-100px", left:"30%",
        background:"radial-gradient(circle, rgba(0,200,255,0.16) 0%, transparent 70%)",
        animation:"drift-3 30s ease-in-out infinite, orb-pulse 9s ease-in-out 1s infinite",
      }}/>
      <div className="bg-orb" style={{
        width:"400px", height:"400px",
        top:"55%", left:"10%",
        background:"radial-gradient(circle, rgba(180,60,255,0.18) 0%, transparent 70%)",
        animation:"drift-4 20s ease-in-out infinite, orb-pulse 6s ease-in-out 3s infinite",
      }}/>
      {/* Small vivid accent orbs */}
      <div className="bg-orb" style={{
        width:"220px", height:"220px",
        top:"20%", left:"55%",
        filter:"blur(50px)",
        background:"radial-gradient(circle, rgba(0,245,255,0.28) 0%, transparent 70%)",
        animation:"drift-2 16s ease-in-out 4s infinite, orb-pulse 5s ease-in-out infinite",
      }}/>
      <div className="bg-orb" style={{
        width:"180px", height:"180px",
        bottom:"25%", right:"15%",
        filter:"blur(45px)",
        background:"radial-gradient(circle, rgba(162,89,255,0.32) 0%, transparent 70%)",
        animation:"drift-1 18s ease-in-out 6s infinite, orb-pulse 4s ease-in-out 1s infinite",
      }}/>

      {/* ── Slow rotating rings ───────────────────────────────────── */}
      <div className="bg-ring" style={{
        width:"900px", height:"900px",
        border:"1px solid rgba(0,245,255,0.06)",
        animation:"spin-slow 60s linear infinite",
      }}/>
      <div className="bg-ring" style={{
        width:"1200px", height:"1200px",
        border:"1px solid rgba(162,89,255,0.04)",
        animation:"spin-slow-rev 80s linear infinite",
      }}/>
      <div className="bg-ring" style={{
        width:"600px", height:"600px",
        border:"1px solid rgba(0,245,255,0.05)",
        animation:"spin-slow 40s linear infinite reverse",
      }}/>

      {/* ── Floating particles ────────────────────────────────────── */}
      {[
        { left:"8%",   size:3, dur:"18s", delay:"0s",   color:"#00f5ff", drift:"15px"  },
        { left:"18%",  size:2, dur:"22s", delay:"3s",   color:"#a259ff", drift:"-20px" },
        { left:"30%",  size:4, dur:"16s", delay:"7s",   color:"#00f5ff", drift:"25px"  },
        { left:"42%",  size:2, dur:"25s", delay:"1s",   color:"#a259ff", drift:"-10px" },
        { left:"55%",  size:3, dur:"19s", delay:"5s",   color:"#00e5ff", drift:"30px"  },
        { left:"65%",  size:2, dur:"21s", delay:"9s",   color:"#c084ff", drift:"-25px" },
        { left:"75%",  size:4, dur:"17s", delay:"2s",   color:"#00f5ff", drift:"18px"  },
        { left:"85%",  size:2, dur:"23s", delay:"6s",   color:"#a259ff", drift:"-15px" },
        { left:"92%",  size:3, dur:"20s", delay:"4s",   color:"#00f5ff", drift:"22px"  },
        { left:"23%",  size:2, dur:"27s", delay:"11s",  color:"#c084ff", drift:"-18px" },
        { left:"48%",  size:3, dur:"15s", delay:"8s",   color:"#00f5ff", drift:"12px"  },
        { left:"70%",  size:2, dur:"24s", delay:"13s",  color:"#a259ff", drift:"-28px" },
      ].map((p, i) => (
        <div key={i} className="bg-particle" style={{
          left: p.left,
          bottom: "-10px",
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          animationDuration: p.dur,
          animationDelay: p.delay,
          ["--drift" as string]: p.drift,
        }}/>
      ))}

      {/* ── Scan line ─────────────────────────────────────────────── */}
      <div className="bg-scan" style={{ animationDelay:"3s" }}/>

      {/* ── Static corner circuit accents ─────────────────────────── */}
      <svg className="fixed top-0 left-0 pointer-events-none z-0 opacity-20"
        width="260" height="260" viewBox="0 0 260 260">
        <path d="M0 80 L40 80 L40 40 L80 40" fill="none" stroke="#00f5ff" strokeWidth="0.6"/>
        <path d="M0 120 L70 120 L70 70 L120 70" fill="none" stroke="#a259ff" strokeWidth="0.4"/>
        <path d="M0 160 L20 160 L20 140 L60 140 L60 100" fill="none" stroke="#00f5ff" strokeWidth="0.5"/>
        <circle cx="40" cy="80" r="2.5" fill="#00f5ff"/>
        <circle cx="80" cy="40" r="2"   fill="#00f5ff"/>
        <circle cx="70" cy="120" r="2"  fill="#a259ff"/>
        <circle cx="60" cy="140" r="1.5" fill="#00f5ff"/>
      </svg>
      <svg className="fixed top-0 right-0 pointer-events-none z-0 opacity-20"
        width="260" height="260" viewBox="0 0 260 260" style={{transform:"scaleX(-1)"}}>
        <path d="M0 80 L40 80 L40 40 L80 40" fill="none" stroke="#a259ff" strokeWidth="0.6"/>
        <path d="M0 120 L70 120 L70 70 L120 70" fill="none" stroke="#00f5ff" strokeWidth="0.4"/>
        <path d="M0 160 L20 160 L20 140 L60 140 L60 100" fill="none" stroke="#a259ff" strokeWidth="0.5"/>
        <circle cx="40" cy="80" r="2.5" fill="#a259ff"/>
        <circle cx="80" cy="40" r="2"   fill="#a259ff"/>
        <circle cx="70" cy="120" r="2"  fill="#00f5ff"/>
        <circle cx="60" cy="140" r="1.5" fill="#a259ff"/>
      </svg>
      <svg className="fixed bottom-0 left-0 pointer-events-none z-0 opacity-15"
        width="260" height="260" viewBox="0 0 260 260" style={{transform:"scaleY(-1)"}}>
        <path d="M0 80 L40 80 L40 40 L80 40" fill="none" stroke="#00f5ff" strokeWidth="0.6"/>
        <path d="M0 120 L70 120 L70 70 L120 70" fill="none" stroke="#a259ff" strokeWidth="0.4"/>
        <circle cx="40" cy="80" r="2.5" fill="#00f5ff"/>
        <circle cx="80" cy="40" r="2"   fill="#00f5ff"/>
      </svg>
      <svg className="fixed bottom-0 right-0 pointer-events-none z-0 opacity-15"
        width="260" height="260" viewBox="0 0 260 260" style={{transform:"scale(-1,-1)"}}>
        <path d="M0 80 L40 80 L40 40 L80 40" fill="none" stroke="#a259ff" strokeWidth="0.6"/>
        <path d="M0 120 L70 120 L70 70 L120 70" fill="none" stroke="#00f5ff" strokeWidth="0.4"/>
        <circle cx="40" cy="80" r="2.5" fill="#a259ff"/>
        <circle cx="80" cy="40" r="2"   fill="#a259ff"/>
      </svg>
    </>
  );
}
