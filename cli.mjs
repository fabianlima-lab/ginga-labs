#!/usr/bin/env node
// Demo do protótipo: gera um estadual fictício, narra um clássico e simula a temporada.
// Uso: node cli.mjs [seed]
// O mundo gerado é salvo em out/mundo.json — dados abertos, moddáveis por design.

import { mkdirSync, writeFileSync } from "node:fs";
import { criarRng } from "./src/rng.mjs";
import { gerarClubes } from "./src/clubes.mjs";
import { simularPartida } from "./src/partida.mjs";
import { simularTemporada } from "./src/temporada.mjs";

const seed = Number(process.argv[2] ?? 1970);
const rng = criarRng(seed);

console.log("═".repeat(72));
console.log("  PRANCHETA FC — protótipo do gerador de mundo (Ginga Labs)");
console.log(`  Campeonato Estadual de Pindorama · seed ${seed} · 100% fictício`);
console.log("═".repeat(72));

const clubes = gerarClubes(rng, 16);

console.log("\n── OS 16 CLUBES DO ESTADUAL ──\n");
for (const c of clubes) {
  console.log(`  ${c.sigla}  ${c.nome}  [${c.rotuloArquetipo}, força ${c.nivel}]`);
  console.log(`       "${c.contexto}"`);
}

// O craque do campeonato: maior ginga do mundo gerado
const todos = clubes.flatMap((c) => c.elenco.map((j) => ({ ...j, clube: c.curto })));
const craque = todos.sort((a, b) => b.atributos.ginga - a.atributos.ginga)[0];
console.log("\n── O CRAQUE DA VÁRZEA DESTA GERAÇÃO ──\n");
console.log(`  ${craque.nome}, ${craque.idade} anos, ${craque.posicao} do ${craque.clube}`);
console.log(`  Ginga ${craque.atributos.ginga} · Marra ${craque.atributos.marra} · Raça ${craque.atributos.raca} · Frieza ${craque.atributos.frieza}`);
console.log(`  Geral ${craque.geral} → Potencial ${craque.potencial}`);
console.log(`  Origem: ${craque.historia.origem}`);
console.log(`  Detalhe: ${craque.historia.traco}`);

console.log("\n── NARRAÇÃO: O CLÁSSICO DA RODADA 1 ──\n");
const partida = simularPartida(rng, clubes[0], clubes[1], { narrar: true });
for (const linha of partida.narracao) console.log(`  📻 ${linha}\n`);

console.log("── CLASSIFICAÇÃO FINAL DO ESTADUAL (15 rodadas) ──\n");
const temporada = simularTemporada(rng, clubes);
console.log("      CLUBE                                    PTS   J   V   E   D   GP  GC  SG");
temporada.classificacao.forEach((t, i) => {
  const pos = String(i + 1).padStart(2);
  const nome = t.clube.nome.padEnd(40).slice(0, 40);
  const sg = t.gp - t.gc;
  console.log(
    `  ${pos}. ${nome} ${String(t.pts).padStart(3)} ${String(t.j).padStart(3)} ${String(t.v).padStart(3)} ` +
    `${String(t.e).padStart(3)} ${String(t.d).padStart(3)} ${String(t.gp).padStart(4)} ${String(t.gc).padStart(3)} ${String(sg).padStart(3)}`
  );
});

const campeao = temporada.classificacao[0].clube;
console.log(`\n  🏆 CAMPEÃO: ${campeao.nome} — ${campeao.rotuloArquetipo}!`);

console.log("\n── ARTILHARIA ──\n");
temporada.topArtilheiros.forEach(([nome, gols], i) => {
  console.log(`  ${i + 1}. ${nome} — ${gols} gols`);
});

// Dados abertos: o mundo inteiro vai pra JSON (pilar do modding/IA)
mkdirSync(new URL("./out", import.meta.url), { recursive: true });
writeFileSync(
  new URL("./out/mundo.json", import.meta.url),
  JSON.stringify({ seed, campeonato: "Estadual de Pindorama", clubes }, null, 2)
);
console.log("\n  💾 Mundo completo salvo em out/mundo.json (16 clubes, 368 jogadores)");
console.log("═".repeat(72));
