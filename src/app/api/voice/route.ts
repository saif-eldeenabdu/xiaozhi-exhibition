import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

function getClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set.");
  return new Groq({ apiKey: key });
}

export async function POST(req: NextRequest) {
  let groq: Groq;
  try {
    groq = getClient();
  } catch {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  try {
    const form = await req.formData();
    const audioFile = form.get("audio") as File | null;
    const lang = (form.get("lang") as string) || "en";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    // ── Step 1: Speech → Text (Groq Whisper) ──────────────────────────────
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language: lang === "ar" ? "ar" : "en",
      response_format: "json",
    });
    const transcript = transcription.text.trim();

    if (!transcript) {
      return NextResponse.json(
        { error: "Could not transcribe audio. Please speak clearly." },
        { status: 400 }
      );
    }

    // ── Step 2: Text → LLM (Groq LLaMA) ──────────────────────────────────
    const systemPrompt =
      lang === "ar"
        ? `أنت مساعد ذكاء اصطناعي صوتي يعمل على جهاز ESP32-S3 مدمج. اسمك شياوجي. أجب بإيجاز وبشكل طبيعي بالعربية الفصحى الحديثة في جملة أو جملتين كحد أقصى.`
        : `You are a voice AI assistant running on an embedded ESP32-S3 device called Xiaozhi. Reply naturally and concisely — one or two sentences maximum.`;

    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ],
      max_tokens: 120,
      temperature: 0.7,
    });
    const reply = chat.choices[0]?.message?.content?.trim() ?? "I didn't catch that.";

    // TTS is handled client-side via window.speechSynthesis
    return NextResponse.json({ transcript, reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/voice]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
