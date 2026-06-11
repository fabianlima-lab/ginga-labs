// Clubes-arquétipo: cada clube fictício nasce com identidade, contexto e nível.
// O arquétipo não é cosmético — define orçamento, pressão da torcida e narrativa.

import { entre, escolher } from "./rng.mjs";
import { gerarIdentidadeClube } from "./nomes.mjs";
import { gerarElenco } from "./jogadores.mjs";

export const ARQUETIPOS = [
  {
    id: "gigante_decadente",
    rotulo: "Gigante decadente",
    nivel: [12, 15],
    contexto: "Já foi campeão estadual sete vezes. Hoje deve três meses de salário e a torcida cobra como se fosse 1985.",
  },
  {
    id: "time_de_massa",
    rotulo: "Time de massa",
    nivel: [11, 14],
    contexto: "A maior torcida da região. Estádio cheio até na Série D, pressão de Libertadores em jogo de estadual.",
  },
  {
    id: "ferroviario",
    rotulo: "Clube ferroviário",
    nivel: [8, 12],
    contexto: "Fundado pelos operários da estrada de ferro. A diretoria é eleita no sindicato e o churrasco pós-jogo é sagrado.",
  },
  {
    id: "colonia",
    rotulo: "Clube de colônia",
    nivel: [8, 12],
    contexto: "Fundado por imigrantes há um século. Organizado, contas em dia, mas a base anda esquecida.",
  },
  {
    id: "interior_raiz",
    rotulo: "Raiz do interior",
    nivel: [6, 10],
    contexto: "O campo tem ondulação e a arquibancada é de madeira. Todo grande clube da capital odeia jogar aqui.",
  },
  {
    id: "projeto_investidor",
    rotulo: "Projeto de investidor",
    nivel: [10, 14],
    contexto: "Um empresário misterioso comprou o clube ano passado. Dinheiro novo, métodos estranhos, promessas grandes.",
  },
  {
    id: "varzea_promovida",
    rotulo: "Várzea promovida",
    nivel: [5, 9],
    contexto: "Subiu da segunda divisão estadual com time de peneira e raça. Ninguém aqui tem empresário. Ainda.",
  },
  {
    id: "tradicional_medio",
    rotulo: "Tradicional de meio de tabela",
    nivel: [9, 12],
    contexto: "Nunca brilha, nunca cai. O sócio mais antigo jura que este é o ano — jura isso desde 1992.",
  },
];

export function gerarClube(rng, toponimosUsados, nomesUsados, arquetipoForcado) {
  const arquetipo = arquetipoForcado ?? escolher(rng, ARQUETIPOS);
  const identidade = gerarIdentidadeClube(rng, toponimosUsados);
  const nivel = entre(rng, arquetipo.nivel[0], arquetipo.nivel[1]);

  return {
    ...identidade,
    arquetipo: arquetipo.id,
    rotuloArquetipo: arquetipo.rotulo,
    contexto: arquetipo.contexto,
    nivel,
    caixa: nivel * entre(rng, 8, 15) * 1000, // em R$ fictícios
    moralTorcida: entre(rng, 6, 16),
    elenco: gerarElenco(rng, nivel, nomesUsados),
  };
}

export function gerarClubes(rng, quantidade) {
  const toponimosUsados = new Set();
  const nomesUsados = new Set();
  const clubes = [];
  // garante diversidade: um de cada arquétipo primeiro, depois sorteia
  for (let i = 0; i < quantidade; i++) {
    const forcado = i < ARQUETIPOS.length ? ARQUETIPOS[i] : undefined;
    clubes.push(gerarClube(rng, toponimosUsados, nomesUsados, forcado));
  }
  return clubes;
}
