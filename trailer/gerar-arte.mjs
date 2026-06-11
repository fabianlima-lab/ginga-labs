// Gera a arte ilustrada do trailer via Gemini (nano banana / Imagen).
// USO:  GOOGLE_API_KEY=... node gerar-arte.mjs
// A key vem SEMPRE do ambiente — nunca de arquivo. Saída: public/arte/.

import { mkdirSync, writeFileSync } from "node:fs";

const KEY = process.env.GOOGLE_API_KEY;
if (!KEY) {
  console.error("Defina GOOGLE_API_KEY no ambiente. A key não vive em arquivo nenhum deste repo.");
  process.exit(1);
}
const MODELO = process.env.MODELO_IMAGEM ?? "gemini-3-pro-image";

mkdirSync(new URL("./public/arte/", import.meta.url), { recursive: true });

// O estilo é UM só — a direção de arte vai no fim de todo prompt.
const ESTILO =
  "Dark moody cinematic illustration, heavy film grain, almost-black background (#0d0f0c), " +
  "earthy tones with selective warm yellow (#ffd447) accent light, deep shadows, " +
  "Brazilian interior atmosphere, no text, no watermark, no real club logos or kits.";

const PECAS = [
  {
    arquivo: "varzea.png",
    prompt:
      "A dirt football pitch in a small Brazilian town at golden dusk, rusty goalpost without net, " +
      "silhouettes of people leaning on a low fence watching, dust in the air. " + ESTILO,
  },
  {
    arquivo: "menino.png",
    prompt:
      "A skinny 16-year-old boy seen from behind, oversized football shirt, holding a worn ball under his arm, " +
      "looking at an empty floodlit pitch at night, single floodlight haze, backlit rim light. " + ESTILO,
  },
  {
    arquivo: "arquibancada.png",
    prompt:
      "Old wooden stands of a small Brazilian stadium packed at night, flags and smoke, " +
      "single floodlight cutting the dark, crowd as silhouettes. " + ESTILO,
  },
];

for (const peca of PECAS) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: peca.prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
      }),
    }
  );
  if (!resp.ok) throw new Error(`${peca.arquivo} -> ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  const json = await resp.json();
  const parte = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!parte) throw new Error(`${peca.arquivo}: resposta sem imagem (${JSON.stringify(json).slice(0, 200)})`);
  const buf = Buffer.from(parte.inlineData.data, "base64");
  writeFileSync(new URL(`./public/arte/${peca.arquivo}`, import.meta.url), buf);
  console.log(`✔ ${peca.arquivo} (${(buf.length / 1024).toFixed(0)} kB)`);
}

console.log("Arte gerada em trailer/public/arte/.");
