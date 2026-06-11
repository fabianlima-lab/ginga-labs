// Corte principal (40s, X/Twitter) — roteiro em docs/TRAILER.md.
// Um jogo de texto pede trailer de tipografia cinética: o texto É a imagem.
// Áudio: PLACEHOLDER — ver src/audio.md. As marcações de som estão nos
// comentários de cada cena pra trilha/locução encaixarem depois.

import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const FPS = 30;
const s = (seg) => Math.round(seg * FPS);
export const DURACAO_40S = s(40);

// mesmos tokens do teaser: uma identidade só
const COR = {
  fundo: "#0d0f0c",
  papel: "#f2ead8",
  destaque: "#ffd447",
  apagado: "#9a937f",
  perigo: "#c62828",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

const Tela = ({ children, style }) => (
  <AbsoluteFill
    style={{
      backgroundColor: COR.fundo,
      justifyContent: "center",
      alignItems: "center",
      padding: 120,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// texto digitando, caractere a caractere — o gancho dos 2 primeiros segundos
const Digitado = ({ texto, comecaEm = 0, porSegundo = 28, tamanho = 72, cor = COR.papel }) => {
  const frame = useCurrentFrame();
  const visiveis = Math.max(0, Math.floor(((frame - comecaEm) / FPS) * porSegundo));
  const mostra = texto.slice(0, visiveis);
  const cursorAceso = Math.floor(frame / (FPS / 2)) % 2 === 0 && visiveis < texto.length + 20;
  return (
    <div style={{ fontFamily: SERIF, fontSize: tamanho, color: cor, textAlign: "center", lineHeight: 1.35, maxWidth: 1500 }}>
      {mostra}
      <span style={{ color: COR.destaque, opacity: cursorAceso ? 1 : 0 }}>▌</span>
    </div>
  );
};

// ── 0–3s · silêncio → chiado de rádio ───────────────────────────────
const Abertura = () => (
  <Tela>
    <Digitado texto="O país do futebol não pode comprar o maior jogo de futebol do mundo." porSegundo={30} />
  </Tela>
);

// ── 3–6s · chiado cresce ────────────────────────────────────────────
const Resposta = () => {
  const frame = useCurrentFrame();
  const escala = spring({ frame, fps: FPS, config: { damping: 14 } });
  return (
    <Tela>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 96,
          color: COR.destaque,
          textAlign: "center",
          transform: `scale(${escala})`,
          fontWeight: "bold",
        }}
      >
        Então fizemos um que nasceu aqui.
      </div>
    </Tela>
  );
};

// ── 6–12s · surdo entra, longe · a ficha do menino ──────────────────
const ATRIBUTOS = [
  ["GINGA", 18, COR.destaque],
  ["MARRA", 16, COR.destaque],
  ["FRIEZA", 8, COR.perigo],
];

const Ficha = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, s(6)], [1, 1.18], { extrapolateRight: "clamp" });
  return (
    <Tela>
      <div style={{ transform: `scale(${zoom})` }}>
        <div style={{ fontFamily: MONO, fontSize: 38, color: COR.apagado, marginBottom: 30, textAlign: "center" }}>
          ficha do olheiro · escrita a lápis · 16 anos
        </div>
        <div style={{ border: `3px solid ${COR.apagado}`, borderRadius: 12, padding: "50px 90px" }}>
          {ATRIBUTOS.map(([nome, valor, cor], i) => {
            const aparece = spring({ frame: frame - s(1.2) * i - s(0.5), fps: FPS, config: { damping: 12 } });
            return (
              <div
                key={nome}
                style={{
                  fontFamily: MONO,
                  fontSize: 88,
                  color: cor,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 140,
                  opacity: aparece,
                  transform: `translateX(${(1 - aparece) * 60}px)`,
                  fontWeight: "bold",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: COR.papel }}>{nome}</span>
                <span>{valor}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Tela>
  );
};

// ── 12–20s · locutor tenso, baixo · a narração sobe ─────────────────
const LINHAS_NARRACAO = [
  "Torneio de várzea.",
  "O olheiro jurou que valia a pena.",
  "O menino pega na bola...",
];

const Narracao = () => {
  const frame = useCurrentFrame();
  return (
    <Tela style={{ alignItems: "flex-start" }}>
      <div style={{ borderLeft: `6px solid ${COR.destaque}`, paddingLeft: 60 }}>
        {LINHAS_NARRACAO.map((linha, i) => {
          const aparece = spring({ frame: frame - s(2.2) * i, fps: FPS, config: { damping: 13 } });
          return (
            <div
              key={linha}
              style={{
                fontFamily: SERIF,
                fontSize: 76,
                color: COR.papel,
                opacity: aparece,
                transform: `translateY(${(1 - aparece) * 40}px)`,
                lineHeight: 1.6,
              }}
            >
              {linha}
            </div>
          );
        })}
      </div>
    </Tela>
  );
};

// ── 20–28s · locutor EXPLODE + charanga · corte seco · GOL ──────────
const Lance = () => {
  const frame = useCurrentFrame();
  // três pancadas de texto, cada uma maior — depois 0,5s de PRETO — GOL
  const pancadas = [
    { texto: "PASSOU POR UM...", em: 0, tamanho: 110 },
    { texto: "PASSOU POR DOIS...", em: s(1.6), tamanho: 140 },
    { texto: "BATEEEEU...", em: s(3.2), tamanho: 180 },
  ];
  const inicioSilencio = s(4.8);
  const inicioGol = s(5.3);

  if (frame >= inicioGol) {
    const tremor = Math.sin(frame * 2.1) * interpolate(frame, [inicioGol, inicioGol + s(1.2)], [14, 0], { extrapolateRight: "clamp" });
    const escala = spring({ frame: frame - inicioGol, fps: FPS, config: { damping: 9, stiffness: 140 } });
    return (
      <Tela>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: "bold",
            fontSize: 265, // cheio sem cortar o G e o L
            color: COR.destaque,
            transform: `scale(${escala}) translateX(${tremor}px)`,
            letterSpacing: "0.02em",
          }}
        >
          GOOOOOOL
        </div>
      </Tela>
    );
  }
  if (frame >= inicioSilencio) return <Tela />; // corte seco: preto e nada

  const atual = [...pancadas].reverse().find((p) => frame >= p.em);
  const desde = frame - (atual?.em ?? 0);
  const escala = spring({ frame: desde, fps: FPS, config: { damping: 10, stiffness: 160 } });
  return (
    <Tela>
      {atual && (
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: "bold",
            fontSize: atual.tamanho,
            color: COR.papel,
            transform: `scale(${escala})`,
            textAlign: "center",
          }}
        >
          {atual.texto}
        </div>
      )}
    </Tela>
  );
};

// ── 28–34s · coro da torcida (faixa original) · flashes de decisão ──
const DECISOES = [
  "Paga a passagem do menino?",
  "Vende pro empresário?",
  "A mãe dele quer sua opinião.",
];

const Decisoes = () => {
  const frame = useCurrentFrame();
  const porFlash = s(2);
  const i = Math.min(DECISOES.length - 1, Math.floor(frame / porFlash));
  const desde = frame - i * porFlash;
  const opacidade = interpolate(desde, [0, 4, porFlash - 6, porFlash], [0, 1, 1, 0]);
  return (
    <Tela>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 100,
          color: i === DECISOES.length - 1 ? COR.destaque : COR.papel,
          opacity: opacidade,
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: 1500,
          lineHeight: 1.3,
        }}
      >
        {DECISOES[i]}
      </div>
    </Tela>
  );
};

// ── 34–40s · a música corta, só o surdo · o convite ─────────────────
const Convite = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const linhas = ["Jogue o primeiro capítulo.", "Grátis. No navegador. Agora."];
  // o surdo como coração: a URL pulsa
  const pulso = 1 + Math.max(0, Math.sin((frame / FPS) * Math.PI * 1.6)) * 0.03;
  return (
    <Tela>
      {linhas.map((l, i) => {
        const aparece = spring({ frame: frame - s(0.8) * i, fps: FPS, config: { damping: 13 } });
        return (
          <div key={l} style={{ fontFamily: SERIF, fontSize: 86, color: COR.papel, opacity: aparece, lineHeight: 1.5 }}>
            {l}
          </div>
        );
      })}
      <div
        style={{
          fontFamily: MONO,
          fontWeight: "bold",
          fontSize: 130,
          color: COR.destaque,
          marginTop: 70,
          transform: `scale(${pulso})`,
        }}
      >
        {/* placeholder até o domínio existir (teaser/config.mjs) */}
        varzea.jogo.br
      </div>
    </Tela>
  );
};

export const Trailer = () => (
  <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
    {/* [áudio] 0–3s: silêncio → chiado de rádio sobe */}
    <Sequence from={s(0)} durationInFrames={s(3)}><Abertura /></Sequence>
    {/* [áudio] 3–6s: chiado cresce */}
    <Sequence from={s(3)} durationInFrames={s(3)}><Resposta /></Sequence>
    {/* [áudio] 6–12s: surdo entra, longe */}
    <Sequence from={s(6)} durationInFrames={s(6)}><Ficha /></Sequence>
    {/* [áudio] 12–20s: locutor tenso, baixo */}
    <Sequence from={s(12)} durationInFrames={s(8)}><Narracao /></Sequence>
    {/* [áudio] 20–28s: locutor EXPLODE + charanga; 0,5s de silêncio antes do GOL */}
    <Sequence from={s(20)} durationInFrames={s(8)}><Lance /></Sequence>
    {/* [áudio] 28–34s: coro da torcida (faixa ORIGINAL — nada de canto real) */}
    <Sequence from={s(28)} durationInFrames={s(6)}><Decisoes /></Sequence>
    {/* [áudio] 34–40s: música corta; só o surdo, como coração */}
    <Sequence from={s(34)} durationInFrames={s(6)}><Convite /></Sequence>
  </AbsoluteFill>
);
