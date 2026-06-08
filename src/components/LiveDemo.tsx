"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t, tx, type Lang } from "@/lib/translations";
import { SiriOrb } from "./SiriOrb";

type DemoState = "idle" | "recording" | "processing" | "responding";
type TabMode = "voice" | "sim";

// ── Scripted conversations ──────────────────────────────────────────────────
const conversations = [
  {
    user: { en:"What's the capital of Saudi Arabia?", ar:"ما هي عاصمة المملكة العربية السعودية؟" },
    ai:   { en:"The capital of Saudi Arabia is Riyadh — also home to some of the most ambitious tech initiatives in the world.", ar:"عاصمة المملكة العربية السعودية هي الرياض — موطن بعض أكثر المبادرات التقنية طموحاً في العالم." },
  },
  {
    user: { en:"Tell me a fun fact.", ar:"أخبرني بحقيقة ممتعة." },
    ai:   { en:"A single bolt of lightning contains enough energy to toast 100,000 slices of bread. Not that I'd recommend it.", ar:"صاعقة برق واحدة تحتوي على طاقة كافية لتحميص 100,000 شريحة خبز. لكنني لا أنصح بتجربة ذلك." },
  },
  {
    user: { en:"What can you do?", ar:"ماذا تستطيع أن تفعل؟" },
    ai:   { en:"I can answer questions, hold conversations, tell you facts, help you think — all from a chip the size of your thumbnail.", ar:"يمكنني الإجابة على الأسئلة، وإجراء المحادثات، وإخبارك بالحقائق — كل ذلك من شريحة بحجم إبهامك." },
  },
  {
    user: { en:"How smart are you?", ar:"كم أنت ذكي؟" },
    ai:   { en:"Smart enough to know I'm running on $15 of hardware. That's either humbling or impressive, depending on how you look at it.", ar:"ذكي بما يكفي لأعرف أنني أعمل على أجهزة بقيمة 15 دولاراً. هذا إما متواضع أو مثير للإعجاب." },
  },
  {
    user: { en:"Who built you?", ar:"من بناك؟" },
    ai:   { en:"A student who wired every component by hand, flashed the firmware, and wrote the face animation layer from scratch. Not bad, right?", ar:"طالب وصّل كل مكوّن يدوياً، وحمّل البرنامج الثابت، وكتب طبقة تحريك الوجه من الصفر." },
  },
];

function useTypewriter(text: string, active: boolean, speed = 24) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0,i));
      if (i>=text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active, speed]);
  return { displayed, done };
}

const cyanColors   = { c1:"oklch(80% 0.2 190)",  c2:"oklch(75% 0.18 210)", c3:"oklch(78% 0.22 170)" };
const violetColors = { c1:"oklch(75% 0.2 290)",  c2:"oklch(78% 0.18 310)", c3:"oklch(72% 0.22 270)" };
const redColors    = { c1:"oklch(70% 0.22 20)",   c2:"oklch(72% 0.20 10)",  c3:"oklch(68% 0.24 30)"  };
const idleColors   = { c1:"oklch(50% 0.04 220)", c2:"oklch(52% 0.03 200)", c3:"oklch(48% 0.05 240)" };

interface Message { role:"user"|"ai"; text:string; }

// ── Real voice component ────────────────────────────────────────────────────
function VoiceChat() {
  const { lang } = useLanguage();
  const [state, setState] = useState<DemoState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string|null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const speakReply = useCallback((text: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === "ar" ? "ar-SA" : "en-US";
    utt.rate = 1.05;
    utt.onend = () => setState("idle");
    window.speechSynthesis.speak(utt);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendToAI = useCallback(async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("lang", lang);
    try {
      const res = await fetch("/api/voice", { method:"POST", body:formData });
      if (!res.ok) {
        const err = await res.json().catch(()=>({error:"Request failed"}));
        throw new Error(err.error || "Request failed");
      }
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role:"user", text:data.transcript },
        { role:"ai",   text:data.reply },
      ]);
      setState("responding");
      speakReply(data.reply, lang);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setState("idle");
    }
  }, [lang, speakReply]);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setState("processing");
        await sendToAI(blob);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setState("recording");
    } catch {
      setError(lang === "en" ? "Microphone access denied." : "تم رفض الوصول إلى الميكروفون.");
      setState("idle");
    }
  }, [lang, sendToAI]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const handleMicClick = () => {
    if (state === "idle") startRecording();
    else if (state === "recording") stopRecording();
  };

  const orbColors = state === "recording" ? redColors
    : state === "processing" ? violetColors
    : state === "responding" ? cyanColors
    : idleColors;

  const orbDuration = state === "idle" ? 30 : state === "recording" ? 4 : 6;

  const stateLabel = {
    idle:       lang==="en" ? "Ready — tap mic to speak" : "جاهز — اضغط للتحدث",
    recording:  lang==="en" ? "Listening… tap again to send" : "يستمع… اضغط مجدداً للإرسال",
    processing: lang==="en" ? "Processing…" : "جارٍ المعالجة…",
    responding: lang==="en" ? "Speaking…" : "يتحدث…",
  }[state];

  const stateColor = { idle:"#555", recording:"#ff4444", processing:"#a259ff", responding:"#00f5ff" }[state];
  const isRTL = lang === "ar";

  return (
    <div className="card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <SiriOrb size="40px" colors={orbColors} animationDuration={orbDuration}/>
        <div className="flex-1">
          <div className="font-heading text-xs text-white font-bold tracking-widest">XIAOZHI</div>
          <div className="font-body text-xs transition-colors duration-500" style={{color:stateColor}}>
            {stateLabel}
          </div>
        </div>
        {state==="recording"&&(
          <div className="flex gap-1 items-center">
            {[0,1,2,3].map(i=>(
              <div key={i} className="w-1 rounded-full bg-red-400"
                style={{ height:`${8+i*4}px`, animation:`pulse 0.8s ease-in-out ${i*0.12}s infinite` }}/>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={chatRef} className="p-5 space-y-3 overflow-y-auto" style={{minHeight:"220px", maxHeight:"300px"}}>
        {messages.length===0&&state==="idle"&&(
          <div className="flex flex-col items-center justify-center h-28 gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{background:"rgba(0,245,255,0.06)", border:"1px solid rgba(0,245,255,0.15)"}}>
              <svg className="w-5 h-5 text-cyan" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <p className="font-body text-xs text-muted">{stateLabel}</p>
          </div>
        )}

        {messages.map((msg,i) => {
          const isUser = msg.role==="user";
          const alignRight = isRTL ? !isUser : isUser;
          return (
            <div key={i} className={`flex ${alignRight?"justify-end":"justify-start"}`}>
              <div className="max-w-xs sm:max-w-sm px-4 py-3 font-body text-sm leading-relaxed"
                style={{
                  background: isUser?"rgba(0,245,255,0.1)":"rgba(162,89,255,0.1)",
                  border:     isUser?"1px solid rgba(0,245,255,0.22)":"1px solid rgba(162,89,255,0.22)",
                  color:      isUser?"#7af0ff":"#ddd",
                  borderRadius: alignRight?"18px 18px 4px 18px":"18px 18px 18px 4px",
                }}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {state==="processing"&&(
          <div className={`flex ${isRTL?"justify-end":"justify-start"}`}>
            <div className="px-5 py-4 rounded-2xl"
              style={{background:"rgba(162,89,255,0.1)", border:"1px solid rgba(162,89,255,0.22)"}}>
              <span className="inline-flex gap-1.5">
                {[0,1,2].map(d=>(
                  <span key={d} className="w-2 h-2 rounded-full inline-block"
                    style={{background:"#a259ff", animation:`pulse 1s ease-in-out ${d*0.2}s infinite`}}/>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {error&&(
        <div className="mx-5 mb-3 px-4 py-2 rounded-xl text-xs font-body"
          style={{background:"rgba(255,60,60,0.1)", border:"1px solid rgba(255,60,60,0.25)", color:"#ff8080"}}>
          ⚠ {error}
        </div>
      )}

      {/* Mic */}
      <div className="flex justify-center py-5 border-t border-white/5">
        <button onClick={handleMicClick}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${state==="recording"?"mic-recording":""}`}
          style={{
            borderColor: state==="recording"?"#ff4444": state==="idle"?"#00f5ff":"#333",
            background:  state==="recording"?"rgba(255,68,68,0.12)": state==="idle"?"rgba(0,245,255,0.08)":"transparent",
            cursor: state==="processing"||state==="responding" ? "not-allowed":"pointer",
          }}
          disabled={state==="processing"||state==="responding"}>
          {state==="recording" ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#ff4444">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
              stroke={state==="idle"?"#00f5ff":"#444"} strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Scripted demo component ─────────────────────────────────────────────────
function SimDemo() {
  const { lang } = useLanguage();
  const [demoState, setDemoState] = useState<"idle"|"listening"|"thinking"|"responding">("idle");
  const [idx, setIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const convo = conversations[idx % conversations.length];
  const userText = tx(convo.user, lang);
  const aiText   = tx(convo.ai,   lang);
  const userTyper = useTypewriter(userText, demoState==="listening");
  const aiTyper   = useTypewriter(aiText,   demoState==="responding", 22);

  const handleMic = () => {
    if (demoState!=="idle") return;
    setDemoState("listening");
    setTimeout(()=>{
      setDemoState("thinking");
      setMessages(p=>[...p,{role:"user",text:userText}]);
      setTimeout(()=>{
        setDemoState("responding");
        setTimeout(()=>{
          setMessages(p=>[...p,{role:"ai",text:aiText}]);
          setIdx(i=>i+1);
          setDemoState("idle");
        }, aiText.length*23+500);
      }, 900);
    }, 1600);
  };

  useEffect(()=>{
    if (chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[messages,demoState]);

  const orbColors = demoState==="idle"?idleColors:demoState==="listening"?cyanColors:violetColors;
  const orbDuration = demoState==="idle"?30:demoState==="listening"?8:5;
  const stateColor = {idle:"#444",listening:"#00f5ff",thinking:"#a259ff",responding:"#a259ff"}[demoState];
  const stateLabel = {
    idle:      lang==="en"?"Ready — tap the mic":"اضغط على الميكروفون للبدء",
    listening: lang==="en"?"Listening…":"جارٍ الاستماع…",
    thinking:  lang==="en"?"Processing…":"جارٍ المعالجة…",
    responding:lang==="en"?"Responding…":"جارٍ الرد…",
  }[demoState];
  const isRTL = lang==="ar";

  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <SiriOrb size="40px" colors={orbColors} animationDuration={orbDuration}/>
        <div>
          <div className="font-heading text-xs text-white font-bold tracking-widest">XIAOZHI</div>
          <div className="font-body text-xs transition-colors duration-500" style={{color:stateColor}}>
            {stateLabel}
          </div>
        </div>
      </div>

      <div ref={chatRef} className="p-5 space-y-3 overflow-y-auto" style={{minHeight:"220px",maxHeight:"300px"}}>
        {messages.length===0&&demoState==="idle"&&(
          <div className="flex items-center justify-center h-28">
            <p className="font-body text-xs text-muted">
              {lang==="en"?"Tap the mic to start a scripted demo":"اضغط للبدء في العرض التوضيحي"}
            </p>
          </div>
        )}
        {messages.map((msg,i)=>{
          const isUser=msg.role==="user";
          const alignRight=isRTL?!isUser:isUser;
          return(
            <div key={i} className={`flex ${alignRight?"justify-end":"justify-start"}`}>
              <div className="max-w-xs sm:max-w-sm px-4 py-3 font-body text-sm leading-relaxed"
                style={{
                  background:isUser?"rgba(0,245,255,0.1)":"rgba(162,89,255,0.1)",
                  border:isUser?"1px solid rgba(0,245,255,0.22)":"1px solid rgba(162,89,255,0.22)",
                  color:isUser?"#7af0ff":"#ddd",
                  borderRadius:alignRight?"18px 18px 4px 18px":"18px 18px 18px 4px",
                }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {demoState==="listening"&&(
          <div className={`flex ${isRTL?"justify-start":"justify-end"}`}>
            <div className="max-w-xs sm:max-w-sm px-4 py-3 font-body text-sm"
              style={{background:"rgba(0,245,255,0.1)",border:"1px solid rgba(0,245,255,0.22)",
                color:"#7af0ff",borderRadius:isRTL?"18px 18px 18px 4px":"18px 18px 4px 18px"}}>
              {userTyper.displayed}{!userTyper.done&&<span className="typing-cursor"/>}
            </div>
          </div>
        )}
        {demoState==="responding"&&(
          <div className={`flex ${isRTL?"justify-end":"justify-start"}`}>
            <div className="max-w-xs sm:max-w-sm px-4 py-3 font-body text-sm leading-relaxed"
              style={{background:"rgba(162,89,255,0.1)",border:"1px solid rgba(162,89,255,0.22)",
                color:"#ddd",borderRadius:isRTL?"18px 18px 4px 18px":"18px 18px 18px 4px"}}>
              {aiTyper.displayed}{!aiTyper.done&&<span className="typing-cursor"/>}
            </div>
          </div>
        )}
        {demoState==="thinking"&&(
          <div className={`flex ${isRTL?"justify-end":"justify-start"}`}>
            <div className="px-5 py-4 rounded-2xl"
              style={{background:"rgba(162,89,255,0.1)",border:"1px solid rgba(162,89,255,0.22)"}}>
              <span className="inline-flex gap-1.5">
                {[0,1,2].map(d=>(
                  <span key={d} className="w-2 h-2 rounded-full inline-block"
                    style={{background:"#a259ff",animation:`pulse 1s ease-in-out ${d*0.2}s infinite`}}/>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center py-5 border-t border-white/5">
        <button onClick={handleMic} disabled={demoState!=="idle"}
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
          style={{
            borderColor:demoState==="idle"?"#00f5ff":"#2a2a2a",
            background:demoState==="idle"?"rgba(0,245,255,0.08)":"transparent",
            boxShadow:demoState==="idle"?"0 0 22px rgba(0,245,255,0.28)":"none",
          }}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
            stroke={demoState==="idle"?"#00f5ff":"#333"} strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Architecture diagram ────────────────────────────────────────────────────
function ArchitectureDiagram({ lang }: { lang: Lang }) {
  const [hovered, setHovered] = useState<string|null>(null);
  const layers = [
    { key:"cloud",    label:tx(t.demo.layers.cloud,lang),    tip:tx(t.demo.layers.cloudTip,lang),    color:"#a259ff", items:["STT","LLM","TTS"] },
    { key:"firmware", label:tx(t.demo.layers.firmware,lang), tip:tx(t.demo.layers.firmwareTip,lang), color:"#00f5ff", items:["Xiaozhi","ESP-IDF","WebSocket","Opus"] },
    { key:"hardware", label:tx(t.demo.layers.hardware,lang), tip:tx(t.demo.layers.hardwareTip,lang), color:"#9090a8", items:["MIC","ESP32-S3","AMP","OLED"] },
  ];
  return (
    <div className="mt-3 card rounded-2xl p-5 space-y-3">
      {layers.map((layer,li)=>(
        <div key={layer.key}
          className="relative rounded-xl p-4 transition-all duration-300 cursor-default"
          style={{ border:`1px solid ${layer.color}22`, background:hovered===layer.key?`${layer.color}0c`:"transparent" }}
          onMouseEnter={()=>setHovered(layer.key)}
          onMouseLeave={()=>setHovered(null)}>
          <div className="flex items-start justify-between mb-3 gap-3">
            <span className="font-heading text-xs font-bold tracking-widest" style={{color:layer.color}}>
              {layer.label}
            </span>
            {hovered===layer.key&&(
              <span className="font-body text-xs text-white/50 text-right max-w-xs leading-relaxed">{layer.tip}</span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {layer.items.map(item=>(
              <span key={item} className="px-3 py-1 rounded-full font-heading text-xs"
                style={{border:`1px solid ${layer.color}30`, color:layer.color, background:`${layer.color}08`}}>
                {item}
              </span>
            ))}
          </div>
          {li<layers.length-1&&(
            <div className="absolute left-1/2 -bottom-3 flex gap-2 -translate-x-1/2">
              {[0,1,2].map(d=>(
                <div key={d} className="w-1 h-1 rounded-full"
                  style={{background:layer.color, boxShadow:`0 0 4px ${layer.color}`,
                    animation:`dot-up 1.8s ease-in-out ${d*0.25}s infinite`}}/>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export function LiveDemo() {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<TabMode>("sim");
  const [showArch, setShowArch] = useState(false);

  return (
    <section id="demo" className="py-16 px-6 relative">
      <div className="section-divider mb-16" />
      <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{background:"radial-gradient(ellipse 60% 40% at 50% 50%, rgba(162,89,255,0.05) 0%, transparent 70%)"}}/>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading tracking-widest mb-3 reveal"
            style={{background:"rgba(162,89,255,0.1)", border:"1px solid rgba(162,89,255,0.25)", color:"#a259ff"}}>
            LIVE DEMO
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white reveal reveal-delay-1">
            {tx(t.demo.title, lang)}
          </h2>
          <p className="font-body text-muted mt-2 reveal reveal-delay-2">
            {tx(t.demo.subtitle, lang)}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-1 mb-5 reveal reveal-delay-2"
          style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)"}}>
          {(["sim","voice"] as TabMode[]).map(mode=>(
            <button key={mode} onClick={()=>setTab(mode)}
              className="flex-1 py-2.5 rounded-lg font-heading text-xs tracking-widest transition-all duration-300"
              style={{
                background: tab===mode?"rgba(0,245,255,0.12)":"transparent",
                border:     tab===mode?"1px solid rgba(0,245,255,0.28)":"1px solid transparent",
                color:      tab===mode?"#00f5ff":"#666",
              }}>
              {mode==="sim"
                ? (lang==="en"?"Scripted Demo":"عرض توضيحي")
                : (lang==="en"?"🎤 Live Voice AI":"🎤 ذكاء صوتي حقيقي")}
            </button>
          ))}
        </div>

        {/* Demo area */}
        <div className="reveal reveal-delay-3">
          {tab==="sim" ? <SimDemo/> : <VoiceChat/>}
        </div>

        {/* Under the hood */}
        <div className="mt-5 reveal reveal-delay-4">
          <button onClick={()=>setShowArch(v=>!v)}
            className="w-full flex items-center justify-between px-5 py-3.5 card rounded-xl font-heading text-xs tracking-widest text-white/55 hover:text-white transition-colors">
            <span>{tx(t.demo.underHoodBtn, lang)}</span>
            <svg className="w-4 h-4 transition-transform duration-300"
              style={{transform:showArch?"rotate(180deg)":"none"}}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showArch&&<ArchitectureDiagram lang={lang}/>}
        </div>
      </div>
    </section>
  );
}
