// ATO 1 — A descoberta (min 1–5). Domingo, torneio de várzea do bairro.
// O jogador vê o menino, vê a ficha, e toma a Decisão 1. O jogo lembra.
// (rascunho do Claude — aguardando o diretor)
//
// Placeholders disponíveis: {menino} (nome do menino), {caixa} (caixa atual).

export const ATO1 = [
  {
    tipo: "fala",
    texto:
      "Domingo de manhã. Seu primeiro dia de folga em três semanas — que o olheiro do clube fez questão de estragar.",
  },
  {
    tipo: "fala",
    texto:
      "*\"Professor, confia em mim. Vai lá no campo do bairro hoje. Se eu tiver errado, nunca mais te peço nada.\"*",
  },
  {
    tipo: "fala",
    texto:
      "O campo é de terra, a trave tem mais ferrugem que tinta, e tem mais gente em volta do alambrado do que no último jogo do Aliança.",
  },
  { tipo: "continuar", rotulo: "Olhar o jogo" },
  {
    tipo: "radio",
    texto:
      "Não tem locutor aqui. Mas se tivesse, ele estaria gritando.",
  },
  {
    tipo: "fala",
    texto:
      "Um menino franzino, camisa duas vezes maior que ele, pega na bola pela primeira vez. Pisa em cima. Olha pro marcador. E o tempo... desacelera.",
  },
  {
    tipo: "fala",
    texto:
      "Passou por um. Passou por **dois**. O terceiro derruba ele com falta — e o menino levanta rindo.",
  },
  {
    tipo: "fala",
    texto:
      "O olheiro te entrega uma ficha amassada, escrita a lápis. Você lê duas vezes, porque na primeira não acreditou:",
  },
  { tipo: "ficha", jogador: "menino" },
  {
    tipo: "fala",
    texto:
      "{menino}, 16 anos. A ginga não se ensina. A frieza... a frieza se aprende. Talvez. Se alguém ensinar.",
  },
  {
    tipo: "fala",
    texto:
      "O caixa do clube tem **R$ {caixa}** — e três folhas salariais atrasadas. Contratar o menino é assinar com a família, pagar luvas, alojamento. Uns quinze mil que fariam falta no vestiário.",
  },
  {
    tipo: "escolha",
    id: "decisao1",
    opcoes: [
      {
        id: "contratar",
        rotulo: "Decisão",
        texto: "Contratar o menino. Talento assim não espera o clube se organizar.",
      },
      {
        id: "economizar",
        rotulo: "Decisão",
        texto: "Economizar pro salário do elenco. Quem salva o time do rebaixamento são os homens, não uma promessa.",
      },
    ],
    ramos: {
      contratar: [
        {
          tipo: "fala",
          texto:
            "Você atravessa o campo de terra antes do jogo acabar. A mãe do menino te olha desconfiada — já viram muito engravatado prometer mundos por ali.",
          efeitos: { caixa: -15000, contratado: true, moralElenco: -2 },
        },
        {
          tipo: "fala",
          texto:
            "*\"Eu não prometo que ele vira craque, dona. Prometo que enquanto for comigo, ninguém usa o seu filho.\"* Ela aperta sua mão. Sua mão, dessa vez, é que tá suando.",
        },
        {
          tipo: "fala",
          texto:
            "Segunda-feira, o vestiário recebe a notícia em silêncio. Três meses sem salário, e o clube foi às compras. Tem conversa pelos cantos.",
        },
      ],
      economizar: [
        {
          tipo: "fala",
          texto:
            "Você dobra a ficha e devolve. O olheiro não diz nada — só guarda o lápis atrás da orelha e olha o resto do jogo calado.",
          efeitos: { moralElenco: 2 },
        },
        {
          tipo: "fala",
          texto:
            "Segunda-feira, o salário de um mês cai na conta do elenco. O capitão te cumprimenta com um aceno que vale um discurso. O vestiário tá com você.",
        },
        {
          tipo: "fala",
          texto:
            "Mas terça-feira o olheiro aparece na sua sala e deixa a ficha amassada em cima da mesa, sem falar nada. Ela fica ali. Te olhando.",
        },
      ],
    },
  },
];
