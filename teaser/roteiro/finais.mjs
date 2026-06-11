// OS FINAIS — o epílogo da run, escolhido pela primeira condição que casar.
// (rascunho do Claude — aguardando o diretor)
//
// `resumo` recebido pela condição:
//   escapou        o Aliança ficou na primeira divisão?
//   trilho         "segurou" | "vendeu" | "rival"  (rival = recusado 2x, jogou contra)
//   golDoMenino    o menino marcou na final (por você ou contra você)
//   moralMenino    moral do menino no apito final
//   exposicao      o quanto o empresário sabia
//
// O `card` é a frase compartilhável (estilo Wordle) — PR do card usa isso.

export const FINAIS = [
  {
    n: 1,
    titulo: "Nasceu um craque",
    condicao: (r) => r.trilho === "segurou" && r.escapou && r.golDoMenino,
    cenas: [
      { tipo: "fala", texto: "O gol da salvação tem dezesseis anos e o nome que você leu numa ficha amassada. A arquibancada grita esse nome até a voz acabar — e a cidade, segunda-feira, acorda sabendo que viu o começo de alguma coisa." },
      { tipo: "fala", texto: "O empresário volta no fim do ano, como prometeu. Mas agora quem decide o preço é você. E quem decide o momento é a mãe dele. Do jeito que devia ser." },
    ],
    card: "Salvei o Aliança com gol do Craque da Várzea. A cidade sabe o nome dele. Eu li primeiro.",
  },
  {
    n: 2,
    titulo: "O projeto",
    condicao: (r) => r.trilho === "segurou" && r.escapou,
    cenas: [
      { tipo: "fala", texto: "Escapou. Sem brilho, sem manchete, do jeito que se escapa de verdade: no suor dos onze. O menino terminou o jogo exausto e sorrindo, aprendendo o que nenhuma várzea ensina — perder o medo dos grandes." },
      { tipo: "fala", texto: "Ano que vem tem estadual de novo. E dessa vez, o Aliança tem um projeto. Você segurou a peça mais difícil de segurar: o futuro." },
    ],
    card: "Salvei o Aliança e segurei o Craque da Várzea. O projeto continua. — sobrevivi pra sonhar",
  },
  {
    n: 3,
    titulo: "Caíram juntos, sobem juntos",
    condicao: (r) => r.trilho === "segurou" && !r.escapou && r.moralMenino >= 13,
    cenas: [
      { tipo: "fala", texto: "Caiu. A palavra desce seca, sem anestesia. Mas na segunda-feira, quando você chega no CT esperando o vestiário vazio, o menino tá lá. Primeiro a chegar. *\"Segunda divisão também tem gol, professor.\"*" },
      { tipo: "fala", texto: "A mãe manda outro bolo de fubá. O bilhete diz só: *\"O senhor segurou. Agora aguenta.\"* Você cola na porta da sua sala." },
    ],
    card: "Caí com o Aliança — e o Craque da Várzea caiu junto, por escolha. Ano que vem a gente volta.",
  },
  {
    n: 4,
    titulo: "O peso da queda",
    condicao: (r) => r.trilho === "segurou" && !r.escapou,
    cenas: [
      { tipo: "fala", texto: "Caiu. E na queda, todo mundo faz a mesma conta cruel: os vinte e cinco mil do menino eram o salário que faltou, o reforço que não veio, o ponto que não se conquistou. A conta é injusta. Contas de rebaixamento sempre são." },
      { tipo: "fala", texto: "O empresário liga na segunda-feira. Na segunda divisão, a proposta vale metade — e agora o clube precisa do dobro. O menino treina calado, sabendo que virou moeda. Você o segurou pra protegê-lo do banco. A vida tem ironia de sobra." },
    ],
    card: "Caí com o Aliança segurando o Craque da Várzea. Proteger também tem preço. — alguém pagou",
  },
  {
    n: 5,
    titulo: "O preço da salvação",
    condicao: (r) => r.trilho === "vendeu" && r.escapou && r.exposicao >= 2,
    cenas: [
      { tipo: "fala", texto: "Escapou — com o time pago, o presidente sorrindo e a foto do menino no jornal da capital, de agasalho novo, no banco de reservas. Você fez a matéria que o expôs e a venda que o entregou. O empresário te manda uma garrafa de uísque com um cartão: *\"Bom trabalho, sócio.\"*" },
      { tipo: "fala", texto: "Você não abre a garrafa. Mas também não devolve. É exatamente esse o tamanho do desconforto que vai durar." },
    ],
    card: "Salvei o Aliança vendendo o Craque da Várzea — que eu mesmo coloquei na vitrine. O uísque tá fechado até hoje.",
  },
  {
    n: 6,
    titulo: "A salvação tem recibo",
    condicao: (r) => r.trilho === "vendeu" && r.escapou,
    cenas: [
      { tipo: "fala", texto: "Escapou. Salário em dia, clube vivo, missão cumprida — é isso que você repete no espelho, e o espelho quase acredita. No clube grande, o menino estreia com sete minutos no segundo tempo e some da súmula por três meses." },
      { tipo: "fala", texto: "Às vezes chega notícia: que pediu pra voltar, que a capital é grande demais, que a ginga no treino ainda assombra. Você salvou um clube inteiro. Era o trabalho. Ninguém disse que o trabalho tinha o rosto de um menino." },
    ],
    card: "Salvei o Aliança do rebaixamento, mas vendi o Craque da Várzea. Ele nunca mais foi o mesmo.",
  },
  {
    n: 7,
    titulo: "Tudo por nada",
    condicao: (r) => r.trilho === "vendeu" && !r.escapou,
    cenas: [
      { tipo: "fala", texto: "Caiu. Com o dinheiro da venda na conta e o rebaixamento no peito — a combinação mais amarga que esse esporte fabrica. O clube tá pago, organizado e na segunda divisão. O menino tá no banco de um clube grande, e você no banco dos réus da cidade inteira." },
      { tipo: "fala", texto: "Anos depois, vão lembrar dessa temporada com uma frase só: *\"vendeu o menino e caiu mesmo assim\"*. Você sabe que foi mais complicado que isso. A arquibancada não cobra complexidade." },
    ],
    card: "Vendi o Craque da Várzea pra salvar o Aliança. Caí mesmo assim. — futebol não tem recibo",
  },
  {
    n: 8,
    titulo: "A caneta que não doeu",
    condicao: (r) => r.trilho === "rival" && r.escapou && r.golDoMenino,
    cenas: [
      { tipo: "fala", texto: "Ele marcou contra você — claro que marcou, o roteiro nunca perdoa. Mas os seus onze marcaram mais. O Aliança escapa com o time que você escolheu pagar em dia, e o menino atravessa o campo no apito final pra te dar um abraço que o estádio inteiro fotografa." },
      { tipo: "fala", texto: "*\"O senhor não me quis, professor. Mas o time do senhor foi o único que eu tive medo.\"* Tem derrotas que escolhem ser elogio." },
    ],
    card: "O Craque da Várzea que eu recusei marcou contra mim. Escapei mesmo assim. — final com abraço",
  },
  {
    n: 9,
    titulo: "Os homens de aço",
    condicao: (r) => r.trilho === "rival" && r.escapou,
    cenas: [
      { tipo: "fala", texto: "Escapou — sem joia, sem milagre, com onze homens pagos em dia e um vestiário que fechou com você desde a várzea. O menino jogou bonito do outro lado, mas bonito não vence sempre. Raça, às vezes, vence." },
      { tipo: "fala", texto: "No churrasco da salvação, o capitão levanta o copo: *\"Ao professor, que escolheu a gente.\"* Foi a escolha mais cara da sua carreira. Hoje, é só hoje, ela parece barata." },
    ],
    card: "Recusei o Craque da Várzea duas vezes e salvei o Aliança com os homens. O vestiário era o talento.",
  },
  {
    n: 10,
    titulo: "A conta chegou",
    condicao: (r) => r.trilho === "rival" && !r.escapou && r.golDoMenino,
    cenas: [
      { tipo: "fala", texto: "O gol que te rebaixa nasce de uma ginga que você viu primeiro, numa várzea, numa ficha amassada escrita a lápis. Ele não comemora. Fica parado, olhando pro seu banco, e o estádio inteiro entende a frase que não foi dita." },
      { tipo: "fala", texto: "No vestiário, a ficha continua na gaveta. Você finalmente joga fora. Depois volta no lixo e pega de novo. Algumas decisões a gente erra duas vezes — guardar essa, você decide errar pra sempre." },
    ],
    card: "Recusei o Craque da Várzea. Ele me rebaixou com a ginga que eu vi primeiro. — Final mais cruel do jogo",
  },
  {
    n: 11,
    titulo: "A ficha na mesa",
    condicao: (r) => r.trilho === "rival" && !r.escapou,
    cenas: [
      { tipo: "fala", texto: "Caiu. Nem foi o menino — ele até jogou mal, nervoso na primeira final da vida. Foi o conjunto: o estadual é cruel com quem hesita, e você hesitou na várzea, hesitou no caixa, hesitou onde não dava." },
      { tipo: "fala", texto: "Limpando a sala, você acha a ficha amassada. Ginga 18, marra 16, frieza 8, raça 14, a lápis. Dobra com cuidado e deixa em cima da mesa, pro próximo treinador. Com um bilhete: *\"Da próxima vez, acredita no olheiro.\"*" },
    ],
    card: "Recusei o Craque da Várzea e caí com o Aliança. Deixei a ficha pro próximo. — aprendam comigo",
  },
];

export const TOTAL_FINAIS = FINAIS.length;
