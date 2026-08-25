#!/usr/bin/env node
// One-off precompute: projects the 41 real places recorded in the Gaspésie
// album (public/gaspesie/fotos/dados.json) onto the hand-plotted schematic
// SVG map in public/gaspesie/index.html (viewBox 0 0 1080 620).
//
// A global affine fit (lat/lon -> x/y) was tried against the 12 places that
// exist both as real GPS clusters and as hand-plotted STOPS/REFCITIES points
// -- error up to 71px (Carleton-sur-Mer), unacceptable on a 1080-wide map
// that promises accurate positions. Nearest-neighbor geometric blending is
// worse (up to 202px) because the coastline folds back on itself near the
// peninsula tip and across the ferry gap, so raw geographic proximity picks
// control points across water.
//
// Instead: interpolate each real place along the known route order, between
// its two nearest *route-adjacent* control points, using detour distance
// (haversine(A,P)+haversine(P,B)-haversine(A,B)) to pick the right segment.
// This follows the route's topology instead of raw geography, and exactly
// reproduces the 12 control points (t=0 or t=1).
//
// Usage: node scripts/gaspesie-mapa-real.mjs
// Prints the assignment table + the REAL_STOPS array to paste into index.html.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DADOS = path.join(ROOT, "public/gaspesie/fotos/dados.json");

// Control points: real place name -> hand-plotted {x,y} already in
// public/gaspesie/index.html (STOPS/REFCITIES). Most have real lat/lon
// pulled from dados.json photo GPS (matched by `local` name below); a few
// (marked `latlon`) are REFCITIES with no photo taken there -- the outbound
// (Charlevoix, north shore) and return (highway 20, south shore) legs are
// each covered by a single STOPS pair 500+ km apart, which is too coarse:
// several real photo-stops fall along these legs and need finer waypoints
// to interpolate against. These use well-known town-center coordinates
// (accurate to a few km, i.e. sub-pixel to a few px at this map's scale --
// far better than leaving 500 km of coastline as one straight chord).
const CONTROL_XY = {
  "Trois-Rivières": { x: 88, y: 554 },
  "Baie-Saint-Paul": { x: 308, y: 378, latlon: [47.4409, -70.5044] },
  "Tadoussac": { x: 397, y: 248 },
  "Les Escoumins": { x: 432, y: 213 },
  "Godbout": { x: 637, y: 48 },
  "Cap-Chat-Est": { x: 763, y: 80 },
  "Mont-Saint-Pierre": { x: 824, y: 82 },
  "Rivière-au-Renard": { x: 977, y: 84 },
  "Gaspé": { x: 1010, y: 132 },
  "Percé": { x: 1022, y: 184 },
  "Chandler": { x: 910, y: 251 },
  "Carleton-sur-Mer": { x: 705, y: 268 },
  "Sainte-Flavie": { x: 559, y: 178 },
  "Rivière-du-Loup": { x: 374, y: 355, latlon: [47.8288, -69.5405] },
  "La Pocatière": { x: 326, y: 424, latlon: [47.3667, -70.0333] },
  "Montmagny": { x: 272, y: 462, latlon: [46.9836, -70.5561] },
  "Québec / Lévis": { x: 215, y: 497, latlon: [46.8082, -71.1778] },
  "Bécancour": { x: 95, y: 560, latlon: [46.3298, -72.4335] },
};

// Route order: consecutive pairs define the segments real places get
// interpolated along. Trois-Rivières appears at both ends (round trip).
// Outbound = north shore via Charlevoix; return = south shore via hwy 20.
const ROUTE_ORDER = [
  "Trois-Rivières",
  "Baie-Saint-Paul",
  "Tadoussac",
  "Les Escoumins",
  "Godbout",
  "Cap-Chat-Est",
  "Mont-Saint-Pierre",
  "Rivière-au-Renard",
  "Gaspé",
  "Percé",
  "Chandler",
  "Carleton-sur-Mer",
  "Sainte-Flavie",
  "Rivière-du-Loup",
  "La Pocatière",
  "Montmagny",
  "Québec / Lévis",
  "Bécancour",
  "Trois-Rivières",
];

// Manual overrides for places the automatic detour-minimization might place
// on a visually wrong segment. { local: [segmentFromName, segmentToName] }
const OVERRIDE = {};

function haversineMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function centroides(dados) {
  const porLocal = new Map();
  for (const it of dados) {
    if (!it.local || it.lat == null || it.lon == null) continue;
    if (!porLocal.has(it.local)) porLocal.set(it.local, []);
    porLocal.get(it.local).push(it);
  }
  const out = [];
  for (const [local, itens] of porLocal) {
    const lat = itens.reduce((s, i) => s + i.lat, 0) / itens.length;
    const lon = itens.reduce((s, i) => s + i.lon, 0) / itens.length;
    const primeira = itens.slice().sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))[0];
    out.push({ local, lat, lon, n: itens.length, data: primeira.data, hora: primeira.hora });
  }
  return out.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function main() {
  const dados = JSON.parse(fs.readFileSync(DADOS, "utf8"));
  const lugares = centroides(dados);

  // Real lat/lon for each control point comes from the actual photo data,
  // not guessed — build it from the same centroids.
  const controlReal = {};
  for (const l of lugares) {
    if (CONTROL_XY[l.local]) controlReal[l.local] = l;
  }
  for (const [nome, xy] of Object.entries(CONTROL_XY)) {
    if (!controlReal[nome] && xy.latlon) {
      controlReal[nome] = { local: nome, lat: xy.latlon[0], lon: xy.latlon[1] };
    }
  }
  const faltando = Object.keys(CONTROL_XY).filter((n) => !controlReal[n]);
  if (faltando.length) {
    console.warn("Control points with no real GPS (photo or manual latlon):", faltando);
  }

  const segmentos = [];
  for (let i = 0; i < ROUTE_ORDER.length - 1; i++) {
    const aName = ROUTE_ORDER[i];
    const bName = ROUTE_ORDER[i + 1];
    const a = controlReal[aName];
    const b = controlReal[bName];
    if (!a || !b) continue;
    segmentos.push({
      aName, bName,
      a: { lat: a.lat, lon: a.lon, ...CONTROL_XY[aName] },
      b: { lat: b.lat, lon: b.lon, ...CONTROL_XY[bName] },
      distAB: haversineMetros(a.lat, a.lon, b.lat, b.lon),
    });
  }

  console.log(`${lugares.length} real places, ${segmentos.length} route segments, ${Object.keys(controlReal).length}/${Object.keys(CONTROL_XY).length} control points resolved.\n`);

  const projetados = [];
  for (const lugar of lugares) {
    let melhor = null;
    const overrideNames = OVERRIDE[lugar.local];
    const candidatos = overrideNames
      ? segmentos.filter((s) => s.aName === overrideNames[0] && s.bName === overrideNames[1])
      : segmentos;

    for (const seg of candidatos) {
      const distAP = haversineMetros(seg.a.lat, seg.a.lon, lugar.lat, lugar.lon);
      const distPB = haversineMetros(lugar.lat, lugar.lon, seg.b.lat, seg.b.lon);
      const detour = distAP + distPB - seg.distAB;
      if (!melhor || detour < melhor.detour) {
        melhor = { seg, distAP, detour };
      }
    }

    if (!melhor) {
      console.warn(`  No segment found for ${lugar.local} -- skipping`);
      continue;
    }

    const t = Math.max(0, Math.min(1, melhor.distAP / melhor.seg.distAB));
    const x = melhor.seg.a.x + t * (melhor.seg.b.x - melhor.seg.a.x);
    const y = melhor.seg.a.y + t * (melhor.seg.b.y - melhor.seg.a.y);

    console.log(
      `${lugar.data} ${lugar.hora}  ${lugar.local.padEnd(42)} -> [${melhor.seg.aName} .. ${melhor.seg.bName}] t=${t.toFixed(2)} detour=${Math.round(melhor.detour / 1000)}km  x=${x.toFixed(0)} y=${y.toFixed(0)}`
    );

    projetados.push({ ...lugar, x, y });
  }

  // Merge screen-close consecutive points (chronological order already holds).
  const MERGE_PX = 15;
  const mesclados = [];
  for (const p of projetados) {
    const ultimo = mesclados[mesclados.length - 1];
    if (ultimo && Math.hypot(p.x - ultimo.x, p.y - ultimo.y) < MERGE_PX) {
      ultimo.locais.push(p.local);
      ultimo.dataFim = p.data;
      ultimo.n += p.n;
    } else {
      mesclados.push({ x: p.x, y: p.y, locais: [p.local], data: p.data, dataFim: p.data, n: p.n });
    }
  }

  console.log(`\n${projetados.length} points projected, ${mesclados.length} after merging (<${MERGE_PX}px apart).\n`);

  const linhas = mesclados.map((m) => {
    const label = m.locais.join(" / ");
    const dataTxt = m.data === m.dataFim ? m.data : `${m.data} → ${m.dataFim}`;
    return `  { x:${m.x.toFixed(1)}, y:${m.y.toFixed(1)}, label:${JSON.stringify(label)}, data:${JSON.stringify(dataTxt)}, n:${m.n} }`;
  });

  console.log("const REAL_STOPS = [");
  console.log(linhas.join(",\n"));
  console.log("];");

  // Unmerged, one entry per unique `local` name (chronological), for the
  // album's per-place mini-map: draws the real path traveled from home up
  // to and including whichever place that block is, instead of a straight
  // line. "__inicio__" is a synthetic first point (the real Trois-Rivières
  // departure fix) that never matches a real `local` name.
  const caminho = [
    `  { x:88, y:554, local:"__inicio__" }`,
    ...projetados.map((p) => `  { x:${p.x.toFixed(1)}, y:${p.y.toFixed(1)}, local:${JSON.stringify(p.local)} }`),
  ];
  console.log("\nconst PLACE_PATH = [");
  console.log(caminho.join(",\n"));
  console.log("];");
}

main();
