// O card compartilhável — estilo Wordle: a run inteira numa imagem
// pronta pra WhatsApp/X. Canvas puro, sem dependência, 1080×1080.

import { CONFIG } from "./config.mjs";

const L = 1080; // lado

function quebrarLinhas(ctx, texto, larguraMax) {
  const palavras = texto.split(" ");
  const linhas = [];
  let atual = "";
  for (const p of palavras) {
    const tentativa = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(tentativa).width > larguraMax && atual) {
      linhas.push(atual);
      atual = p;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/**
 * Desenha o card e devolve o canvas.
 * `dados`: { tituloFinal, fraseCard, n, total, seed, escapou }
 */
export function desenharCard(dados) {
  const canvas = document.createElement("canvas");
  canvas.width = L;
  canvas.height = L;
  const ctx = canvas.getContext("2d");

  // fundo e moldura
  ctx.fillStyle = "#0d0f0c";
  ctx.fillRect(0, 0, L, L);
  ctx.strokeStyle = "#ffd447";
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, L - 72, L - 72);

  // cabeçalho: nome do jogo
  ctx.fillStyle = "#ffd447";
  ctx.font = "bold 64px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(CONFIG.nomeJogo, L / 2, 150);

  ctx.fillStyle = "#9a937f";
  ctx.font = "32px Georgia, serif";
  ctx.fillText("o primeiro capítulo · grátis · no navegador", L / 2, 200);

  // veredito da run
  ctx.fillStyle = dados.escapou ? "#2e7d32" : "#c62828";
  ctx.font = "bold 44px Georgia, serif";
  ctx.fillText(dados.escapou ? "ESCAPOU DO REBAIXAMENTO" : "REBAIXADO", L / 2, 300);

  // a frase do final — o coração do card
  ctx.fillStyle = "#f2ead8";
  ctx.font = "italic 48px Georgia, serif";
  const linhas = quebrarLinhas(ctx, `“${dados.fraseCard}”`, L - 220);
  const altura = 64;
  let y = L / 2 + 40 - ((linhas.length - 1) * altura) / 2;
  for (const linha of linhas) {
    ctx.fillText(linha, L / 2, y);
    y += altura;
  }

  // título e numeração do final
  ctx.fillStyle = "#ffd447";
  ctx.font = "bold 40px Georgia, serif";
  ctx.fillText(dados.tituloFinal, L / 2, 840);
  ctx.fillStyle = "#9a937f";
  ctx.font = "34px Georgia, serif";
  ctx.fillText(`Final ${dados.n} de ${dados.total} · mundo ${dados.seed}`, L / 2, 895);

  // rodapé: o convite
  ctx.fillStyle = "#f2ead8";
  ctx.font = "30px Georgia, serif";
  ctx.fillText("Isso foi um domingo. O jogo completo é a carreira inteira.", L / 2, 975);
  ctx.fillStyle = "#ffd447";
  ctx.font = "bold 34px Georgia, serif";
  ctx.fillText(CONFIG.url, L / 2, 1020);

  return canvas;
}

/** Compartilha a imagem (Web Share API) ou baixa como PNG. */
export async function compartilharCard(canvas, dados) {
  const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
  const arquivo = new File([blob], "varzea-final.png", { type: "image/png" });
  const texto = `“${dados.fraseCard}” — ${CONFIG.nomeJogo}, Final ${dados.n} de ${dados.total}. Joga o seu domingo: ${CONFIG.url}`;

  if (navigator.canShare?.({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], text: texto });
      return "compartilhado";
    } catch (e) {
      if (e.name === "AbortError") return "cancelado";
    }
  }
  // fallback: baixa o PNG e tenta deixar o texto no clipboard
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "varzea-final.png";
  a.click();
  URL.revokeObjectURL(a.href);
  try { await navigator.clipboard.writeText(texto); } catch { /* sem clipboard, sem drama */ }
  return "baixado";
}
