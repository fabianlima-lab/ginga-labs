// Teste do teaser (node teaser/teste.mjs): valida o mundo e a
// integridade dos roteiros sem precisar de navegador.

import assert from "node:assert/strict";
import { criarMundo, decidir } from "./mundo.mjs";
import { ATO0 } from "./roteiro/ato0.mjs";
import { ATO1 } from "./roteiro/ato1.mjs";

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

// O motor de partida aceita o Aliança reforçado (fumaça de integração).
const { simularPartida } = await import("../src/partida.mjs");
const { gerarClubes } = await import("../src/clubes.mjs");
const { criarRng } = await import("../src/rng.mjs");
const rng = criarRng(7);
const [rival] = gerarClubes(rng, 1);
const resultado = simularPartida(rng, a.alianca, rival, { narrar: true });
assert.ok(resultado.narracao.length > 0, "partida com o Aliança narra normalmente");

console.log("teaser/teste.mjs: tudo verde ✔");
