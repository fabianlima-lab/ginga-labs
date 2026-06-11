// Geração de nomes 100% fictícios com sabor brasileiro.
// Combinações geradas proceduralmente — nenhum jogador real é representado.

import { escolher } from "./rng.mjs";

const PRENOMES = [
  "João", "Pedro", "Lucas", "Gabriel", "Matheus", "Rafael", "Carlos", "Eduardo",
  "Felipe", "Gustavo", "Vinícius", "Thiago", "Bruno", "Diego", "Wesley", "Maicon",
  "Anderson", "Robson", "Cleiton", "Jefferson", "Wallace", "Douglas", "Alex",
  "Renan", "Igor", "Caio", "Davi", "Erick", "Luan", "Kauã", "Ryan", "Emerson",
  "Marcos", "Paulo", "Vitor", "Samuel", "Yuri", "Washington", "Wellington", "Otávio"
];

const SOBRENOMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues",
  "Almeida", "Nascimento", "Lima", "Araújo", "Ribeiro", "Carvalho", "Gomes",
  "Martins", "Barbosa", "Rocha", "Dias", "Nunes", "Moreira", "Cavalcanti",
  "Farias", "Teixeira", "Correia", "Vieira", "Monteiro", "Cardoso", "Ramos"
];

// Apelidos de boleiro — genéricos, no estilo da várzea.
const APELIDOS = [
  "Juninho", "Zezinho", "Marquinhos", "Betinho", "Toninho", "Serginho",
  "Foguinho", "Pixote", "Tatu", "Sombra", "Foguete", "Cabecinha", "Xodó",
  "Biruta", "Peixe", "Canhoto", "Maestro", "Russo", "Índio", "Trovão"
];

const SUFIXO_REGIONAL = ["da Vila", "do Norte", "Baiano", "Mineiro", "Carioca", "Gaúcho", "Paulista", ""];

export function gerarNomeJogador(rng, usados) {
  for (let tentativa = 0; tentativa < 50; tentativa++) {
    let nome;
    const estilo = rng();
    if (estilo < 0.30) {
      // Apelido puro ou com sufixo regional
      const apelido = escolher(rng, APELIDOS);
      const sufixo = escolher(rng, SUFIXO_REGIONAL);
      nome = sufixo ? `${apelido} ${sufixo}` : apelido;
    } else if (estilo < 0.55) {
      // Prenome único (estilo craque brasileiro)
      nome = escolher(rng, PRENOMES);
    } else {
      nome = `${escolher(rng, PRENOMES)} ${escolher(rng, SOBRENOMES)}`;
    }
    if (!usados.has(nome)) {
      usados.add(nome);
      return nome;
    }
  }
  // fallback: adiciona numeral romano de "Filho/Neto"
  const base = `${escolher(rng, PRENOMES)} ${escolher(rng, SOBRENOMES)}`;
  const nome = `${base} Filho`;
  usados.add(nome);
  return nome;
}

// ---- Clubes fictícios ----

const PREFIXOS_CLUBE = [
  "Esporte Clube", "Associação Atlética", "Grêmio Esportivo",
  "Sociedade Esportiva", "Clube Atlético", "União Esportiva", "Ferroviário"
];

const TOPONIMOS = [
  "Vila Aurora", "Açaituba", "Pedra Lisa", "Campo Alegre", "Boa Ventura",
  "Maracanjuba", "Itaquari", "Rio Manso", "Palmeirinha", "Cruzeiro do Vale",
  "Porto das Garças", "Santa Quitéria", "Morro Azul", "Tabocas", "Laranjal",
  "Vila Operária", "Alto da Serra", "Baixada do Sol", "Capivari das Flores", "Encruzilhada"
];

const CORES = [
  ["vermelho", "branco"], ["preto", "branco"], ["verde", "amarelo"],
  ["azul", "branco"], ["grená", "azul"], ["alvinegro", "dourado"],
  ["tricolor", ""], ["celeste", "branco"], ["verde", "preto"], ["amarelo", "preto"]
];

const APELIDOS_TORCIDA = [
  "Furacão da Várzea", "Gigante do Bairro", "Máquina", "Esquadrão",
  "Time do Povo", "Camisa Pesada", "Orgulho Operário", "Tradição", "Fera", "Veterano"
];

export function gerarIdentidadeClube(rng, toponimosUsados) {
  let toponimo;
  do {
    toponimo = escolher(rng, TOPONIMOS);
  } while (toponimosUsados.has(toponimo));
  toponimosUsados.add(toponimo);

  const prefixo = escolher(rng, PREFIXOS_CLUBE);
  const nome = prefixo === "Ferroviário" ? `Ferroviário de ${toponimo}` : `${prefixo} ${toponimo}`;
  const sigla = toponimo
    .split(/[\s]/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .padEnd(3, toponimo[1].toUpperCase())
    .slice(0, 3);

  return {
    nome,
    curto: toponimo,
    sigla,
    cores: escolher(rng, CORES).filter(Boolean),
    apelido: escolher(rng, APELIDOS_TORCIDA),
  };
}
