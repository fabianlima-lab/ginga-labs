// Gerador de jogadores fictícios — atributos 1–20 (técnicos + brasileiros).
// "ginga", "marra", "raça", "frieza" e "malandragem" são o coração do sistema:
// nenhum outro management game os tem, e o motor de partida os usa de verdade.

import { entre, escolher, sino } from "./rng.mjs";
import { gerarNomeJogador } from "./nomes.mjs";

export const POSICOES = ["GOL", "ZAG", "LAT", "VOL", "MEI", "PON", "ATA"];

// Pesos de cada atributo no "geral" da posição.
const PESOS = {
  GOL: { defesa: 5, frieza: 2, raca: 1 },
  ZAG: { desarme: 4, cabeceio: 3, raca: 2, marra: 1 },
  LAT: { velocidade: 3, desarme: 2, passe: 2, resistencia: 2, ginga: 1 },
  VOL: { desarme: 3, passe: 3, resistencia: 2, raca: 2 },
  MEI: { passe: 4, visao: 3, ginga: 2, frieza: 1 },
  PON: { drible: 4, velocidade: 3, ginga: 3 },
  ATA: { finalizacao: 5, frieza: 3, ginga: 2, marra: 1 },
};

const ORIGENS = [
  "cria da base do próprio clube",
  "descoberto numa peneira com mais de 400 meninos",
  "revelado no torneio de várzea do bairro",
  "veio do futsal da escola pública",
  "filho de roupeiro, cresceu dentro do clube",
  "jogava descalço no campo de terra até os 14",
  "voltou ao futebol depois de trabalhar de entregador",
  "irmão mais novo de um ex-jogador que não vingou",
];

const TRACOS = [
  "manda dinheiro pra mãe todo mês",
  "tem um empresário rondando a família",
  "perde a cabeça quando provocado",
  "ídolo da torcida organizada",
  "estuda à noite por exigência da avó",
  "já pensou em largar tudo",
  "sonha em jogar na Europa antes dos 22",
  "é o capitão do vestiário, mesmo sem braçadeira",
  "fé inabalável: aponta pro céu em todo gol",
  "fama de baladeiro que o treino desmente — às vezes",
];

function idadePorPerfil(rng) {
  const r = rng();
  if (r < 0.18) return entre(rng, 16, 19); // promessas
  if (r < 0.75) return entre(rng, 20, 28); // núcleo
  return entre(rng, 29, 36); // veteranos
}

export function gerarJogador(rng, posicao, nivelClube, usados) {
  const idade = idadePorPerfil(rng);
  // nível do clube (1-20) ancora a qualidade média do elenco
  const base = Math.max(3, Math.min(17, nivelClube + entre(rng, -2, 2)));

  const atr = {};
  const tecnicos = ["finalizacao", "passe", "drible", "desarme", "cabeceio", "velocidade", "resistencia", "defesa", "visao"];
  const brasileiros = ["ginga", "marra", "raca", "frieza", "malandragem"];
  for (const a of tecnicos) atr[a] = sino(rng, base - 4, base + 4);
  for (const a of brasileiros) atr[a] = sino(rng, 4, 19);

  // especialização da posição: reforça os atributos-chave
  for (const chave of Object.keys(PESOS[posicao])) {
    atr[chave] = Math.min(20, atr[chave] + entre(rng, 1, 3));
  }
  if (posicao !== "GOL") atr.defesa = entre(rng, 1, 4);

  const geral = calcularGeral(atr, posicao);
  // potencial: jovens têm teto alto; veteranos já chegaram onde iam chegar
  const margem = idade <= 19 ? entre(rng, 2, 7) : idade <= 24 ? entre(rng, 1, 4) : 0;
  const potencial = Math.min(20, geral + margem);

  return {
    nome: gerarNomeJogador(rng, usados),
    posicao,
    idade,
    atributos: atr,
    geral,
    potencial,
    moral: entre(rng, 8, 16),
    historia: {
      origem: escolher(rng, ORIGENS),
      traco: escolher(rng, TRACOS),
    },
  };
}

export function calcularGeral(atr, posicao) {
  const pesos = PESOS[posicao];
  let soma = 0;
  let totalPesos = 0;
  for (const [chave, peso] of Object.entries(pesos)) {
    soma += atr[chave] * peso;
    totalPesos += peso;
  }
  return Math.round(soma / totalPesos);
}

// Elenco padrão de 23: 2 GOL, 4 ZAG, 4 LAT, 3 VOL, 4 MEI, 3 PON, 3 ATA
const FORMACAO_ELENCO = [
  ["GOL", 2], ["ZAG", 4], ["LAT", 4], ["VOL", 3], ["MEI", 4], ["PON", 3], ["ATA", 3],
];

export function gerarElenco(rng, nivelClube, usados) {
  const elenco = [];
  for (const [pos, qtd] of FORMACAO_ELENCO) {
    for (let i = 0; i < qtd; i++) elenco.push(gerarJogador(rng, pos, nivelClube, usados));
  }
  return elenco;
}

// Titulares: o melhor de cada posição num 4-4-2 clássico de estadual
export function escalarTitulares(elenco) {
  const porPosicao = (pos, n) =>
    elenco.filter((j) => j.posicao === pos).sort((a, b) => b.geral - a.geral).slice(0, n);
  return [
    ...porPosicao("GOL", 1),
    ...porPosicao("ZAG", 2),
    ...porPosicao("LAT", 2),
    ...porPosicao("VOL", 2),
    ...porPosicao("MEI", 2),
    ...porPosicao("PON", 1),
    ...porPosicao("ATA", 1),
  ];
}
