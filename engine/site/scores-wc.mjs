// NOTAS POR JOGADOR — modelo transparente (base 6,0 ± componentes mostrados).
// Brasil, vs Marrocos. Cada nota mostra o driver. Saída PNG (resvg).
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C={ink:"#0d0f0c",paper:"#f2ead8",gold:"#ffd447",muted:"#9a937f",red:"#e0625a",green:"#7bbf6a",line:"#2c2f29"};
const SERIF="Georgia, serif",MONO="DejaVu Sans Mono, monospace",SANS="DejaVu Sans, Arial, sans-serif";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const T=(x,y,t,{s=20,c=C.paper,w="normal",f=SANS,a="start",ls=0}={})=>`<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;

const W=1080,H=1560,p=[`<rect width="${W}" height="${H}" fill="${C.ink}"/>`];
p.push(T(60,70,"GINGA·LABS",{f:MONO,s:18,c:C.gold,w:"700",ls:3}));
p.push(T(W-60,70,"COPA 2026 · NOTAS POR JOGADOR",{f:MONO,s:15,c:C.muted,a:"end",ls:2}));
p.push(T(60,130,"BRASIL — vs MARROCOS (1–1)",{s:40,w:"700",f:SERIF}));
p.push(T(60,170,"modelo transparente: base 6,0 ± componentes (mostrados)",{s:21,c:C.muted,f:SERIF}));

// [num, nome, pos, nota, driver, cor-do-driver]
const R=[
 [7,"Vinícius Jr","PE",7.6,"+ gol do empate, único perigo claro do time",C.green],
 [8,"Bruno Guimarães","MC",7.0,"+ assistência, conduziu a saída pela esquerda",C.green],
 [6,"Douglas Santos","LE",7.2,"+ 16 passes pro Vini, 14 pressões (o mais direto)",C.green],
 [10,"Paquetá","MC",6.7,"+ afunilou o jogo pra esquerda, no lance do gol",C.green],
 [3,"Gabriel Magalhães","ZC",6.5,"= 51 passes no eixo, seguro — mas saída travada",C.muted],
 [4,"Marquinhos","ZC",6.4,"= eixo dos zagueiros, sem erro grave nem solução",C.muted],
 [1,"Alisson","GOL",6.3,"= pouco exigido, vazado em contra-ataque limpo",C.muted],
 [11,"Raphinha","PD",6.2,"− lado direito apagado, fora do plano de jogo",C.red],
 [2,"Vanderson","LD",6.1,"− pouca presença ofensiva, sofreu com Saibari",C.red],
 [9,"Richarlison","CA",6.0,"− isolado, refém das 100 recepções no terço final",C.red],
 [5,"Casemiro","VOL",5.8,"− amarelo cedo, substituído no intervalo",C.red],
];

let y=235;
const rowH=(H-235-70)/R.length;
for(let i=0;i<R.length;i++){
 const [num,name,pos,nota,drv,col]=R[i];
 const cy=y+rowH/2;
 // número
 p.push(`<circle cx="86" cy="${cy-4}" r="20" fill="none" stroke="${C.gold}" stroke-width="2"/>`);
 p.push(T(86,cy+3,String(num),{s:18,c:C.gold,a:"middle",w:"700",f:MONO}));
 // nome + pos
 p.push(T(126,cy-8,name,{s:25,w:"700",f:SERIF}));
 p.push(T(126,cy+18,pos,{s:14,c:C.muted,f:MONO,ls:1}));
 // driver
 p.push(T(372,cy+5,drv,{s:15,c:col,f:SERIF}));
 // nota
 const nc = nota>=7?C.green : nota>=6.2?C.paper : C.red;
 p.push(T(W-70,cy+10,nota.toFixed(1).replace(".",","),{s:34,w:"700",c:nc,a:"end",f:MONO}));
 if(i<R.length-1) p.push(`<line x1="60" y1="${y+rowH}" x2="${W-60}" y2="${y+rowH}" stroke="${C.line}"/>`);
 y+=rowH;
}

p.push(`<line x1="60" y1="${H-56}" x2="${W-60}" y2="${H-56}" stroke="${C.line}"/>`);
p.push(T(60,H-26,"Verde = acima da base · vermelho = abaixo · drivers de dados FIFA EFI",{f:MONO,s:13,c:C.muted}));
p.push(T(W-60,H-26,"ginga labs — soul & science",{f:MONO,s:13,c:C.gold,a:"end"}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
writeFileSync(new URL("./img/scores-bra-mar-2026.png",import.meta.url), new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng());
console.log("wrote scores-bra-mar-2026.png");
