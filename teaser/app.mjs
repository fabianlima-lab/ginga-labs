// Várzea — teaser jogável. Orquestra as cenas; o texto vive em roteiro/.
// Os módulos do motor (../src) são os mesmos do CLI: um mundo, dois palcos.

import { armarAceleracao, fala, limpar, continuar, escolher } from "./maquina.mjs";
import { criarMundo, decidir } from "./mundo.mjs";
import { montarCampeonato, jogarPartida, jogarTrecho, criarDegola, atualizarDegola, lerDegola, desfechoDegola } from "./campeonato.mjs";
import { escolher as sortear, entre } from "../src/rng.mjs";
import { ATO0 } from "./roteiro/ato0.mjs";
import { ATO1 } from "./roteiro/ato1.mjs";
import { ABERTURA_ATO2, ABERTURAS_RODADA, PRE_JOGO, MANCHETES, DEGOLA, PRESIDENTE } from "./roteiro/ato2.mjs";
import { EVENTOS } from "./roteiro/eventos.mjs";
import { ABERTURA_ATO3, EMPRESARIO, FANTASMA, PRE_FINAL, INTERVALO, AOS_80, APITO_FINAL } from "./roteiro/ato3.mjs";
import { FINAIS, TOTAL_FINAIS } from "./roteiro/finais.mjs";
import { desenharCard, compartilharCard } from "./card.mjs";
import { CONFIG } from "./config.mjs";

const palco = document.getElementById("palco");
armarAceleracao(palco);

const mundo = criarMundo();
const adversarios = montarCampeonato(mundo);
const degola = criarDegola(mundo);
const eventosUsados = new Set();

// Placeholders que o roteiro pode usar nas falas.
let extras = {};
function preencher(texto) {
  const dados = {
    menino: mundo.menino.nome,
    caixa: mundo.estado.caixa.toLocaleString("pt-BR"),
    rival: degola.rivalCurto,
    pontosAli: degola.pontosAlianca,
    pontosRival: degola.pontosRival,
    ...extras,
  };
  return texto.replace(/\{(\w+)\}/g, (_, k) => dados[k] ?? `{${k}}`);
}

// A ficha amassada do olheiro: só os atributos que contam a história.
const FICHA_ATRIBUTOS = ["ginga", "marra", "frieza", "raca"];
const NOMES_ATRIBUTOS = { ginga: "Ginga", marra: "Marra", frieza: "Frieza", raca: "Raça" };

function mostrarFicha(jogador) {
  const dl = document.createElement("dl");
  dl.className = "ficha";
  for (const chave of FICHA_ATRIBUTOS) {
    const valor = jogador.atributos[chave];
    const dt = document.createElement("dt");
    dt.textContent = NOMES_ATRIBUTOS[chave];
    const dd = document.createElement("dd");
    dd.textContent = valor;
    if (valor >= 16) dd.className = "alto";
    else if (valor <= 8) dd.className = "baixo";
    dl.append(dt, dd);
  }
  palco.appendChild(dl);
  dl.scrollIntoView({ block: "end", behavior: "smooth" });
}

async function tocarCenas(cenas) {
  for (const cena of cenas) {
    if (cena.tipo === "fala" || cena.tipo === "radio") {
      if (cena.efeitos) decidir(mundo, null, null, cena.efeitos);
      await fala(palco, preencher(cena.texto), cena.tipo === "radio" ? "radio" : "fala");
    } else if (cena.tipo === "ficha") {
      mostrarFicha(mundo[cena.jogador]);
    } else if (cena.tipo === "continuar") {
      await continuar(palco, cena.rotulo);
    } else if (cena.tipo === "escolha") {
      const escolhida = await escolher(palco, cena.opcoes);
      decidir(mundo, cena.id, escolhida);
      await tocarCenas(cena.ramos?.[escolhida] ?? []);
    }
  }
}

// ── Ato 2: o loop ─────────────────────────────────────────────────────

function condicaoVale(se) {
  if (!se) return true;
  return se.startsWith("!") ? !mundo.estado[se.slice(1)] : Boolean(mundo.estado[se]);
}

function proximoEvento() {
  return EVENTOS.find((ev) => !eventosUsados.has(ev.id) && condicaoVale(ev.se));
}

async function narrarPartida(adversario, mandante) {
  const resultado = jogarPartida(mundo, adversario, { mandante });
  for (const linha of resultado.narracao) {
    const ehGol = /GO+L/.test(linha);
    const p = await fala(palco, linha, "radio");
    if (ehGol) p.classList.add("gol");
  }
  return resultado;
}

async function tocarRodada(numero, adversario) {
  limpar(palco);
  extras = { rodada: numero, adversario: adversario.nome, golsAli: "", golsAdv: "" };

  await fala(palco, preencher(sortear(mundo.rng, ABERTURAS_RODADA)));

  const evento = proximoEvento();
  if (evento) {
    eventosUsados.add(evento.id);
    await tocarCenas(evento.cenas);
  }

  await continuar(palco, "Ir pro jogo");
  limpar(palco);
  await fala(palco, sortear(mundo.rng, PRE_JOGO));

  const resultado = await narrarPartida(adversario, numero % 2 === 1);

  // consequência: manchete, conta da degola, a ligação do presidente
  atualizarDegola(mundo, degola, resultado.saldo);
  const manchete =
    resultado.golsDoMenino > 0 && resultado.saldo !== "derrota"
      ? sortear(mundo.rng, MANCHETES.golMenino)
      : sortear(mundo.rng, MANCHETES[resultado.saldo]);
  await fala(palco, `**CORREIO DA CIDADE** — ${preencher(manchete)}`);
  await fala(palco, preencher(DEGOLA[lerDegola(degola).tom]));
  await fala(palco, PRESIDENTE[resultado.saldo]);
  await continuar(palco, "Próxima semana");
}

// ── Ato 3: o dilema final ─────────────────────────────────────────────

async function intervencao(momento) {
  await fala(palco, momento.pergunta);
  return escolher(palco, momento.opcoes);
}

async function tocarFinal(adversario) {
  limpar(palco);
  extras = { ...extras, adversario: adversario.nome };
  await tocarCenas(ABERTURA_ATO3);

  if (mundo.estado.meninoNoElenco) {
    // a proposta cresce com a exposição: o empresário cobra pelo que viu
    const proposta = 60000 + Math.max(0, mundo.estado.exposicao) * 15000 + entre(mundo.rng, 0, 9) * 1000;
    extras.proposta = proposta.toLocaleString("pt-BR");
    await tocarCenas(EMPRESARIO);
    if (mundo.estado.meninoVendido) decidir(mundo, null, null, { caixa: proposta });
    await continuar(palco, "Ir pra final");
  } else if (mundo.estado.meninoNoRival) {
    adversario.elenco.push(mundo.menino); // ele te espera do outro lado
    await tocarCenas(FANTASMA);
  }

  limpar(palco);
  await tocarCenas(PRE_FINAL);

  // a final em três trechos: 1º tempo, até os 80, e o resto da vida
  let placar = undefined;
  let golsDoMenino = 0;
  let resultado;
  const trechos = [
    { minutoInicio: 1, minutoFim: 45, abertura: true },
    { minutoInicio: 46, minutoFim: 80, momento: INTERVALO },
    { minutoInicio: 81, minutoFim: 90, encerramento: true, momento: AOS_80 },
  ];
  for (const trecho of trechos) {
    const tatica = trecho.momento ? await intervencao(trecho.momento) : "equilibrio";
    resultado = jogarTrecho(mundo, adversario, { ...trecho, tatica, placar, mandante: false });
    placar = { [adversario.sigla]: resultado.golsCasa, ALI: resultado.golsFora };
    golsDoMenino += resultado.golsDoMenino;
    for (const linha of resultado.narracao) {
      const p = await fala(palco, linha, "radio");
      if (/GO+L/.test(linha)) p.classList.add("gol");
    }
  }

  await tocarCenas(APITO_FINAL);
  return { resultado, golsDoMenino };
}

async function tocarEpilogo({ resultado, golsDoMenino }) {
  const { escapou } = desfechoDegola(mundo, degola, resultado.saldo);

  await fala(
    palco,
    `A conta final da degola: **Aliança ${degola.pontosAlianca}, ${degola.rivalCurto} ${degola.pontosRival}**.`
  );

  const resumo = {
    escapou,
    trilho: mundo.estado.meninoNoRival ? "rival" : mundo.estado.meninoVendido ? "vendeu" : "segurou",
    golDoMenino: golsDoMenino > 0,
    moralMenino: mundo.menino.moral,
    exposicao: mundo.estado.exposicao,
  };
  const final = FINAIS.find((f) => f.condicao(resumo)) ?? FINAIS[FINAIS.length - 1];

  limpar(palco);
  await fala(palco, escapou ? "**O ALIANÇA FICA NA PRIMEIRA DIVISÃO.**" : "**O ALIANÇA ESTÁ REBAIXADO.**");
  await tocarCenas(final.cenas);
  await telaFinal(final, escapou);
}

// ── A tela final: o card compartilhável e os convites ────────────────

async function telaFinal(final, escapou) {
  const dados = {
    tituloFinal: final.titulo,
    fraseCard: final.card,
    n: final.n,
    total: TOTAL_FINAIS,
    seed: mundo.seed,
    escapou,
  };

  await fala(palco, `**${final.titulo}** — Final ${final.n} de ${TOTAL_FINAIS}.`);

  const canvas = desenharCard(dados);
  const img = document.createElement("img");
  img.className = "card-final";
  img.alt = `Card da run: ${final.titulo}, Final ${final.n} de ${TOTAL_FINAIS}`;
  img.src = canvas.toDataURL("image/png");
  palco.appendChild(img);

  await fala(palco, "*Isso foi um domingo. O jogo completo é a carreira inteira.*");

  const ctas = document.createElement("div");
  ctas.className = "ctas";

  const botaoShare = document.createElement("button");
  botaoShare.className = "principal";
  botaoShare.textContent = "Compartilhar o meu final";
  botaoShare.addEventListener("click", () => compartilharCard(canvas, dados));
  ctas.appendChild(botaoShare);

  const botaoDeNovo = document.createElement("button");
  botaoDeNovo.textContent = "Jogar de novo";
  botaoDeNovo.addEventListener("click", () => location.reload());
  ctas.appendChild(botaoDeNovo);

  const links = [
    ["Wishlist na Steam", CONFIG.linkWishlist],
    ["Entrar na lista", CONFIG.linkLista],
    ["Discord", CONFIG.linkDiscord],
  ];
  for (const [rotulo, href] of links) {
    if (!href) continue; // só aparece quando o canal existir (config.mjs)
    const a = document.createElement("a");
    a.textContent = rotulo;
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    ctas.appendChild(a);
  }

  palco.appendChild(ctas);
  ctas.scrollIntoView({ block: "end", behavior: "smooth" });
}

async function principal() {
  await tocarCenas(ATO0);
  limpar(palco);
  await tocarCenas(ATO1);
  await continuar(palco, "Seguir");

  limpar(palco);
  await tocarCenas(ABERTURA_ATO2);
  for (let rodada = 1; rodada <= 3; rodada++) {
    await tocarRodada(rodada, adversarios[rodada - 1]);
  }

  const final = await tocarFinal(adversarios[3]);
  await tocarEpilogo(final);
}

principal();
