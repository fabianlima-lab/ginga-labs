// Gera o áudio do trailer via ElevenLabs (locução + efeitos + torcida).
// USO:  ELEVENLABS_API_KEY=... node gerar-audio.mjs
// A key vem SEMPRE do ambiente — nunca de arquivo. Saída: public/audio/.

import { mkdirSync, writeFileSync } from "node:fs";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Defina ELEVENLABS_API_KEY no ambiente. A key não vive em arquivo nenhum deste repo.");
  process.exit(1);
}
const VOZ = process.env.ELEVENLABS_VOICE_ID ?? "onwK4e9ZLuTAKqWW03F9"; // Daniel: grave, registro de locutor

const API = "https://api.elevenlabs.io/v1";
mkdirSync(new URL("./public/audio/", import.meta.url), { recursive: true });

async function chamar(caminho, corpo, arquivo) {
  const resp = await fetch(`${API}${caminho}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!resp.ok) throw new Error(`${caminho} -> ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(new URL(`./public/audio/${arquivo}`, import.meta.url), buf);
  console.log(`✔ ${arquivo} (${(buf.length / 1024).toFixed(0)} kB)`);
}

const fala = (texto, arquivo, ajustes = {}) =>
  chamar(`/text-to-speech/${VOZ}`, {
    text: texto,
    model_id: "eleven_multilingual_v2",
    language_code: undefined,
    voice_settings: { stability: 0.35, similarity_boost: 0.8, style: 0.65, ...ajustes },
  }, arquivo);

const efeito = (texto, segundos, arquivo) =>
  chamar("/sound-generation", { text: texto, duration_seconds: segundos, prompt_influence: 0.4 }, arquivo);

// ── locução (estilo rádio AM brasileira) ─────────────────────────────
await fala(
  "Torneio de várzea. O olheiro jurou que valia a pena. O menino pega na bola...",
  "locucao-narracao.mp3",
  { stability: 0.5, style: 0.4 } // tenso, baixo, segurando
);
await fala(
  "Passou por um!... Passou por DOIS!... BATEEEEEU!...",
  "locucao-lance.mp3",
  { stability: 0.2, style: 0.9 } // explodindo
);
await fala("GOOOOOOOOOOOL!", "locucao-gol.mp3", { stability: 0.15, style: 1.0 });

// ── efeitos e torcida (faixa ORIGINAL — nada de hino ou canto real) ──
await efeito("old AM radio static hiss, tuning between stations, slowly rising in intensity, vintage", 6, "sfx-chiado.mp3");
await efeito("distant Brazilian surdo bass drum beating steadily far away inside a stadium, sparse, ominous, low", 8, "sfx-surdo-longe.mp3");
await efeito("Brazilian football stadium crowd roaring with samba batucada drums and brass band charanga, euphoric celebration, energetic", 10, "sfx-torcida.mp3");
await efeito("single deep surdo bass drum hit repeating slowly like a heartbeat, dry, dark, intimate, 100 bpm", 7, "sfx-surdo-coracao.mp3");

console.log("Áudio gerado em trailer/public/audio/.");
