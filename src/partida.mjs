// Motor de partida + narração estilo rádio brasileira.
// Os atributos brasileiros importam: ginga gera drible no lance, frieza decide
// o gol nos minutos finais, raça muda o jogo quando o time está perdendo.

import { entre, escolher } from "./rng.mjs";
import { escalarTitulares } from "./jogadores.mjs";

function forcas(clube) {
  const titulares = escalarTitulares(clube.elenco);
  const frente = titulares.filter((j) => ["MEI", "PON", "ATA"].includes(j.posicao));
  const fundo = titulares.filter((j) => ["ZAG", "LAT", "VOL"].includes(j.posicao));
  const goleiro = titulares.find((j) => j.posicao === "GOL");
  const media = (lista, f) => lista.reduce((s, j) => s + f(j), 0) / lista.length;

  return {
    titulares,
    ataque: media(frente, (j) => (j.atributos.finalizacao + j.atributos.drible + j.atributos.ginga) / 3),
    defesa: media(fundo, (j) => (j.atributos.desarme + j.atributos.raca) / 2),
    goleiro: goleiro.atributos.defesa,
    frente,
    goleiroJogador: goleiro,
  };
}

const ABERTURAS = [
  "Boa tarde, amigo da Rádio! O sol castiga, a arquibancada ferve e a bola vai rolar em {estadio}!",
  "Atenção torcedor! Apita o árbitro… COMEÇA O JOGO entre {casa} e {fora}!",
  "Domingo de futebol raiz, gramado castigado e clima de decisão: {casa} contra {fora}!",
];

const LANCES_GINGA = [
  "{jogador} pisa na bola... olha a GINGA do menino! Passou por um, passou por DOIS",
  "{jogador} chama o marcador pro baile, corta pra dentro com um drible seco",
  "que caneta, minha gente! {jogador} humilhou na ginga",
];

const LANCES_NORMAIS = [
  "{jogador} arranca pelo meio e arrisca de longe",
  "cruzamento na área, {jogador} sobe mais que todo mundo",
  "bola enfiada açucarada, {jogador} sai na cara do gol",
  "rebote na entrada da área, {jogador} ajeita e bate",
];

const DESFECHO_GOL = [
  "É GOL! É GOOOOOOOOOL DO {clube}! {jogador}, o moleque, aos {min} minutos! A arquibancada VEM ABAIXO!",
  "GOOOOOOOL! Pode gritar, torcedor! {jogador} balança a rede e corre pro alambrado!",
  "NA GAVETA! GOL DE {jogador}! O {clube} explode de alegria aos {min}!",
];

const DESFECHO_TRAVE = [
  "NA TRAVE! NA TRAAAVE, MINHA NOSSA SENHORA! O {clube} chora, {jogador} não acredita!",
  "explodiu o travessão! O estádio inteiro levou a mão na cabeça!",
];

const DESFECHO_DEFESA = [
  "E O GOLEIRO FAZ UM MILAGRE! Que defesa, que DEFESAÇA de {goleiro}!",
  "{goleiro} voa no ângulo e salva o {clubeDef}! Tá fechado o gol hoje!",
];

const DESFECHO_FORA = [
  "pra fora! Passou raspando a trave, tirando tinta!",
  "isolou! Mandou pra cima da arquibancada e a torcida devolve a bola com raiva!",
];

function preencher(texto, dados) {
  return texto.replace(/\{(\w+)\}/g, (_, k) => dados[k] ?? `{${k}}`);
}

export function simularPartida(rng, casa, fora, opcoes = {}) {
  const narrar = opcoes.narrar ?? false;
  const fCasa = forcas(casa);
  const fFora = forcas(fora);
  const narracao = [];

  if (narrar) {
    narracao.push(preencher(escolher(rng, ABERTURAS), {
      casa: casa.nome, fora: fora.nome, estadio: `o caldeirão de ${casa.curto}`,
    }));
  }

  const placar = { [casa.sigla]: 0, [fora.sigla]: 0 };
  const goleadores = [];
  const totalLances = entre(rng, 7, 11);
  const minutos = Array.from({ length: totalLances }, () => entre(rng, 1, 90)).sort((a, b) => a - b);

  for (let i = 0; i < totalLances; i++) {
    const minuto = minutos[i];
    // mando de campo vale ~12% de força extra
    const pesoCasa = fCasa.ataque * 1.12 + fCasa.defesa * 0.3;
    const pesoFora = fFora.ataque + fFora.defesa * 0.3;
    const ehCasa = rng() < pesoCasa / (pesoCasa + pesoFora);
    const atk = ehCasa ? fCasa : fFora;
    const def = ehCasa ? fFora : fCasa;
    const clubeAtk = ehCasa ? casa : fora;
    const clubeDef = ehCasa ? fora : casa;

    // protagonista do lance: atacantes com mais ginga aparecem mais
    const protagonista = escolher(rng, atk.frente);
    const lanceComGinga = protagonista.atributos.ginga >= 14 && rng() < 0.5;

    // conversão: finalização + frieza (se minuto >= 75) vs goleiro + defesa
    let poderChute = protagonista.atributos.finalizacao;
    if (minuto >= 75) poderChute = (poderChute + protagonista.atributos.frieza) / 2;
    // raça: time que está perdendo joga com a faca nos dentes
    const perdendo = placar[clubeAtk.sigla] < placar[clubeDef.sigla];
    if (perdendo) poderChute += 1.5;

    const resistencia = def.goleiro * 0.6 + def.defesa * 0.4;
    const chanceGol = Math.max(0.08, Math.min(0.55, 0.30 + (poderChute - resistencia) * 0.025));

    const sorteio = rng();
    let desfecho;
    if (sorteio < chanceGol) {
      desfecho = "gol";
      placar[clubeAtk.sigla]++;
      goleadores.push({ nome: protagonista.nome, clube: clubeAtk.sigla, minuto });
    } else if (sorteio < chanceGol + 0.12) desfecho = "trave";
    else if (sorteio < chanceGol + 0.32) desfecho = "defesa";
    else desfecho = "fora";

    if (narrar) {
      const lance = preencher(
        escolher(rng, lanceComGinga ? LANCES_GINGA : LANCES_NORMAIS),
        { jogador: protagonista.nome }
      );
      const finais = { gol: DESFECHO_GOL, trave: DESFECHO_TRAVE, defesa: DESFECHO_DEFESA, fora: DESFECHO_FORA };
      const fim = preencher(escolher(rng, finais[desfecho]), {
        jogador: protagonista.nome,
        clube: clubeAtk.curto,
        clubeDef: clubeDef.curto,
        goleiro: def.goleiroJogador.nome,
        min: minuto,
      });
      narracao.push(`${minuto}' — ${lance}... ${fim}`);
    }
  }

  if (narrar) {
    narracao.push(
      `FIM DE JOGO! ${casa.nome} ${placar[casa.sigla]} x ${placar[fora.sigla]} ${fora.nome}. ` +
      (placar[casa.sigla] === placar[fora.sigla]
        ? "Tudo igual, e tem gente saindo do estádio reclamando do juiz mesmo assim."
        : "A torcida vencedora não vai dormir hoje!")
    );
  }

  return {
    casa: casa.sigla,
    fora: fora.sigla,
    golsCasa: placar[casa.sigla],
    golsFora: placar[fora.sigla],
    goleadores,
    narracao,
  };
}
