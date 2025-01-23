const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const env = require("../main/env.json");

async function buildAfter() {
  // zip
  const destinationZip = path.join(__dirname, "../release/release.zip");
  const output = fs.createWriteStream(destinationZip);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  const macPack = path.join(__dirname, `../release/${env.name}.dmg`);
  if (fs.existsSync(macPack)) {
    archive.file(macPack, { name: `${env.name}.dmg` });
  }
  const winPack = path.join(__dirname, `../release/${env.name}.exe`);
  if (fs.existsSync(winPack)) {
    archive.file(winPack, { name: `${env.name}.exe` });
  }
  await archive.finalize();
}

buildAfter();
