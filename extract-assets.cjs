const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const htmlFile = path.resolve(process.argv[2] || "index.html");
const outputDir = path.join(path.dirname(htmlFile), "assets", "extracted");

if (!fs.existsSync(htmlFile)) {
  console.error("index.html not found:", htmlFile);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

let html = fs.readFileSync(htmlFile, "utf8");
let count = 0;
const saved = new Map();

const pattern = /data:(image|video)\/([a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\r\n]+)(?=["')\s])/g;

html = html.replace(pattern, (match, type, mime, encoded) => {
  const buffer = Buffer.from(encoded.replace(/\s/g, ""), "base64");

  if (!buffer.length) return match;

  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const ext = mime.toLowerCase().replace("jpeg", "jpg").replace("svg+xml", "svg");
  const filename = `${type}-${hash}.${ext}`;
  const destination = path.join(outputDir, filename);

  if (!saved.has(hash)) {
    fs.writeFileSync(destination, buffer);
    saved.set(hash, filename);
    count++;
  }

  return `assets/extracted/${filename}`;
});

fs.writeFileSync(htmlFile, html, "utf8");

console.log(`Completed. Extracted ${count} unique files.`);
console.log("Assets folder:", outputDir);
console.log("Updated HTML:", htmlFile);
