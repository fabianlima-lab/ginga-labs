// O recorte do campeonato que o teaser precisa: 4 jogos pra escapar da degola.
// Adversários saem do gerador real de clubes; a tabela é um duelo direto
// contra o outro afundado — simples de ler, impossível de ignorar.

import { gerarClube, ARQUETIPOS } from "../src/clubes.mjs";
import { simularPartida } from "../src/partida.mjs";

// Arquétipos dos 4 adversários, em ordem de jogo (drama crescente):
// um favorito pra apanhar bonito, dois tamanho justo, e a final contra
// o projeto do investidor — o mesmo empresário que ronda o menino.
const OPONENTES = ["time_de_massa", "interior_raiz", "tradicional_medio", "projeto_investidor"];

export function montarCampeonato(mundo) {
  const { rng, nomesUsados } = mundo;
  const toponimos = new Set();
  return OPONENTES.map((id) =>
    gerarClube(rng, toponimos, nomesUsados, ARQUETIPOS.find((a) => a.id === id))
  );
}

// A moral do menino entra em campo: confiança vira frieza, abalo apaga a ginga.
function comMoralAplicada(mundo, jogar) {
  const { menino, estado } = mundo;
  const originais = { ...menino.atributos };
  if (estado.meninoNoElenco || estado.meninoNoRival) {
    if (menino.moral >= 14) {
      menino.atributos.frieza = Math.min(20, menino.atributos.frieza + 2);
      menino.atributos.finalizacao = Math.min(20, menino.atributos.finalizacao + 1);
    } else if (menino.moral <= 8) {
      menino.atributos.frieza = Math.max(1, menino.atributos.frieza - 2);
      menino.atributos.ginga = Math.max(1, menino.atributos.ginga - 1);
    }
  }
  try {
    return jogar();
  } finally {
    menino.atributos = originais;
  }
}

function lerResultado(mundo, resultado, mandante) {
  const golsAli = mandante ? resultado.golsCasa : resultado.golsFora;
  const golsAdv = mandante ? resultado.golsFora : resultado.golsCasa;
  const saldo = golsAli > golsAdv ? "vitoria" : golsAli < golsAdv ? "derrota" : "empate";
  const golsDoMenino = resultado.goleadores.filter((g) => g.nome === mundo.menino.nome).length;
  return { ...resultado, golsAli, golsAdv, saldo, golsDoMenino };
}

/** Joga uma rodada inteira de uma vez (Ato 2). */
export function jogarPartida(mundo, adversario, { mandante = true } = {}) {
  return comMoralAplicada(mundo, () => {
    const casa = mandante ? mundo.alianca : adversario;
    const fora = mandante ? adversario : mundo.alianca;
    const resultado = simularPartida(mundo.rng, casa, fora, { narrar: true });
    return lerResultado(mundo, resultado, mandante);
  });
}

// Posturas táticas da final: bônus aplicado só ao lado do Aliança.
export const TATICAS = {
  pra_cima: { ataque: 2, defesa: -1.5 },
  equilibrio: {},
  fechado: { ataque: -1.5, defesa: 2 },
};

/**
 * Joga um TRECHO da final (Ato 3): a partida para no intervalo e aos 80'
 * pra intervenção tática. `placar` encadeia os trechos.
 */
export function jogarTrecho(mundo, adversario, opcoes) {
  const { mandante = false, minutoInicio, minutoFim, placar, tatica = "equilibrio", abertura = false, encerramento = false } = opcoes;
  return comMoralAplicada(mundo, () => {
    const casa = mandante ? mundo.alianca : adversario;
    const fora = mandante ? adversario : mundo.alianca;
    const bonus = TATICAS[tatica];
    const resultado = simularPartida(mundo.rng, casa, fora, {
      narrar: true,
      minutoInicio,
      minutoFim,
      placarInicial: placar,
      abertura,
      encerramento,
      ...(mandante ? { bonusCasa: bonus } : { bonusFora: bonus }),
    });
    return lerResultado(mundo, resultado, mandante);
  });
}

/** Tabela-duelo: Aliança contra o outro afundado, o {rival}. */
export function criarDegola(mundo) {
  const rival = gerarClube(mundo.rng, new Set(), mundo.nomesUsados);
  return {
    rivalNome: rival.nome,
    rivalCurto: rival.curto,
    pontosAlianca: 0,
    pontosRival: 0,
  };
}

const PONTOS = { vitoria: 3, empate: 1, derrota: 0 };

export function atualizarDegola(mundo, degola, saldo) {
  degola.pontosAlianca += PONTOS[saldo];
  // o rival joga a rodada dele em outro estádio: pesado pra baixo,
  // afinal ele também é um afundado
  const sorteio = mundo.rng();
  degola.pontosRival += sorteio < 0.3 ? 3 : sorteio < 0.62 ? 1 : 0;
  return degola;
}

/** A última rodada do rival acontece longe — e decide tanto quanto a sua. */
export function desfechoDegola(mundo, degola, saldoAlianca) {
  degola.pontosAlianca += PONTOS[saldoAlianca];
  const sorteio = mundo.rng();
  const saldoRival = sorteio < 0.3 ? "vitoria" : sorteio < 0.62 ? "empate" : "derrota";
  degola.pontosRival += PONTOS[saldoRival];
  // empate em pontos: cai o Aliança — o critério é o absurdo de sempre
  return { escapou: degola.pontosAlianca > degola.pontosRival, saldoRival };
}

export function lerDegola(degola) {
  const dif = degola.pontosAlianca - degola.pontosRival;
  if (dif > 2) return { tom: "respira", dif };
  if (dif >= 0) return { tom: "fio", dif };
  return { tom: "afundando", dif };
}
