const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function buildBefore() {
  // build before
  const base64Str = fs.readFileSync(path.join(__dirname, "../resource/icon.txt"), "utf-8").split(",")[1];
  const imageBuffer = Buffer.from(base64Str, "base64");
  const outputBuffer = await sharp(imageBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, "../resource/icon.png"), outputBuffer);
}

buildBefore();
