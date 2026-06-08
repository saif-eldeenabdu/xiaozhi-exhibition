# Xiaozhi ESP32 Exhibition Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-futuristic, bilingual (EN/AR) single-page exhibition website for the Xiaozhi ESP32 AI Assistant project, featuring 7 sections, a live interactive demo simulation, animated hardware diagram, scroll animations, and full RTL support.

**Architecture:** Next.js 14 App Router with TypeScript and Tailwind CSS. All content lives in a single `translations.ts` file for clean EN/AR switching. A React context (`LanguageContext`) drives RTL layout and string resolution across all components. No external animation libraries — all motion via CSS keyframes and vanilla JS `IntersectionObserver`.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3, Google Fonts (Orbitron + DM Sans), CSS custom properties, IntersectionObserver API, localStorage.

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies |
| `next.config.ts` | Next.js config |
| `tailwind.config.ts` | Extended theme (colors, fonts, keyframes) |
| `src/app/globals.css` | CSS vars, noise overlay, grid pattern, glow utilities, scroll-reveal classes |
| `src/app/layout.tsx` | Root layout: fonts, `<html dir>`, metadata |
| `src/app/page.tsx` | Assembles all sections, mounts IntersectionObserver |
| `src/lib/utils.ts` | `cn()` classname utility |
| `src/lib/translations.ts` | All EN/AR string pairs |
| `src/context/LanguageContext.tsx` | Lang state, toggle, RTL sync, localStorage |
| `src/components/SiriOrb.tsx` | Verbatim orb component from spec |
| `src/components/Navbar.tsx` | Logo + EN/AR toggle |
| `src/components/Hero.tsx` | Orb hero + CTA |
| `src/components/WhatIsIt.tsx` | 3 stat cards + punchy paragraph |
| `src/components/Hardware.tsx` | SVG breadboard schematic + animated callout labels |
| `src/components/HowItWorks.tsx` | 6-step animated pipeline |
| `src/components/LiveDemo.tsx` | Chat sim + collapsible architecture diagram |
| `src/components/AboutBuilder.tsx` | Credit paragraph + 3 achievement badges |
| `src/components/Footer.tsx` | Minimal project name + tiny orb |

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Initialize the project**

Run from `D:/projects/jarvis`:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```
Expected: Project scaffolded with `src/app/`, `tailwind.config.ts`, `package.json`.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install lucide-react
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: Server starts on `http://localhost:3000` with no errors. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 14 project with TypeScript and Tailwind"
```

---

## Task 2: Tailwind Config + Google Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update tailwind.config.ts**

Replace the entire file content with:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        "bg-2": "#0d0d0d",
        cyan: "#00f5ff",
        violet: "#a259ff",
        muted: "#888888",
      },
      fontFamily: {
        heading: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(170px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(170px) rotate(-360deg)" },
        },
        "orbit-sm": {
          "0%": { transform: "rotate(0deg) translateX(52px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(52px) rotate(-360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 40px rgba(0,245,255,0.3)" },
          "50%": { boxShadow: "0 0 80px rgba(0,245,255,0.6)" },
        },
        "dot-travel": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(-200px)", opacity: "0" },
        },
        "step-glow": {
          "0%, 100%": { boxShadow: "0 0 0px rgba(0,245,255,0)" },
          "50%": { boxShadow: "0 0 20px rgba(0,245,255,0.8)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        orbit: "orbit 8s linear infinite",
        "orbit-sm": "orbit-sm 6s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "dot-travel": "dot-travel 2s ease-in-out infinite",
        "step-glow": "step-glow 2s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update src/app/layout.tsx with Google Fonts**

Replace the entire file:
```typescript
import type { Metadata } from "next";
import { Orbitron, DM_Sans } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Xiaozhi ESP32 AI Assistant",
  description: "A fully functional voice AI assistant built by hand on a chip smaller than your thumbnail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${orbitron.variable} ${dmSans.variable} font-body bg-bg text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx
git commit -m "feat: configure Tailwind theme with custom colors, fonts, and keyframes"
```

---

## Task 3: Global CSS (Noise, Grid, Glow, Scroll-Reveal)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cyan: #00f5ff;
  --violet: #a259ff;
  --bg: #080808;
  --bg-2: #0d0d0d;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  position: relative;
  overflow-x: hidden;
}

/* Noise texture overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

/* Section divider */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  box-shadow: 0 0 8px var(--cyan);
  opacity: 0.4;
}

/* Grid pattern background */
.grid-bg {
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Cyan glow text */
.text-glow-cyan {
  text-shadow: 0 0 20px rgba(0, 245, 255, 0.6);
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }

/* Glowing border */
.border-glow {
  border: 1px solid rgba(0, 245, 255, 0.2);
  box-shadow: 0 0 12px rgba(0, 245, 255, 0.08), inset 0 0 12px rgba(0, 245, 255, 0.02);
}

.border-glow:hover {
  border-color: rgba(0, 245, 255, 0.5);
  box-shadow: 0 0 24px rgba(0, 245, 255, 0.2), inset 0 0 12px rgba(0, 245, 255, 0.05);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

/* Arabic font override — use DM Sans with proper Arabic support fallback */
[dir="rtl"] {
  font-family: var(--font-dm-sans), "Segoe UI", "Tahoma", "Arial Unicode MS", sans-serif;
}

[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3 {
  font-family: var(--font-orbitron), "Segoe UI", sans-serif;
}

/* Typing cursor */
.typing-cursor::after {
  content: "▋";
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add global CSS with noise texture, grid bg, glow utils, scroll-reveal"
```

---

## Task 4: Utils + Translations

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/translations.ts`

- [ ] **Step 1: Create src/lib/utils.ts**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Install clsx and tailwind-merge**

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 3: Create src/lib/translations.ts**

```typescript
export type Lang = "en" | "ar";

export const t = {
  nav: {
    en: "Xiaozhi ESP32",
    ar: "شياوجي ESP32",
  },

  hero: {
    headline: {
      en: "Meet the AI that lives in your pocket.",
      ar: "قابل الذكاء الاصطناعي الذي يعيش في جيبك.",
    },
    subheadline: {
      en: "A fully functional voice AI assistant — built by hand, on a chip smaller than your thumbnail.",
      ar: "مساعد ذكاء اصطناعي صوتي متكامل — مبني يدوياً على شريحة أصغر من إبهامك.",
    },
    cta: {
      en: "See How It Works",
      ar: "اكتشف كيف يعمل",
    },
  },

  whatIsIt: {
    title: {
      en: "What Is It?",
      ar: "ما هو؟",
    },
    stat1: {
      en: "$15 in hardware",
      ar: "١٥ دولاراً فقط في المكونات",
    },
    stat2: {
      en: "4 components. 1 brain.",
      ar: "٤ مكونات. عقل واحد.",
    },
    stat3: {
      en: "Millisecond response",
      ar: "استجابة في أجزاء من الثانية",
    },
    body: {
      en: "This is not a toy. This is a real, live AI assistant — the kind you'd find in smart speakers and voice assistants — built from scratch on a microcontroller the size of a thumbnail. It hears you, thinks, and talks back. Entirely by hand.",
      ar: "هذا ليس لعبة. هذا مساعد ذكاء اصطناعي حقيقي ومباشر — من النوع الذي تجده في السماعات الذكية ومساعدي الصوت — مبني من الصفر على متحكم دقيق بحجم إبهام. يسمعك، يفكر، ويرد عليك. يدوياً بالكامل.",
    },
  },

  hardware: {
    title: {
      en: "Built by Hand",
      ar: "مبني يدوياً",
    },
    comp1: {
      label: { en: "The Brain", ar: "العقل" },
      tooltip: { en: "ESP32-S3: dual-core 240MHz processor with built-in WiFi and Bluetooth.", ar: "معالج ثنائي النواة بتردد 240MHz مع واي فاي وبلوتوث مدمجَين." },
    },
    comp2: {
      label: { en: "The Ears", ar: "الأذنان" },
      tooltip: { en: "INMP441: I2S MEMS microphone with ultra-low noise and 24-bit precision.", ar: "ميكروفون MEMS بدقة 24 بت وضوضاء منخفضة للغاية." },
    },
    comp3: {
      label: { en: "The Voice", ar: "الصوت" },
      tooltip: { en: "MAX98357 + speaker: I2S class-D amplifier that turns digital audio into sound.", ar: "مضخم صوت رقمي يحوّل الصوت الرقمي إلى موجات صوتية." },
    },
    comp4: {
      label: { en: "The Face", ar: "الوجه" },
      tooltip: { en: "OLED display: 128×64 pixels showing animated expressions and status.", ar: "شاشة OLED بدقة 128×64 بكسل تعرض تعبيرات متحركة وحالة الجهاز." },
    },
  },

  howItWorks: {
    title: {
      en: "How It Works",
      ar: "كيف يعمل",
    },
    steps: [
      { en: "You speak", ar: "تتكلم", icon: "mic" },
      { en: "Chip captures + compresses", ar: "الشريحة تلتقط وتضغط", icon: "cpu" },
      { en: "Streams over WiFi", ar: "إرسال عبر الواي فاي", icon: "wifi" },
      { en: "AI understands + responds", ar: "الذكاء الاصطناعي يفهم ويرد", icon: "brain" },
      { en: "Response streams back", ar: "الرد يعود", icon: "zap" },
      { en: "You hear the answer", ar: "تسمع الإجابة", icon: "volume2" },
    ],
    footer: {
      en: "The entire round trip — from your voice to the AI's response — happens faster than a blink.",
      ar: "الرحلة الكاملة — من صوتك إلى رد الذكاء الاصطناعي — تحدث أسرع من رمشة عين.",
    },
    playBtn: {
      en: "Play Animation",
      ar: "تشغيل الرسوم المتحركة",
    },
  },

  demo: {
    title: {
      en: "Try It",
      ar: "جربه",
    },
    subtitle: {
      en: "A simulation of how the real device responds",
      ar: "محاكاة لكيفية استجابة الجهاز الحقيقي",
    },
    idle: {
      en: "Tap the mic to start",
      ar: "اضغط على الميكروفون للبدء",
    },
    listening: {
      en: "Listening...",
      ar: "جارٍ الاستماع...",
    },
    thinking: {
      en: "Processing...",
      ar: "جارٍ المعالجة...",
    },
    underHoodBtn: {
      en: "Under the Hood",
      ar: "خلف الكواليس",
    },
    layers: {
      hardware: { en: "Hardware Layer", ar: "طبقة المكونات" },
      firmware: { en: "Firmware Layer", ar: "طبقة البرمجيات الثابتة" },
      cloud: { en: "Cloud AI Layer", ar: "طبقة الذكاء السحابي" },
      hardwareTip: { en: "Mic captures audio → ESP32 digitizes → amp plays back", ar: "الميكروفون يلتقط الصوت → ESP32 يحوله رقمياً → المضخم يشغله" },
      firmwareTip: { en: "Xiaozhi framework on ESP-IDF, WebSocket stream, Opus codec compression", ar: "إطار Xiaozhi على ESP-IDF، بث WebSocket، ضغط Opus" },
      cloudTip: { en: "Speech-to-Text → Large Language Model → Text-to-Speech pipeline", ar: "تحويل الكلام إلى نص → نموذج لغوي كبير → تحويل النص إلى كلام" },
    },
  },

  about: {
    title: {
      en: "Built From Scratch",
      ar: "مبني من الصفر",
    },
    body: {
      en: "Every wire soldered. Every config file tuned. Every component chosen deliberately. This isn't a kit — it's a working embedded AI system, built and understood at every layer.",
      ar: "كل سلك تم لحامه. كل ملف إعدادات تم ضبطه. كل مكون تم اختياره بعناية. هذا ليس طقماً جاهزاً — إنه نظام ذكاء اصطناعي مدمج يعمل، مبني ومفهوم في كل طبقة.",
    },
    badge1: { en: "Custom Firmware Configuration", ar: "تهيئة البرمجيات الثابتة المخصصة" },
    badge2: { en: "Hand-Wired Hardware", ar: "أجهزة مولودة يدوياً" },
    badge3: { en: "Original Face Animation Layer", ar: "طبقة تحريك الوجه الأصلية" },
  },

  footer: {
    name: {
      en: "Xiaozhi ESP32 Assistant",
      ar: "مساعد شياوجي ESP32",
    },
  },
};

export function tx(obj: { en: string; ar: string }, lang: Lang): string {
  return obj[lang];
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils.ts src/lib/translations.ts
git commit -m "feat: add cn utility and full EN/AR translations"
```

---

## Task 5: Language Context

**Files:**
- Create: `src/context/LanguageContext.tsx`

- [ ] **Step 1: Create the context**

```typescript
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "ar" || stored === "en") {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggle = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/LanguageContext.tsx
git commit -m "feat: add LanguageContext with RTL toggle and localStorage persistence"
```

---

## Task 6: SiriOrb Component

**Files:**
- Create: `src/components/SiriOrb.tsx`

- [ ] **Step 1: Create SiriOrb.tsx (verbatim from spec, cleaned for Next.js)**

```typescript
"use client";

import { cn } from "@/lib/utils";

interface SiriOrbProps {
  size?: string;
  className?: string;
  colors?: { bg?: string; c1?: string; c2?: string; c3?: string };
  animationDuration?: number;
}

export const SiriOrb: React.FC<SiriOrbProps> = ({
  size = "192px",
  className,
  colors,
  animationDuration = 20,
}) => {
  const defaultColors = {
    bg: "transparent",
    c1: "oklch(75% 0.15 350)",
    c2: "oklch(80% 0.12 200)",
    c3: "oklch(78% 0.14 280)",
  };
  const finalColors = { ...defaultColors, ...colors };
  const sizeValue = parseInt(size.replace("px", ""), 10);
  const blurAmount = Math.max(sizeValue * 0.08, 8);
  const contrastAmount = Math.max(sizeValue * 0.003, 1.8);

  return (
    <div
      className={cn("siri-orb-wrapper", className)}
      style={
        {
          width: size,
          height: size,
          "--bg": finalColors.bg,
          "--c1": finalColors.c1,
          "--c2": finalColors.c2,
          "--c3": finalColors.c3,
          "--animation-duration": `${animationDuration}s`,
          "--blur-amount": `${blurAmount}px`,
          "--contrast-amount": contrastAmount,
        } as React.CSSProperties
      }
    >
      <style>{`
        @property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        .siri-orb-wrapper {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          background: radial-gradient(circle, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.03) 30%, transparent 70%);
          flex-shrink: 0;
        }
        .siri-orb-wrapper::before {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            conic-gradient(from calc(var(--angle) * 1.2) at 30% 65%, var(--c3) 0deg, transparent 45deg 315deg, var(--c3) 360deg),
            conic-gradient(from calc(var(--angle) * 0.8) at 70% 35%, var(--c2) 0deg, transparent 60deg 300deg, var(--c2) 360deg),
            conic-gradient(from calc(var(--angle) * -1.5) at 65% 75%, var(--c1) 0deg, transparent 90deg 270deg, var(--c1) 360deg),
            conic-gradient(from calc(var(--angle) * 2.1) at 25% 25%, var(--c2) 0deg, transparent 30deg 330deg, var(--c2) 360deg),
            conic-gradient(from calc(var(--angle) * -0.7) at 80% 80%, var(--c1) 0deg, transparent 45deg 315deg, var(--c1) 360deg),
            radial-gradient(ellipse 120% 80% at 40% 60%, var(--c3) 0%, transparent 50%);
          filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(1.2);
          animation: orb-rotate var(--animation-duration) linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }
        .siri-orb-wrapper::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 45% 55%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 30%, transparent 60%);
          mix-blend-mode: overlay;
        }
        @keyframes orb-rotate { from { --angle: 0deg; } to { --angle: 360deg; } }
        @media (prefers-reduced-motion: reduce) { .siri-orb-wrapper::before { animation: none; } }
      `}</style>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SiriOrb.tsx
git commit -m "feat: add SiriOrb component with animated conic gradient orb"
```

---

## Task 7: Navbar Component

**Files:**
- Create: `src/components/Navbar.tsx`

- [ ] **Step 1: Create Navbar.tsx**

```typescript
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

export function Navbar() {
  const { lang, toggle } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-3">
        <SiriOrb
          size="28px"
          animationDuration={20}
          colors={{
            c1: "oklch(80% 0.2 190)",
            c2: "oklch(75% 0.18 210)",
            c3: "oklch(78% 0.22 170)",
          }}
        />
        <span className="font-heading text-sm font-bold tracking-widest text-white/90">
          {tx(t.nav, lang)}
        </span>
      </div>

      <button
        onClick={toggle}
        className="relative flex items-center gap-1 px-3 py-1.5 rounded-full border border-cyan/30 bg-cyan/5 hover:bg-cyan/10 hover:border-cyan/60 transition-all duration-300 font-heading text-xs tracking-widest text-cyan"
        aria-label="Toggle language"
      >
        <span
          className={`transition-all duration-300 ${lang === "en" ? "opacity-100 font-bold" : "opacity-40"}`}
        >
          EN
        </span>
        <span className="text-white/20 mx-0.5">/</span>
        <span
          className={`transition-all duration-300 ${lang === "ar" ? "opacity-100 font-bold" : "opacity-40"}`}
        >
          AR
        </span>
      </button>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Navbar with language toggle"
```

---

## Task 8: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Create Hero.tsx**

```typescript
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
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Orbit ring */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer orbit ring */}
        <div
          className="absolute rounded-full border border-cyan/20"
          style={{ width: "360px", height: "360px" }}
        />
        {/* Orbiting dot */}
        <div
          className="absolute"
          style={{ width: "360px", height: "360px" }}
        >
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyan"
            style={{
              marginTop: "-4px",
              marginLeft: "-4px",
              boxShadow: "0 0 8px rgba(0,245,255,0.8)",
              animation: "orbit 8s linear infinite",
            }}
          />
        </div>

        {/* Main orb */}
        <div
          className="relative"
          style={{
            animation: "glow-pulse 3s ease-in-out infinite",
            borderRadius: "50%",
          }}
        >
          <SiriOrb
            size="300px"
            animationDuration={15}
            colors={{
              c1: "oklch(80% 0.2 190)",
              c2: "oklch(75% 0.18 210)",
              c3: "oklch(78% 0.22 170)",
            }}
          />
        </div>
      </div>

      {/* Text */}
      <h1
        className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-glow-cyan reveal mb-4 max-w-3xl"
        style={{ lineHeight: 1.15 }}
      >
        {tx(t.hero.headline, lang)}
      </h1>

      <p className="font-body text-base sm:text-lg text-muted reveal reveal-delay-2 max-w-xl mb-10">
        {tx(t.hero.subheadline, lang)}
      </p>

      <button
        onClick={scrollToDemo}
        className="reveal reveal-delay-3 relative px-8 py-4 font-heading text-sm font-bold tracking-widest text-bg bg-cyan rounded-full hover:shadow-[0_0_32px_rgba(0,245,255,0.5)] transition-all duration-300 hover:scale-105 active:scale-100"
      >
        {tx(t.hero.cta, lang)}
      </button>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(transparent, #080808)",
        }}
      />
    </section>
  );
}
```

- [ ] **Step 2: Add CSS keyframes for orbit and glow-pulse to globals.css**

These are already added in Task 3's globals.css. Confirm `@keyframes orbit` and `@keyframes glow-pulse` (as CSS, not just Tailwind) exist. Add at end of globals.css if missing:
```css
@keyframes orbit {
  0%   { transform: rotate(0deg) translateX(178px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(178px) rotate(-360deg); }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 40px rgba(0,245,255,0.3); }
  50%       { box-shadow: 0 0 80px rgba(0,245,255,0.6); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx src/app/globals.css
git commit -m "feat: add Hero section with orb, orbit ring, and animated headline"
```

---

## Task 9: WhatIsIt Section

**Files:**
- Create: `src/components/WhatIsIt.tsx`

- [ ] **Step 1: Create WhatIsIt.tsx**

```typescript
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

const stats = [
  {
    icon: "💰",
    svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18h-2v1.93C7.06 19.44 4.56 16.94 4.07 14H6v-2H4.07C4.56 9.06 7.06 6.56 10 6.07V8h2V6.07c2.94.49 5.44 2.99 5.93 5.93H16v2h1.93c-.49 2.94-2.99 5.44-5.93 5.93z",
    stat: t.whatIsIt.stat1,
  },
  {
    icon: "🧠",
    svgPath: "M9.5 2A5.5 5.5 0 0 0 4 7.5v9A5.5 5.5 0 0 0 9.5 22h5a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 14.5 2h-5zM12 6a1 1 0 0 1 1 1v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V7a1 1 0 0 1 1-1z",
    stat: t.whatIsIt.stat2,
  },
  {
    icon: "⚡",
    svgPath: "M13 2L4.09 12.97 11 12l-2 8.03L20 10h-7l2-8z",
    stat: t.whatIsIt.stat3,
  },
];

export function WhatIsIt() {
  const { lang } = useLanguage();

  return (
    <section id="what-is-it" className="py-24 px-6 relative">
      <div className="section-divider mb-24" />

      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white text-center mb-16 reveal">
          {tx(t.whatIsIt.title, lang)}
        </h2>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`reveal reveal-delay-${i + 1} border-glow rounded-2xl p-8 text-center bg-bg-2/60 backdrop-blur-sm group cursor-default`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center group-hover:bg-cyan/20 transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-cyan fill-current"
                    viewBox="0 0 24 24"
                    style={{ color: "#00f5ff" }}
                  >
                    <path d={s.svgPath} />
                  </svg>
                </div>
              </div>
              <p className="font-heading text-lg font-bold text-white">
                {tx(s.stat, lang)}
              </p>
            </div>
          ))}
        </div>

        {/* Body paragraph */}
        <p className="reveal reveal-delay-4 font-body text-base sm:text-lg text-muted text-center max-w-2xl mx-auto leading-relaxed">
          {tx(t.whatIsIt.body, lang)}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WhatIsIt.tsx
git commit -m "feat: add WhatIsIt section with stat cards and punchy paragraph"
```

---

## Task 10: Hardware Section (SVG Schematic)

**Files:**
- Create: `src/components/Hardware.tsx`

- [ ] **Step 1: Create Hardware.tsx with SVG breadboard schematic**

```typescript
"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

interface ComponentDef {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: keyof typeof t.hardware;
  lineX: number;
  lineY: number;
  labelSide: "left" | "right";
}

const components: ComponentDef[] = [
  {
    id: 1,
    x: 145,
    y: 110,
    width: 80,
    height: 50,
    color: "#00f5ff",
    label: "comp1",
    lineX: 80,
    lineY: 135,
    labelSide: "left",
  },
  {
    id: 2,
    x: 145,
    y: 195,
    width: 50,
    height: 30,
    color: "#a259ff",
    label: "comp2",
    lineX: 80,
    lineY: 210,
    labelSide: "left",
  },
  {
    id: 3,
    x: 225,
    y: 195,
    width: 60,
    height: 30,
    color: "#00f5ff",
    label: "comp3",
    lineX: 330,
    lineY: 210,
    labelSide: "right",
  },
  {
    id: 4,
    x: 155,
    y: 260,
    width: 60,
    height: 40,
    color: "#a259ff",
    label: "comp4",
    lineX: 330,
    lineY: 280,
    labelSide: "right",
  },
];

export function Hardware() {
  const { lang } = useLanguage();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  return (
    <section id="hardware" className="py-24 px-6 relative">
      <div className="section-divider mb-24" />
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white text-center mb-16 reveal">
          {tx(t.hardware.title, lang)}
        </h2>

        <div className="reveal flex justify-center">
          <div className="relative" style={{ width: "420px", maxWidth: "100%" }}>
            {/* SVG Schematic */}
            <svg
              viewBox="0 0 420 360"
              className="w-full"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,245,255,0.15))" }}
            >
              {/* Breadboard base */}
              <rect x="100" y="80" width="220" height="240" rx="6" fill="#0d1117" stroke="rgba(0,245,255,0.15)" strokeWidth="1" />

              {/* Breadboard rails */}
              <rect x="108" y="88" width="204" height="8" rx="2" fill="rgba(0,245,255,0.05)" stroke="rgba(0,245,255,0.1)" strokeWidth="0.5" />
              <rect x="108" y="305" width="204" height="8" rx="2" fill="rgba(255,0,0,0.05)" stroke="rgba(255,100,100,0.1)" strokeWidth="0.5" />

              {/* Pin holes grid */}
              {Array.from({ length: 10 }).map((_, row) =>
                Array.from({ length: 18 }).map((_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={116 + col * 11}
                    cy={108 + row * 18}
                    r="1.5"
                    fill="rgba(0,245,255,0.12)"
                  />
                ))
              )}

              {/* Connecting wires */}
              <path d="M185 135 L185 195" stroke="rgba(0,245,255,0.3)" strokeWidth="1.5" strokeDasharray="4 2" />
              <path d="M185 225 L185 260" stroke="rgba(162,89,255,0.3)" strokeWidth="1.5" strokeDasharray="4 2" />
              <path d="M275 210 L285 210" stroke="rgba(0,245,255,0.3)" strokeWidth="1.5" />

              {/* Components */}
              {components.map((comp, i) => (
                <g
                  key={comp.id}
                  style={{
                    cursor: "pointer",
                    animation: `fade-in 0.5s ease-out ${i * 0.2}s both`,
                  }}
                  onClick={() =>
                    setActiveTooltip(activeTooltip === comp.id ? null : comp.id)
                  }
                  onMouseEnter={() => setActiveTooltip(comp.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <rect
                    x={comp.x}
                    y={comp.y}
                    width={comp.width}
                    height={comp.height}
                    rx="4"
                    fill={`${comp.color}15`}
                    stroke={comp.color}
                    strokeWidth={activeTooltip === comp.id ? "2" : "1"}
                    style={{
                      filter:
                        activeTooltip === comp.id
                          ? `drop-shadow(0 0 6px ${comp.color})`
                          : "none",
                      transition: "all 0.2s",
                    }}
                  />
                  {/* Chip pins */}
                  {Array.from({ length: 4 }).map((_, p) => (
                    <rect
                      key={p}
                      x={comp.x + (p * comp.width) / 4 + comp.width / 8 - 1}
                      y={comp.y - 4}
                      width="3"
                      height="4"
                      fill={comp.color}
                      opacity="0.5"
                    />
                  ))}
                  <text
                    x={comp.x + comp.width / 2}
                    y={comp.y + comp.height / 2 + 4}
                    textAnchor="middle"
                    fill={comp.color}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {comp.id === 1 ? "ESP32-S3" : comp.id === 2 ? "INMP441" : comp.id === 3 ? "MAX98357" : "OLED"}
                  </text>
                </g>
              ))}

              {/* Callout lines + labels */}
              {components.map((comp, i) => {
                const key = comp.label as keyof typeof t.hardware;
                if (key === "title") return null;
                const compData = t.hardware[key] as { label: { en: string; ar: string }; tooltip: { en: string; ar: string } };
                const midY = comp.y + comp.height / 2;
                const isRight = comp.labelSide === "right";
                const lineEnd = isRight ? comp.lineX : comp.lineX;
                const compMidX = comp.x + (isRight ? comp.width : 0);

                return (
                  <g
                    key={`label-${comp.id}`}
                    style={{
                      animation: `fade-in 0.5s ease-out ${i * 0.2 + 0.3}s both`,
                    }}
                  >
                    <line
                      x1={compMidX}
                      y1={midY}
                      x2={lineEnd}
                      y2={comp.lineY}
                      stroke={comp.color}
                      strokeWidth="0.75"
                      opacity="0.6"
                      strokeDasharray="3 2"
                    />
                    <circle cx={lineEnd} cy={comp.lineY} r="3" fill={comp.color} opacity="0.8" />
                    <text
                      x={isRight ? lineEnd + 8 : lineEnd - 8}
                      y={comp.lineY + 4}
                      textAnchor={isRight ? "start" : "end"}
                      fill="white"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {tx(compData.label, lang)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip overlay */}
            {activeTooltip !== null && (() => {
              const comp = components.find((c) => c.id === activeTooltip)!;
              const key = comp.label as keyof typeof t.hardware;
              if (key === "title") return null;
              const compData = t.hardware[key] as { label: { en: string; ar: string }; tooltip: { en: string; ar: string } };
              return (
                <div
                  className="absolute z-10 bg-bg-2/95 border border-cyan/30 rounded-xl px-4 py-3 text-xs font-body text-white/80 max-w-52 pointer-events-none"
                  style={{
                    top: `${(comp.y / 360) * 100}%`,
                    left: comp.labelSide === "right" ? "75%" : "0%",
                    transform: "translateY(-50%)",
                    boxShadow: "0 0 20px rgba(0,245,255,0.15)",
                  }}
                >
                  <div className="font-bold text-cyan text-xs mb-1">
                    {tx(compData.label, lang)}
                  </div>
                  {tx(compData.tooltip, lang)}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hardware.tsx
git commit -m "feat: add Hardware section with SVG breadboard schematic and callout labels"
```

---

## Task 11: HowItWorks Section

**Files:**
- Create: `src/components/HowItWorks.tsx`

- [ ] **Step 1: Create HowItWorks.tsx**

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

const stepIcons = [
  // Mic
  <svg key="mic" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  // Cpu
  <svg key="cpu" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  // Wifi
  <svg key="wifi" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  // Brain / sparkles
  <svg key="brain" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4z"/><circle cx="12" cy="10" r="2"/></svg>,
  // Zap
  <svg key="zap" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  // Volume
  <svg key="vol" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
];

export function HowItWorks() {
  const { lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = t.howItWorks.steps;

  const playAnimation = () => {
    if (playing) return;
    setPlaying(true);
    setActiveStep(0);
    steps.forEach((_, i) => {
      intervalRef.current = setTimeout(() => {
        setActiveStep(i);
        if (i === steps.length - 1) {
          setTimeout(() => setPlaying(false), 800);
        }
      }, i * 700);
    });
  };

  // Auto-play on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          setTimeout(playAnimation, 400);
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 px-6 relative">
      <div className="section-divider mb-24" />

      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white text-center mb-6 reveal">
          {tx(t.howItWorks.title, lang)}
        </h2>

        <div className="flex justify-center mb-16 reveal reveal-delay-1">
          <button
            onClick={playAnimation}
            disabled={playing}
            className="px-6 py-2 font-heading text-xs tracking-widest rounded-full border border-cyan/30 text-cyan hover:bg-cyan/10 disabled:opacity-40 transition-all duration-300"
          >
            {tx(t.howItWorks.playBtn, lang)}
          </button>
        </div>

        {/* Desktop: horizontal; Mobile: vertical */}
        <div className="hidden md:flex items-center justify-between gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                  style={{
                    borderColor: activeStep >= i ? "#00f5ff" : "rgba(255,255,255,0.1)",
                    color: activeStep >= i ? "#00f5ff" : "rgba(255,255,255,0.3)",
                    boxShadow: activeStep === i ? "0 0 24px rgba(0,245,255,0.6)" : "none",
                    background: activeStep >= i ? "rgba(0,245,255,0.08)" : "transparent",
                  }}
                >
                  {stepIcons[i]}
                </div>
                <p
                  className="mt-3 font-body text-xs text-center max-w-20 transition-colors duration-500"
                  style={{ color: activeStep >= i ? "#fff" : "#555" }}
                >
                  {tx(step, lang)}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="h-px w-8 mx-1 transition-all duration-500 flex-shrink-0"
                  style={{
                    background: activeStep > i ? "#00f5ff" : "rgba(255,255,255,0.1)",
                    boxShadow: activeStep > i ? "0 0 6px rgba(0,245,255,0.5)" : "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="flex md:hidden flex-col items-start gap-6 ps-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500"
                style={{
                  borderColor: activeStep >= i ? "#00f5ff" : "rgba(255,255,255,0.1)",
                  color: activeStep >= i ? "#00f5ff" : "rgba(255,255,255,0.3)",
                  boxShadow: activeStep === i ? "0 0 20px rgba(0,245,255,0.6)" : "none",
                  background: activeStep >= i ? "rgba(0,245,255,0.08)" : "transparent",
                }}
              >
                {stepIcons[i]}
              </div>
              <p
                className="font-body text-sm transition-colors duration-500"
                style={{ color: activeStep >= i ? "#fff" : "#555" }}
              >
                {tx(step, lang)}
              </p>
            </div>
          ))}
        </div>

        <p className="reveal mt-16 font-body text-center text-muted italic max-w-xl mx-auto">
          {tx(t.howItWorks.footer, lang)}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HowItWorks.tsx
git commit -m "feat: add HowItWorks 6-step animated pipeline"
```

---

## Task 12: Live Demo Section

**Files:**
- Create: `src/components/LiveDemo.tsx`

- [ ] **Step 1: Define conversation pairs at top of file**

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx, type Lang } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

type DemoState = "idle" | "listening" | "thinking" | "responding";

const conversations: Array<{ user: { en: string; ar: string }; ai: { en: string; ar: string } }> = [
  {
    user: { en: "What's the capital of Saudi Arabia?", ar: "ما هي عاصمة المملكة العربية السعودية؟" },
    ai: { en: "The capital of Saudi Arabia is Riyadh — also home to some of the most ambitious tech initiatives in the world.", ar: "عاصمة المملكة العربية السعودية هي الرياض — موطن بعض أكثر المبادرات التقنية طموحاً في العالم." },
  },
  {
    user: { en: "Tell me a fun fact.", ar: "أخبرني بحقيقة ممتعة." },
    ai: { en: "A single bolt of lightning contains enough energy to toast 100,000 slices of bread. Not that I'd recommend it.", ar: "صاعقة برق واحدة تحتوي على طاقة كافية لتحميص 100,000 شريحة خبز. لكنني لا أنصح بتجربة ذلك." },
  },
  {
    user: { en: "What can you do?", ar: "ماذا تستطيع أن تفعل؟" },
    ai: { en: "I can answer questions, hold conversations, tell you facts, help you think — all from a chip the size of your thumbnail.", ar: "يمكنني الإجابة على الأسئلة، وإجراء المحادثات، وإخبارك بالحقائق، ومساعدتك على التفكير — كل ذلك من شريحة بحجم إبهامك." },
  },
  {
    user: { en: "How smart are you?", ar: "كم أنت ذكي؟" },
    ai: { en: "Smart enough to know I'm running on $15 of hardware. That's either humbling or impressive, depending on how you look at it.", ar: "ذكي بما يكفي لأعرف أنني أعمل على أجهزة بقيمة 15 دولاراً. هذا إما متواضع أو مثير للإعجاب، حسب كيفية نظرتك إليه." },
  },
  {
    user: { en: "Who built you?", ar: "من بناك؟" },
    ai: { en: "A student who wired every component by hand, flashed the firmware, and wrote the face animation layer from scratch. Not bad, right?", ar: "طالب وصّل كل مكوّن يدوياً، وحمّل البرنامج الثابت، وكتب طبقة تحريك الوجه من الصفر. ليس سيئاً، أليس كذلك؟" },
  },
];
```

- [ ] **Step 2: Add the component body**

Append to the same file:
```typescript
function useTypewriter(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, active]);
  return { displayed, done };
}

const cyanColors = { c1: "oklch(80% 0.2 190)", c2: "oklch(75% 0.18 210)", c3: "oklch(78% 0.22 170)" };
const violetColors = { c1: "oklch(75% 0.2 290)", c2: "oklch(78% 0.18 310)", c3: "oklch(72% 0.22 270)" };
const idleColors = { c1: "oklch(50% 0.04 220)", c2: "oklch(52% 0.03 200)", c3: "oklch(48% 0.05 240)" };

export function LiveDemo() {
  const { lang } = useLanguage();
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [convoIndex, setConvoIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [currentUserMsg, setCurrentUserMsg] = useState("");
  const [currentAiMsg, setCurrentAiMsg] = useState("");
  const [showArchitecture, setShowArchitecture] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const currentConvo = conversations[convoIndex % conversations.length];

  const userTyping = useTypewriter(
    tx(currentConvo.user, lang),
    demoState === "listening"
  );
  const aiTyping = useTypewriter(
    tx(currentConvo.ai, lang),
    demoState === "responding",
    20
  );

  const handleMic = () => {
    if (demoState !== "idle") return;
    setDemoState("listening");

    setTimeout(() => {
      setDemoState("thinking");
      setMessages((prev) => [
        ...prev,
        { role: "user", text: tx(currentConvo.user, lang) },
      ]);
      setTimeout(() => {
        setDemoState("responding");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "ai", text: tx(currentConvo.ai, lang) },
          ]);
          setConvoIndex((i) => i + 1);
          setDemoState("idle");
        }, tx(currentConvo.ai, lang).length * 22 + 400);
      }, 1000);
    }, 1500);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, demoState]);

  const orbColors =
    demoState === "idle"
      ? idleColors
      : demoState === "listening"
      ? cyanColors
      : violetColors;

  const orbDuration =
    demoState === "idle" ? 30 : demoState === "listening" ? 8 : 5;

  const stateLabel = {
    idle: tx(t.demo.idle, lang),
    listening: tx(t.demo.listening, lang),
    thinking: tx(t.demo.thinking, lang),
    responding: tx(t.demo.thinking, lang),
  };

  return (
    <section id="demo" className="py-24 px-6 relative">
      <div className="section-divider mb-24" />
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white text-center mb-3 reveal">
          {tx(t.demo.title, lang)}
        </h2>
        <p className="font-body text-muted text-center mb-12 reveal reveal-delay-1">
          {tx(t.demo.subtitle, lang)}
        </p>

        {/* Chat container */}
        <div className="reveal border-glow rounded-2xl bg-bg-2/80 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
            <SiriOrb size="40px" colors={orbColors} animationDuration={orbDuration} />
            <div>
              <div className="font-heading text-xs text-white font-bold tracking-widest">
                XIAOZHI
              </div>
              <div
                className="font-body text-xs transition-colors duration-500"
                style={{
                  color:
                    demoState === "idle"
                      ? "#555"
                      : demoState === "listening"
                      ? "#00f5ff"
                      : "#a259ff",
                }}
              >
                {stateLabel[demoState]}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="p-6 space-y-4 overflow-y-auto"
            style={{ minHeight: "280px", maxHeight: "360px" }}
          >
            {messages.length === 0 && demoState === "idle" && (
              <div className="flex items-center justify-center h-32">
                <p className="font-body text-sm text-white/20">
                  {tx(t.demo.idle, lang)}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? (lang === "ar" ? "justify-start" : "justify-end") : (lang === "ar" ? "justify-end" : "justify-start")}`}
              >
                <div
                  className="max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl font-body text-sm"
                  style={{
                    background:
                      msg.role === "user"
                        ? "rgba(0,245,255,0.1)"
                        : "rgba(162,89,255,0.1)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(0,245,255,0.2)"
                        : "1px solid rgba(162,89,255,0.2)",
                    color: msg.role === "user" ? "#00f5ff" : "#e0e0e0",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Active typing */}
            {demoState === "listening" && (
              <div className={`flex ${lang === "ar" ? "justify-start" : "justify-end"}`}>
                <div
                  className="max-w-xs sm:max-w-sm px-4 py-3 font-body text-sm"
                  style={{
                    background: "rgba(0,245,255,0.1)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#00f5ff",
                    borderRadius: "18px 18px 4px 18px",
                  }}
                >
                  {userTyping.displayed}
                  {!userTyping.done && <span className="typing-cursor" />}
                </div>
              </div>
            )}

            {demoState === "responding" && (
              <div className={`flex ${lang === "ar" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-xs sm:max-w-sm px-4 py-3 font-body text-sm"
                  style={{
                    background: "rgba(162,89,255,0.1)",
                    border: "1px solid rgba(162,89,255,0.2)",
                    color: "#e0e0e0",
                    borderRadius: "18px 18px 18px 4px",
                  }}
                >
                  {aiTyping.displayed}
                  {!aiTyping.done && <span className="typing-cursor" />}
                </div>
              </div>
            )}

            {demoState === "thinking" && (
              <div className={`flex ${lang === "ar" ? "justify-end" : "justify-start"}`}>
                <div
                  className="px-4 py-3 font-body text-sm"
                  style={{
                    background: "rgba(162,89,255,0.1)",
                    border: "1px solid rgba(162,89,255,0.2)",
                    color: "#a259ff",
                    borderRadius: "18px 18px 18px 4px",
                  }}
                >
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"
                        style={{
                          animation: `pulse 1s ease-in-out ${d * 0.2}s infinite`,
                          backgroundColor: "#a259ff",
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mic button */}
          <div className="flex justify-center pb-6">
            <button
              onClick={handleMic}
              disabled={demoState !== "idle"}
              className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
              style={{
                borderColor: demoState === "idle" ? "#00f5ff" : "#555",
                background: demoState === "idle" ? "rgba(0,245,255,0.1)" : "transparent",
                boxShadow: demoState === "idle" ? "0 0 20px rgba(0,245,255,0.3)" : "none",
              }}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke={demoState === "idle" ? "#00f5ff" : "#555"}
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        {/* Under the Hood */}
        <div className="reveal mt-8">
          <button
            onClick={() => setShowArchitecture((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 border-glow rounded-2xl font-heading text-sm tracking-widest text-white/70 hover:text-white transition-colors"
          >
            <span>{tx(t.demo.underHoodBtn, lang)}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: showArchitecture ? "rotate(180deg)" : "none" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showArchitecture && (
            <ArchitectureDiagram lang={lang} />
          )}
        </div>
      </div>
    </section>
  );
}

function ArchitectureDiagram({ lang }: { lang: Lang }) {
  const layers = [
    {
      key: "cloud",
      label: tx(t.demo.layers.cloud, lang),
      tip: tx(t.demo.layers.cloudTip, lang),
      color: "#a259ff",
      items: ["STT", "LLM", "TTS"],
      y: 0,
    },
    {
      key: "firmware",
      label: tx(t.demo.layers.firmware, lang),
      tip: tx(t.demo.layers.firmwareTip, lang),
      color: "#00f5ff",
      items: ["Xiaozhi", "ESP-IDF", "WebSocket", "Opus"],
      y: 1,
    },
    {
      key: "hardware",
      label: tx(t.demo.layers.hardware, lang),
      tip: tx(t.demo.layers.hardwareTip, lang),
      color: "#888",
      items: ["MIC", "ESP32-S3", "AMP", "OLED"],
      y: 2,
    },
  ];

  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  return (
    <div className="mt-4 border-glow rounded-2xl bg-bg-2/80 p-6">
      <div className="flex flex-col gap-4">
        {layers.map((layer, li) => (
          <div
            key={layer.key}
            className="relative rounded-xl p-4 cursor-pointer transition-all duration-300"
            style={{
              border: `1px solid ${layer.color}30`,
              background:
                hoveredLayer === layer.key ? `${layer.color}0d` : "transparent",
            }}
            onMouseEnter={() => setHoveredLayer(layer.key)}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="font-heading text-xs font-bold tracking-widest"
                style={{ color: layer.color }}
              >
                {layer.label}
              </span>
              {hoveredLayer === layer.key && (
                <span className="font-body text-xs text-white/50 max-w-xs text-right">
                  {layer.tip}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {layer.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full font-heading text-xs"
                  style={{
                    border: `1px solid ${layer.color}40`,
                    color: layer.color,
                    background: `${layer.color}0a`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Animated data dots going upward */}
            {li < layers.length - 1 && (
              <div className="absolute left-1/2 -bottom-4 flex gap-2">
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: layer.color,
                      animation: `dot-travel 2s ease-in-out ${d * 0.3}s infinite`,
                      boxShadow: `0 0 4px ${layer.color}`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LiveDemo.tsx
git commit -m "feat: add LiveDemo section with chat simulation and architecture diagram"
```

---

## Task 13: AboutBuilder Section

**Files:**
- Create: `src/components/AboutBuilder.tsx`

- [ ] **Step 1: Create AboutBuilder.tsx**

```typescript
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";

const badges = [
  { en: t.about.badge1.en, ar: t.about.badge1.ar, color: "#00f5ff" },
  { en: t.about.badge2.en, ar: t.about.badge2.ar, color: "#a259ff" },
  { en: t.about.badge3.en, ar: t.about.badge3.ar, color: "#00f5ff" },
];

export function AboutBuilder() {
  const { lang } = useLanguage();

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="section-divider mb-24" />

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mb-8 reveal">
          {tx(t.about.title, lang)}
        </h2>

        <p className="font-body text-base sm:text-lg text-muted leading-relaxed mb-12 reveal reveal-delay-1">
          {tx(t.about.body, lang)}
        </p>

        <div className="flex flex-wrap gap-4 justify-center reveal reveal-delay-2">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="px-5 py-2.5 rounded-full font-heading text-xs tracking-widest transition-all duration-300 hover:scale-105"
              style={{
                border: `1px solid ${badge.color}40`,
                color: badge.color,
                background: `${badge.color}0a`,
                boxShadow: `0 0 12px ${badge.color}15`,
              }}
            >
              {lang === "en" ? badge.en : badge.ar}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AboutBuilder.tsx
git commit -m "feat: add AboutBuilder section with achievement badges"
```

---

## Task 14: Footer

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create Footer.tsx**

```typescript
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t, tx } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="py-16 px-6 flex flex-col items-center gap-4">
      <div className="section-divider w-full mb-12" />
      <SiriOrb
        size="32px"
        animationDuration={25}
        colors={{
          c1: "oklch(80% 0.2 190)",
          c2: "oklch(75% 0.18 210)",
          c3: "oklch(78% 0.22 170)",
        }}
      />
      <p className="font-heading text-xs tracking-widest text-white/30">
        {tx(t.footer.name, lang)}
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add minimal Footer with orb"
```

---

## Task 15: Main Page + Scroll Animations

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite src/app/page.tsx**

```typescript
"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhatIsIt } from "@/components/WhatIsIt";
import { Hardware } from "@/components/Hardware";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveDemo } from "@/components/LiveDemo";
import { AboutBuilder } from "@/components/AboutBuilder";
import { Footer } from "@/components/Footer";

function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}

export default function Page() {
  return (
    <LanguageProvider>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        <WhatIsIt />
        <Hardware />
        <HowItWorks />
        <LiveDemo />
        <AboutBuilder />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
```

- [ ] **Step 2: Remove "use client" constraint from layout — it's a server component**

Ensure `src/app/layout.tsx` does NOT have `"use client"` at the top. The LanguageProvider is mounted in page.tsx, so layout stays as a server component.

- [ ] **Step 3: Delete the default Next.js page content**

The default `src/app/page.tsx` is already replaced in Step 1. Also remove `src/app/globals.css` default Next.js styles (already done in Task 3).

- [ ] **Step 4: Test the full page**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Page loads with dark background
- Navbar visible with EN/AR toggle
- Orb renders and animates in hero
- Language toggle switches all text and flips RTL
- Sections fade in on scroll
- HowItWorks pipeline animates
- Demo chat simulation works: click mic → user message types → AI responds
- Architecture diagram expands/collapses

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: assemble main page with all sections and scroll-reveal observer"
```

---

## Task 16: Fix TypeScript Errors + Build Verification

**Files:**
- Possibly modify: any component file with TS errors

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Fix any reported errors. Common issues:
- Missing `React` import in `.tsx` files — add `import React from "react"` if needed
- `t.hardware` index access — cast with `as keyof typeof t.hardware` where needed
- `t.about.badge1` accessed with `.en`/`.ar` directly — use `tx()` helper instead

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. Warnings about `@property` CSS syntax are acceptable.

- [ ] **Step 3: Fix any build errors**

If build fails due to `"use client"` boundary issues (server component importing client component), add `"use client"` to the affected component.

If build fails due to `jsx` in `.tsx` style tag, the SiriOrb uses a `<style>` tag directly — ensure it compiles without the `jsx` pragma (it does since we removed `jsx` attribute from the `<style>` tag).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: resolve TypeScript errors and ensure production build passes"
```

---

## Task 17: Responsive Polish

**Files:**
- Modify: multiple component files as needed

- [ ] **Step 1: Test on mobile viewport (375px)**

In browser DevTools, set viewport to 375×812. Check:
- Hero orb: should be max 220px on mobile. Add `sm:w-[300px] w-[220px]` to orb wrapper.
- Hero headline: font size should be readable. `text-2xl sm:text-4xl md:text-5xl` is correct.
- WhatIsIt cards: stacked on mobile (`grid-cols-1 sm:grid-cols-3` is correct).
- HowItWorks: vertical layout on mobile (already handled with `hidden md:flex` / `flex md:hidden`).
- Hardware SVG: scales with `w-full` — verify it's not cut off.
- Demo chat: `max-w-xs` messages fit on small screens.

- [ ] **Step 2: Fix hero orb size on mobile**

In `src/components/Hero.tsx`, find the `<SiriOrb size="300px" ...>` and wrap it in a responsive container:
```typescript
// Replace the SiriOrb call with:
<div className="block">
  <SiriOrb
    size={typeof window !== "undefined" && window.innerWidth < 640 ? "220px" : "300px"}
    animationDuration={15}
    colors={{
      c1: "oklch(80% 0.2 190)",
      c2: "oklch(75% 0.18 210)",
      c3: "oklch(78% 0.22 170)",
    }}
  />
</div>
```

Actually, since SiriOrb accepts a CSS size string, use a CSS variable approach instead — wrap in a div that constrains it:
```typescript
<div className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px]">
  <SiriOrb
    size="100%"
    ...
  />
</div>
```
Note: SiriOrb uses `parseInt(size)` so passing `"100%"` won't work for blur calc. Use a fixed class approach: render the orb at 300px but wrap in a div that scales it down with CSS `transform: scale()` on mobile. Add to `globals.css`:
```css
@media (max-width: 639px) {
  .hero-orb-scale { transform: scale(0.73); }
}
```
Then add `className="hero-orb-scale"` to the orb wrapper div in Hero.tsx.

- [ ] **Step 3: Final visual check on desktop (1440px)**

Verify sections have appropriate max-widths and center correctly. Check that the noise overlay doesn't interfere with text readability.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: responsive polish for mobile and desktop viewports"
```

---

## Self-Review: Spec Coverage Check

| Spec Requirement | Covered by Task |
|-----------------|-----------------|
| Dark futuristic aesthetic, #080808 bg | Task 2, 3 |
| Cyan #00f5ff + violet #a259ff accents | Task 2, 3 |
| Orbitron + DM Sans fonts | Task 2 |
| Noise texture overlay | Task 3 |
| Grid/circuit pattern | Task 3 |
| Scroll-triggered section reveals | Task 3, 15 |
| EN/AR toggle + RTL flip + localStorage | Task 5, 7 |
| Hero with 300px SiriOrb + orbit ring | Task 8 |
| Hero headline + subheadline + CTA | Task 8 |
| Hero radial glow background | Task 8 |
| 3 stat cards with glowing icons | Task 9 |
| Punchy paragraph (EN+AR) | Task 9 |
| SVG breadboard schematic | Task 10 |
| Animated callout labels with tooltips | Task 10 |
| 6-step HowItWorks pipeline | Task 11 |
| Auto-play on scroll + Play button | Task 11 |
| Horizontal desktop / vertical mobile | Task 11 |
| Demo chat simulation | Task 12 |
| 5 pre-scripted convo pairs (EN+AR) | Task 12 |
| SiriOrb state changes (idle/listen/think) | Task 12 |
| Typing animation for messages | Task 12 |
| Collapsible "Under the Hood" | Task 12 |
| 3-layer architecture diagram | Task 12 |
| Animated data packet dots | Task 12 |
| Credit paragraph + 3 badges | Task 13 |
| Minimal footer with 32px orb | Task 14 |
| Section dividers as glowing lines | Task 3 |
| Mobile responsive | Task 17 |
| No lorem ipsum | All tasks — all content specified |
| No Inter/Roboto/Arial | Task 2 |
| 60fps animations (transform/opacity) | All tasks |
