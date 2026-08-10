#!/usr/bin/env node
// Processes new photos/videos dropped in gaspesie/originaux/, compresses them
// for the mobile web (webp photos, h264 video + webp poster), appends them to
// public/gaspesie/fotos/dados.json (read by public/gaspesie/album.html), then
// commits and pushes so the existing GitHub Actions workflow builds and
// deploys to OVH automatically. gaspesie/originaux/ is gitignored and never
// touched by git here — only public/gaspesie/fotos/ output is committed.
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
const VIDEO_TIMEZONE = "America/Toronto";

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

  return {
    date: { y: get("year"), m: get("month"), d: get("day"), hh: get("hour"), mm: get("minute") },
    duration,
  };
}

async function processarFoto(filePath, id) {
  const buf = fs.readFileSync(filePath);
  const thumbPath = path.join(FOTOS, `${id}-thumb.webp`);
  const fullPath = path.join(FOTOS, `${id}.webp`);

  await sharp(buf).rotate().resize(640, 640, { fit: "cover" }).webp({ quality: 62 }).toFile(thumbPath);
  await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 76 }).toFile(fullPath);

  const { y, m, d, hh, mm } = await dataHoraFoto(filePath);
  return {
    id,
    tipo: "foto",
    data: `${y}-${m}-${d}`,
    hora: `${hh}:${mm}`,
    thumb: `fotos/${id}-thumb.webp`,
    full: `fotos/${id}.webp`,
  };
}

async function processarVideo(filePath, id) {
  const outPath = path.join(FOTOS, `${id}.mp4`);
  const framePath = path.join(FOTOS, `${id}-frame.jpg`);
  const posterPath = path.join(FOTOS, `${id}-poster.webp`);

  const { date, duration } = infoVideo(filePath);
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

  return {
    id,
    tipo: "video",
    data: `${date.y}-${date.m}-${date.d}`,
    hora: `${date.hh}:${date.mm}`,
    src: `fotos/${id}.mp4`,
    poster: `fotos/${id}-poster.webp`,
  };
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

  if (!novos.length) {
    console.log("No new photos or videos to process.");
    return;
  }

  dados = [...dados, ...novos].sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  fs.writeFileSync(DADOS, JSON.stringify(dados, null, 2) + "\n");
  console.log(`\n${novos.length} new item(s) processed. dados.json updated.`);

  if (noGit) {
    console.log("--no-git: skipping commit/push.");
    return;
  }

  git("add", "public/gaspesie/fotos", "public/gaspesie/album.html", "public/gaspesie/index.html");
  const staged = git("diff", "--cached", "--name-only").trim();
  if (!staged) {
    console.log("Nothing staged, skipping commit.");
    return;
  }

  const nFotos = novos.filter((n) => n.tipo === "foto").length;
  const nVideos = novos.filter((n) => n.tipo === "video").length;
  const partes = [];
  if (nFotos) partes.push(`${nFotos} photo${nFotos === 1 ? "" : "s"}`);
  if (nVideos) partes.push(`${nVideos} video${nVideos === 1 ? "" : "s"}`);
  const msg = `Add ${partes.join(" and ")} to Gaspésie album`;

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
