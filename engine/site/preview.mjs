// Renders a visual mockup of the landing page (SVG -> PNG via resvg) so we can
// react to the branding quickly. Not the real site — the real site is index.html.
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C = { ink:"#0d0f0c", paper:"#f2ead8", gold:"#ffd447", muted:"#9a937f", line:"#2c2f29" };
const SERIF = "Georgia, serif", MONO = "Courier New, monospace";
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const T = (x,y,t,{s=20,c=C.paper,w="normal",f=SERIF,a="start",ls=0}={}) =>
  `<text x="${x}" y="${y}" font-family="${f}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" letter-spacing="${ls}">${esc(t)}</text>`;

const W=1200,H=1500,M=150,R=W-150;
const p=[];
p.push(`<rect width="${W}" height="${H}" fill="${C.ink}"/>`);
// top bar
p.push(`<line x1="${M}" y1="120" x2="${R}" y2="120" stroke="${C.line}"/>`);
p.push(T(M,90,"GINGA",{f:MONO,w:"700",s:24,ls:6}));
p.push(T(M+120,90,"·",{f:MONO,w:"700",s:24,c:C.gold}));
p.push(T(M+145,90,"LABS",{f:MONO,w:"700",s:24,ls:6}));
p.push(T(R,90,"SOUL & SCIENCE",{f:MONO,s:14,c:C.muted,a:"end",ls:3}));
// hero
p.push(T(M,250,"FOOTBALL INTELLIGENCE · TOLD HONESTLY",{f:MONO,s:15,c:C.gold,ls:4}));
const hero=[["We read the game in the ",null],["numbers",C.gold],[" and",null]];
let hx=M;
p.push(T(M,335,"We read the game in the",{s:62,w:"700"}));
p.push(`<text x="${M}" y="410" font-family="${SERIF}" font-size="62" font-weight="700"><tspan fill="${C.gold}">numbers</tspan><tspan fill="${C.paper}"> and tell it</tspan></text>`);
p.push(`<text x="${M}" y="485" font-family="${SERIF}" font-size="62" font-weight="700"><tspan fill="${C.paper}">through the </tspan><tspan fill="${C.gold}">players</tspan><tspan fill="${C.paper}">.</tspan></text>`);
p.push(T(M,560,"An experiment in whether a machine can truly understand",{s:24,c:C.paper}));
p.push(T(M,595,"football — not compute it, but feel it like the street.",{s:24,c:C.paper}));
p.push(`<line x1="${M}" y1="660" x2="${R}" y2="660" stroke="${C.line}"/>`);
// manifesto
p.push(T(M,730,"Most football data is cold, and most storytelling is unbacked.",{s:21,c:C.muted}));
p.push(`<text x="${M}" y="765" font-family="${SERIF}" font-size="21"><tspan fill="${C.paper}" font-weight="700">We refuse the trade-off.</tspan></text>`);
p.push(T(M,825,"Look at the data first. Form a view. Then check the history",{s:21,c:C.muted}));
p.push(T(M,858,"books — and say where the legend is myth, and where the",{s:21,c:C.muted}));
p.push(T(M,891,"numbers found what nobody noticed. When unsure, say so.",{s:21,c:C.muted}));
p.push(`<line x1="${M}" y1="955" x2="${R}" y2="955" stroke="${C.line}"/>`);
// latest
p.push(T(M,1020,"LATEST",{f:MONO,s:15,c:C.muted,ls:4}));
p.push(T(M,1075,"CANON · WORLD CUPS · THE DATA, 1930–2022",{f:MONO,s:14,c:C.muted,ls:2}));
p.push(T(M,1130,"The Era of Not Conceding",{s:42,w:"700",c:C.gold}));
p.push(T(M,1180,"Fontaine scored 13. Schillaci won the same prize with 6.",{s:21,c:C.muted}));
p.push(T(M,1212,"What 22 World Cups of data say about the years football",{s:21,c:C.muted}));
p.push(T(M,1244,"forgot how to score.",{s:21,c:C.muted}));
p.push(`<line x1="${M}" y1="1300" x2="${R}" y2="1300" stroke="${C.line}"/>`);
p.push(T(M,1400,"GINGA·LABS — written by a machine, sourced like a",{f:MONO,s:14,c:C.muted,ls:1}));
p.push(T(M,1428,"journalist, told like a fan.",{f:MONO,s:14,c:C.muted,ls:1}));

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join("")}</svg>`;
const png=new Resvg(svg,{fitTo:{mode:"width",value:1200},font:{loadSystemFonts:true}}).render().asPng();
writeFileSync(new URL("./preview.png",import.meta.url),png);
console.log("wrote engine/site/preview.png");
