// Várzea — teaser jogável. Orquestra as cenas; o texto vive em roteiro/.
// Os módulos do motor (../src) são os mesmos do CLI: um mundo, dois palcos.

import { armarAceleracao, fala, limpar, continuar, escolher } from "./maquina.mjs";
import { criarMundo, decidir } from "./mundo.mjs";
import { ATO0 } from "./roteiro/ato0.mjs";
import { ATO1 } from "./roteiro/ato1.mjs";

const palco = document.getElementById("palco");
armarAceleracao(palco);

const mundo = criarMundo();

// Placeholders que o roteiro pode usar nas falas.
function preencher(texto) {
  const dados = {
    menino: mundo.menino.nome,
    caixa: mundo.estado.caixa.toLocaleString("pt-BR"),
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

async function principal() {
  await tocarCenas(ATO0);
  limpar(palco);
  await tocarCenas(ATO1);
  limpar(palco);

  // Próximos PRs: Ato 2 (o loop de rodadas), Ato 3 (o dilema final).
  await fala(palco, "*— fim do trecho disponível nesta versão —*");
  if (mundo.estado.meninoNoElenco) {
    await fala(palco, `${mundo.menino.nome} treina com o elenco quarta-feira. O campeonato não espera.`);
  } else {
    await fala(palco, "A ficha continua na sua mesa. O campeonato não espera.");
  }
}

principal();
