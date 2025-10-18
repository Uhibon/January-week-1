// generateAudio.js
// Run once from your repo folder: node generateAudio.js
// Downloads Sage MP3s to /assets/audio

const fs = require("fs");
const https = require("https");
const path = require("path");

const words = [
  "goal","plan","future","dream","challenge","try","change","habit",
  "exercise","study","learn","practice","success","focus","motivation"
];

const baseUrl = "https://bryanharper.tokyo/_functions/tts?voice=sage&text=";
const outDir = path.join(__dirname, "assets", "audio");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(word) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outDir, `${word}.mp3`);
    const file = fs.createWriteStream(filePath);

    https.get(baseUrl + encodeURIComponent(word), (res) => {
      // follow a single redirect if present
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => res2.pipe(file));
      } else if (res.statusCode === 200) {
        res.pipe(file);
      } else {
        return reject(new Error(`HTTP ${res.statusCode} for ${word}`));
      }
      file.on("finish", () => file.close(() => resolve(word)));
    }).on("error", reject);
  });
}

(async () => {
  console.log("🎧 Generating Sage audio files...");
  for (const w of words) {
    try {
      await download(w);
      console.log(`✅ Saved: ${w}.mp3`);
    } catch (e) {
      console.error(`❌ ${w}:`, e.message || e);
    }
  }
  console.log("✨ Done. Files are in /assets/audio");
})();
