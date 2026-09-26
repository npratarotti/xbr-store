import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const input = join(root, "public", "logo.svg");
const outDir = join(root, "public", "icons");
async function main() {
  await mkdir(outDir, { recursive: true });
  for (const size of [192, 512]) {
    const out = join(outDir, `icon-${size}.png`);
    await sharp(input).resize(size, size).png({ quality: 100 }).toFile(out);
    console.log("Gerado: public/icons/icon-" + size + ".png");
  }
  await sharp(input).resize(512, 512).png().toFile(join(outDir, "maskable-512.png"));
  console.log("Gerado: public/icons/maskable-512.png");
  console.log("OK!");
}
main().catch((err) => { console.error(err); process.exit(1); });
