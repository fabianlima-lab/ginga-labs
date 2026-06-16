// Designed match report (passmap) from mined StatsBomb data → PNG via resvg.
// Reads ../mining/passmap.json. Brand: dark, gold, the prancheta pitch.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const D = JSON.parse(readFileSync(new URL("../mining/passmap.json", import.meta.url)));
// orient so Brazil attacks → (defenders/GK on the left): anchor on the back line
const _dx = D.nodes.filter(n=>/Back|Goalkeeper/.test(n.pos)).map(n=>n.x);
if (_dx.length && _dx.reduce((a,b)=>a+b,0)/_dx.length > 60) D.nodes.forEach(n=>{ n.x = 120 - n.x; n.y = 80 - n.y; });
const C = { ink:"#0d0f0c", paper:"#f2ead8", gold:"#ffd447", muted:"#9a937f", pitch:"#10231a", line:"#3a5247", red:"#e0625a", green:"#7bbf6a" };
const SERIF="Georgia, serif", MONO="DejaVu Sans Mono, Courier New, monospace", SANS="DejaVu Sans, Arial, sans-serif";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const T=(x,y,t,{s=20,c=C.paper,w="normal",f=SANS,a="start",ls=0}={})=>`<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;

const SHORT={"Thiago Emiliano da Silva":"T. Silva","João Miranda de Souza Filho":"Miranda","Alisson Ramsés Becker":"Alisson","Marcelo Vieira da Silva Júnior":"Marcelo","Fagner Conserva Lemos":"Fagner","Carlos Henrique Casimiro":"Casemiro","Philippe Coutinho Correia":"Coutinho","José Paulo Bezerra Maciel Júnior":"Paulinho","Neymar da Silva Santos Júnior":"Neymar","Willian Borges da Silva":"Willian","Gabriel Fernando de Jesus":"G. Jesus","Roberto Firmino Barbosa de Oliveira":"Firmino"};
const short=n=>SHORT[n]||n.split(" ")[0];

const W=1080,H=1500;
const p=[`<rect width="${W}" height="${H}" fill="${C.ink}"/>`];

// header
p.push(T(60,72,"GINGA·LABS",{f:MONO,s:18,c:C.gold,w:"700",ls:3}));
p.push(T(W-60,72,"PASSMAP · THE CANON",{f:MONO,s:16,c:C.muted,a:"end",ls:2}));
p.push(T(60,140,"BRAZIL 1–2 BELGIUM",{s:58,w:"700",f:SERIF}));
p.push(T(60,180,"World Cup 2018 · quarter-final · the night control wasn't enough",{s:23,c:C.muted,f:SERIF}));

// stat strip
const stats=[["POSSESSION",`${D.stats.poss}%`],["xG","2.61 — 0.41"],["PASSES","532 · 86%"],["SHOTS",`${D.stats.team.shots} — ${D.stats.opp.shots}`]];
stats.forEach(([k,v],i)=>{const x=60+i*255;p.push(T(x,250,k,{f:MONO,s:15,c:C.muted,ls:2}));p.push(T(x,292,v,{s:30,w:"700",c:i===1?C.gold:C.paper,f:MONO}));});
p.push(`<line x1="60" y1="320" x2="${W-60}" y2="320" stroke="${C.line}"/>`);

// pitch region
const PX=70,PY=360,PW=W-140,PH=620;  // pitch box
const sx=v=>PX+(v/120)*PW, sy=v=>PY+(v/80)*PH;
p.push(`<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="10" fill="${C.pitch}" stroke="${C.line}" stroke-width="2"/>`);
// pitch markings
const ml=[`<line x1="${sx(60)}" y1="${PY}" x2="${sx(60)}" y2="${PY+PH}" stroke="${C.line}" stroke-width="2"/>`,
 `<circle cx="${sx(60)}" cy="${sy(40)}" r="${(10/120)*PW}" fill="none" stroke="${C.line}" stroke-width="2"/>`,
 `<rect x="${sx(0)}" y="${sy(18)}" width="${(18/120)*PW}" height="${(44/80)*PH}" fill="none" stroke="${C.line}" stroke-width="2"/>`,
 `<rect x="${sx(102)}" y="${sy(18)}" width="${(18/120)*PW}" height="${(44/80)*PH}" fill="none" stroke="${C.line}" stroke-width="2"/>`];
p.push(...ml);
p.push(T(sx(60),PY-12,"BRAZIL ATTACK →",{f:MONO,s:14,c:C.muted,a:"middle",ls:2}));

// edges
const maxN=Math.max(...D.edges.map(e=>e.n));
const byName=Object.fromEntries(D.nodes.map(n=>[n.name,n]));
for(const e of D.edges){const a=byName[e.a],b=byName[e.b];if(!a||!b)continue;
 const w=1.2+6*(e.n/maxN), op=0.18+0.5*(e.n/maxN);
 p.push(`<line x1="${sx(a.x)}" y1="${sy(a.y)}" x2="${sx(b.x)}" y2="${sy(b.y)}" stroke="${C.gold}" stroke-width="${w.toFixed(1)}" stroke-opacity="${op.toFixed(2)}"/>`);}
// nodes
const maxT=Math.max(...D.nodes.map(n=>n.touches));
for(const n of D.nodes){const r=16+22*(n.touches/maxT);const X=sx(n.x),Y=sy(n.y);
 p.push(`<circle cx="${X}" cy="${Y}" r="${r.toFixed(1)}" fill="${C.gold}" stroke="${C.ink}" stroke-width="2"/>`);
 p.push(T(X,Y+6,String(n.num),{s:19,w:"700",c:C.ink,a:"middle",f:MONO}));
 p.push(T(X,Y+r+22,short(n.name),{s:16,c:C.paper,a:"middle",f:SANS,w:"700"}));}

// findings
let fy=1055;
p.push(T(60,fy,"WHAT THE DATA SEES",{f:MONO,s:16,c:C.gold,ls:3}));fy+=44;
const F=[
 ["2.61 xG — and they lost.","Brazil out-created Belgium six-to-one in expected goals (2.61 vs 0.41) and went out. Courtois saved everything; Belgium needed one De Bruyne counter and a deflection."],
 ["Built through the centre-backs.","Thiago Silva (51 touches) and Miranda (41) saw more of the ball than any midfielder — patient, 86% passing, tilted right (33% vs 26% left). Total control of a game they lost."],
 ["The 2018 World Cup, in one match.","Our Canon flags 2018 as the edition where control bought chances, not goals (it tracked xG, not results). This was the proof: 58% of the ball, the better team — beaten on transition."],
];
F.forEach(([h,b],i)=>{
 p.push(`<circle cx="76" cy="${fy-6}" r="15" fill="none" stroke="${C.gold}" stroke-width="2"/>`);
 p.push(T(76,fy,String(i+1),{s:18,c:C.gold,a:"middle",w:"700",f:MONO}));
 p.push(T(110,fy,h,{s:24,w:"700",c:C.paper,f:SERIF}));fy+=30;
 // wrap body
 const words=b.split(" ");let line="",lines=[];for(const w of words){if((line+" "+w).length>78){lines.push(line);line=w;}else line=(line?line+" ":"")+w;}lines.push(line);
 for(const ln of lines){p.push(T(110,fy,ln,{s:18,c:C.muted,f:SERIF}));fy+=25;}fy+=22;
});

p.push(`<line x1="60" y1="${H-58}" x2="${W-60}" y2="${H-58}" stroke="${C.line}"/>`);
p.push(T(60,H-28,"Pass network: completed passes, starting XI to first sub · data: StatsBomb open",{f:MONO,s:14,c:C.muted}));
p.push(T(W-60,H-28,"ginga labs — soul & science",{f:MONO,s:14,c:C.gold,a:"end",ls:1}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
const png=new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng();
writeFileSync(new URL("./img/report-bra-bel-2018.png",import.meta.url),png);
console.log("wrote engine/site/img/report-bra-bel-2018.png");
