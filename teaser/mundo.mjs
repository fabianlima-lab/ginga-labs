// O mundo do teaser: o Esporte Clube Aliança e o menino.
// Usa o motor de ../src — mesmo RNG com seed, mesmos geradores do CLI.
// O seed da run aparece no card final: cada jogador teve O SEU menino.

import { criarRng, entre } from "../src/rng.mjs";
import { gerarElenco, calcularGeral } from "../src/jogadores.mjs";
import { gerarNomeJogador } from "../src/nomes.mjs";

// Atributos do menino são FIXOS por design (docs/TEASER.md): a ficha
// Ginga 18 / Marra 16 / Frieza 8 / Raça 14 é o coração da hipótese.
// O que varia por seed é o nome, o entorno e como as partidas se desenrolam.
const ATRIBUTOS_MENINO = {
  ginga: 18, marra: 16, frieza: 8, raca: 14, malandragem: 15,
  drible: 17, velocidade: 16, finalizacao: 12, passe: 11,
  cabeceio: 6, desarme: 4, resistencia: 10, visao: 12, defesa: 2,
};

export function criarMundo(seed = 1 + Math.floor(Math.random() * 99999)) {
  const rng = criarRng(seed);
  const nomesUsados = new Set();

  const alianca = {
    nome: "Esporte Clube Aliança",
    curto: "Aliança",
    sigla: "ALI",
    arquetipo: "gigante_decadente",
    nivel: 6, // lanterna: elenco fraco de verdade, a simulação sente
    elenco: gerarElenco(rng, 6, nomesUsados),
  };

  const menino = {
    nome: gerarNomeJogador(rng, nomesUsados),
    apelido: null, // a torcida batiza no Ato 2
    posicao: "PON",
    idade: 16,
    atributos: { ...ATRIBUTOS_MENINO },
    geral: calcularGeral(ATRIBUTOS_MENINO, "PON"),
    potencial: 20,
    moral: 12,
    historia: {
      origem: "revelado no torneio de várzea do bairro",
      traco: "manda dinheiro pra mãe todo mês",
    },
  };

  const estado = {
    seed,
    caixa: entre(rng, 30, 42) * 1000, // R$ fictícios — três folhas atrasadas
    moralElenco: 9,
    exposicao: 0, // o quanto o empresário sabe do menino (pesa no Ato 3)
    escolhas: {},
    meninoNoElenco: false,
  };

  return { seed, rng, alianca, menino, estado, nomesUsados };
}

/** Registra uma decisão (id pode ser null para efeitos avulsos de cena). */
export function decidir(mundo, id, opcao, efeitos = {}) {
  if (id) mundo.estado.escolhas[id] = opcao;
  if (efeitos.caixa) mundo.estado.caixa += efeitos.caixa;
  if (efeitos.moralElenco) mundo.estado.moralElenco += efeitos.moralElenco;
  if (efeitos.moralMenino) mundo.menino.moral += efeitos.moralMenino;
  if (efeitos.exposicao) mundo.estado.exposicao += efeitos.exposicao;
  if (efeitos.contratado) {
    mundo.estado.meninoNoElenco = true;
    mundo.alianca.elenco.push(mundo.menino);
  }
  if (efeitos.venderMenino) {
    mundo.estado.meninoNoElenco = false;
    mundo.estado.meninoVendido = true;
    const i = mundo.alianca.elenco.indexOf(mundo.menino);
    if (i >= 0) mundo.alianca.elenco.splice(i, 1);
  }
  if (efeitos.meninoProRival) mundo.estado.meninoNoRival = true;
  if (efeitos.perderGoleiro) {
    const melhor = mundo.alianca.elenco
      .filter((j) => j.posicao === "GOL")
      .sort((x, y) => y.geral - x.geral)[0];
    mundo.alianca.elenco.splice(mundo.alianca.elenco.indexOf(melhor), 1);
  }
}
