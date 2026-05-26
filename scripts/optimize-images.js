/**
 * optimize-images.js
 * Converte le immagini PNG pesanti in WebP per ridurre drasticamente le dimensioni.
 * Uso: node scripts/optimize-images.js
 */

import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "src", "assets");

// File PNG da convertire (quelli pesanti)
const PNG_TARGETS = [
  "autosort/autosort.png",
  "dev/legrandtabou-site.png",
  "dev/imediatop-site.png",
  "dev/trullidigiulia_site.png",
  "enzotedeschiphoto.png",
];

// Foto JPG da ottimizzare (ridurre dimensioni se troppo grandi)
const JPG_TARGETS = [
  "photos/IMG_7849-2-refined_compressed.jpg",
  "photos/IMG_8031-compressed.jpg",
  "photos/IMG_8172-compressed.jpg",
  "photos/IMG_8252-compressed.jpg",
  "photos/Ninfe_compressed.jpg",
  "photos/fotoprofumi1_def_compressed.jpg",
  "photos/fotoprofumi3_compressed.jpg",
  "photos/fotoprofumi4_def_compressed.jpg",
];

const WEBP_QUALITY = 85;
const MAX_WIDTH = 1600; // px — sufficiente per schermi retina
const ABOUT_MAX_WIDTH = 1200; // px — foto about non serve più grande

async function getFileSize(filepath) {
  const s = await stat(filepath);
  return s.size;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

async function convertPngToWebp(relativePath) {
  const inputPath = join(ASSETS_DIR, relativePath);
  const outputPath = inputPath.replace(/\.png$/i, ".webp");
  const isAboutPhoto = relativePath.includes("enzotedeschiphoto");
  const maxWidth = isAboutPhoto ? ABOUT_MAX_WIDTH : MAX_WIDTH;

  try {
    const originalSize = await getFileSize(inputPath);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let pipeline = image;
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
    }

    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

    const newSize = await getFileSize(outputPath);
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(
      `✅ ${relativePath}`,
      `\n   ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% saved)`,
    );
  } catch (err) {
    console.error(`❌ ${relativePath}: ${err.message}`);
  }
}

async function optimizeJpgToWebp(relativePath) {
  const inputPath = join(ASSETS_DIR, relativePath);
  const outputPath = inputPath.replace(/\.jpg$/i, ".webp");

  try {
    const originalSize = await getFileSize(inputPath);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let pipeline = image;
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

    const newSize = await getFileSize(outputPath);
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(
      `✅ ${relativePath}`,
      `\n   ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% saved)`,
    );
  } catch (err) {
    console.error(`❌ ${relativePath}: ${err.message}`);
  }
}

async function main() {
  console.log("🖼️  Ottimizzazione immagini — PNG → WebP\n");
  console.log("=".repeat(50));

  for (const file of PNG_TARGETS) {
    await convertPngToWebp(file);
  }

  console.log("\n" + "=".repeat(50));
  console.log("\n📸 Ottimizzazione foto JPG → WebP\n");

  for (const file of JPG_TARGETS) {
    await optimizeJpgToWebp(file);
  }

  console.log("\n✨ Fatto! Aggiorna gli import in projects.js e about.js");
}

main();
