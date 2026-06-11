// Teste do teaser (node teaser/teste.mjs): valida o mundo e a
// integridade dos roteiros sem precisar de navegador.

import assert from "node:assert/strict";
import { criarMundo, decidir } from "./mundo.mjs";
import { montarCampeonato, jogarPartida, criarDegola, atualizarDegola, lerDegola } from "./campeonato.mjs";
import { ATO0 } from "./roteiro/ato0.mjs";
import { ATO1 } from "./roteiro/ato1.mjs";
import { ABERTURA_ATO2, ABERTURAS_RODADA, PRE_JOGO, MANCHETES, DEGOLA, PRESIDENTE } from "./roteiro/ato2.mjs";
import { EVENTOS } from "./roteiro/eventos.mjs";

const TIPOS = new Set(["fala", "radio", "ficha", "continuar", "escolha"]);

function validarCenas(cenas, nome) {
  assert.ok(Array.isArray(cenas) && cenas.length > 0, `${nome}: vazio`);
  for (const cena of cenas) {
    assert.ok(TIPOS.has(cena.tipo), `${nome}: tipo desconhecido "${cena.tipo}"`);
    if (cena.tipo === "fala" || cena.tipo === "radio") {
      assert.equal(typeof cena.texto, "string", `${nome}: fala sem texto`);
    }
    if (cena.tipo === "escolha") {
      assert.ok(cena.id, `${nome}: escolha sem id`);
      assert.ok(cena.opcoes.length >= 2, `${nome}: escolha precisa de 2+ opções`);
      for (const op of cena.opcoes) {
        assert.ok(op.id && op.texto, `${nome}: opção incompleta em ${cena.id}`);
        assert.ok(cena.ramos?.[op.id], `${nome}: opção "${op.id}" sem ramo em ${cena.id}`);
        validarCenas(cena.ramos[op.id], `${nome}/${cena.id}/${op.id}`);
      }
    }
  }
}

validarCenas(ATO0, "ATO0");
validarCenas(ATO1, "ATO1");
validarCenas(ABERTURA_ATO2, "ABERTURA_ATO2");
for (const ev of EVENTOS) {
  assert.ok(ev.id && ev.se, `evento sem id/condição`);
  validarCenas(ev.cenas, `EVENTOS/${ev.id}`);
}
// O Ato 2 precisa de 3 eventos por trilho, senão alguma rodada fica sem decisão.
assert.ok(EVENTOS.filter((e) => e.se === "meninoNoElenco").length >= 3, "faltam eventos no trilho com o menino");
assert.ok(EVENTOS.filter((e) => e.se === "!meninoNoElenco").length >= 3, "faltam eventos no trilho sem o menino");
for (const grupo of [ABERTURAS_RODADA, PRE_JOGO, ...Object.values(MANCHETES)]) {
  assert.ok(grupo.length > 0, "grupo de textos do Ato 2 vazio");
}
assert.ok(DEGOLA.respira && DEGOLA.fio && DEGOLA.afundando, "leituras da degola incompletas");
assert.ok(PRESIDENTE.vitoria && PRESIDENTE.empate && PRESIDENTE.derrota, "falas do presidente incompletas");

// Mundo: reproduzível por seed, e o menino tem a ficha do design doc.
const a = criarMundo(1970);
const b = criarMundo(1970);
assert.equal(a.menino.nome, b.menino.nome, "mesmo seed deve dar o mesmo menino");
assert.equal(a.estado.caixa, b.estado.caixa, "mesmo seed deve dar o mesmo caixa");
assert.deepEqual(
  [a.menino.atributos.ginga, a.menino.atributos.marra, a.menino.atributos.frieza, a.menino.atributos.raca],
  [18, 16, 8, 14],
  "ficha do menino é fixa por design (docs/TEASER.md)"
);
assert.equal(a.alianca.elenco.length, 23, "Aliança nasce com elenco padrão");

// Decisões mexem no estado de verdade.
const caixaAntes = a.estado.caixa;
decidir(a, "decisao1", "contratar", { caixa: -15000, contratado: true, moralElenco: -2 });
assert.equal(a.estado.escolhas.decisao1, "contratar");
assert.equal(a.estado.caixa, caixaAntes - 15000);
assert.equal(a.alianca.elenco.length, 24, "contratar põe o menino no elenco");
assert.equal(a.estado.meninoNoElenco, true);

// Campeonato: adversários na ordem de drama certa, partida narra e restaura.
const adversarios = montarCampeonato(a);
assert.equal(adversarios.length, 4);
assert.deepEqual(
  adversarios.map((c) => c.arquetipo),
  ["time_de_massa", "interior_raiz", "tradicional_medio", "projeto_investidor"],
  "adversários do teaser têm arquétipos fixos em ordem"
);
const friezaAntes = a.menino.atributos.frieza;
const resultado = jogarPartida(a, adversarios[0], { mandante: true });
assert.ok(resultado.narracao.length > 0, "partida narra");
assert.ok(["vitoria", "empate", "derrota"].includes(resultado.saldo));
assert.equal(a.menino.atributos.frieza, friezaAntes, "moral não vaza pros atributos depois do jogo");

// Degola: contas batem.
const degola = criarDegola(a);
atualizarDegola(a, degola, "vitoria");
assert.equal(degola.pontosAlianca, 3);
assert.ok(["respira", "fio", "afundando"].includes(lerDegola(degola).tom));

// Playthrough headless: percorre todos os ramos de todos os eventos
// aplicando efeitos — nenhuma combinação pode quebrar o estado.
function percorrer(cenas, mundo, escolherOpcao) {
  for (const cena of cenas) {
    if (cena.efeitos) decidir(mundo, null, null, cena.efeitos);
    if (cena.tipo === "escolha") {
      const op = escolherOpcao(cena);
      decidir(mundo, cena.id, op.id);
      percorrer(cena.ramos[op.id], mundo, escolherOpcao);
    }
  }
}
for (let variante = 0; variante < 8; variante++) {
  const m = criarMundo(100 + variante);
  percorrer(ATO1, m, (c) => c.opcoes[variante % c.opcoes.length]);
  const advs = montarCampeonato(m);
  const usados = new Set();
  for (let rodada = 0; rodada < 3; rodada++) {
    const ev = EVENTOS.find(
      (e) => !usados.has(e.id) && (e.se.startsWith("!") ? !m.estado[e.se.slice(1)] : m.estado[e.se])
    );
    assert.ok(ev, `variante ${variante}: rodada ${rodada + 1} sem evento disponível`);
    usados.add(ev.id);
    percorrer(ev.cenas, m, (c) => c.opcoes[(variante >> rodada) % c.opcoes.length]);
    const r = jogarPartida(m, advs[rodada], { mandante: rodada % 2 === 0 });
    assert.ok(Number.isInteger(r.golsAli) && Number.isInteger(r.golsFora ?? 0));
  }
  assert.ok(m.estado.caixa > -50000, `variante ${variante}: caixa explodiu (${m.estado.caixa})`);
  const goleiros = m.alianca.elenco.filter((j) => j.posicao === "GOL");
  assert.ok(goleiros.length >= 1, `variante ${variante}: time sem goleiro`);
}

console.log("teaser/teste.mjs: tudo verde ✔");
