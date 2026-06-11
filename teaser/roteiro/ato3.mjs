// ATO 3 — O dilema final (min 15–18): o empresário, a mãe, a última partida.
// (rascunho do Claude — aguardando o diretor)
//
// Placeholders: {menino}, {adversario}, {rival}, {proposta}, {pontosAli}, {pontosRival}

export const ABERTURA_ATO3 = [
  {
    tipo: "fala",
    texto:
      "**Última rodada.** O adversário: {adversario} — o clube do investidor, dinheiro novo, métodos estranhos. A conta da degola: Aliança {pontosAli}, {rival} {pontosRival}. Eles também jogam no domingo. Não depende só de você. Nunca dependeu.",
  },
];

// O empresário aparece na terça. A proposta cresce com a exposição do menino.
export const EMPRESARIO = [
  {
    tipo: "fala",
    texto:
      "Terça-feira, o carro de vidro fumê para na porta do CT — e dessa vez a porta abre. O empresário tem um relógio que custa o seu ano e um sorriso que custa mais caro ainda.",
  },
  {
    tipo: "fala",
    texto:
      "*\"Proposta do grande da capital: **R$ {proposta}** pelo menino. À vista. Resolve teu salário atrasado, resolve tua folha, resolve tua vida, professor.\"* Ele deixa o contrato na mesa. *\"Vale até sexta.\"*",
  },
  {
    tipo: "fala",
    texto:
      "Você sabe o que acontece com menino de dezesseis anos que sobe cedo demais pra banco de clube grande. A cidade tem dois ou três exemplos andando por aí. Um deles é roupeiro.",
  },
  {
    tipo: "fala",
    texto:
      "Quinta à noite, a mãe do menino te liga. Não pergunta de contrato, não pergunta de valor. Pergunta baixinho, de pai pra pai: *\"O senhor deixaria ir, se fosse o seu?\"*",
  },
  {
    tipo: "escolha",
    id: "decisao_final",
    opcoes: [
      {
        id: "vender",
        rotulo: "O dilema",
        texto: "Aceitar a venda. O dinheiro salva o clube AGORA — e segurar o sonho dos outros também é um tipo de soberba.",
      },
      {
        id: "segurar",
        rotulo: "O dilema",
        texto: "Recusar e dizer a ela a verdade: \"ainda não. Lá ele vira banco; aqui ele vira jogador.\"",
      },
    ],
    ramos: {
      vender: [
        {
          tipo: "fala",
          efeitos: { venderMenino: true, moralElenco: 3 },
          texto:
            "Sexta-feira o contrato sai assinado e o dinheiro cai na conta. A folha atrasada é paga no mesmo dia — tem jogador chorando no vestiário com o comprovante na mão. O menino vem se despedir com o agasalho novo do clube grande, dois números maior. *\"Obrigado por tudo, professor.\"* Você não joga a final com ele. Você joga a final por ele.",
        },
      ],
      segurar: [
        {
          tipo: "fala",
          efeitos: { moralMenino: 3, moralElenco: -1 },
          texto:
            "Você responde a verdade pra mãe — e ela fica em silêncio um tempo do tamanho de uma vida. *\"Então segura ele, professor. Mas segura DE VERDADE.\"* Sexta, o empresário recolhe o contrato sem desfazer o sorriso: *\"Volto no fim do ano. Eles sempre assinam no fim do ano.\"* No vestiário, tem veterano fazendo a conta do salário que não veio.",
        },
      ],
    },
  },
];

// Se o menino foi pro rival (recusado duas vezes), não tem proposta — tem fantasma.
export const FANTASMA = [
  {
    tipo: "fala",
    texto:
      "O jornal da quinta traz a entrevista do menino — agasalho do {adversario}, sorriso de estreia: *\"O Aliança? Foram me ver na várzea. Não quiseram. Tá tudo certo, cada um tem o seu caminho.\"* Não tem mágoa na frase. É pior: tem paz.",
  },
  {
    tipo: "fala",
    texto:
      "Domingo ele joga contra você. A ficha amassada continua na gaveta da sua mesa. Você não teve coragem de jogar fora.",
  },
  { tipo: "continuar", rotulo: "Ir pra final" },
];

export const PRE_FINAL = [
  {
    tipo: "fala",
    texto:
      "Domingo. O estádio recebe o maior público do ano — degola enche mais que título, porque medo é mais pontual que esperança. O vestiário não precisa de discurso. Você dá um mesmo assim, de três palavras: *\"Olha pra cima.\"*",
  },
  { tipo: "continuar", rotulo: "Bola rolando" },
];

// Intervenções táticas: no intervalo e aos 80'. O texto muda, o bônus é o mesmo.
export const INTERVALO = {
  pergunta: "Intervalo. Quinze minutos que são seus. O que você muda?",
  opcoes: [
    { id: "pra_cima", rotulo: "Tática", texto: "Pra cima deles: dois atacantes, lateral virando ponta, e que Deus nos ajude." },
    { id: "equilibrio", rotulo: "Tática", texto: "Manter o plano: o jogo tá sendo o que a gente treinou. Confia." },
    { id: "fechado", rotulo: "Tática", texto: "Fechar a casa: linha de cinco, volante na sobra, e sair no veneno." },
  ],
};

export const AOS_80 = {
  pergunta: "Aos 80 minutos, o jogo inteiro cabe na sua próxima decisão.",
  opcoes: [
    { id: "pra_cima", rotulo: "Tática", texto: "Tudo ou nada: até o zagueiro de cabeça boa vai pra área." },
    { id: "equilibrio", rotulo: "Tática", texto: "Cabeça fria: quem se desespera aos 80 entrega aos 85." },
    { id: "fechado", rotulo: "Tática", texto: "Trancar o resultado: cera, bandeirinha de escanteio, futebol de guerra." },
  ],
};

export const APITO_FINAL = [
  {
    tipo: "fala",
    texto: "O árbitro olha pro relógio. Leva o apito à boca. E o estádio inteiro morre e nasce no mesmo segundo.",
  },
];
