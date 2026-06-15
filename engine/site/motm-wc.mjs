// CRAQUE DO JOGO (MOTM) — escolha + nota + por quê (conclusão → mecanismo).
// Brasil 1–1 Marrocos. Honesto: vencedor + vice reconhecido. Saída PNG (resvg).
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C={ink:"#0d0f0c",paper:"#f2ead8",gold:"#ffd447",muted:"#9a937f",red:"#e0625a",line:"#2c2f29"};
const SERIF="Georgia, serif",MONO="DejaVu Sans Mono, monospace",SANS="DejaVu Sans, Arial, sans-serif";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const T=(x,y,t,{s=20,c=C.paper,w="normal",f=SANS,a="start",ls=0}={})=>`<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;
const wrap=(t,n)=>{const w=t.split(" ");let l="",o=[];for(const x of w){if((l+" "+x).length>n){o.push(l);l=x;}else l=(l?l+" ":"")+x;}o.push(l);return o;};

const W=1080,H=1180,p=[`<rect width="${W}" height="${H}" fill="${C.ink}"/>`];
p.push(T(60,70,"GINGA·LABS",{f:MONO,s:18,c:C.gold,w:"700",ls:3}));
p.push(T(W-60,70,"COPA 2026 · CRAQUE DO JOGO",{f:MONO,s:15,c:C.muted,a:"end",ls:2}));
p.push(T(60,130,"BRASIL 1–1 MARROCOS",{s:26,w:"700",f:MONO,c:C.muted}));

// nome + número grande
p.push(`<circle cx="140" cy="280" r="74" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>`);
p.push(T(140,302,"7",{s:78,w:"700",c:C.ink,a:"middle",f:MONO}));
p.push(T(248,250,"VINÍCIUS JR",{s:56,w:"700",f:SERIF}));
p.push(T(248,300,"ponta-esquerda · o único perigo real do Brasil",{s:22,c:C.muted,f:SERIF}));

// nota
p.push(`<rect x="${W-300}" y="370" width="240" height="120" rx="12" fill="#14160f" stroke="${C.line}"/>`);
p.push(T(W-180,420,"NOTA",{f:MONO,s:14,c:C.gold,a:"middle",ls:3}));
p.push(T(W-180,478,"7,6",{s:60,w:"700",c:C.gold,a:"middle",f:MONO}));

// stat lines
let y=400;
p.push(T(60,y,"O QUE ELE FEZ",{f:MONO,s:15,c:C.gold,ls:3}));y+=44;
const stats=[
 ["1 gol","o empate aos 32' — cortou de fora pra dentro pela esquerda, ângulo"],
 ["plano A inteiro","alvo de 16 passes diretos de Douglas Santos, a ligação mais usada do time"],
 ["0,99 → o pico","carregou quase todo o xG do Brasil numa única ameaça clara"],
];
for(const [k,v] of stats){
 p.push(T(60,y,k,{f:MONO,s:22,c:C.paper,w:"700"}));y+=30;
 for(const l of wrap(v,72)){p.push(T(60,y,l,{s:18,c:C.muted,f:SERIF}));y+=25;}y+=16;
}

// por quê
y+=10;
p.push(`<rect x="56" y="${y-26}" width="${W-112}" height="200" rx="12" fill="#14160f" stroke="${C.line}"/>`);
p.push(T(80,y+2,"POR QUÊ",{f:MONO,s:14,c:C.gold,ls:3}));y+=36;
const why="Num jogo em que o Marrocos foi melhor na transição e na entrada no terço final, o Brasil tinha um caminho só pro gol — e o Vinícius era esse caminho. Não foi o melhor jogador em campo no agregado; foi o mais decisivo. Sem o lance dele, o Brasil perde. Eficiência não é plano, mas naquele minuto foi o suficiente.";
for(const l of wrap(why,82)){p.push(T(80,y,l,{s:19,c:C.paper,f:SERIF}));y+=27;}

// vice honesto
y+=44;
p.push(T(60,y,"VICE (HONESTAMENTE)",{f:MONO,s:14,c:C.muted,ls:2}));y+=34;
for(const l of wrap("Bounou. As defesas dele seguraram o 1–1 que, pelo xG (1,33 a 0,99), poderia ter sido derrota do Brasil. Saibari fez o gol e a melhor jogada coletiva da noite.",82)){p.push(T(60,y,l,{s:18,c:C.muted,f:SERIF}));y+=25;}

p.push(`<line x1="60" y1="${H-56}" x2="${W-60}" y2="${H-56}" stroke="${C.line}"/>`);
p.push(T(60,H-26,"Escolha do nosso modelo · dados FIFA EFI + narração ESPN",{f:MONO,s:13,c:C.muted}));
p.push(T(W-60,H-26,"ginga labs — soul & science",{f:MONO,s:13,c:C.gold,a:"end"}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
writeFileSync(new URL("./img/motm-bra-mar-2026.png",import.meta.url), new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng());
console.log("wrote motm-bra-mar-2026.png");
