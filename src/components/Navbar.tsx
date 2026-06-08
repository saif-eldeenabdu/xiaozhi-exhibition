"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

export function Navbar() {
  const { lang, toggle } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-3">
        <SiriOrb
          size="26px"
          animationDuration={20}
          colors={{
            c1: "oklch(80% 0.2 190)",
            c2: "oklch(75% 0.18 210)",
            c3: "oklch(78% 0.22 170)",
          }}
        />
        <span className="font-heading text-xs font-bold tracking-widest text-white/90">
          {tx(t.nav, lang)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/nerds"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading text-xs tracking-widest transition-all duration-300"
          style={{
            border: "1px solid rgba(74,222,128,0.25)",
            color: "#4ade80",
            background: "rgba(74,222,128,0.05)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.12)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.5)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.05)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.25)";
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 5px #4ade80" }} />
          {lang === "en" ? "FOR NERDS" : "للمهتمين"}
        </Link>

        <button
          onClick={toggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-cyan/30 bg-cyan/5 hover:bg-cyan/10 hover:border-cyan/60 transition-all duration-300 font-heading text-xs tracking-widest text-cyan"
          aria-label="Toggle language"
        >
          <span
            className="transition-all duration-300"
            style={{ opacity: lang === "en" ? 1 : 0.35, fontWeight: lang === "en" ? 700 : 400 }}
          >
            EN
          </span>
          <span className="text-white/20 mx-0.5">/</span>
          <span
            className="transition-all duration-300"
            style={{ opacity: lang === "ar" ? 1 : 0.35, fontWeight: lang === "ar" ? 700 : 400 }}
          >
            AR
          </span>
        </button>
      </div>
    </nav>
  );
}
