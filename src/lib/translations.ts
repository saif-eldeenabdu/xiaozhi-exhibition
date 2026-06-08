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
      tooltip: {
        en: "ESP32-S3: dual-core 240MHz processor with built-in WiFi and Bluetooth.",
        ar: "معالج ثنائي النواة بتردد 240MHz مع واي فاي وبلوتوث مدمجَين.",
      },
    },
    comp2: {
      label: { en: "The Ears", ar: "الأذنان" },
      tooltip: {
        en: "INMP441: I2S MEMS microphone with ultra-low noise and 24-bit precision.",
        ar: "ميكروفون MEMS بدقة 24 بت وضوضاء منخفضة للغاية.",
      },
    },
    comp3: {
      label: { en: "The Voice", ar: "الصوت" },
      tooltip: {
        en: "MAX98357 + speaker: I2S class-D amplifier that turns digital audio into sound.",
        ar: "مضخم صوت رقمي يحوّل الصوت الرقمي إلى موجات صوتية.",
      },
    },
    comp4: {
      label: { en: "The Face", ar: "الوجه" },
      tooltip: {
        en: "OLED display: 128×64 pixels showing animated expressions and status.",
        ar: "شاشة OLED بدقة 128×64 بكسل تعرض تعبيرات متحركة وحالة الجهاز.",
      },
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
    ] as Array<{ en: string; ar: string; icon: string }>,
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
      hardwareTip: {
        en: "Mic captures audio → ESP32 digitizes → amp plays back",
        ar: "الميكروفون يلتقط الصوت → ESP32 يحوله رقمياً → المضخم يشغله",
      },
      firmwareTip: {
        en: "Xiaozhi framework on ESP-IDF, WebSocket stream, Opus codec compression",
        ar: "إطار Xiaozhi على ESP-IDF، بث WebSocket، ضغط Opus",
      },
      cloudTip: {
        en: "Speech-to-Text → Large Language Model → Text-to-Speech pipeline",
        ar: "تحويل الكلام إلى نص → نموذج لغوي كبير → تحويل النص إلى كلام",
      },
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
