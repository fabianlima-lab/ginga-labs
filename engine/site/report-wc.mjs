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
p.push(T(W-60,70,"WORLD CUP 2026 · GROUP C",{f:MONO,s:15,c:C.muted,a:"end",ls:2}));
p.push(T(60,142,"BRAZIL 1–1 MOROCCO",{s:56,w:"700",f:SERIF}));
p.push(T(60,182,"phase by phase — who actually won each moment",{s:23,c:C.muted,f:SERIF}));

const strip=[["POSSESSION","47% — 45%"],["xG","0.99 — 1.33"],["SHOTS (ON)","12(5) — 14(3)"],["DISTANCE","113.7 — 114.9 km"]];
strip.forEach(([k,v],i)=>{const x=60+i*255;p.push(T(x,250,k,{f:MONO,s:14,c:C.muted,ls:1}));p.push(T(x,290,v,{s:24,w:"700",c:i===1?C.gold:C.paper,f:MONO}));});

// phases
const EDGE={BRAZIL:C.gold,MOROCCO:C.red,EVEN:C.muted};
const phases=[
 ["Build-up","BRAZIL",
  "Marquinhos–Gabriel 51 passes (the CB spine) · Douglas Santos → Vinícius 16, the busiest attacking link",
  "Brazil deliberately overloaded the left — Douglas Santos, Paquetá and Bruno funnelling to Vinícius to isolate him 1v1. That matchup is exactly how they scored."],
 ["Pressing & transition","MOROCCO",
  "50 forced turnovers to 41 · 79 second balls to 56 · ball won back in 16.8s vs 18.0s",
  "Morocco's counter-press swarmed every loose ball and turned Brazil's build-up into chaos. Brazil pressed more (315 pressures) — Morocco's was sharper and faster."],
 ["Final third","MOROCCO",
  "149 final-third receptions to 100 · xG 1.33 to 0.99 · 49 ball progressions to 30",
  "Morocco got there far more often. Brazil arrived less, but more dangerously — one Vinícius isolation outweighed Morocco's volume."],
 ["Set pieces","EVEN",
  "6 corners to 2 · 0 set-piece goals · both goals from open play",
  "Brazil's set-piece volume brought no end product. The game was settled in open play, not the box."],
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
p.push(T(80,y+4,"VERDICT",{f:MONO,s:15,c:C.gold,ls:3}));
y+=40;
const verd="Morocco edged the phases that decide games by volume — transition and final-third entry — and deserved more than a point. Brazil's one clear advantage, the engineered left-side 1v1 for Vinícius, is precisely what rescued the draw. One plan, one goal.";
for(const l of wrap(verd,86)){p.push(T(80,y,l,{s:19,c:C.paper,f:SERIF}));y+=28;}

p.push(`<line x1="60" y1="${H-56}" x2="${W-60}" y2="${H-56}" stroke="${C.line}"/>`);
p.push(T(60,H-26,"Source: FIFA Enhanced Football Intelligence — post-match report (free)",{f:MONO,s:13,c:C.muted}));
p.push(T(W-60,H-26,"ginga labs — soul & science",{f:MONO,s:13,c:C.gold,a:"end"}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
writeFileSync(new URL("./img/report-bra-mar-2026.png",import.meta.url), new Resvg(svg,{fitTo:{mode:"width",value:W},font:{loadSystemFonts:true}}).render().asPng());
console.log("wrote report-bra-mar-2026.png");
