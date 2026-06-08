"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="py-16 px-6 flex flex-col items-center gap-4">
      <div className="section-divider w-full mb-10" />
      <SiriOrb
        size="32px"
        animationDuration={25}
        colors={{
          c1: "oklch(80% 0.2 190)",
          c2: "oklch(75% 0.18 210)",
          c3: "oklch(78% 0.22 170)",
        }}
      />
      <p className="font-heading text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
        {tx(t.footer.name, lang)}
      </p>
    </footer>
  );
}
