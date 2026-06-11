// Corte de gameplay (90s, Reddit/YouTube) — "o jogo já existe".
// Mostra as features na UI REAL do teaser, dentro de uma janela de
// navegador, com a arte gerada (Gemini) atrás. Locução BR nativa.

import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, spring } from "remotion";
import { Pelicula, Prancheta, Placar, VuRadio } from "./graficos.jsx";

export const FPS = 30;
const s = (seg) => Math.round(seg * FPS);
export const DURACAO_90S = s(90);

const COR = { fundo: "#0d0f0c", papel: "#f2ead8", destaque: "#ffd447", apagado: "#9a937f", perigo: "#c62828", grama: "#2e7d32" };
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', monospace";
const som = (a) => staticFile(`audio/${a}`);
const arte = (a) => staticFile(`arte/${a}`);

// ── moldura de navegador: a prova de que roda AGORA, sem download ────
const Janela = ({ children }) => (
  <div
    style={{
      width: 1500,
      height: 860,
      background: COR.fundo,
      borderRadius: 18,
      border: "1px solid #333",
      boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", background: "#181a17", borderBottom: "1px solid #2a2d28" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
      ))}
      <div style={{ flex: 1, margin: "0 30px", background: "#0d0f0c", borderRadius: 8, padding: "8px 22px", fontFamily: MONO, fontSize: 24, color: COR.apagado }}>
        fabianlima-lab.github.io/ginga-labs
      </div>
    </div>
    <div style={{ flex: 1, padding: "50px 70px", position: "relative" }}>{children}</div>
  </div>
);

const Fundo = ({ imagem, opacidade = 0.45, children }) => (
  <AbsoluteFill style={{ backgroundColor: COR.fundo, justifyContent: "center", alignItems: "center" }}>
    {imagem && (
      <AbsoluteFill>
        <Img src={arte(imagem)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: opacidade }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(13,15,12,0.5) 0%, rgba(13,15,12,0.85) 100%)" }} />
      </AbsoluteFill>
    )}
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

const Rotulo = ({ children }) => (
  <div style={{ fontFamily: MONO, fontSize: 30, color: COR.destaque, letterSpacing: "0.25em", marginBottom: 26, textTransform: "uppercase" }}>
    {children}
  </div>
);

// texto digitando (mesma linguagem do teaser)
const digitado = (frame, texto, porSegundo = 40) => texto.slice(0, Math.max(0, Math.floor((frame / FPS) * porSegundo)));

// ── 0–4s · o gancho ──────────────────────────────────────────────────
const Gancho = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <div style={{ fontFamily: SERIF, fontSize: 66, color: COR.papel, textAlign: "center", maxWidth: 1500, lineHeight: 1.4 }}>
        {digitado(frame, "O país do futebol não pode comprar o maior jogo de futebol do mundo.", 32)}
        <span style={{ color: COR.destaque }}>▌</span>
      </div>
    </Fundo>
  );
};

// ── 4–10s · o título sobre a várzea real ─────────────────────────────
const Titulo = () => {
  const frame = useCurrentFrame();
  const escala = spring({ frame: frame - s(0.6), fps: FPS, config: { damping: 12 } });
  return (
    <Fundo imagem="varzea.png" opacidade={0.6}>
      <div style={{ fontFamily: SERIF, fontSize: 52, color: COR.papel, marginBottom: 30 }}>Então fizemos um que nasceu aqui.</div>
      <div style={{ fontFamily: SERIF, fontWeight: "bold", fontSize: 150, color: COR.destaque, transform: `scale(${escala})`, textShadow: "0 10px 60px rgba(0,0,0,0.9)" }}>
        PRANCHETA FC
      </div>
      <div style={{ fontFamily: MONO, fontSize: 32, color: COR.apagado, marginTop: 24 }}>management de futebol · 100% fictício · 100% brasileiro</div>
    </Fundo>
  );
};

// ── 10–20s · FEATURE: o mundo gerado ─────────────────────────────────
const CLUBES = [
  ["MAO", "Ferroviário de Morro Azul", "Gigante decadente", 12],
  ["CAA", "Grêmio Esp. Campo Alegre", "Time de massa", 12],
  ["ADS", "União Esp. Alto da Serra", "Clube ferroviário", 8],
  ["CDV", "Ferroviário de Cruzeiro do Vale", "Clube de colônia", 9],
  ["LAA", "Esporte Clube Laranjal", "Raiz do interior", 10],
  ["MAA", "Ferroviário de Maracanjuba", "Projeto de investidor", 11],
  ["SQA", "Clube Atl. Santa Quitéria", "Várzea promovida", 6],
];

const Mundo = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <Janela>
        <Rotulo>mundo gerado · seed 1970</Rotulo>
        {CLUBES.map(([sigla, nome, arq, forca], i) => {
          const aparece = spring({ frame: frame - s(0.9) * i - s(0.6), fps: FPS, config: { damping: 13 } });
          return (
            <div key={sigla} style={{ display: "flex", gap: 30, alignItems: "baseline", fontFamily: MONO, fontSize: 34, lineHeight: 2.1, opacity: aparece, transform: `translateX(${(1 - aparece) * 50}px)` }}>
              <span style={{ color: COR.destaque, fontWeight: "bold" }}>{sigla}</span>
              <span style={{ color: COR.papel, flex: 1 }}>{nome}</span>
              <span style={{ color: COR.apagado }}>{arq}</span>
              <span style={{ color: COR.destaque }}>{forca}</span>
            </div>
          );
        })}
        <div style={{ position: "absolute", bottom: 40, left: 70, fontFamily: SERIF, fontSize: 34, color: COR.apagado, fontStyle: "italic" }}>
          outro seed, outro mundo — reproduzível e moddável (tudo em JSON)
        </div>
      </Janela>
    </Fundo>
  );
};

// ── 20–30s · FEATURE: os atributos brasileiros ───────────────────────
const FICHA = [
  ["GINGA", 18, COR.destaque], ["MARRA", 16, COR.destaque], ["RAÇA", 14, COR.papel],
  ["FRIEZA", 8, COR.perigo], ["MALANDRAGEM", 15, COR.papel],
  ["drible", 17, COR.apagado], ["velocidade", 16, COR.apagado], ["finalização", 12, COR.apagado],
];

const Atributos = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <Janela>
        <Rotulo>a ficha que nenhum outro jogo tem</Rotulo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 110, rowGap: 6 }}>
          {FICHA.map(([nome, valor, cor], i) => {
            const aparece = spring({ frame: frame - s(0.75) * i - s(0.5), fps: FPS, config: { damping: 13 } });
            return (
              <div key={nome} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 42, lineHeight: 1.85, opacity: aparece }}>
                <span style={{ color: cor === COR.apagado ? COR.apagado : COR.papel }}>{nome}</span>
                <span style={{ color: cor, fontWeight: "bold" }}>{valor}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 40, left: 70, fontFamily: SERIF, fontSize: 34, color: COR.apagado, fontStyle: "italic" }}>
          e o motor usa de verdade: ginga vira drible, frieza decide aos 89'
        </div>
      </Janela>
    </Fundo>
  );
};

// ── 30–42s · FEATURE: decisões que o jogo lembra ─────────────────────
const Decisao = () => {
  const frame = useCurrentFrame();
  const opcoes = [
    "Pagar a passagem do seu bolso, sem alarde.",
    "Cobrar disciplina. Aqui é profissional.",
    "Mandar o roupeiro buscar o menino de moto.",
  ];
  const escolheEm = s(7);
  const escolhida = frame >= escolheEm;
  return (
    <Fundo>
      <Janela>
        <div style={{ fontFamily: SERIF, fontSize: 40, color: COR.papel, lineHeight: 1.5, maxWidth: 1280 }}>
          {digitado(frame, "O menino não aparece no treino. A mãe não teve o dinheiro da passagem — e ele tem vergonha de dizer.", 50)}
        </div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
          {opcoes.map((op, i) => {
            const aparece = spring({ frame: frame - s(2.5) - s(0.5) * i, fps: FPS, config: { damping: 13 } });
            const éEscolhida = escolhida && i === 0;
            return (
              <div
                key={op}
                style={{
                  fontFamily: SERIF,
                  fontSize: 36,
                  color: éEscolhida ? COR.fundo : COR.papel,
                  background: éEscolhida ? COR.destaque : "none",
                  border: `2px solid ${éEscolhida ? COR.destaque : COR.apagado}`,
                  borderRadius: 10,
                  padding: "20px 30px",
                  opacity: aparece,
                  fontWeight: éEscolhida ? "bold" : "normal",
                }}
              >
                {op}
              </div>
            );
          })}
        </div>
        {frame > escolheEm + s(1.5) && (
          <div style={{ marginTop: 44, fontFamily: MONO, fontSize: 32, color: COR.destaque }}>
            ✓ o jogo lembra — moral do menino +3 · caixa −R$ 200
          </div>
        )}
      </Janela>
    </Fundo>
  );
};

// ── 42–58s · FEATURE: a partida narrada ──────────────────────────────
const LINHAS_JOGO = [
  ["radio", "73' — olha a GINGA do menino! Passou por um, passou por DOIS..."],
  ["radio", "87' — bola enfiada açucarada, o menino sai na cara do gol..."],
  ["gol", "É GOL! É GOOOOOOOOOL DO ALIANÇA! O moleque, aos 87!"],
];

const PartidaNarrada = () => {
  const frame = useCurrentFrame();
  const progresso = interpolate(frame, [0, s(10), s(12)], [0.1, 0.85, 1], { extrapolateRight: "clamp" });
  return (
    <Fundo>
      <Prancheta progresso={progresso} opacidade={0.3} />
      <Janela>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <Placar aparece={1} golsCasa={frame > s(10.5) ? 1 : 0} minuto={Math.min(90, 70 + Math.floor(frame / FPS / 0.55))} />
        </div>
        {LINHAS_JOGO.map(([tipo, linha], i) => {
          const desde = frame - s(3.5) * i - s(1);
          if (desde < 0) return null;
          const éGol = tipo === "gol";
          return (
            <div
              key={linha}
              style={{
                fontFamily: MONO,
                fontSize: éGol ? 52 : 38,
                color: éGol ? COR.destaque : COR.papel,
                fontWeight: éGol ? "bold" : "normal",
                borderLeft: `5px solid ${COR.destaque}`,
                paddingLeft: 28,
                marginBottom: 30,
                lineHeight: 1.45,
                transform: éGol && desde < s(0.6) ? `translateX(${Math.sin(desde * 2.2) * 8}px)` : undefined,
              }}
            >
              {digitado(desde, linha, 46)}
            </div>
          );
        })}
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 0.5 }}>
          <VuRadio intensidade={frame > s(10.5) ? 1.4 : 0.8} />
        </div>
      </Janela>
    </Fundo>
  );
};

// ── 58–66s · FEATURE: os 11 finais e o card ──────────────────────────
const CardFinal = () => {
  const frame = useCurrentFrame();
  const escala = spring({ frame: frame - s(0.4), fps: FPS, config: { damping: 12 } });
  return (
    <Fundo>
      <div style={{ transform: `scale(${escala}) rotate(-1.2deg)`, border: `5px solid ${COR.destaque}`, borderRadius: 14, padding: "60px 90px", background: COR.fundo, textAlign: "center", maxWidth: 1320 }}>
        <div style={{ fontFamily: SERIF, fontWeight: "bold", fontSize: 54, color: COR.destaque, marginBottom: 28 }}>PRANCHETA FC</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: COR.papel, lineHeight: 1.5 }}>
          “Salvei o Aliança do rebaixamento, mas vendi o Craque da Várzea. Ele nunca mais foi o mesmo.”
        </div>
        <div style={{ fontFamily: MONO, fontSize: 32, color: COR.apagado, marginTop: 34 }}>A salvação tem recibo — Final 6 de 11 · mundo 47291</div>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 44, color: COR.papel, marginTop: 50 }}>
        Onze finais. <span style={{ color: COR.destaque }}>Qual vai ser o seu?</span>
      </div>
    </Fundo>
  );
};

// ── 66–76s · o menino, a frase, a tese ───────────────────────────────
const Tese = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo imagem="menino.png" opacidade={0.75}>
      <div style={{ position: "absolute", bottom: 130, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 56, color: COR.papel, textShadow: "0 4px 40px rgba(0,0,0,0.95)" }}>
          {digitado(frame, "Isso foi um domingo.", 24)}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 56, color: COR.destaque, marginTop: 16, textShadow: "0 4px 40px rgba(0,0,0,0.95)" }}>
          {frame > s(3) ? digitado(frame - s(3), "O jogo completo é a carreira inteira.", 24) : ""}
        </div>
      </div>
    </Fundo>
  );
};

// ── 76–90s · CTA sobre a arquibancada ────────────────────────────────
const Convite = () => {
  const frame = useCurrentFrame();
  const pulso = 1 + Math.max(0, Math.sin((frame / FPS) * Math.PI * 1.6)) * 0.03;
  return (
    <Fundo imagem="arquibancada.png" opacidade={0.5}>
      <div style={{ fontFamily: SERIF, fontSize: 72, color: COR.papel, textAlign: "center", lineHeight: 1.5 }}>
        Jogue o primeiro capítulo.
        <br />
        <span style={{ color: COR.destaque, fontWeight: "bold" }}>Grátis. No navegador. Agora.</span>
      </div>
      <div style={{ fontFamily: MONO, fontWeight: "bold", fontSize: 64, color: COR.destaque, marginTop: 70, transform: `scale(${pulso})`, background: "rgba(13,15,12,0.8)", padding: "20px 50px", borderRadius: 12 }}>
        fabianlima-lab.github.io/ginga-labs
      </div>
      <div style={{ fontFamily: MONO, fontSize: 30, color: COR.apagado, marginTop: 40 }}>
        100% fictício · 100% brasileiro · moddável até o osso
      </div>
    </Fundo>
  );
};

export const Gameplay = () => (
  <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
    <Sequence from={s(0)} durationInFrames={s(4)}><Gancho /></Sequence>
    <Sequence from={s(4)} durationInFrames={s(6)}><Titulo /></Sequence>
    <Sequence from={s(10)} durationInFrames={s(10)}><Mundo /></Sequence>
    <Sequence from={s(20)} durationInFrames={s(10)}><Atributos /></Sequence>
    <Sequence from={s(30)} durationInFrames={s(12)}><Decisao /></Sequence>
    <Sequence from={s(42)} durationInFrames={s(16)}><PartidaNarrada /></Sequence>
    <Sequence from={s(58)} durationInFrames={s(8)}><CardFinal /></Sequence>
    <Sequence from={s(66)} durationInFrames={s(10)}><Tese /></Sequence>
    <Sequence from={s(76)} durationInFrames={s(14)}><Convite /></Sequence>

    {/* ── trilha ── */}
    <Sequence from={s(0)} durationInFrames={s(4)}>
      <Audio src={som("sfx-chiado.mp3")} volume={(f) => interpolate(f, [0, s(4)], [0.1, 0.6])} />
    </Sequence>
    <Sequence from={s(4)} durationInFrames={s(6)}>
      <Audio src={som("sfx-surdo-longe.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={s(10)} durationInFrames={s(10)}>
      <Audio src={som("locucao-mundo.mp3")} volume={0.95} />
      <Audio src={som("sfx-surdo-longe.mp3")} volume={0.15} />
    </Sequence>
    <Sequence from={s(20)} durationInFrames={s(10)}>
      <Audio src={som("locucao-atributos.mp3")} volume={0.95} />
    </Sequence>
    <Sequence from={s(30)} durationInFrames={s(4)}>
      <Audio src={som("locucao-decisoes.mp3")} volume={0.95} />
    </Sequence>
    <Sequence from={s(42)} durationInFrames={s(5)}>
      <Audio src={som("locucao-narracao.mp3")} volume={0.9} />
    </Sequence>
    <Sequence from={s(47.2)} durationInFrames={s(5.1)}>
      <Audio src={som("locucao-lance.mp3")} volume={1} />
    </Sequence>
    {/* 52.3–52.8: silêncio seco */}
    <Sequence from={s(52.8)} durationInFrames={s(1.9)}>
      <Audio src={som("locucao-gol.mp3")} volume={1} />
    </Sequence>
    <Sequence from={s(52.8)} durationInFrames={s(8)}>
      <Audio src={som("sfx-torcida.mp3")} volume={(f) => interpolate(f, [0, s(0.4), s(7), s(8)], [0.9, 0.7, 0.55, 0])} />
    </Sequence>
    <Sequence from={s(58.5)} durationInFrames={s(3)}>
      <Audio src={som("locucao-finais.mp3")} volume={0.95} />
    </Sequence>
    <Sequence from={s(66)} durationInFrames={s(10)}>
      <Audio src={som("sfx-surdo-coracao.mp3")} volume={0.65} />
    </Sequence>
    <Sequence from={s(76)} durationInFrames={s(14)}>
      <Audio src={som("sfx-torcida.mp3")} volume={(f) => interpolate(f, [0, s(2), s(12), s(14)], [0.25, 0.4, 0.4, 0])} />
    </Sequence>

    <Pelicula />
  </AbsoluteFill>
);
