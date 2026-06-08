import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialise client lazily so missing key just returns a clear error at runtime
function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set.");
  return new OpenAI({ apiKey: key });
}

export async function POST(req: NextRequest) {
  let openai: OpenAI;
  try {
    openai = getClient();
  } catch {
    return NextResponse.json(
      { error: "OpenAI API key not configured. See README for setup." },
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

    // ── Step 1: Speech → Text (Whisper) ───────────────────────────────────
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: lang === "ar" ? "ar" : "en",
    });
    const transcript = transcription.text.trim();

    if (!transcript) {
      return NextResponse.json({ error: "Could not transcribe audio. Please speak clearly." }, { status: 400 });
    }

    // ── Step 2: Text → LLM (GPT-4o-mini) ─────────────────────────────────
    const systemPrompt = lang === "ar"
      ? `أنت مساعد ذكاء اصطناعي صوتي يعمل على جهاز ESP32-S3 مدمج. اسمك شياوجي. أجب بإيجاز وبشكل طبيعي بالعربية الفصحى الحديثة في جملة أو جملتين كحد أقصى.`
      : `You are a voice AI assistant running on an embedded ESP32-S3 device. Your name is Xiaozhi. Reply naturally and concisely — one or two sentences maximum.`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: transcript },
      ],
      max_tokens: 120,
      temperature: 0.7,
    });
    const reply = chat.choices[0]?.message?.content?.trim() ?? "I didn't catch that.";

    // ── Step 3: Text → Speech (TTS) ───────────────────────────────────────
    const ttsResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",        // clear, friendly, gender-neutral
      input: reply,
      response_format: "mp3",
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    return NextResponse.json({ transcript, reply, audioBase64 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/voice]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
