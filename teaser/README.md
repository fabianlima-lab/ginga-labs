# Teaser jogável — "Várzea"

O teaser de 15–20 minutos descrito em [`docs/TEASER.md`](../docs/TEASER.md).
Estático, sem build, sem cadastro: HTML + ES modules direto no navegador,
reutilizando o motor de `../src`.

## Rodar localmente

O app importa módulos de `../src`, então sirva a **raiz do repositório**:

```bash
npx serve .            # ou: python3 -m http.server
# abrir http://localhost:3000/teaser/
```

## Estrutura

```
index.html        casca única (PT-BR, mobile-first)
estilo.css        tipografia é a arte: tokens, rádio, ficha, escolhas
maquina.mjs       máquina de texto (digitação, toque acelera, escolhas)
config.mjs        nome, URL e links externos (placeholders do diretor)
mundo.mjs         o Aliança, o menino e o estado da run (usa ../src)
campeonato.mjs    adversários, partidas e a conta da degola
card.mjs          o card compartilhável (canvas 1080×1080 + Web Share)
app.mjs           orquestra as cenas
teste.mjs         valida mundo + roteiros (node teaser/teste.mjs)
roteiro/          SÓ texto — é aqui que o diretor criativo revisa
  ato0.mjs        a abertura (30s)
  ato1.mjs        a descoberta + Decisão 1
  ato2.mjs        moldura do loop: rodadas, manchetes, presidente
  eventos.mjs     banco de eventos (decisões de cada rodada)
  ato3.mjs        o empresário, a mãe, a final e as intervenções
  finais.mjs      os epílogos (Final N de 11) + frases do card
```

## Convenção

- **Texto narrativo vive em `roteiro/`**, nunca embutido na engenharia.
  Cada ato é um arquivo; revisão criativa = PR mexendo só em `roteiro/`.
- Markdown leve nas falas: `**negrito**` (destaque amarelo), `*itálico*`
  (voz baixa/rubrica).
