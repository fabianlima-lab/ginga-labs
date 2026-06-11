// Teste do teaser (node teaser/teste.mjs): valida o mundo e a
// integridade dos roteiros sem precisar de navegador.

import assert from "node:assert/strict";
import { criarMundo, decidir } from "./mundo.mjs";
import { montarCampeonato, jogarPartida, criarDegola, atualizarDegola, lerDegola } from "./campeonato.mjs";
import { ATO0 } from "./roteiro/ato0.mjs";
import { ATO1 } from "./roteiro/ato1.mjs";
import { ABERTURA_ATO2, ABERTURAS_RODADA, PRE_JOGO, MANCHETES, DEGOLA, PRESIDENTE } from "./roteiro/ato2.mjs";
import { EVENTOS } from "./roteiro/eventos.mjs";
import { ABERTURA_ATO3, EMPRESARIO, FANTASMA, PRE_FINAL, INTERVALO, AOS_80, APITO_FINAL } from "./roteiro/ato3.mjs";
import { FINAIS, TOTAL_FINAIS } from "./roteiro/finais.mjs";
import { TATICAS, jogarTrecho, desfechoDegola } from "./campeonato.mjs";

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

// Ato 3: roteiros válidos, táticas das intervenções existem no motor.
validarCenas(ABERTURA_ATO3, "ABERTURA_ATO3");
validarCenas(EMPRESARIO, "EMPRESARIO");
validarCenas(FANTASMA, "FANTASMA");
validarCenas(PRE_FINAL, "PRE_FINAL");
validarCenas(APITO_FINAL, "APITO_FINAL");
for (const momento of [INTERVALO, AOS_80]) {
  assert.ok(momento.opcoes.length >= 2);
  for (const op of momento.opcoes) {
    assert.ok(TATICAS[op.id], `tática "${op.id}" da intervenção não existe no campeonato`);
  }
}

// Finais: TODA combinação de estado cai em exatamente um final (o primeiro que casar).
assert.ok(TOTAL_FINAIS >= 8 && TOTAL_FINAIS <= 12, "meta do design: 8–12 finais");
for (const f of FINAIS) {
  assert.ok(f.n && f.titulo && f.card && f.cenas.length > 0, `final ${f.n} incompleto`);
  validarCenas(f.cenas, `FINAIS/${f.n}`);
}
for (const escapou of [true, false])
  for (const trilho of ["segurou", "vendeu", "rival"])
    for (const golDoMenino of [true, false])
      for (const moralMenino of [5, 12, 16])
        for (const exposicao of [-1, 0, 2]) {
          const resumo = { escapou, trilho, golDoMenino, moralMenino, exposicao };
          const casados = FINAIS.filter((f) => f.condicao(resumo));
          assert.ok(casados.length >= 1, `nenhum final casa com ${JSON.stringify(resumo)}`);
        }

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

  // Ato 3 headless: final em três trechos, placar encadeado bate no fim.
  const finalAdv = advs[3];
  if (m.estado.meninoNoRival) finalAdv.elenco.push(m.menino);
  if (m.estado.meninoNoElenco && variante % 2 === 0) {
    percorrer(EMPRESARIO, m, (c) => c.opcoes[variante % c.opcoes.length]);
  }
  let placar;
  let golsTrechos = 0;
  let r3;
  const taticas = ["equilibrio", "pra_cima", "fechado"];
  for (const [i, janela] of [[1, 45], [46, 80], [81, 90]].entries()) {
    r3 = jogarTrecho(m, finalAdv, {
      minutoInicio: janela[0], minutoFim: janela[1], placar, mandante: false,
      tatica: taticas[(variante + i) % 3], abertura: i === 0, encerramento: i === 2,
    });
    placar = { [finalAdv.sigla]: r3.golsCasa, ALI: r3.golsFora };
    golsTrechos += r3.goleadores.length;
  }
  assert.equal(r3.golsCasa + r3.golsFora, golsTrechos, `variante ${variante}: placar dos trechos não bate com os gols`);
  const { escapou } = desfechoDegola(m, { pontosAlianca: 4, pontosRival: 4, rivalCurto: "X" }, r3.saldo);
  assert.equal(typeof escapou, "boolean");
  const resumo = {
    escapou,
    trilho: m.estado.meninoNoRival ? "rival" : m.estado.meninoVendido ? "vendeu" : "segurou",
    golDoMenino: r3.golsDoMenino > 0,
    moralMenino: m.menino.moral,
    exposicao: m.estado.exposicao,
  };
  assert.ok(FINAIS.some((f) => f.condicao(resumo)), `variante ${variante}: run real sem final`);
}

// Config do card: campos presentes; frases de card cabem num card.
const { CONFIG } = await import("./config.mjs");
assert.ok(CONFIG.nomeJogo && CONFIG.url, "config do card incompleta");
for (const f of FINAIS) {
  assert.ok(f.card.length <= 140, `card do final ${f.n} longo demais (${f.card.length})`);
}

console.log("teaser/teste.mjs: tudo verde ✔");
