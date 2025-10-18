// generateAudio.js
// Run this once locally: node generateAudio.js
// It will create /assets/audio/ and download all Sage voice mp3s automatically

import fs from "fs";
import https from "https";

const words = [
  "goal","plan","future","dream","challenge","try","change","habit",
  "exercise","study","learn","practice","success","focus","motivation"
];

const baseUrl = "https://bryanharper.tokyo/_functions/tts?voice=sage&text=";
const dir = "./assets/audio";

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function download(word) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`${dir}/${word}.mp3`);
    https.get(baseUrl + encodeURIComponent(word), res => {
      if (res.statusCode !== 200) return reject(`Failed: ${res.statusCode}`);
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve(word)));
    }).on("error", reject);
  });
}

(async () => {
  console.log("🎧 Generating Sage audio files...");
  for (const word of words) {
    try {
      await download(word);
      console.log(`✅ Saved: ${word}.mp3`);
    } catch (err) {
      console.error(`❌ ${word}:`, err);
    }
  }
  console.log("✨ All audio generated successfully!");
})();
