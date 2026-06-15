// WC 2026 match report — PHASE-BY-PHASE comparison (the cheat-sheet lens).
// Brazil 1-1 Morocco, free FIFA EFI data. Scores each phase + the mechanism.
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C={ink:"#0d0f0c",paper:"#f2ead8",gold:"#ffd447",muted:"#9a937f",red:"#e0625a",line:"#2c2f29"};
const SERIF="Georgia, serif",MONO="DejaVu Sans Mono, monospace",SANS="DejaVu Sans, Arial, sans-serif";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const T=(x,y,t,{s=20,c=C.paper,w="normal",f=SANS,a="start",ls=0}={})=>`<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;
const wrap=(t,n)=>{const w=t.split(" ");let l="",o=[];for(const x of w){if((l+" "+x).length>n){o.push(l);l=x;}else l=(l?l+" ":"")+x;}o.push(l);return o;};

const W=1080,H=1560,p=[`<rect width="${W}" height="${H}" fill="${C.ink}"/>`];
p.push(T(60,70,"GINGA·LABS",{f:MONO,s:18,c:C.gold,w:"700",ls:3}));
p.push(T(W-60,70,"COPA 2026 · GRUPO C",{f:MONO,s:15,c:C.muted,a:"end",ls:2}));
p.push(T(60,142,"BRASIL 1–1 MARROCOS",{s:56,w:"700",f:SERIF}));
p.push(T(60,182,"fase a fase — quem venceu cada momento de verdade",{s:23,c:C.muted,f:SERIF}));

const strip=[["POSSE","47% — 45%"],["xG","0.99 — 1.33"],["CHUTES (NO GOL)","12(5) — 14(3)"],["DISTÂNCIA","113.7 — 114.9 km"]];
strip.forEach(([k,v],i)=>{const x=60+i*255;p.push(T(x,250,k,{f:MONO,s:14,c:C.muted,ls:1}));p.push(T(x,290,v,{s:24,w:"700",c:i===1?C.gold:C.paper,f:MONO}));});

// phases
const EDGE={BRASIL:C.gold,MARROCOS:C.red,IGUAL:C.muted};
const phases=[
 ["Construção","BRASIL",
  "Marquinhos–Gabriel 51 passes (eixo dos zagueiros) · Douglas Santos → Vini 16, a ligação ofensiva mais usada",
  "Brasil sobrecarregou a esquerda — Douglas Santos e Paquetá afunilando pra isolar Vinícius no 1v1. Saiu o empate: Vini cortou de fora pra dentro, ângulo, assistência de Bruno Guimarães (32')."],
 ["Pressão & transição","MARROCOS",
  "50 posses forçadas a 41 · 79 segundas bolas a 56 · bola recuperada em 16,8s vs 18,0s",
  "A contra-pressão do Marrocos caçou cada bola solta — e fez gol nela: Saibari finalizou um contra-ataque após lançamento de Brahim Díaz (21'). O Brasil pressionou mais; o Marrocos pressionou melhor."],
 ["Entrada no terço final","MARROCOS",
  "149 recepções no terço final a 100 · xG 1,33 a 0,99 · 57 quebras de linha por dentro a 32",
  "O Marrocos chegou muito mais, e por dentro. O Brasil chegou menos, mas com mais perigo — um isolamento de Vinícius pesou mais que o volume do Marrocos."],
 ["Bola parada","IGUAL",
  "6 escanteios a 2 · 0 gols de bola parada · os dois gols com a bola rolando",
  "O volume de escanteios do Brasil não virou nada. O jogo se decidiu na bola rolando, não na área."],
];
let y=370;
for(let i=0;i<phases.length;i++){
 const [name,edge,stat,why]=phases[i];
 p.push(`<circle cx="78" cy="${y-7}" r="16" fill="none" stroke="${C.gold}" stroke-width="2"/>`);
 p.push(T(78,y,String(i+1),{s:18,c:C.gold,a:"middle",w:"700",f:MONO}));
 p.push(T(112,y,name,{s:27,w:"700",f:SERIF}));
 // edge pill
 const pillW=esc(edge).length*13+44, px=W-60-pillW;
 p.push(`<rect x="${px}" y="${y-26}" width="${pillW}" height="34" rx="17" fill="none" stroke="${EDGE[edge]}" stroke-width="2"/>`);
 p.push(T(px+pillW/2,y-3,edge,{f:MONO,s:15,c:EDGE[edge],a:"middle",w:"700",ls:1}));
 y+=34; p.push(T(112,y,stat,{f:MONO,s:15,c:C.paper}));
 y+=34; for(const l of wrap(why,82)){p.push(T(112,y,l,{s:18,c:C.muted,f:SERIF}));y+=26;}
 y+=14; if(i<phases.length-1)p.push(`<line x1="60" y1="${y-18}" x2="${W-60}" y2="${y-18}" stroke="${C.line}"/>`);
}

// verdict
y+=20;
p.push(`<rect x="56" y="${y-26}" width="${W-112}" height="150" rx="12" fill="#14160f" stroke="${C.line}"/>`);
p.push(T(80,y+4,"VEREDITO",{f:MONO,s:15,c:C.gold,ls:3}));
y+=40;
const verd="O Marrocos venceu as fases que decidem o jogo — transição e entrada no terço final — e merecia mais que um ponto. A única vantagem clara do Brasil, o 1v1 fabricado pra Vinícius na esquerda, é justamente o que salvou o empate. Um plano, um gol.";
for(const l of wrap(verd,86)){p.push(T(80,y,l,{s:19,c:C.paper,f:SERIF}));y+=28;}

p.push(`<line x1="60" y1="${H-56}" x2="${W-60}" y2="${H-56}" stroke="${C.line}"/>`);
p.push(T(60,H-26,"Fonte: FIFA Enhanced Football Intelligence — relatório pós-jogo (gratuito)",{f:MONO,s:13,c:C.muted}));
p.push(T(W-60,H-26,"ginga labs — soul & science",{f:MONO,s:13,c:C.gold,a:"end"}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
writeFileSync(new URL("./img/report-bra-mar-2026.png",import.meta.url), new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng());
console.log("wrote report-bra-mar-2026.png");
