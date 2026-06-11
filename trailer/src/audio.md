# Áudio do trailer — plano (placeholder por enquanto)

O corte renderiza HOJE sem áudio; as marcações de cada cena estão nos
comentários de `Trailer.jsx`, segundo a segundo, prontas pra encaixar.

## Decisão de produção (alinhada com o Fabian)

**Tudo via IA — nenhum músico contratado.**

| Peça | Plano |
|---|---|
| Locução (estilo rádio AM: "PASSOU POR UM… GOOOOOOL") | **ElevenLabs** — voz do Fabian clonada OU voz gerada em PT-BR. Fabian fornece a API key quando formos gravar. |
| Faixa de torcida (surdo, caixa, charanga, coro pro "Aliança") | Geração por IA (Eleven Music ou similar) — faixa ORIGINAL; estilo não é protegido, melodia específica é. **Proibido**: hinos reais, cantos de arquibancada reais (adaptações de músicas protegidas). |
| Chiado de rádio / silêncios | Sound design simples, gerado ou sintetizado. |

## Mapa de áudio (espelha os comentários do Trailer.jsx)

| t | Som |
|---|---|
| 0–3s | silêncio → chiado de rádio subindo |
| 3–6s | chiado cresce |
| 6–12s | surdo entra, longe |
| 12–20s | locutor tenso, voz baixa |
| 20–24.8s | locutor EXPLODE, charanga junto |
| 24.8–25.3s | **corte seco: 0,5s de silêncio absoluto** |
| 25.3–28s | "GOOOOOOL" preenchendo tudo |
| 28–34s | coro da torcida (faixa original) |
| 34–40s | música corta; só o surdo, como coração batendo |

## Quando o áudio chegar

Colocar os arquivos em `trailer/audio/` e usar `<Audio src={staticFile(...)} />`
nas `Sequence`s correspondentes — os tempos já batem.
