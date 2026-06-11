# Trailer — renderizado por código (Remotion)

O corte principal de 40s do [`docs/TRAILER.md`](../docs/TRAILER.md):
tipografia cinética, sem filmagem, sem banco de imagem. Cada ajuste de
timing é um commit.

## Rodar

```bash
cd trailer
npm install
npm run studio    # editor visual com scrub de timeline
npm run render    # gera out/trailer-40s.mp4
```

## Estrutura

```
src/index.jsx     registerRoot
src/Root.jsx      composições (Principal40s; cortes Reddit/vertical depois)
src/Trailer.jsx   as 7 cenas do roteiro, segundo a segundo
src/audio.md      plano de áudio (IA: ElevenLabs + faixa original) — placeholder
```

## Estado do áudio

Sem áudio por enquanto — as marcações de som estão comentadas em cada
`Sequence` e detalhadas em `src/audio.md`. Decisão de produção: tudo via
IA (ElevenLabs pra locução, faixa de torcida original gerada), nenhum
hino ou canto real.
