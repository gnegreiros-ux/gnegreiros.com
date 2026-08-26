#!/usr/bin/env node
// Processes new photos/videos dropped in gaspesie/originaux/, compresses them
// for the mobile web (webp photos, h264 video + webp poster), appends them to
// public/gaspesie/fotos/dados.json (read by public/gaspesie/album.html), then
// commits and pushes so the existing GitHub Actions workflow builds and
// deploys to OVH automatically. gaspesie/originaux/ is gitignored and never
// touched by git here — only public/gaspesie/fotos/ output is committed.
//
// Video is uploaded to the Cloudflare R2 bucket "gaspesie-videos" (via the
// wrangler CLI — run `npx wrangler login` once) instead of committed: OVH's
// SFTP account has a 1GB quota that video alone blew past in August 2026.
// dados.json stores the R2 public URL as `src`, not a local path.
//
// Also reverse-geocodes GPS coordinates (EXIF for photos, ISO 6709 "location"
// tag for videos) into a place name via OpenStreetMap Nominatim, so the album
// can group photos by place within each day. Runs as a backfill pass too:
// any existing item missing lat/lon/local gets one, as long as its original
// file is still present in gaspesie/originaux/.
//
// Usage:
//   node scripts/gaspesie-publicar.mjs            process + commit + push
//   node scripts/gaspesie-publicar.mjs --no-git    process only, no git actions

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import exifr from "exifr";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGINAIS = path.join(ROOT, "gaspesie/originaux");
const FOTOS = path.join(ROOT, "public/gaspesie/fotos");
const DADOS = path.join(FOTOS, "dados.json");
const LOCAIS_MANUAIS = path.join(ROOT, "gaspesie/locais-manuais.json");
const VIDEO_TIMEZONE = "America/Toronto";
const R2_BUCKET = "gaspesie-videos";
const R2_PUBLIC_BASE = "https://pub-1b342c9179634a29bbdc1651f012b9af.r2.dev";
const NOMINATIM_UA = "gnegreiros.com-gaspesie-album/1.0 (personal travel album, contact: gnegreiros7@gmail.com)";
const NOMINATIM_DELAY_MS = 1100; // Nominatim usage policy: max 1 req/s

const EXT_FOTO = new Set([".jpg", ".jpeg", ".png", ".heic", ".heif"]);
const EXT_VIDEO = new Set([".mp4", ".mov", ".m4v"]);

const noGit = process.argv.includes("--no-git");

function ferramentaDisponivel(cmd) {
  try {
    execFileSync(cmd, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

async function dataHoraFoto(filePath) {
  let d = null;
  try {
    const exif = await exifr.parse(filePath, ["DateTimeOriginal", "CreateDate"]);
    d = exif?.DateTimeOriginal || exif?.CreateDate || null;
  } catch {
    d = null;
  }
  if (!d) d = fs.statSync(filePath).mtime;
  return {
    y: String(d.getFullYear()),
    m: pad2(d.getMonth() + 1),
    d: pad2(d.getDate()),
    hh: pad2(d.getHours()),
    mm: pad2(d.getMinutes()),
  };
}

function infoVideo(filePath) {
  let tags = {};
  let duration = 0;
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "quiet", "-print_format", "json", "-show_format", filePath],
      { encoding: "utf8" }
    );
    const json = JSON.parse(out);
    tags = json.format?.tags || {};
    duration = parseFloat(json.format?.duration || "0") || 0;
  } catch {
    // fall through to mtime below
  }

  const raw = tags["com.apple.quicktime.creationdate"] || tags["creation_time"] || null;
  const instant = raw ? new Date(raw) : fs.statSync(filePath).mtime;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIDEO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const get = (t) => parts.find((p) => p.type === t).value;

  const locRaw = tags["location"] || tags["com.apple.quicktime.location.ISO6709"] || null;
  const gps = locRaw ? parseISO6709(locRaw) : null;

  return {
    date: { y: get("year"), m: get("month"), d: get("day"), hh: get("hour"), mm: get("minute") },
    duration,
    gps,
  };
}

// Parses ISO 6709 coordinate strings like "+49.2255-065.8177+8.011993/"
// (the format QuickTime/ffmpeg store GPS location tags in).
function parseISO6709(str) {
  const m = /^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)/.exec(str);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lon = parseFloat(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

async function gpsFoto(filePath) {
  try {
    const gps = await exifr.gps(filePath);
    if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
      return { lat: gps.latitude, lon: gps.longitude };
    }
  } catch {
    // no GPS data — fine, not all photos have it
  }
  return null;
}

// Manual place-name overrides for spots Nominatim doesn't know at
// locality level (specific beaches, parks, campgrounds), so it would
// otherwise fall back to the enclosing town. Edit gaspesie/locais-manuais.json
// to add more — { nome, lat, lon, raioM } — no code changes needed.
function carregarLocaisManuais() {
  try {
    return JSON.parse(fs.readFileSync(LOCAIS_MANUAIS, "utf8"));
  } catch {
    return [];
  }
}

function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function localManual(lat, lon, overrides) {
  for (const o of overrides) {
    if (distanciaMetros(lat, lon, o.lat, o.lon) <= o.raioM) return o.nome;
  }
  return null;
}

const geoCache = new Map();
let lastNominatimCall = 0;

// Reverse-geocodes lat/lon into a place name via OpenStreetMap Nominatim.
// Queries at zoom=16 (street-level) but reads the *address* hierarchy
// rather than the top-level name/type, which is often just the nearest
// road or amenity — the address block still carries the enclosing
// hamlet/village/town at that zoom. Never translates — returns the name
// as OSM has it, which for Québec places is already in French.
async function nomeLocal(lat, lon) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (geoCache.has(key)) return geoCache.get(key);

  const wait = NOMINATIM_DELAY_MS - (Date.now() - lastNominatimCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimCall = Date.now();

  let nome = null;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`;
    const res = await fetch(url, { headers: { "User-Agent": NOMINATIM_UA } });
    if (res.ok) {
      const j = await res.json();
      const addr = j.address || {};
      nome = addr.hamlet || addr.village || addr.town || addr.city || addr.suburb || addr.county || j.name || null;
    }
  } catch (err) {
    console.warn(`  Reverse geocode failed for ${lat},${lon}: ${err.message}`);
  }

  geoCache.set(key, nome);
  return nome;
}

async function processarFoto(filePath, id) {
  const buf = fs.readFileSync(filePath);
  const thumbPath = path.join(FOTOS, `${id}-thumb.webp`);
  const fullPath = path.join(FOTOS, `${id}.webp`);

  await sharp(buf).rotate().resize(640, 640, { fit: "cover" }).webp({ quality: 62 }).toFile(thumbPath);
  await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 76 }).toFile(fullPath);

  const { y, m, d, hh, mm } = await dataHoraFoto(filePath);
  const gps = await gpsFoto(filePath);
  return {
    id,
    tipo: "foto",
    data: `${y}-${m}-${d}`,
    hora: `${hh}:${mm}`,
    thumb: `fotos/${id}-thumb.webp`,
    full: `fotos/${id}.webp`,
    ...(gps ? { lat: gps.lat, lon: gps.lon } : {}),
  };
}

async function processarVideo(filePath, id) {
  const outPath = path.join(FOTOS, `${id}.mp4`); // temporary — uploaded to R2 then deleted
  const framePath = path.join(FOTOS, `${id}-frame.jpg`);
  const posterPath = path.join(FOTOS, `${id}-poster.webp`);

  const { date, duration, gps } = infoVideo(filePath);
  const seek = duration > 2 ? 1 : 0;

  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", filePath,
    "-vf", "scale=960:960:force_original_aspect_ratio=decrease:force_divisible_by=2",
    "-c:v", "libx264", "-crf", "26", "-preset", "veryfast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    outPath,
  ]);

  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-ss", String(seek), "-i", filePath,
    "-frames:v", "1", framePath,
  ]);
  await sharp(fs.readFileSync(framePath)).resize(640, 640, { fit: "cover" }).webp({ quality: 62 }).toFile(posterPath);
  fs.unlinkSync(framePath);

  const key = `gaspesie/${id}.mp4`;
  execFileSync(
    "npx",
    [
      "-y", "wrangler", "r2", "object", "put", `${R2_BUCKET}/${key}`,
      "--file", outPath,
      "--content-type", "video/mp4",
      "--cache-control", "public, max-age=31536000, immutable",
      "--remote",
    ],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
  );
  fs.unlinkSync(outPath);

  return {
    id,
    tipo: "video",
    data: `${date.y}-${date.m}-${date.d}`,
    hora: `${date.hh}:${date.mm}`,
    src: `${R2_PUBLIC_BASE}/${key}`,
    poster: `fotos/${id}-poster.webp`,
    ...(gps ? { lat: gps.lat, lon: gps.lon } : {}),
  };
}

// Finds the original raw file for an already-published item id (any
// supported extension), used to backfill GPS on items processed before
// location support existed.
function encontrarOriginal(id) {
  for (const ext of [...EXT_FOTO, ...EXT_VIDEO, ...[...EXT_FOTO].map((e) => e.toUpperCase()), ...[...EXT_VIDEO].map((e) => e.toUpperCase())]) {
    const p = path.join(ORIGINAIS, id + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Backfills lat/lon (from the original file, if still present) and local
// (via reverse geocoding) on any item that's missing them. Mutates in place
// and returns whether anything changed.
async function preencherLocais(dados) {
  let alterou = false;

  for (const item of dados) {
    if (item.lat != null && item.lon != null) continue;
    const original = encontrarOriginal(item.id);
    if (!original) continue;
    const gps = item.tipo === "video" ? infoVideo(original).gps : await gpsFoto(original);
    if (gps) {
      item.lat = gps.lat;
      item.lon = gps.lon;
      alterou = true;
    }
  }

  const locaisManuais = carregarLocaisManuais();

  for (const item of dados) {
    if (item.lat == null || item.lon == null || item.local) continue;
    const nome = localManual(item.lat, item.lon, locaisManuais) || (await nomeLocal(item.lat, item.lon));
    if (nome) {
      item.local = nome;
      alterou = true;
    }
  }

  return alterou;
}

async function main() {
  fs.mkdirSync(FOTOS, { recursive: true });

  if (!fs.existsSync(ORIGINAIS)) {
    console.log(`No ${path.relative(ROOT, ORIGINAIS)} folder found — nothing to do.`);
    return;
  }

  const temFfmpeg = ferramentaDisponivel("ffmpeg") && ferramentaDisponivel("ffprobe");

  let dados = [];
  if (fs.existsSync(DADOS)) {
    dados = JSON.parse(fs.readFileSync(DADOS, "utf8"));
  }
  const idsConhecidos = new Set(dados.map((d) => d.id));

  const arquivos = fs
    .readdirSync(ORIGINAIS)
    .filter((f) => !f.startsWith("."))
    .sort();

  const novos = [];

  for (const nome of arquivos) {
    const id = path.parse(nome).name;
    const ext = path.parse(nome).ext.toLowerCase();
    const filePath = path.join(ORIGINAIS, nome);

    if (idsConhecidos.has(id)) continue;

    if (EXT_FOTO.has(ext)) {
      try {
        console.log(`Photo: ${nome}`);
        const item = await processarFoto(filePath, id);
        novos.push(item);
      } catch (err) {
        console.warn(`  Skipped ${nome}: ${err.message}`);
      }
    } else if (EXT_VIDEO.has(ext)) {
      if (!temFfmpeg) {
        console.warn(`  Skipped ${nome}: ffmpeg/ffprobe not found (brew install ffmpeg)`);
        continue;
      }
      try {
        console.log(`Video: ${nome}`);
        const item = await processarVideo(filePath, id);
        novos.push(item);
      } catch (err) {
        console.warn(`  Skipped ${nome}: ${err.message}`);
      }
    } else {
      console.log(`Ignored (unsupported type): ${nome}`);
    }
  }

  if (novos.length) {
    dados = [...dados, ...novos].sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    console.log(`\n${novos.length} new item(s) processed.`);
  } else {
    console.log("No new photos or videos to process.");
  }

  console.log("\nChecking locations (reverse geocoding via OpenStreetMap)...");
  const locaisAlterados = await preencherLocais(dados);
  if (locaisAlterados) console.log("Location data updated.");

  if (!novos.length && !locaisAlterados) {
    console.log("Nothing to update.");
    return;
  }

  fs.writeFileSync(DADOS, JSON.stringify(dados, null, 2) + "\n");
  console.log("dados.json updated.");

  if (noGit) {
    console.log("--no-git: skipping commit/push.");
    return;
  }

  git("add", "public/gaspesie/fotos", "public/gaspesie/album.html", "public/gaspesie/index.html", "gaspesie/locais-manuais.json");
  const staged = git("diff", "--cached", "--name-only").trim();
  if (!staged) {
    console.log("Nothing staged, skipping commit.");
    return;
  }

  let msg;
  if (novos.length) {
    const nFotos = novos.filter((n) => n.tipo === "foto").length;
    const nVideos = novos.filter((n) => n.tipo === "video").length;
    const partes = [];
    if (nFotos) partes.push(`${nFotos} photo${nFotos === 1 ? "" : "s"}`);
    if (nVideos) partes.push(`${nVideos} video${nVideos === 1 ? "" : "s"}`);
    msg = `Add ${partes.join(" and ")} to Gaspésie album`;
  } else {
    msg = "Backfill location data for Gaspésie album";
  }

  git("commit", "-m", msg);
  console.log(`Committed: ${msg}`);
  git("push");
  console.log("Pushed to origin/main.");
  console.log("GitHub Actions will build and deploy to OVH automatically.");
  console.log("URL: https://gnegreiros.com/gaspesie/album.html");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
