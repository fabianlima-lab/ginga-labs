// Data charts that back the story — rendered from our actual mined numbers.
// SVG -> PNG via resvg. Self-contained (title + source on each), so they travel
// well as standalone images (Twitter format).
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync(new URL("./img/", import.meta.url), { recursive: true });

const C = { ink:"#0d0f0c", paper:"#f2ead8", gold:"#ffd447", dim:"#5f5a45", muted:"#9a937f", line:"#2c2f29" };
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const T = (x,y,t,o={}) => `<text x="${x}" y="${y}" font-family="${o.f||'Georgia, serif'}" font-size="${o.s||20}" fill="${o.c||C.paper}" font-weight="${o.w||'normal'}" text-anchor="${o.a||'start'}" letter-spacing="${o.ls||0}"${o.rot?` transform="rotate(${o.rot} ${x} ${y})"`:''}>${esc(t)}</text>`;

function bars({ title, sub, data, max, source, highlight = {}, rotX = 0, w = 1000, h = 600 }) {
  const padL = 60, padR = 40, padT = 130, padB = rotX ? 70 : 80;
  const cw = w - padL - padR, ch = h - padT - padB, base = padT + ch;
  const n = data.length, gap = (cw * 0.28) / n, bw = (cw - gap * (n - 1)) / n;
  let body = "";
  data.forEach(([label, val], i) => {
    const x = padL + i * (bw + gap), bh = ch * val / max, y = base - bh;
    const hl = highlight[label];
    body += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="2" fill="${hl ? C.gold : C.dim}"/>`;
    if (hl) body += T(x + bw/2, y - 12, hl === true ? String(val) : hl, { s: 22, c: C.gold, w: "700", a: "middle" });
    body += T(x + bw/2, base + (rotX ? 22 : 26), String(label), { s: rotX ? 13 : 16, c: C.muted, a: rotX ? "end" : "middle", f: "Courier New, monospace", rot: rotX });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${C.ink}"/>
    ${T(padL, 56, title, { s: 30, w: "700" })}
    ${T(padL, 88, sub, { s: 17, c: C.muted })}
    <line x1="${padL}" y1="${base}" x2="${w - padR}" y2="${base}" stroke="${C.line}"/>
    ${body}
    ${T(padL, h - 16, source, { s: 12, c: C.dim, f: "Courier New, monospace" })}
    ${T(w - padR, h - 16, "GINGA·LABS", { s: 12, c: C.dim, a: "end", f: "Courier New, monospace", ls: 2 })}
  </svg>`;
}

function out(name, svg) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1000 }, font: { loadSystemFonts: true } }).render().asPng();
  writeFileSync(new URL(`./img/${name}.png`, import.meta.url), png);
  console.log("wrote img/" + name + ".png");
}

// Chart 1 — Golden Boot goals per tournament (the decline + the flat-6 plateau)
out("golden-boot", bars({
  title: "The Golden Boot, by tournament",
  sub: "Goals it took to win it — top scorer, each World Cup",
  source: "Source: Wikipedia (FIFA World Cup Golden Boot)",
  max: 14, rotX: -90,
  data: [["1930",8],["1934",5],["1938",7],["1950",9],["1954",11],["1958",13],["1962",4],["1966",9],["1970",10],["1974",7],["1978",6],["1982",6],["1986",6],["1990",6],["1994",6],["1998",6],["2002",8],["2006",5],["2010",5],["2014",6],["2018",6],["2022",8]],
  highlight: { "1958": "Fontaine 13", "1990": "Schillaci 6" },
}));

// Chart 2 — goals in the final, by era (the collapse and the rebound)
out("final-goals", bars({
  title: "Goals in the World Cup final, by era",
  sub: "The collapse to 1990 — and the recent rebound",
  source: "Source: Wikipedia (List of FIFA World Cup finals)",
  max: 6.5,
  data: [["1930–70", 5.0], ["1974–86", 4.0], ["1990–2014", 1.4], ["2018–22", 6.0]],
  highlight: { "1990–2014": true, "2018–22": true },
}));
