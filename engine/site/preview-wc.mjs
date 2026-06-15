// PRÉ-JOGO — prévia tática: as duas escalações prováveis + 3 chaves + palpite.
// Brasil × Marrocos, Copa 2026. Formato Tier-1 (sem footage). Saída PNG (resvg).
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C={ink:"#0d0f0c",paper:"#f2ead8",gold:"#ffd447",muted:"#9a937f",red:"#e0625a",line:"#2c2f29",pitch:"#10231a",grass:"#3a5247"};
const SERIF="Georgia, serif",MONO="DejaVu Sans Mono, monospace",SANS="DejaVu Sans, Arial, sans-serif";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const T=(x,y,t,{s=20,c=C.paper,w="normal",f=SANS,a="start",ls=0}={})=>`<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;
const wrap=(t,n)=>{const w=t.split(" ");let l="",o=[];for(const x of w){if((l+" "+x).length>n){o.push(l);l=x;}else l=(l?l+" ":"")+x;}o.push(l);return o;};

const W=1080,H=1560,p=[`<rect width="${W}" height="${H}" fill="${C.ink}"/>`];
p.push(T(60,70,"GINGA·LABS",{f:MONO,s:18,c:C.gold,w:"700",ls:3}));
p.push(T(W-60,70,"COPA 2026 · GRUPO C · PRÉVIA",{f:MONO,s:15,c:C.muted,a:"end",ls:2}));
p.push(T(60,142,"BRASIL × MARROCOS",{s:56,w:"700",f:SERIF}));
p.push(T(60,182,"amanhã, 21h — escalações prováveis e o que observar",{s:23,c:C.muted,f:SERIF}));

// ── pitch (vertical): Brasil ataca pra cima, Marrocos pra baixo ──
const PX=70,PY=230,PW=W-140,PH=760;
const sx=v=>PX+(v/100)*PW, sy=v=>PY+(v/100)*PH;
p.push(`<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="10" fill="${C.pitch}" stroke="${C.grass}" stroke-width="2"/>`);
p.push(`<line x1="${PX}" y1="${sy(50)}" x2="${PX+PW}" y2="${sy(50)}" stroke="${C.grass}" stroke-width="2"/>`);
p.push(`<circle cx="${sx(50)}" cy="${sy(50)}" r="${(0.13*PW).toFixed(0)}" fill="none" stroke="${C.grass}" stroke-width="2"/>`);
p.push(`<rect x="${sx(28)}" y="${PY}" width="${(0.44*PW).toFixed(0)}" height="${(0.13*PH).toFixed(0)}" fill="none" stroke="${C.grass}" stroke-width="2"/>`);
p.push(`<rect x="${sx(28)}" y="${(PY+PH-0.13*PH).toFixed(0)}" width="${(0.44*PW).toFixed(0)}" height="${(0.13*PH).toFixed(0)}" fill="none" stroke="${C.grass}" stroke-width="2"/>`);
p.push(T(sx(50),PY+24,"MARROCOS ↑ 4-3-3",{f:MONO,s:14,c:C.red,a:"middle",ls:1}));
p.push(T(sx(50),PY+PH-14,"BRASIL ↓ 4-3-3",{f:MONO,s:14,c:C.gold,a:"middle",ls:1}));

const node=(x,y,num,name,col)=>{const X=sx(x),Y=sy(y);
 p.push(`<circle cx="${X}" cy="${Y}" r="19" fill="${col}" stroke="${C.ink}" stroke-width="2"/>`);
 p.push(T(X,Y+6,String(num),{s:17,w:"700",c:C.ink,a:"middle",f:MONO}));
 p.push(T(X,Y+34,name,{s:14,c:C.paper,a:"middle",f:SANS,w:"700"}));};

// Brasil (provável) — ataca pra cima (y grande = gol do Brasil embaixo)
const BRA=[[50,93,1,"Alisson"],[18,78,6,"D. Santos"],[39,80,3,"Gabriel"],[61,80,4,"Marquinhos"],[82,78,2,"Vanderson"],
 [50,65,5,"Casemiro"],[30,59,8,"Bruno G."],[70,59,10,"Paquetá"],[20,45,7,"Vinícius"],[50,42,9,"Richarlison"],[80,45,11,"Raphinha"]];
// Marrocos (provável) — ataca pra baixo
const MAR=[[50,7,1,"Bounou"],[82,22,2,"Hakimi"],[61,20,4,"Aguerd"],[39,20,5,"Saïss"],[18,22,3,"Mazraoui"],
 [50,35,8,"Amrabat"],[70,41,6,"Ounahi"],[30,41,14,"Brahim D."],[80,55,7,"Ziyech"],[50,58,9,"En-Nesyri"],[20,55,19,"Saibari"]];
for(const [x,y,n,nm] of BRA) node(x,y,n,nm,C.gold);
for(const [x,y,n,nm] of MAR) node(x,y,n,nm,C.red);

// ── 3 chaves do jogo (conclusão primeiro) ──
let y=1058;
p.push(T(60,y,"3 CHAVES DO JOGO",{f:MONO,s:16,c:C.gold,ls:3}));y+=40;
const keys=[
 ["A transição é a arma do Marrocos.","Eles vivem de segunda bola e contra-ataque. O jogo do Brasil é proteger a saída — perder a bola no meio é o convite pro gol deles."],
 ["Vinícius isolado é o plano A do Brasil.","Sobrecarregar a esquerda pra soltar o 1v1. Funciona — mas se for o único caminho, marcar o Vini com dois apaga o ataque."],
 ["Quem furar por dentro chega ao gol.","A bola pela linha de fundo é inofensiva. A decisão está nos corredores centrais: penetração, não posse."],
];
for(let i=0;i<keys.length;i++){const [h,b]=keys[i];
 p.push(`<circle cx="76" cy="${y-6}" r="15" fill="none" stroke="${C.gold}" stroke-width="2"/>`);
 p.push(T(76,y,String(i+1),{s:17,c:C.gold,a:"middle",w:"700",f:MONO}));
 p.push(T(110,y,h,{s:22,w:"700",c:C.paper,f:SERIF}));y+=28;
 for(const l of wrap(b,84)){p.push(T(110,y,l,{s:16,c:C.muted,f:SERIF}));y+=23;}y+=14;
}

// ── palpite ──
y+=4;
p.push(`<rect x="56" y="${y-26}" width="${W-112}" height="92" rx="12" fill="#14160f" stroke="${C.line}"/>`);
p.push(T(80,y+2,"PALPITE",{f:MONO,s:14,c:C.gold,ls:3}));
p.push(T(W-80,y+4,"empate apertado · 1–1",{f:SERIF,s:26,c:C.paper,a:"end",w:"700"}));
y+=36;
for(const l of wrap("Jogo equilibrado, leve borda do Marrocos no xG esperado pela transição. Confiança: média.",78)){p.push(T(80,y,l,{s:16,c:C.muted,f:SERIF}));y+=22;}

p.push(`<line x1="60" y1="${H-56}" x2="${W-60}" y2="${H-56}" stroke="${C.line}"/>`);
p.push(T(60,H-26,"Escalações prováveis · forma recente + crenças do nosso banco",{f:MONO,s:13,c:C.muted}));
p.push(T(W-60,H-26,"ginga labs — soul & science",{f:MONO,s:13,c:C.gold,a:"end"}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
writeFileSync(new URL("./img/preview-bra-mar-2026.png",import.meta.url), new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng());
console.log("wrote preview-bra-mar-2026.png");
