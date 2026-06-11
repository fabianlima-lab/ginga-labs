# Trailer / Vídeo Teaser — Roteiro e Direção (v0.1, para revisão)

> Objetivo: viralizar no X (Twitter) e Reddit e levar tráfego pro teaser
> jogável. CTA único: **jogar agora, grátis, no navegador.**

## Princípios

1. **Gancho nos 2 primeiros segundos** ou o algoritmo nos enterra.
2. **Legendado sempre** — maioria assiste sem som.
3. **Upload nativo** em cada plataforma (link externo mata alcance).
4. **Cortes por plataforma:** 30–40s (X), 60–90s (Reddit/YouTube),
   vertical 30s (TikTok/Reels/Shorts).
5. Um jogo de texto pede um trailer de **tipografia cinética**: o texto É a
   imagem. Nada de gameplay capturado tremido.

## Direção de som (decisão importante)

**NÃO usar hinos ou cantos de torcida reais.** Hinos são composições
protegidas, e muitos cantos de arquibancada são adaptações de músicas pop
também protegidas (é por isso que a TV às vezes corta o áudio da torcida).

**Em vez disso: faixa ORIGINAL no estilo torcida brasileira** — surdo, caixa,
charanga de metais, coro cantando o nome do clube FICTÍCIO ("Aliança").
Estilo não é protegido; melodia específica é. Produção: músico freelancer
(Workana/Fiverr, ~US$100–300) com cessão total de direitos por contrato.
Bônus: o canto fictício vira identidade sonora da marca.

**Voz:** locutor brasileiro real, estilo rádio AM (~US$50–150, ou o Fabian
se a voz servir). TTS ainda não entrega o "NA TRAVE!" com sangue.

## Roteiro — corte principal (40s, X/Twitter)

| t | Áudio | Tela |
|---|---|---|
| 0–3s | Silêncio → chiado de rádio | Preto. Texto branco digitando: **"O país do futebol não pode comprar o maior jogo de futebol do mundo."** |
| 3–6s | Chiado cresce | **"Então fizemos um que nasceu aqui."** |
| 6–12s | Surdo entra, longe | UI do jogo surge: a ficha do menino. Zoom nos atributos: **GINGA 18 · MARRA 16 · FRIEZA 8** |
| 12–20s | Locutor, tenso, baixo | Texto da narração subindo na tela: *"Torneio de várzea. O olheiro jurou que valia a pena. O menino pega na bola..."* |
| 20–28s | Locutor EXPLODE + charanga entra junto | Tipografia explodindo: *"PASSOU POR UM... PASSOU POR DOIS... BATEEEEU..."* — corte seco, silêncio de 0,5s — **"GOOOOOOL"** preenchendo a tela inteira |
| 28–34s | Coro da torcida (faixa original) | Flashes rápidos de decisões do jogo: *"Paga a passagem do menino?"* / *"Vende pro empresário?"* / *"A mãe dele quer sua opinião."* |
| 34–40s | Música corta. Só o surdo, como coração batendo | **"Jogue o primeiro capítulo. Grátis. No navegador. Agora."** + URL gigante. |

## Corte Reddit/YouTube (60–90s)

Mesma espinha, com +30s mostrando uma decisão completa (o dilema da
passagem de ônibus) e 1 frase de posicionamento:
*"100% fictício. 100% brasileiro. Moddável até o osso."*
(Reddit respeita honestidade técnica — a frase do modding é anzol pra
r/footballmanagergames.)

## Produção

- **Ferramenta: Remotion** (vídeo renderizado por código, React). O Claude
  monta o trailer inteiro programaticamente; iteramos como código — cada
  ajuste de timing é um commit, não uma tarde de editor de vídeo.
- Assets: tipografia + UI do jogo real + faixa original + locução. Sem
  filmagem, sem banco de imagem (banco de imagem genérico = cheiro de fake).
- Custo total estimado: **US$150–450** (música + locutor). Resto é código.

## Distribuição (papel do Fabian)

- X: thread — vídeo no tweet 1, história do projeto no 2 ("o FM é bloqueado
  no Brasil, então..."), link no 3.
- Reddit: r/footballmanagergames (inglês, ângulo "FM banned in Brazil"),
  r/futebol, r/brasil, r/jogos (PT, ângulo identidade).
- Timing: enquanto a Copa do Mundo segue viva na conversa.
- Comunidades de FM Brasil no Discord/WhatsApp/Telegram: compartilhar como
  membro, não como anúncio.

## Métricas do vídeo

| Métrica | Meta |
|---|---|
| Taxa de conclusão do vídeo | > 30% (X) |
| CTR pro teaser jogável | > 2% |
| Shares/quotes orgânicos | observar — métrica de ouro |
