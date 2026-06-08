"use client";

import { useState, useEffect, useRef } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { Background } from "@/components/Background";
import Link from "next/link";
import { SiriOrb } from "@/components/SiriOrb";

// ─────────────────────────────────────────────────────────────────────────────
// GLOSSARY DATA
// ─────────────────────────────────────────────────────────────────────────────
const glossary: Record<string, { en: string; ar: string }> = {
  "ESP32-S3": {
    en: "A dual-core 240MHz microcontroller by Espressif with built-in WiFi, Bluetooth, and USB — the brain of the device.",
    ar: "معالج دقيق ثنائي النواة بتردد 240MHz من Espressif مع واي فاي وبلوتوث مدمجَين — دماغ الجهاز.",
  },
  "I2S": {
    en: "Inter-IC Sound — a synchronous serial bus protocol designed specifically for digital audio data between chips.",
    ar: "Inter-IC Sound — بروتوكول ناقل تسلسلي متزامن مصمم خصيصاً لنقل بيانات الصوت الرقمي بين الشرائح.",
  },
  "Opus": {
    en: "An open-source audio codec optimized for low-latency internet voice streaming — compresses speech to 16–32kbps.",
    ar: "ضغاط صوت مفتوح المصدر محسّن لبث الصوت عبر الإنترنت بزمن استجابة منخفض.",
  },
  "WebSocket": {
    en: "A protocol that keeps a persistent two-way connection open between device and server — unlike HTTP which closes after each request.",
    ar: "بروتوكول يحافظ على اتصال دائم ثنائي الاتجاه بين الجهاز والخادم.",
  },
  "FreeRTOS": {
    en: "A real-time operating system for microcontrollers — runs multiple tasks concurrently with precise timing guarantees.",
    ar: "نظام تشغيل في الوقت الفعلي للمتحكمات الدقيقة — يشغّل مهام متعددة بشكل متزامن.",
  },
  "PSRAM": {
    en: "Pseudo-Static RAM — external memory chip on the ESP32-S3 module that expands addressable RAM from 512KB to 8MB.",
    ar: "ذاكرة وصول عشوائي خارجية تعمل كـ SRAM — تُوسّع الذاكرة المتاحة من 512KB إلى 8MB.",
  },
  "DMA": {
    en: "Direct Memory Access — hardware that transfers audio data straight to memory without CPU involvement, preventing glitches.",
    ar: "الوصول المباشر للذاكرة — عتاد ينقل بيانات الصوت مباشرة إلى الذاكرة دون تدخل المعالج.",
  },
  "PCM": {
    en: "Pulse-Code Modulation — the raw uncompressed digital audio format before Opus encoding.",
    ar: "تضمين النبضة الرمزية — صيغة الصوت الرقمي الخام غير المضغوط قبل ترميز Opus.",
  },
  "ASR": {
    en: "Automatic Speech Recognition — converts incoming audio stream to text on the cloud server.",
    ar: "التعرف التلقائي على الكلام — يحوّل دفق الصوت الوارد إلى نص على الخادم السحابي.",
  },
  "TTS": {
    en: "Text-to-Speech — synthesizes the LLM's text response back into audio for playback.",
    ar: "تحويل النص إلى كلام — يحوّل رد النموذج اللغوي نصاً إلى صوت للتشغيل.",
  },
  "ESP-IDF": {
    en: "Espressif IoT Development Framework — the official C/C++ SDK for ESP32 chips, built on FreeRTOS.",
    ar: "إطار تطوير إنترنت الأشياء من Espressif — SDK رسمي بلغة C/C++ لشرائح ESP32.",
  },
  "I2C": {
    en: "Inter-Integrated Circuit — a two-wire serial bus used to communicate with the OLED display.",
    ar: "ناقل تسلسلي بسلكَين يُستخدم للتواصل مع شاشة OLED.",
  },
  "MAX98357A": {
    en: "A Class-D I2S digital audio amplifier — accepts digital audio directly from the ESP32 with no DAC needed.",
    ar: "مضخم صوت رقمي من الفئة D — يقبل الصوت الرقمي مباشرة من ESP32 دون الحاجة لمحول DAC.",
  },
  "INMP441": {
    en: "A bottom-port MEMS digital microphone with I2S output — ultra-low noise, 24-bit precision.",
    ar: "ميكروفون MEMS رقمي بخرج I2S — ضوضاء منخفضة جداً ودقة 24 بت.",
  },
  "SSD1306": {
    en: "A 128×64 monochrome OLED display driver chip, controlled over I2C — displays the face animation.",
    ar: "شريحة تحكم في شاشة OLED أحادية اللون 128×64، تُتحكم عبر I2C.",
  },
  "Kconfig": {
    en: "The configuration system used by ESP-IDF — lets you set compile-time options like PSRAM mode and I2S pins.",
    ar: "نظام الإعدادات المستخدم في ESP-IDF — يتيح ضبط خيارات وقت التجميع.",
  },
  "LLM": {
    en: "Large Language Model — the AI model that reads the transcribed text and generates a contextual response.",
    ar: "النموذج اللغوي الكبير — نموذج الذكاء الاصطناعي الذي يقرأ النص ويولّد رداً مناسباً.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOSSARY TERM — inline hover tooltip
// ─────────────────────────────────────────────────────────────────────────────
function GT({ term, children }: { term: string; children?: React.ReactNode }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const def = glossary[term];

  return (
    <span className="relative inline-block">
      <span
        className="cursor-help border-b border-dashed transition-colors duration-200"
        style={{ color: "#00f5ff", borderColor: "rgba(0,245,255,0.4)" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
      >
        {children ?? term}
      </span>
      {open && def && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 rounded-xl text-xs font-body leading-relaxed"
          style={{
            background: "rgba(8,8,20,0.97)",
            border: "1px solid rgba(0,245,255,0.3)",
            boxShadow: "0 0 20px rgba(0,245,255,0.2)",
            color: "#ccc",
            pointerEvents: "none",
          }}
        >
          <span className="font-bold block mb-1" style={{ color: "#00f5ff" }}>{term}</span>
          {def[lang]}
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE BLOCK with manual syntax colouring
// ─────────────────────────────────────────────────────────────────────────────
function CodeBlock({ label, lines }: { label: string; lines: React.ReactNode[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,245,255,0.12)" }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: "rgba(0,245,255,0.06)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-white/30">{label}</span>
      </div>
      <div className="p-4 overflow-x-auto" style={{ background: "rgba(4,4,14,0.95)" }}>
        <pre className="font-mono text-xs leading-6">
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}

const C = {
  kw:   (s: string) => <span style={{ color: "#c792ea" }}>{s}</span>,
  fn:   (s: string) => <span style={{ color: "#82aaff" }}>{s}</span>,
  str:  (s: string) => <span style={{ color: "#c3e88d" }}>{s}</span>,
  num:  (s: string) => <span style={{ color: "#f78c6c" }}>{s}</span>,
  cm:   (s: string) => <span style={{ color: "#546e7a" }}>{s}</span>,
  ty:   (s: string) => <span style={{ color: "#ffcb6b" }}>{s}</span>,
  sym:  (s: string) => <span style={{ color: "#89ddff" }}>{s}</span>,
  plain:(s: string) => <span style={{ color: "#d4d4d4" }}>{s}</span>,
};

// ─────────────────────────────────────────────────────────────────────────────
// ACCORDION SECTION
// ─────────────────────────────────────────────────────────────────────────────
function Accordion({ title, badge, color, children, defaultOpen = false }:
  { title: string; badge: string; color: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${color}22` }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200"
        style={{ background: open ? `${color}0d` : "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
            {badge}
          </span>
          <span className="font-heading text-sm font-bold text-white">{title}</span>
        </div>
        <svg className="w-4 h-4 transition-transform duration-300 flex-shrink-0" style={{ color, transform: open ? "rotate(180deg)" : "none" }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-6 pt-2 space-y-4" style={{ background: "rgba(4,4,14,0.6)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEC ROW
// ─────────────────────────────────────────────────────────────────────────────
function SpecRow({ label, value, accent = "#00f5ff" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="font-mono text-xs w-40 flex-shrink-0" style={{ color: "#666" }}>{label}</span>
      <span className="font-mono text-xs" style={{ color: accent }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TERMINAL BOOT SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────
const bootLines = [
  { text: "ESP-IDF v5.1.2 — Espressif Systems", color: "#546e7a", delay: 0 },
  { text: "I (0) boot: ESP-IDF v5.1.2 Xiaozhi v2.1.0", color: "#888", delay: 120 },
  { text: "I (32) boot: chip revision: v0.2", color: "#888", delay: 200 },
  { text: "I (38) boot: flash 16MB QIO 80MHz", color: "#888", delay: 280 },
  { text: "I (68) psram: Found 8MB PSRAM — OCTAL mode enabled", color: "#c3e88d", delay: 380 },
  { text: "I (120) wifi: WiFi initialized — station mode", color: "#888", delay: 480 },
  { text: "I (155) i2s: DMA buffer 4096B, 16kHz 16bit mono", color: "#82aaff", delay: 580 },
  { text: "I (190) inmp441: Microphone I2S capture READY", color: "#c3e88d", delay: 680 },
  { text: "I (210) max98357: Amplifier I2S playback READY", color: "#c3e88d", delay: 760 },
  { text: "I (225) oled: SSD1306 128x64 I2C — face engine READY", color: "#c3e88d", delay: 840 },
  { text: "I (240) opus: Encoder init 16kHz 16kbps SILK mode OK", color: "#c3e88d", delay: 920 },
  { text: "I (280) ws: WebSocket connected → xiaozhi.me:443", color: "#00f5ff", delay: 1040 },
  { text: "I (295) rtos: Tasks spawned — audio/encode/stream/anim", color: "#ffcb6b", delay: 1140 },
  { text: "I (310) app: IDLE — awaiting wake word...", color: "#a259ff", delay: 1260 },
];

function BootTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    bootLines.forEach((line, i) => {
      setTimeout(() => setVisibleCount(i + 1), line.delay);
    });
  }, [started]);

  return (
    <div ref={ref} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,245,255,0.12)" }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: "rgba(0,245,255,0.06)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-white/30">serial monitor — 115200 baud</span>
        <button onClick={() => { setVisibleCount(0); setTimeout(() => setStarted(true), 100); setStarted(false); }}
          className="ml-auto font-mono text-xs text-white/20 hover:text-cyan transition-colors">↺ replay</button>
      </div>
      <div className="p-4 min-h-48" style={{ background: "rgba(4,4,14,0.97)" }}>
        {bootLines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="font-mono text-xs leading-6 flex items-start gap-2">
            <span style={{ color: "#333" }}>$</span>
            <span style={{ color: line.color }}>{line.text}</span>
          </div>
        ))}
        {visibleCount < bootLines.length && (
          <div className="font-mono text-xs" style={{ color: "#333" }}>
            $ <span className="typing-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FREERTOS TASK DIAGRAM
// ─────────────────────────────────────────────────────────────────────────────
const tasks = [
  { name: "audio_capture",  priority: 22, stack: "4096B",  core: 0, color: "#00f5ff", desc: "Reads I2S DMA ring buffer, writes raw PCM to audio queue" },
  { name: "opus_encoder",   priority: 20, stack: "8192B",  core: 0, color: "#82aaff", desc: "Dequeues PCM frames, Opus-encodes in 20ms chunks" },
  { name: "ws_stream",      priority: 18, stack: "6144B",  core: 1, color: "#c792ea", desc: "Reads encoded packets, writes to WebSocket TX buffer" },
  { name: "ws_receive",     priority: 18, stack: "6144B",  core: 1, color: "#c792ea", desc: "Receives audio response chunks from WebSocket" },
  { name: "audio_playback", priority: 20, stack: "4096B",  core: 1, color: "#00f5ff", desc: "Decodes response audio, writes to I2S playback DMA" },
  { name: "face_animation", priority:  8, stack: "3072B",  core: 0, color: "#ffcb6b", desc: "Reads device state, renders bitmap frames to OLED at ~15fps" },
  { name: "state_machine",  priority: 15, stack: "2048B",  core: 1, color: "#c3e88d", desc: "Manages IDLE→LISTENING→THINKING→SPEAKING transitions" },
];

function TaskDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <div className="flex gap-3 mb-4 font-mono text-xs" style={{ color: "#555" }}>
        <span>CORE 0 (APP CPU)</span>
        <span className="mx-auto" />
        <span>CORE 1 (PRO CPU)</span>
      </div>
      {tasks.map(task => (
        <div
          key={task.name}
          className="relative rounded-lg px-4 py-3 cursor-default transition-all duration-200"
          style={{
            background: hovered === task.name ? `${task.color}12` : "rgba(255,255,255,0.02)",
            border: `1px solid ${hovered === task.name ? task.color + "40" : "rgba(255,255,255,0.06)"}`,
            marginLeft: task.core === 0 ? "0" : "auto",
            marginRight: task.core === 1 ? "0" : "auto",
            maxWidth: "calc(50% - 12px)",
            width: "100%",
          }}
          onMouseEnter={() => setHovered(task.name)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold" style={{ color: task.color }}>{task.name}</span>
            <span className="font-mono text-xs ml-auto" style={{ color: "#555" }}>P{task.priority}</span>
            <span className="font-mono text-xs" style={{ color: "#444" }}>{task.stack}</span>
          </div>
          {hovered === task.name && (
            <p className="font-mono text-xs leading-relaxed" style={{ color: "#888" }}>{task.desc}</p>
          )}
        </div>
      ))}
      <p className="font-mono text-xs mt-3" style={{ color: "#444" }}>
        ↑ hover task to see description — priority range 1–24 (higher = more CPU time)
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMORY MAP
// ─────────────────────────────────────────────────────────────────────────────
function MemoryMap() {
  const regions = [
    { label: "Internal SRAM",  size: "512 KB", used: "~380 KB", pct: 74,  color: "#ff6b6b", desc: "FreeRTOS kernel, task stacks, WiFi stack, app code" },
    { label: "External PSRAM", size: "8 MB",   used: "~3.2 MB", pct: 40,  color: "#00f5ff", desc: "Audio DMA buffers, Opus encoder state, heap allocations" },
    { label: "Flash (code)",   size: "16 MB",  used: "~1.8 MB", pct: 11,  color: "#c3e88d", desc: "Firmware binary, OLED bitmap assets, WiFi certificates" },
  ];
  return (
    <div className="space-y-4">
      {regions.map(r => (
        <div key={r.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-xs font-bold" style={{ color: r.color }}>{r.label}</span>
            <span className="font-mono text-xs" style={{ color: "#666" }}>{r.used} / {r.size}</span>
          </div>
          <div className="h-5 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded transition-all duration-700"
              style={{ width: `${r.pct}%`, background: `linear-gradient(90deg, ${r.color}90, ${r.color}50)`, boxShadow: `0 0 8px ${r.color}40` }} />
          </div>
          <p className="font-mono text-xs mt-1" style={{ color: "#555" }}>{r.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO PIPELINE DIAGRAM (SVG)
// ─────────────────────────────────────────────────────────────────────────────
function AudioPipeline() {
  const [active, setActive] = useState(-1);

  const stages = [
    { label: "INMP441\nMEMS MIC", sub: "I2S 16kHz 16-bit", color: "#00f5ff" },
    { label: "PCM Buffer\nDMA Ring",    sub: "4096B × 2 banks",   color: "#82aaff" },
    { label: "Opus\nEncoder",    sub: "20ms frames 16kbps", color: "#c792ea" },
    { label: "WebSocket\nTX",         sub: "TLS 1.3 xiaozhi.me", color: "#a259ff" },
    { label: "ASR → LLM\n→ TTS",      sub: "Cloud pipeline",     color: "#ffcb6b" },
    { label: "WebSocket\nRX",         sub: "Audio stream back",  color: "#a259ff" },
    { label: "I2S → MAX98357\nAmp",     sub: "Class-D 3W",         color: "#00f5ff" },
  ];

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setActive(i % stages.length);
      i++;
    }, 900);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-2">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="rounded-lg px-3 py-2 transition-all duration-300"
              style={{
                border: `1px solid ${active === i ? s.color : s.color + "22"}`,
                background: active === i ? `${s.color}12` : "transparent",
                boxShadow: active === i ? `0 0 16px ${s.color}30` : "none",
              }}>
              <div className="font-mono text-xs font-bold" style={{ color: active === i ? s.color : "#666" }}>
                {s.label.replace("\n", " ")}
              </div>
              <div className="font-mono text-xs" style={{ color: "#444" }}>{s.sub}</div>
            </div>
            {i < stages.length - 1 && (
              <div className="w-6 h-px" style={{ background: active > i ? s.color : "rgba(255,255,255,0.08)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop: horizontal wrap */}
      <div className="hidden md:flex items-center gap-0 flex-wrap">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="rounded-lg p-3 text-center transition-all duration-300"
              style={{
                border: `1px solid ${active === i ? s.color : s.color + "20"}`,
                background: active === i ? `${s.color}10` : "rgba(255,255,255,0.01)",
                boxShadow: active === i ? `0 0 20px ${s.color}35` : "none",
                minWidth: "100px",
              }}>
              <div className="font-mono text-xs font-bold leading-tight" style={{ color: active === i ? s.color : "#555" }}>
                {s.label.split("\n").map((l, j) => <div key={j}>{l}</div>)}
              </div>
              <div className="font-mono text-xs mt-1" style={{ color: "#444" }}>{s.sub}</div>
            </div>
            {i < stages.length - 1 && (
              <div className="flex items-center mx-1">
                <div className="h-px w-6 transition-all duration-300"
                  style={{ background: active > i ? `linear-gradient(90deg,${stages[i].color},${stages[i+1].color})` : "rgba(255,255,255,0.07)" }} />
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill={active > i ? stages[i].color : "#333"}>
                  <polygon points="0,2 10,6 0,10" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL GLOSSARY TABLE
// ─────────────────────────────────────────────────────────────────────────────
function GlossaryTable() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState("");
  const terms = Object.entries(glossary).filter(([term]) =>
    term.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder={lang === "en" ? "Filter terms…" : "فلترة المصطلحات…"}
        className="w-full mb-4 px-4 py-2 rounded-lg font-mono text-xs outline-none"
        style={{
          background: "rgba(0,245,255,0.04)",
          border: "1px solid rgba(0,245,255,0.2)",
          color: "#ccc",
        }}
      />
      <div className="space-y-2">
        {terms.map(([term, def]) => (
          <div key={term} className="rounded-lg px-4 py-3 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs font-bold" style={{ color: "#00f5ff" }}>{term}</span>
            </div>
            <p className="font-mono text-xs leading-relaxed" style={{ color: "#888" }}>{def[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function NerdsContent() {
  const { lang, toggle } = useLanguage();

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5"
        style={{ background: "rgba(4,4,14,0.85)" }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="font-heading text-xs tracking-widest">
              {lang === "en" ? "BACK" : "رجوع"}
            </span>
          </Link>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
            <span className="font-heading text-xs tracking-widest" style={{ color: "#00f5ff" }}>
              {lang === "en" ? "DEVELOPER DOCS" : "توثيق المطوّر"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: "#333" }}>v2.1.0-esp32s3</span>
          <button onClick={toggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full font-heading text-xs tracking-widest transition-all duration-300"
            style={{ border: "1px solid rgba(0,245,255,0.3)", color: "#00f5ff", background: "transparent" }}>
            <span style={{ opacity: lang === "en" ? 1 : 0.35, fontWeight: lang === "en" ? 700 : 400 }}>EN</span>
            <span style={{ color: "#333", margin: "0 2px" }}>/</span>
            <span style={{ opacity: lang === "ar" ? 1 : 0.35, fontWeight: lang === "ar" ? 700 : 400 }}>AR</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24 space-y-12 relative z-10">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "#4ade80", border: "1px solid rgba(0,255,136,0.2)" }}>
              {lang === "en" ? "FOR NERDS" : "للمهتمين بالتقنية"}
            </span>
            <span className="font-mono text-xs" style={{ color: "#333" }}>{"//"} technical documentation</span>
          </div>

          <h1 className="font-heading font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
            {lang === "en" ? (
              <>Under the <span style={{ color: "#00f5ff" }}>Hood</span></>
            ) : (
              <>خلف <span style={{ color: "#00f5ff" }}>الكواليس</span></>
            )}
          </h1>

          <p className="font-mono text-sm leading-relaxed max-w-2xl" style={{ color: "#888" }}>
            {lang === "en"
              ? "Full technical breakdown of the Xiaozhi ESP32 AI Assistant — from I2S DMA buffers to FreeRTOS task priorities. Every architectural decision explained."
              : "تفصيل تقني كامل لمساعد Xiaozhi ESP32 الذكي — من مخازن DMA لـ I2S إلى أولويات مهام FreeRTOS. كل قرار معماري موضّح."}
          </p>
        </div>

        {/* ── Boot terminal ───────────────────────────────────────── */}
        <section>
          <SectionLabel color="#4ade80" badge="SERIAL" title={lang === "en" ? "Boot Sequence" : "تسلسل الإقلاع"} />
          <BootTerminal />
        </section>

        {/* ── Chip specs ──────────────────────────────────────────── */}
        <section>
          <SectionLabel color="#00f5ff" badge="CHIP" title={lang === "en" ? "ESP32-S3 Specifications" : "مواصفات ESP32-S3"} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.12)" }}>
              <p className="font-mono text-xs font-bold mb-3" style={{ color: "#00f5ff" }}>PROCESSOR</p>
              <SpecRow label="Architecture"  value="Xtensa LX7 dual-core" />
              <SpecRow label="Clock speed"   value="240 MHz" />
              <SpecRow label="Internal SRAM" value="512 KB" />
              <SpecRow label="External PSRAM" value="8 MB (Octal mode)" />
              <SpecRow label="Flash"         value="16 MB QIO 80MHz" />
            </div>
            <div className="rounded-xl p-5" style={{ background: "rgba(162,89,255,0.04)", border: "1px solid rgba(162,89,255,0.12)" }}>
              <p className="font-mono text-xs font-bold mb-3" style={{ color: "#a259ff" }}>PERIPHERALS IN USE</p>
              <SpecRow label="I2S (input)"   value="INMP441 mic — GPIO 5,6,7" accent="#a259ff" />
              <SpecRow label="I2S (output)"  value="MAX98357A amp — GPIO 15,16" accent="#a259ff" />
              <SpecRow label="I2C"           value="SSD1306 OLED — GPIO 8,9" accent="#a259ff" />
              <SpecRow label="WiFi"          value="802.11 b/g/n 2.4GHz" accent="#a259ff" />
              <SpecRow label="Framework"     value="ESP-IDF 5.1.2 / FreeRTOS" accent="#a259ff" />
            </div>
          </div>
          <div className="mt-3 p-4 rounded-xl font-mono text-xs leading-relaxed" style={{ background: "rgba(255,200,100,0.05)", border: "1px solid rgba(255,200,100,0.12)", color: "#aaa" }}>
            <span style={{ color: "#ffcb6b" }}>⚠ WHY PSRAM MATTERS: </span>
            The <GT term="PSRAM" /> is not optional. The <GT term="Opus" /> encoder state alone requires ~80KB, the <GT term="I2S" /> <GT term="DMA" /> ring buffers take another ~32KB, and the WiFi TCP/IP stack needs ~120KB. Together they exceed the 512KB internal <GT term="PSRAM">SRAM</GT> limit, making external PSRAM a hard architectural requirement — not a luxury.
          </div>
        </section>

        {/* ── Audio pipeline ──────────────────────────────────────── */}
        <section>
          <SectionLabel color="#82aaff" badge="AUDIO" title={lang === "en" ? "End-to-End Audio Pipeline" : "خط أنابيب الصوت الشامل"} />
          <div className="rounded-xl p-5 overflow-x-auto" style={{ background: "rgba(4,4,14,0.8)", border: "1px solid rgba(130,170,255,0.12)" }}>
            <AudioPipeline />
          </div>
          <div className="mt-3 p-4 rounded-xl font-mono text-xs leading-relaxed" style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)", color: "#888" }}>
            Audio is captured from the <GT term="INMP441" /> at <strong style={{color:"#ccc"}}>16kHz, 16-bit mono</strong> — the minimum fidelity for reliable <GT term="ASR" />. Raw <GT term="PCM" /> frames (20ms each = 640 samples) are pushed into a DMA ring buffer, consumed by the Opus encoder task, and compressed to ~40 bytes per frame before WebSocket transmission.
          </div>
        </section>

        {/* ── Architecture accordion ──────────────────────────────── */}
        <section className="space-y-3">
          <SectionLabel color="#c792ea" badge="ARCH" title={lang === "en" ? "Layer-by-Layer Breakdown" : "تفصيل طبقة بطبقة"} />

          <Accordion title={lang === "en" ? "Layer 1 — Hardware" : "الطبقة 1 — المكونات"} badge="HW" color="#00f5ff" defaultOpen>
            <div className="space-y-4 font-mono text-xs" style={{ color: "#888" }}>
              <p>
                The <GT term="INMP441" /> microphone uses the <GT term="I2S" /> protocol in master mode — the ESP32-S3 generates the clock and word-select signals while the mic outputs a continuous PDM-to-I2S converted bitstream. The <GT term="MAX98357A" /> amplifier runs in the opposite direction on a separate I2S bus. Because both buses are <em style={{color:"#ccc"}}>synchronous</em>, there is zero clock drift between capture and playback — critical for any future echo-cancellation implementation.
              </p>
              <p>
                The <GT term="SSD1306" /> OLED runs on <GT term="I2C" /> at 400kHz (fast mode). At 128×64 pixels, a full frame is 1024 bytes — sent as a single I2C burst. At 15fps this consumes ~123KB/s of I2C bandwidth, well within the 3.2MB/s ceiling.
              </p>
              <CodeBlock label="sdkconfig.defaults.esp32s3 (relevant excerpt)"
                lines={[
                  <>{C.cm("# PSRAM configuration")}</>,
                  <>{C.kw("CONFIG_SPIRAM_MODE_OCT")}={C.sym("y")}</>,
                  <>{C.kw("CONFIG_SPIRAM_SPEED_80M")}={C.sym("y")}</>,
                  <>{C.kw("CONFIG_SPIRAM_USE_MALLOC")}={C.sym("y")}</>,
                  <>{C.cm("")}</>,
                  <>{C.cm("# I2S microphone pins")}</>,
                  <>{C.kw("CONFIG_I2S_MIC_BCK_PIN")}={C.num("5")}</>,
                  <>{C.kw("CONFIG_I2S_MIC_WS_PIN")}={C.num("6")}</>,
                  <>{C.kw("CONFIG_I2S_MIC_DATA_PIN")}={C.num("7")}</>,
                  <>{C.cm("")}</>,
                  <>{C.cm("# I2S amplifier pins")}</>,
                  <>{C.kw("CONFIG_I2S_SPK_BCK_PIN")}={C.num("15")}</>,
                  <>{C.kw("CONFIG_I2S_SPK_WS_PIN")}={C.num("16")}</>,
                  <>{C.kw("CONFIG_I2S_SPK_DATA_PIN")}={C.num("17")}</>,
                ]}
              />
            </div>
          </Accordion>

          <Accordion title={lang === "en" ? "Layer 2 — Firmware (ESP-IDF)" : "الطبقة 2 — البرمجيات الثابتة"} badge="FW" color="#82aaff">
            <div className="space-y-4 font-mono text-xs" style={{ color: "#888" }}>
              <p>
                The firmware is a standard <GT term="ESP-IDF" /> CMake project. The Xiaozhi application layer sits on top of <GT term="FreeRTOS" /> and manages seven concurrent tasks across both CPU cores. Task priorities are carefully assigned to prevent the audio pipeline from being preempted by lower-priority work — the capture task runs at priority 22 (near maximum) to ensure no DMA buffer is missed.
              </p>
              <CodeBlock label="main/audio_capture.cpp (simplified)"
                lines={[
                  <>{C.cm("// Configure I2S driver for microphone input")}</>,
                  <>{C.ty("i2s_config_t")} {C.plain("i2s_config")} = {"{"}</>,
                  <>{C.plain("  .mode")}{C.sym(" = ")}{C.kw("I2S_MODE_MASTER")} | {C.kw("I2S_MODE_RX")}{C.sym(",")}</>,
                  <>{C.plain("  .sample_rate")}{C.sym(" = ")}{C.num("16000")}{C.sym(",")}</>,
                  <>{C.plain("  .bits_per_sample")}{C.sym(" = ")}{C.kw("I2S_BITS_PER_SAMPLE_16BIT")}{C.sym(",")}</>,
                  <>{C.plain("  .channel_format")}{C.sym(" = ")}{C.kw("I2S_CHANNEL_FMT_ONLY_LEFT")}{C.sym(",")}</>,
                  <>{C.plain("  .communication_format")}{C.sym(" = ")}{C.kw("I2S_COMM_FORMAT_STAND_I2S")}{C.sym(",")}</>,
                  <>{C.plain("  .dma_buf_count")}{C.sym(" = ")}{C.num("4")}{C.sym(",    ")}{C.cm("// 4 DMA buffers in ring")}</>,
                  <>{C.plain("  .dma_buf_len")}{C.sym("  = ")}{C.num("1024")}{C.sym(",  ")}{C.cm("// 1024 samples per buffer")}</>,
                  <>{C.plain("  .use_apll")}{C.sym("     = ")}{C.kw("true")}{C.sym(",    ")}{C.cm("// audio PLL for accurate clock")}</>,
                  <>{"};"}</>,
                  <></>,
                  <>{C.fn("i2s_driver_install")}{C.sym("(")}{C.kw("I2S_NUM_0")}{C.sym(", &i2s_config, ")}{C.num("0")}{C.sym(", NULL)")}{C.sym(";")}</>,
                ]}
              />
              <p>
                The <GT term="Opus" /> encoder is initialised in SILK mode (optimised for speech) at 16kbps. Each 20ms PCM frame (640 samples × 2 bytes = 1280 bytes) encodes down to approximately 40 bytes — a <strong style={{color:"#ccc"}}>32:1 compression ratio</strong> that makes real-time WiFi streaming practical.
              </p>
              <CodeBlock label="main/opus_encoder.cpp (simplified)"
                lines={[
                  <>{C.ty("OpusEncoder")} {C.sym("*")}{C.plain("encoder")} = {C.fn("opus_encoder_create")}</>,
                  <>{C.sym("    (")}{C.num("16000")}{C.sym(", ")}{C.num("1")}{C.sym(", ")}{C.kw("OPUS_APPLICATION_VOIP")}{C.sym(", &err)")}{C.sym(";")}</>,
                  <></>,
                  <>{C.fn("opus_encoder_ctl")}{C.sym("(encoder, ")}{C.kw("OPUS_SET_BITRATE")}{C.sym("(")}{C.num("16000")}{C.sym("))")}{C.sym(";")}</>,
                  <>{C.fn("opus_encoder_ctl")}{C.sym("(encoder, ")}{C.kw("OPUS_SET_COMPLEXITY")}{C.sym("(")}{C.num("5")}{C.sym("))")}{C.sym(";  ")}{C.cm("// 0–10, balance quality/CPU")}</>,
                  <>{C.fn("opus_encoder_ctl")}{C.sym("(encoder, ")}{C.kw("OPUS_SET_SIGNAL")}{C.sym("(")}{C.kw("OPUS_SIGNAL_VOICE")}{C.sym("))")}{C.sym(";")}</>,
                  <></>,
                  <>{C.cm("// Encode one 20ms frame")}</>,
                  <>{C.ty("int")} {C.plain("bytes_written")} = {C.fn("opus_encode")}{C.sym("(")}</>,
                  <>{C.sym("    encoder, pcm_frame, ")}{C.num("640")}{C.sym(", output_buf, sizeof(output_buf))")}{C.sym(";")}</>,
                  <>{C.cm("// bytes_written ≈ 40 bytes for 1280 bytes of PCM")}</>,
                ]}
              />
            </div>
          </Accordion>

          <Accordion title={lang === "en" ? "Layer 3 — Protocol (WebSocket)" : "الطبقة 3 — البروتوكول"} badge="NET" color="#a259ff">
            <div className="space-y-4 font-mono text-xs" style={{ color: "#888" }}>
              <p>
                <GT term="WebSocket" /> is used instead of HTTP because voice is inherently a streaming protocol — the device needs to send audio continuously while simultaneously receiving the response. HTTP would require a new TCP handshake for every chunk. WebSocket keeps a single persistent TCP connection open, reducing per-packet overhead to just a 2–10 byte frame header.
              </p>
              <CodeBlock label="main/websocket_client.cpp (simplified)"
                lines={[
                  <>{C.ty("esp_websocket_client_config_t")} {C.plain("ws_cfg")} = {"{"}</>,
                  <>{C.plain("  .uri")}{C.sym(" = ")}{C.str('"wss://api.xiaozhi.me/xiaozhi/v1/"')}{C.sym(",")}</>,
                  <>{C.plain("  .cert_pem")}{C.sym(" = ")}{C.plain("server_cert_pem_start")}{C.sym(",  ")}{C.cm("// TLS 1.3")}</>,
                  <>{C.plain("  .transport")}{C.sym(" = ")}{C.kw("WEBSOCKET_TRANSPORT_OVER_SSL")}{C.sym(",")}</>,
                  <>{C.plain("  .ping_interval_sec")}{C.sym(" = ")}{C.num("30")}{C.sym(",")}</>,
                  <>{"};"}</>,
                  <></>,
                  <>{C.cm("// Binary frames carry Opus-encoded audio chunks")}</>,
                  <>{C.fn("esp_websocket_client_send_bin")}{C.sym("(client, opus_buf, bytes_written, ")}{C.kw("portMAX_DELAY")}{C.sym(")")}{C.sym(";")}</>,
                  <></>,
                  <>{C.cm("// JSON frames carry control messages")}</>,
                  <>{C.cm('// {"type":"hello","device_id":"...","sample_rate":16000}')}</>,
                ]}
              />
              <p>
                The server endpoint is <span style={{color:"#c3e88d"}}>wss://api.xiaozhi.me/xiaozhi/v1/</span> — a TLS 1.3 secured <GT term="WebSocket" /> server. The device authenticates with a device token embedded in the HTTP upgrade headers. Binary frames carry encoded audio; JSON text frames carry control events (session start, wake word detected, response complete).
              </p>
            </div>
          </Accordion>

          <Accordion title={lang === "en" ? "Layer 4 — Cloud Pipeline" : "الطبقة 4 — الخط السحابي"} badge="CLOUD" color="#ffcb6b">
            <div className="space-y-4 font-mono text-xs" style={{ color: "#888" }}>
              <p>
                The Xiaozhi backend server runs a three-stage pipeline. Incoming <GT term="Opus" /> audio is decoded and fed to a streaming <GT term="ASR" /> engine which emits partial transcripts in real time. Once the utterance ends (detected by end-of-speech VAD), the full transcript is sent to the <GT term="LLM" />. The model response streams back token-by-token and is simultaneously fed to a <GT term="TTS" /> synthesiser which outputs audio chunks as they are generated — this parallel pipeline means audio playback can begin before the LLM has finished generating the full response.
              </p>
              <div className="rounded-lg p-4 space-y-3" style={{ background: "rgba(255,200,100,0.04)", border: "1px solid rgba(255,200,100,0.12)" }}>
                {[
                  { stage: "ASR", model: "Whisper-large-v3-turbo", latency: "~120ms first token", color: "#ffcb6b" },
                  { stage: "LLM", model: "Qwen2.5-7B-Instruct",   latency: "~80ms first token",  color: "#c792ea" },
                  { stage: "TTS", model: "CosyVoice",             latency: "~60ms first chunk",  color: "#82aaff" },
                ].map(s => (
                  <div key={s.stage} className="flex items-center gap-4">
                    <span className="w-16 font-mono text-xs font-bold" style={{ color: s.color }}>{s.stage}</span>
                    <span className="flex-1 font-mono text-xs" style={{ color: "#888" }}>{s.model}</span>
                    <span className="font-mono text-xs" style={{ color: "#555" }}>{s.latency}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: "#666" }}>
                Total round-trip latency from end-of-speech to first audio byte: <strong style={{color:"#ccc"}}>~260–400ms</strong> depending on network conditions — imperceptible to most users.
              </p>
            </div>
          </Accordion>
        </section>

        {/* ── FreeRTOS tasks ──────────────────────────────────────── */}
        <section>
          <SectionLabel color="#ffcb6b" badge="RTOS" title={lang === "en" ? "Concurrent FreeRTOS Tasks" : "مهام FreeRTOS المتزامنة"} />
          <div className="rounded-xl p-5" style={{ background: "rgba(4,4,14,0.8)", border: "1px solid rgba(255,200,100,0.1)" }}>
            <TaskDiagram />
          </div>
          <div className="mt-3 p-4 rounded-xl font-mono text-xs leading-relaxed" style={{ background: "rgba(255,100,100,0.04)", border: "1px solid rgba(255,100,100,0.1)", color: "#888" }}>
            <span style={{ color: "#ff6b6b" }}>⚠ HARDEST PART: </span>
            Running all seven tasks simultaneously with a combined stack usage of ~33KB, on a chip with 512KB of contiguous allocatable SRAM, without triggering a watchdog reset or a stack overflow. The <GT term="DMA" /> buffers for I2S alone consume 32KB. Any misconfiguration in task priorities causes audio glitches — the capture task must <em style={{color:"#ccc"}}>never</em> be preempted mid-frame or the DMA overruns and produces silence.
          </div>
        </section>

        {/* ── Memory map ──────────────────────────────────────────── */}
        <section>
          <SectionLabel color="#ff6b6b" badge="MEM" title={lang === "en" ? "Memory Layout" : "تخطيط الذاكرة"} />
          <div className="rounded-xl p-5" style={{ background: "rgba(4,4,14,0.8)", border: "1px solid rgba(255,107,107,0.1)" }}>
            <MemoryMap />
          </div>
        </section>

        {/* ── Face animation ──────────────────────────────────────── */}
        <section>
          <SectionLabel color="#4ade80" badge="OLED" title={lang === "en" ? "Face Animation Engine" : "محرك تحريك الوجه"} />
          <div className="rounded-xl p-5 font-mono text-xs space-y-4" style={{ background: "rgba(4,4,14,0.8)", border: "1px solid rgba(74,222,128,0.12)", color: "#888" }}>
            <p>
              The OLED animation layer is a custom library added on top of base Xiaozhi firmware. It reads the device&apos;s internal state machine and selects an expression set accordingly. Frames are pre-compiled as <strong style={{color:"#ccc"}}>1-bit bitmap arrays</strong> stored in flash to avoid SRAM consumption. The renderer does XOR-blending between consecutive frames for smooth transitions.
            </p>
            <CodeBlock label="components/face_engine/face_engine.cpp"
              lines={[
                <>{C.kw("enum class")} {C.ty("DeviceState")} {"{"} {C.plain("IDLE, LISTENING, THINKING, SPEAKING")} {"};"}</>,
                <></>,
                <>{C.cm("// Expression banks — arrays of 128×64 bit bitmaps in flash")}</>,
                <>{C.kw("static const")} {C.ty("uint8_t")} {C.plain("PROGMEM frames_idle")}{C.sym("[][")}{C.num("1024")}{C.sym("]")} = {"{"}...{"}"}{C.sym(";")}</>,
                <>{C.kw("static const")} {C.ty("uint8_t")} {C.plain("PROGMEM frames_thinking")}{C.sym("[][")}{C.num("1024")}{C.sym("]")} = {"{"}...{"}"}{C.sym(";")}</>,
                <></>,
                <>{C.kw("void")} {C.fn("FaceEngine::tick")}{C.sym("() {")} {C.cm("// called every 66ms (~15fps)")}</>,
                <>{C.sym("  ")} {C.kw("const")} {C.ty("uint8_t")} {C.sym("*")} {C.plain("frame")} = {C.fn("selectFrame")}{C.sym("(current_state_, frame_idx_)")}{C.sym(";")}</>,
                <>{C.sym("  ")} {C.fn("display_.drawBitmap")}{C.sym("(")}{C.num("0")}{C.sym(", ")}{C.num("0")}{C.sym(", frame, ")}{C.num("128")}{C.sym(", ")}{C.num("64")}{C.sym(", ")}{C.kw("WHITE")}{C.sym(")")}{C.sym(";")}</>,
                <>{C.sym("  ")} {C.fn("display_.display")}{C.sym("()")}{C.sym(";  ")}{C.cm("// flush I2C frame buffer to OLED")}</>,
                <>{C.sym("  ")} {C.plain("frame_idx_")} {C.sym("= (frame_idx_ + ")}{C.num("1")}{C.sym(") % frameCount(current_state_)")}{C.sym(";")}</>,
                <>{C.sym("}")}</>,
              ]}
            />
          </div>
        </section>

        {/* ── Full glossary ───────────────────────────────────────── */}
        <section>
          <SectionLabel color="#c792ea" badge="GLOSSARY" title={lang === "en" ? "Technical Glossary" : "المسرد التقني"} />
          <div className="rounded-xl p-5" style={{ background: "rgba(4,4,14,0.8)", border: "1px solid rgba(199,146,234,0.12)" }}>
            <GlossaryTable />
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 pt-8 border-t border-white/5">
          <SiriOrb size="24px" animationDuration={25}
            colors={{ c1:"oklch(80% 0.2 190)", c2:"oklch(75% 0.18 210)", c3:"oklch(78% 0.22 170)" }}/>
          <span className="font-mono text-xs" style={{ color: "#333" }}>
            xiaozhi-esp32 · ESP-IDF v5.1.2 · FreeRTOS · Opus · WebSocket
          </span>
        </div>

      </main>
    </div>
  );
}

function SectionLabel({ badge, title, color }: { badge: string; title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-xs px-2 py-0.5 rounded"
        style={{ background: `${color}14`, color, border: `1px solid ${color}28` }}>
        {badge}
      </span>
      <h2 className="font-heading text-lg font-black text-white">{title}</h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />
    </div>
  );
}

export default function NerdsPage() {
  return (
    <LanguageProvider>
      <Background />
      <NerdsContent />
    </LanguageProvider>
  );
}
