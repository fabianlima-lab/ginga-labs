// Temporada: turno único todos-contra-todos (formato clássico de estadual)
// + tabela de classificação e artilharia.

import { simularPartida } from "./partida.mjs";

// Algoritmo do círculo para gerar rodadas equilibradas
export function gerarRodadas(clubes) {
  const lista = [...clubes];
  const n = lista.length;
  const rodadas = [];
  for (let r = 0; r < n - 1; r++) {
    const jogos = [];
    for (let i = 0; i < n / 2; i++) {
      const a = lista[i];
      const b = lista[n - 1 - i];
      // alterna mando para distribuir jogos em casa
      jogos.push(r % 2 === 0 ? [a, b] : [b, a]);
    }
    rodadas.push(jogos);
    lista.splice(1, 0, lista.pop()); // rotação mantendo o primeiro fixo
  }
  return rodadas;
}

export function simularTemporada(rng, clubes) {
  const tabela = new Map(
    clubes.map((c) => [c.sigla, { clube: c, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 }])
  );
  const artilheiros = new Map();
  const resultados = [];

  for (const rodada of gerarRodadas(clubes)) {
    for (const [casa, fora] of rodada) {
      const r = simularPartida(rng, casa, fora);
      resultados.push(r);

      const tc = tabela.get(r.casa);
      const tf = tabela.get(r.fora);
      tc.j++; tf.j++;
      tc.gp += r.golsCasa; tc.gc += r.golsFora;
      tf.gp += r.golsFora; tf.gc += r.golsCasa;
      if (r.golsCasa > r.golsFora) { tc.v++; tc.pts += 3; tf.d++; }
      else if (r.golsCasa < r.golsFora) { tf.v++; tf.pts += 3; tc.d++; }
      else { tc.e++; tf.e++; tc.pts++; tf.pts++; }

      for (const g of r.goleadores) {
        const chave = `${g.nome} (${g.clube})`;
        artilheiros.set(chave, (artilheiros.get(chave) ?? 0) + 1);
      }
    }
  }

  const classificacao = [...tabela.values()].sort(
    (a, b) => b.pts - a.pts || (b.gp - b.gc) - (a.gp - a.gc) || b.gp - a.gp
  );
  const topArtilheiros = [...artilheiros.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return { classificacao, topArtilheiros, resultados };
}
