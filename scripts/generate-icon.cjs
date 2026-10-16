const fs = require("fs");
const path = require("path");
const { Jimp } = require("jimp");
const pngToIco = require("png-to-ico").default || require("png-to-ico");

const SOURCE = path.join(__dirname, "..", "src", "assets", "image", "fanalamanga-logo.png");
const OUTPUT_DIR = path.join(__dirname, "..", "build");
const OUTPUT = path.join(OUTPUT_DIR, "icon.ico");
const SIZES = [256, 128, 64, 48, 32, 16];

async function main() {
  const source = await Jimp.read(SOURCE);
  const buffers = [];

  for (const size of SIZES) {
    const image = source.clone().resize({ w: size, h: size });
    buffers.push(await image.getBuffer("image/png"));
  }

  const ico = await pngToIco(buffers);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, ico);
  console.log(`Icone generee : ${OUTPUT} (${SIZES.join(", ")} px)`);
}

main().catch((error) => {
  console.error("Echec de la generation de l'icone :", error);
  process.exit(1);
});
