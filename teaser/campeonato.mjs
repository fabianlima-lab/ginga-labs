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

/**
 * Joga uma rodada: aplica o efeito da moral do menino nos atributos
 * (frieza sobe com confiança, despenca abalado), simula com narração,
 * restaura. Devolve o resultado + leitura do jogo.
 */
export function jogarPartida(mundo, adversario, { mandante = true } = {}) {
  const { rng, alianca, menino, estado } = mundo;

  const originais = { ...menino.atributos };
  if (estado.meninoNoElenco) {
    if (menino.moral >= 14) {
      menino.atributos.frieza = Math.min(20, menino.atributos.frieza + 2);
      menino.atributos.finalizacao = Math.min(20, menino.atributos.finalizacao + 1);
    } else if (menino.moral <= 8) {
      menino.atributos.frieza = Math.max(1, menino.atributos.frieza - 2);
      menino.atributos.ginga = Math.max(1, menino.atributos.ginga - 1);
    }
  }

  const casa = mandante ? alianca : adversario;
  const fora = mandante ? adversario : alianca;
  const resultado = simularPartida(rng, casa, fora, { narrar: true });
  menino.atributos = originais;

  const golsAli = mandante ? resultado.golsCasa : resultado.golsFora;
  const golsAdv = mandante ? resultado.golsFora : resultado.golsCasa;
  const saldo = golsAli > golsAdv ? "vitoria" : golsAli < golsAdv ? "derrota" : "empate";
  const golsDoMenino = resultado.goleadores.filter((g) => g.nome === menino.nome).length;

  return { ...resultado, golsAli, golsAdv, saldo, golsDoMenino };
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

export function lerDegola(degola) {
  const dif = degola.pontosAlianca - degola.pontosRival;
  if (dif > 2) return { tom: "respira", dif };
  if (dif >= 0) return { tom: "fio", dif };
  return { tom: "afundando", dif };
}
