#!/usr/bin/env node
// One-off: uploads the existing Gaspésie .mp4 files to the Cloudflare R2
// bucket "gaspesie-videos" (via the wrangler CLI, using the local `wrangler
// login` session — no separate API keys needed), rewrites each video item's
// `src` in dados.json to the R2 public URL, then removes the local .mp4
// (both from disk and git) since it no longer needs to ship through the
// OVH SFTP deploy. Run once; safe to re-run (skips items already migrated).
//
// Usage: node scripts/migrate-videos-to-r2.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FOTOS = path.join(ROOT, "public/gaspesie/fotos");
const DADOS = path.join(FOTOS, "dados.json");

const BUCKET = "gaspesie-videos";
const PUBLIC_BASE = "https://pub-1b342c9179634a29bbdc1651f012b9af.r2.dev";

function jaMigrado(src) {
  return src.startsWith("https://");
}

async function main() {
  const dados = JSON.parse(fs.readFileSync(DADOS, "utf8"));
  const videos = dados.filter((d) => d.tipo === "video" && !jaMigrado(d.src));

  console.log(`${videos.length} video(s) to migrate to R2.`);

  for (const item of videos) {
    const localPath = path.join(FOTOS, `${item.id}.mp4`);
    if (!fs.existsSync(localPath)) {
      console.warn(`  SKIP ${item.id}: local file missing (${localPath})`);
      continue;
    }

    const key = `gaspesie/${item.id}.mp4`;
    process.stdout.write(`  Uploading ${item.id}.mp4 -> r2:${BUCKET}/${key} ... `);
    execFileSync(
      "npx",
      [
        "-y",
        "wrangler",
        "r2",
        "object",
        "put",
        `${BUCKET}/${key}`,
        "--file",
        localPath,
        "--content-type",
        "video/mp4",
        "--cache-control",
        "public, max-age=31536000, immutable",
        "--remote",
      ],
      { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
    );
    console.log("done");

    item.src = `${PUBLIC_BASE}/${key}`;
  }

  fs.writeFileSync(DADOS, JSON.stringify(dados, null, 2) + "\n");
  console.log("dados.json updated with R2 URLs.");

  for (const item of videos) {
    const localPath = path.join(FOTOS, `${item.id}.mp4`);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  }
  console.log("Local .mp4 files removed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
