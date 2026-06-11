// Máquina de texto: tudo no teaser é texto que pulsa, e este é o pulso.
// Digita caractere a caractere; um toque em qualquer lugar acelera, o segundo
// completa na hora. Ritmo é direção de cena: vírgula respira, reticência segura.

const PAUSAS = { ",": 90, ";": 120, ":": 140, ".": 260, "!": 260, "?": 260, "…": 420, "—": 180, "\n": 200 };

let velocidade = 1; // 1 = normal, 4 = acelerado, Infinity = completa já

export function armarAceleracao(palco) {
  palco.classList.add("acelera-toque");
  palco.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest("button")) return; // botões continuam botões
    velocidade = velocidade === 1 ? 4 : Infinity;
  });
}

function espera(ms) {
  if (velocidade === Infinity) return Promise.resolve();
  return new Promise((r) => setTimeout(r, ms / velocidade));
}

/**
 * Digita `texto` dentro de `el`. Suporta **negrito** e *itálico* inline.
 * Resolve quando o texto terminou (ou foi acelerado até o fim).
 */
export async function digitar(el, texto, { porCaractere = 28 } = {}) {
  velocidade = 1;
  el.classList.add("digitando");

  // quebra o markdown leve em segmentos [texto, tag]
  const segmentos = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let ultimo = 0, m;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) segmentos.push([texto.slice(ultimo, m.index), null]);
    segmentos.push([m[1] ?? m[2], m[1] ? "strong" : "em"]);
    ultimo = re.lastIndex;
  }
  if (ultimo < texto.length) segmentos.push([texto.slice(ultimo), null]);

  for (const [trecho, tag] of segmentos) {
    const alvo = tag ? el.appendChild(document.createElement(tag)) : el;
    for (const ch of trecho) {
      alvo.append(ch);
      await espera(porCaractere + (PAUSAS[ch] ?? 0));
    }
  }

  el.classList.remove("digitando");
}

/** Cria um parágrafo no palco e digita nele. */
export async function fala(palco, texto, classe = "fala", opcoes) {
  const p = document.createElement("p");
  p.className = classe;
  palco.appendChild(p);
  p.scrollIntoView({ block: "end", behavior: "smooth" });
  await digitar(p, texto, opcoes);
  return p;
}

/** Limpa o palco (troca de cena). */
export function limpar(palco) {
  palco.replaceChildren();
  window.scrollTo(0, 0);
}

/** Botão "continuar"; resolve quando clicado. */
export function continuar(palco, rotulo = "Continuar") {
  return new Promise((resolver) => {
    const b = document.createElement("button");
    b.className = "continuar";
    b.textContent = rotulo;
    b.addEventListener("click", () => { b.remove(); resolver(); }, { once: true });
    palco.appendChild(b);
    b.scrollIntoView({ block: "end", behavior: "smooth" });
  });
}

/**
 * Apresenta escolhas; resolve com o `id` da escolhida.
 * `opcoes`: [{ id, rotulo, texto }]
 */
export function escolher(palco, opcoes) {
  return new Promise((resolver) => {
    const caixa = document.createElement("div");
    caixa.className = "escolhas";
    for (const op of opcoes) {
      const b = document.createElement("button");
      b.className = "escolha";
      const rot = document.createElement("span");
      rot.className = "rotulo";
      rot.textContent = op.rotulo;
      b.append(rot, op.texto);
      b.addEventListener("click", () => { caixa.remove(); resolver(op.id); }, { once: true });
      caixa.appendChild(b);
    }
    palco.appendChild(caixa);
    caixa.scrollIntoView({ block: "end", behavior: "smooth" });
  });
}
