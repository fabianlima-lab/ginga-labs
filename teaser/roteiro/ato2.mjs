// ATO 2 — O loop (min 5–15): 3 rodadas de decisão → partida → consequência.
// Aqui ficam a moldura das rodadas e as manchetes do jornal fictício.
// (rascunho do Claude — aguardando o diretor)
//
// Placeholders: {menino}, {adversario}, {rival}, {golsAli}, {golsAdv}, {rodada}

export const ABERTURA_ATO2 = [
  {
    tipo: "fala",
    texto:
      "Restam **quatro rodadas** no estadual. O Aliança briga com o {rival} pra não cair — e time que cai pra segunda divisão estadual, nesse país, às vezes não volta nunca mais.",
  },
  { tipo: "continuar", rotulo: "Começar a semana" },
];

export const ABERTURAS_RODADA = [
  "**Rodada {rodada}.** O adversário da vez: {adversario}.",
  "**Rodada {rodada}.** Sábado tem {adversario} pela frente.",
  "**Rodada {rodada}.** A semana termina contra o {adversario}.",
];

export const PRE_JOGO = [
  "Dia de jogo. O vestiário tem cheiro de pomada e silêncio de igreja.",
  "Dia de jogo. A torcida que sobrou faz mais barulho que deveria ser possível.",
  "Dia de jogo. O gramado tá pesado da chuva de ontem — bom pra quem tem raça.",
];

// Manchetes do Correio da Cidade, escolhidas por resultado.
export const MANCHETES = {
  vitoria: [
    "ALIANÇA RESPIRA: vitória devolve esperança à torcida",
    "DEU ALIANÇA: três pontos que valem um mês de salário (que ninguém recebeu)",
  ],
  empate: [
    "PONTINHO MAGRO: Aliança empata e segue na corda bamba",
    "TUDO IGUAL: Aliança tropeça em si mesmo, mas não cai",
  ],
  derrota: [
    "ALIANÇA AFUNDA: derrota aproxima o clube do abismo",
    "NOITE PRA ESQUECER: Aliança perde e a diretoria some do estádio",
  ],
  golMenino: [
    "A JOIA DECIDE: gol de {menino}, 16 anos, sacode o estadual",
    "NASCEU UM CRAQUE? {menino} marca e a cidade aprende o nome dele",
  ],
};

// A leitura da degola depois da rodada, por tom.
export const DEGOLA = {
  respira: "Na conta da degola: Aliança {pontosAli}, {rival} {pontosRival}. Dá pra dormir. Uma noite.",
  fio: "Na conta da degola: Aliança {pontosAli}, {rival} {pontosRival}. Um tropeço e o telefone do presidente toca.",
  afundando: "Na conta da degola: Aliança {pontosAli}, {rival} {pontosRival}. Matematicamente vivo. Emocionalmente, depende do dia.",
};

// A ligação do presidente — fecha cada rodada com o peso do cargo.
export const PRESIDENTE = {
  vitoria: "*\"Tá vendo como dá? Continua assim que a gente conversa sobre aquele atrasado.\"* — e desliga antes de você responder.",
  empate: "*\"Empate pra quem tá embaixo é derrota com cortesia.\"* — silêncio — *\"mas o time lutou. Lutou, né?\"*",
  derrota: "*\"Eu não te trouxe pra cair, professor.\"* — a linha fica muda três segundos — *\"resolve.\"*",
};
