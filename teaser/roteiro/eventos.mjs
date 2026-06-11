// BANCO DE EVENTOS do Ato 2 — uma decisão narrativa antes de cada rodada.
// (rascunho do Claude — aguardando o diretor)
//
// Cada evento tem `se`: condição de estado ("meninoNoElenco" ou "!meninoNoElenco").
// Efeitos possíveis: caixa, moralElenco, moralMenino, exposicao, contratado.
// A moral do menino mexe na frieza dele em campo (campeonato.mjs) — decisão
// aqui vira gol (ou frango) ali. {menino} = nome do menino.

export const EVENTOS = [
  // ── trilho COM o menino ─────────────────────────────────────────────
  {
    id: "passagem",
    se: "meninoNoElenco",
    cenas: [
      {
        tipo: "fala",
        texto:
          "Quarta-feira, {menino} não aparece no treino. Quinta, de novo. O preparador já fala em dispensa: *\"começou assim com os outros, professor.\"*",
      },
      {
        tipo: "fala",
        texto:
          "Mas o roupeiro te puxa de canto: a mãe não teve o dinheiro da passagem essa semana. E o menino tem vergonha de dizer.",
      },
      {
        tipo: "escolha",
        id: "ev_passagem",
        opcoes: [
          { id: "pagar", rotulo: "Decisão", texto: "Pagar a passagem do seu bolso, sem alarde. Ninguém precisa saber." },
          { id: "cobrar", rotulo: "Decisão", texto: "Cobrar disciplina. Problema de casa se resolve em casa; aqui é profissional." },
          { id: "moto", rotulo: "Decisão", texto: "Mandar o roupeiro buscar o menino de moto todo dia. Vira logística do clube." },
        ],
        ramos: {
          pagar: [
            {
              tipo: "fala",
              efeitos: { moralMenino: 3, caixa: -200 },
              texto:
                "Você deixa o dinheiro com o roupeiro, que inventa uma história de \"ajuda de custo da federação\". Sexta-feira o menino treina como se devesse algo a alguém. Deve mesmo. Só não sabe a quem.",
            },
          ],
          cobrar: [
            {
              tipo: "fala",
              efeitos: { moralMenino: -3, moralElenco: 1 },
              texto:
                "Você manda o recado duro pelo preparador. O menino volta no sábado, treina calado, não olha na sua cara. O vestiário aprova: *\"aqui não tem estrela\"*. Mas alguma coisa apagou no olho do garoto.",
            },
          ],
          moto: [
            {
              tipo: "fala",
              efeitos: { moralMenino: 2, caixa: -600 },
              texto:
                "O roupeiro adora: virou \"motorista oficial da joia\". O elenco faz piada, o menino chega cedo e sai por último. A mãe manda um bolo de fubá embrulhado em pano de prato. O clube gasta uma gasolina que não tinha.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "lateral",
    se: "meninoNoElenco",
    cenas: [
      {
        tipo: "fala",
        texto:
          "O lateral mais velho do elenco — onze anos de clube, três rebaixamentos evitados — para você no corredor: *\"Professor, com todo respeito: esse moleque se acha. Dribla em cima dos companheiro no treino, ri. Aqui se sua a camisa.\"*",
      },
      {
        tipo: "escolha",
        id: "ev_lateral",
        opcoes: [
          { id: "conversar", rotulo: "Decisão", texto: "Chamar os dois pra conversar. Veterano ensina, menino escuta — e vice-versa." },
          { id: "punir", rotulo: "Decisão", texto: "Punir o menino: roda de drible acabou. Humildade se aprende no banco." },
          { id: "vestiario", rotulo: "Decisão", texto: "Deixar o vestiário resolver. Sempre se resolveu sozinho, antes de você chegar." },
        ],
        ramos: {
          conversar: [
            {
              tipo: "fala",
              efeitos: { moralMenino: 1, moralElenco: 1 },
              texto:
                "A conversa começa travada e termina com o lateral contando do dia em que driblou um campeão da Libertadores — *\"aí ele me deu uma cotovelada que eu vi o ônibus de volta pra casa\"*. O menino ri. O lateral ri. Não vira amizade, mas vira respeito.",
            },
          ],
          punir: [
            {
              tipo: "fala",
              efeitos: { moralMenino: -2, moralElenco: 2 },
              texto:
                "Sábado o menino assiste ao rachão do banco, mascando o gosto da injustiça. O vestiário fecha com você — *\"é disso que o grupo precisa\"* — mas a ginga, quando volta pro campo, vem com menos alegria dentro.",
            },
          ],
          vestiario: [
            {
              tipo: "fala",
              efeitos: { moralMenino: -1 },
              texto:
                "Terça-feira o treino tem dividida que vale tornozelo. O menino leva três pancadas, levanta as três — **marra 16 não pede arnica**. Na quarta pancada, devolve uma caneta tão cruel que o próprio lateral aplaude. O vestiário resolveu. Resolveu do jeito do vestiário.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "reporter",
    se: "meninoNoElenco",
    cenas: [
      {
        tipo: "fala",
        texto:
          "Um repórter do jornal da cidade liga três vezes no mesmo dia. Quer uma matéria de página inteira: **\"A joia da várzea que pode salvar o Aliança\"**. Foto, entrevista, a história da mãe.",
      },
      {
        tipo: "fala",
        texto:
          "Publicidade é ingresso vendido — e o caixa agradece. Mas é também o nome do menino na boca de todo empresário num raio de trezentos quilômetros.",
      },
      {
        tipo: "escolha",
        id: "ev_reporter",
        opcoes: [
          { id: "expor", rotulo: "Decisão", texto: "Liberar a matéria. O clube precisa de bilheteria e o menino precisa de vitrine." },
          { id: "proteger", rotulo: "Decisão", texto: "Segurar a matéria. Promessa exposta cedo demais vira manchete de fracasso." },
        ],
        ramos: {
          expor: [
            {
              tipo: "fala",
              efeitos: { exposicao: 2, caixa: 4000, moralMenino: 1 },
              texto:
                "A matéria sai no domingo com o menino na capa, segurando a bola como quem segura o mundo. A bilheteria do próximo jogo dobra. Na segunda, um carro com vidro fumê estaciona em frente ao treino e fica lá, parado, o treino inteiro.",
            },
          ],
          proteger: [
            {
              tipo: "fala",
              efeitos: { exposicao: -1, moralMenino: 1 },
              texto:
                "Você dá ao repórter uma entrevista sobre \"o coletivo\" tão sem graça que nem ele consegue aproveitar. O menino segue anônimo mais um pouco. No treino, ele te pergunta por que ninguém quis falar com ele. Você mente: *\"burocracia do clube\"*. Proteger também cansa.",
            },
          ],
        },
      },
    ],
  },

  // ── trilho SEM o menino ─────────────────────────────────────────────
  {
    id: "segunda_chance",
    se: "!meninoNoElenco",
    cenas: [
      {
        tipo: "fala",
        texto:
          "O presidente entra na sua sala com o celular na mão: um vídeo do torneio de várzea, 40 segundos, o menino driblando meio time. *\"Tá em todo grupo de WhatsApp da cidade. Por que a gente não contratou ISSO?\"*",
      },
      {
        tipo: "fala",
        texto:
          "Agora a família sabe o que tem em casa. O empresário do vidro fumê já visitou a mãe duas vezes. Se o Aliança quiser o menino, são **vinte e cinco mil** — e tem que ser hoje.",
      },
      {
        tipo: "escolha",
        id: "ev_segunda_chance",
        opcoes: [
          { id: "pagar_caro", rotulo: "Decisão", texto: "Pagar os vinte e cinco mil. Você errou na várzea; erro se corrige caro." },
          { id: "recusar_de_novo", rotulo: "Decisão", texto: "Recusar de novo. O clube não vira refém de hype de WhatsApp." },
        ],
        ramos: {
          pagar_caro: [
            {
              tipo: "fala",
              efeitos: { caixa: -25000, contratado: true, moralElenco: -3, moralMenino: -1 },
              texto:
                "O dinheiro sai raspando o fundo do caixa. O vestiário recebe a notícia em silêncio de velório — era o salário deles, e virou luvas de um menino de dezesseis anos. Ele chega quarta-feira. É melhor que ele seja tudo aquilo.",
            },
          ],
          recusar_de_novo: [
            {
              tipo: "fala",
              efeitos: { moralElenco: 2, exposicao: 1, meninoProRival: true },
              texto:
                "Você sustenta a decisão na frente do presidente, que sai batendo a porta. Sexta-feira, o jornal anuncia: o menino assinou com o **Atlético do investidor** — exatamente o adversário da última rodada. O destino tem um senso de humor específico.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "organizada",
    se: "!meninoNoElenco",
    cenas: [
      {
        tipo: "fala",
        texto:
          "Amanhece uma faixa amarrada no portão do CT: **\"TIME SEM VERGONHA, DIRETORIA SEM PALAVRA\"**. A torcida organizada — sobraram uns quarenta, mas são quarenta que não faltam — pede reunião com você. Só com você.",
      },
      {
        tipo: "escolha",
        id: "ev_organizada",
        opcoes: [
          { id: "receber", rotulo: "Decisão", texto: "Receber os quarenta no vestiário, de porta aberta. Torcida assim se olha no olho." },
          { id: "blindar", rotulo: "Decisão", texto: "Blindar o elenco: treino fechado, ninguém fala com ninguém até o jogo." },
        ],
        ramos: {
          receber: [
            {
              tipo: "fala",
              efeitos: { moralElenco: 2 },
              texto:
                "O chefe da organizada fala por dez minutos sem respirar. Você escuta tudo, não promete nada, e diz a única coisa que tem: *\"sábado eu boto onze ali dentro que vão sangrar pelo escudo. O resto não tá na minha mão.\"* Sábado, a arquibancada canta do primeiro ao último minuto.",
            },
          ],
          blindar: [
            {
              tipo: "fala",
              efeitos: { moralElenco: -1 },
              texto:
                "Treino fechado, portão trancado, assessoria respondendo por nota. Funciona: a semana é silenciosa. Sábado, a arquibancada também. Silêncio, você descobre, pesa mais de um lado do que do outro.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "goleiro_veterano",
    se: "!meninoNoElenco",
    cenas: [
      {
        tipo: "fala",
        texto:
          "O goleiro — 34 anos, o salário mais alto do elenco, o único que falou com a imprensa nos meses sem pagamento — pede reunião. *\"Professor, recebi proposta do interior de outro estado. Em dia, moradia, escolinha pros meus filhos. Me dá um motivo pra ficar.\"*",
      },
      {
        tipo: "escolha",
        id: "ev_goleiro",
        opcoes: [
          { id: "garantir", rotulo: "Decisão", texto: "Garantir o salário dele em dia com o caixa que você economizou. Capitão não se perde." },
          { id: "liberar", rotulo: "Decisão", texto: "Liberar com aperto de mão. Quem quer ir, vai — e o menino da base assume o gol." },
        ],
        ramos: {
          garantir: [
            {
              tipo: "fala",
              efeitos: { caixa: -8000, moralElenco: 3 },
              texto:
                "Você assina a garantia na frente dele. O goleiro fica — e treina como nos tempos de capitão. O vestiário inteiro percebe: aqui dentro, palavra ainda vale alguma coisa.",
            },
          ],
          liberar: [
            {
              tipo: "fala",
              efeitos: { moralElenco: -3, perderGoleiro: true },
              texto:
                "O abraço é sincero e o desfalque é imediato. O garoto da base tem dezenove anos, dois palmos a menos e uma vontade enorme de não decepcionar — que é exatamente o que costuma fazer um goleiro decepcionar.",
            },
          ],
        },
      },
    ],
  },
];
