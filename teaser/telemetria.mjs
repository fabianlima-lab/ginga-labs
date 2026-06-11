// Instrumentação do teaser — as quatro métricas do docs/TEASER.md:
//   % que completa        → eventos "inicio" e "final"
//   shares do card        → evento "share" (a métrica de ouro)
//   intenção de compra    → evento "cta" (wishlist/lista/discord)
//   rejogadas             → evento "rejogada" (runs >= 2 no mesmo navegador)
//
// Sem endpoint configurado, os eventos ficam no console (debug) e o
// contador de runs no localStorage. Plugar um backend = uma URL no config.

import { CONFIG } from "./config.mjs";

const sessao = Math.random().toString(36).slice(2, 10);
const fila = [];

export function evento(nome, dados = {}) {
  const e = { nome, ...dados, sessao, t: Date.now() };
  fila.push(e);
  if (!CONFIG.analyticsUrl) console.debug("[telemetria]", e);
  if (fila.length >= 10) enviar();
}

function enviar() {
  if (!CONFIG.analyticsUrl || fila.length === 0) return;
  const corpo = JSON.stringify(fila.splice(0));
  navigator.sendBeacon?.(CONFIG.analyticsUrl, corpo);
}

// garante o flush quando a aba fecha ou vai pro fundo (celular!)
addEventListener("pagehide", enviar);
addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") enviar();
});

/** Conta a run no navegador e detecta rejogada. Devolve o nº da run. */
export function contarRun() {
  let runs = 0;
  try {
    runs = Number(localStorage.getItem("varzea_runs") ?? 0) + 1;
    localStorage.setItem("varzea_runs", String(runs));
  } catch {
    runs = 1; // navegação privada: cada run é a primeira
  }
  evento("inicio", { run: runs });
  if (runs >= 2) evento("rejogada", { run: runs });
  return runs;
}
