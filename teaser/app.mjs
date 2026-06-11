// Várzea — teaser jogável. Orquestra as cenas; o texto vive em roteiro/.
// Os módulos do motor (../src) são os mesmos do CLI: um mundo, dois palcos.

import { armarAceleracao, fala, limpar, continuar, escolher } from "./maquina.mjs";
import { ATO0 } from "./roteiro/ato0.mjs";

const palco = document.getElementById("palco");
armarAceleracao(palco);

async function tocarCena(cenas) {
  for (const cena of cenas) {
    if (cena.tipo === "fala") await fala(palco, cena.texto, cena.classe);
    else if (cena.tipo === "radio") await fala(palco, cena.texto, "radio");
    else if (cena.tipo === "continuar") await continuar(palco, cena.rotulo);
    else if (cena.tipo === "escolha") return escolher(palco, cena.opcoes);
  }
}

async function principal() {
  await tocarCena(ATO0);
  limpar(palco);

  // Próximos PRs: Ato 1 (a descoberta), Ato 2 (o loop), Ato 3 (o dilema).
  await fala(palco, "*— fim do trecho disponível nesta versão —*");
  await fala(palco, "O torneio de várzea é domingo. O olheiro jurou que valia a pena ir.");
}

principal();
