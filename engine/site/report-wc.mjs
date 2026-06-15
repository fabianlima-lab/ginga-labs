// WC 2026 match report from FREE FIFA Enhanced Football Intelligence data.
// Brazil 1-1 Morocco — the "underlying numbers" story. SVG -> PNG via resvg.
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C={ink:"#0d0f0c",paper:"#f2ead8",gold:"#ffd447",muted:"#9a937f",red:"#e0625a",line:"#2c2f29",dimg:"#5f5a2a",dimr:"#5a3330"};
const SERIF="Georgia, serif",MONO="DejaVu Sans Mono, monospace",SANS="DejaVu Sans, Arial, sans-serif";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const T=(x,y,t,{s=20,c=C.paper,w="normal",f=SANS,a="start",ls=0}={})=>`<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;

const W=1080,H=1440,p=[`<rect width="${W}" height="${H}" fill="${C.ink}"/>`];
// header
p.push(T(60,70,"GINGA·LABS",{f:MONO,s:18,c:C.gold,w:"700",ls:3}));
p.push(T(W-60,70,"WORLD CUP 2026 · MATCHDAY 1",{f:MONO,s:15,c:C.muted,a:"end",ls:2}));
p.push(T(60,142,"BRAZIL 1–1 MOROCCO",{s:56,w:"700",f:SERIF}));
p.push(T(60,182,"Group C · the draw that flattered the favourites",{s:23,c:C.muted,f:SERIF}));

// stat strip
const strip=[["POSSESSION","47% — 45%"],["xG","0.99 — 1.33"],["SHOTS (ON)","12(5) — 14(3)"],["DISTANCE","113.7 — 114.9 km"]];
strip.forEach(([k,v],i)=>{const x=60+i*255;p.push(T(x,250,k,{f:MONO,s:14,c:C.muted,ls:1}));p.push(T(x,290,v,{s:25,w:"700",c:i===1?C.gold:C.paper,f:MONO}));});
p.push(`<line x1="60" y1="320" x2="${W-60}" y2="320" stroke="${C.line}"/>`);

// underlying numbers — tug of war
p.push(T(60,372,"THE UNDERLYING NUMBERS",{f:MONO,s:17,c:C.gold,ls:3}));
p.push(T(W-60,372,"by FIFA's own tracking",{f:MONO,s:15,c:C.muted,a:"end"}));
const cx=540, maxLen=350;
// [label, brazil, morocco, fmt]
const rows=[
 ["Expected goals (xG)",0.99,1.33,v=>v.toFixed(2)],
 ["Final-third receptions",100,149,v=>v],
 ["Ball progressions",30,49,v=>v],
 ["Forced turnovers",41,50,v=>v],
 ["Second balls won",56,79,v=>v],
 ["Defensive pressures",315,285,v=>v],
];
let y=440;
for(const [lab,b,m,fmt] of rows){
 const rmax=Math.max(b,m), lb=(b/rmax)*maxLen, lm=(m/rmax)*maxLen;
 const bWin=b>m;
 p.push(T(cx,y-30,lab,{f:MONO,s:15,c:C.paper,a:"middle",ls:1}));
 p.push(`<rect x="${cx-lb}" y="${y-18}" width="${lb}" height="26" rx="3" fill="${bWin?C.gold:C.dimg}"/>`);
 p.push(`<rect x="${cx}" y="${y-18}" width="${lm}" height="26" rx="3" fill="${!bWin?C.red:C.dimr}"/>`);
 p.push(T(cx-lb-12,y+1,fmt(b),{f:MONO,s:19,w:"700",c:bWin?C.gold:C.muted,a:"end"}));
 p.push(T(cx+lm+12,y+1,fmt(m),{f:MONO,s:19,w:"700",c:!bWin?C.red:C.muted}));
 y+=72;
}
p.push(`<line x1="${cx}" y1="410" x2="${cx}" y2="${y-50}" stroke="${C.line}" stroke-dasharray="3 5"/>`);
p.push(T(cx-maxLen,y-8,"◄ BRAZIL",{f:MONO,s:14,c:C.gold,ls:1}));
p.push(T(cx+maxLen,y-8,"MOROCCO ►",{f:MONO,s:14,c:C.red,a:"end",ls:1}));

// findings
y+=44; p.push(`<line x1="60" y1="${y-30}" x2="${W-60}" y2="${y-30}" stroke="${C.line}"/>`);
p.push(T(60,y,"WHAT THE DATA SEES",{f:MONO,s:17,c:C.gold,ls:3})); y+=44;
const F=[
 ["The draw flattered the favourites.","Morocco out-created Brazil (1.33 xG to 0.99), reached the final third half-again as often (149 receptions to 100) and progressed the ball far more (49 to 30). On the numbers, the African side were the better team."],
 ["Morocco won the war for loose balls.","79 second balls to 56, 50 forced turnovers to 41, and they won possession back faster (16.8s vs 18.0s). Brazil pressed more — 315 pressures to 285 — and it bought them less."],
 ["Brazil built through the back, and only went left.","Marquinhos and Gabriel Magalhães swapped 51 passes — the spine of everything. The one attacking artery was the left: Douglas Santos fed Vinícius 16 times. Casemiro, the pivot, was a bystander."],
];
F.forEach(([h,b],i)=>{
 p.push(`<circle cx="76" cy="${y-6}" r="15" fill="none" stroke="${C.gold}" stroke-width="2"/>`);
 p.push(T(76,y,String(i+1),{s:18,c:C.gold,a:"middle",w:"700",f:MONO}));
 p.push(T(110,y,h,{s:23,w:"700",c:C.paper,f:SERIF})); y+=30;
 const words=b.split(" ");let ln="",lines=[];for(const w of words){if((ln+" "+w).length>80){lines.push(ln);ln=w;}else ln=(ln?ln+" ":"")+w;}lines.push(ln);
 for(const l of lines){p.push(T(110,y,l,{s:18,c:C.muted,f:SERIF}));y+=25;} y+=20;
});

p.push(`<line x1="60" y1="${H-58}" x2="${W-60}" y2="${H-58}" stroke="${C.line}"/>`);
p.push(T(60,H-28,"Source: FIFA Enhanced Football Intelligence — post-match summary report (free)",{f:MONO,s:13,c:C.muted}));
p.push(T(W-60,H-28,"ginga labs — soul & science",{f:MONO,s:13,c:C.gold,a:"end"}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
writeFileSync(new URL("./img/report-bra-mar-2026.png",import.meta.url), new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng());
console.log("wrote engine/site/img/report-bra-mar-2026.png");
