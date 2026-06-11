# Prancheta FC (codinome) — Ginga Labs

Protótipo do gerador de mundo + simulador de partida do nosso management game
brasileiro. **100% fictício por design** — nenhum clube, jogador ou competição
real é representado.

## Rodar a demo

```bash
node cli.mjs            # seed padrão
node cli.mjs 1958       # qualquer seed = outro mundo, reproduzível
```

A demo gera o **Campeonato Estadual de Pindorama** (16 clubes-arquétipo,
368 jogadores), narra um clássico em estilo rádio, simula a temporada inteira
e imprime classificação + artilharia. O mundo completo é salvo em
`out/mundo.json`.

## Pilares (decididos no brainstorm)

1. **Mundo fictício gerado proceduralmente** — zero bits do FM, zero pessoas
   reais. É o que nos deixa vender no Brasil, onde o FM não pode entrar.
2. **Atributos brasileiros**: `ginga`, `marra`, `raça`, `frieza`,
   `malandragem` — e o motor de partida os usa de verdade (ginga gera drible
   na narração, frieza decide gol nos minutos finais, raça acende o time que
   está perdendo).
3. **Narrativa em primeiro lugar** — cada jogador nasce com origem e um traço
   de história; clubes nascem com arquétipo e contexto (o gigante decadente,
   o projeto do investidor misterioso, a várzea promovida).
4. **Dados abertos e moddáveis** — todo o mundo vive em JSON. A comunidade
   (e o Claude de cada jogador) edita, expande e cria países inteiros.
5. **Modular por país** — o Brasil é o primeiro "pacote"; Argentina, Colômbia
   etc. entram como dados, não como código novo.
6. **AI-native (futuro)** — servidor MCP local expõe o save pro agente do
   jogador ("qual tática contra esse time?"). Custo de inferência nosso: zero.

## Estrutura

```
cli.mjs              demo executável
src/rng.mjs          RNG com seed (mundos reproduzíveis)
src/nomes.mjs        nomes fictícios de jogadores e clubes
src/jogadores.mjs    atributos, posições, backstories, elenco
src/clubes.mjs       arquétipos de clube
src/partida.mjs      motor de partida + narração de rádio
src/temporada.mjs    rodadas, classificação, artilharia
docs/                (no repo raiz) TEASER.md e TRAILER.md
```

## Próximos passos

- [ ] Migrar para o repo `fabianlima-lab/ginga-labs`
- [ ] Revisão do diretor criativo nos textos (narração, arquétipos, traços)
- [ ] Teaser jogável no navegador (ver `docs/TEASER.md`)
- [ ] Evolução de jogador entre temporadas + eventos narrativos
- [ ] Servidor MCP de leitura do save
