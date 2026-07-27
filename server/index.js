const fs = require("fs");
const path = require("path");
const youtubedl = require("youtube-dl-exec");

const PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLQlOi0ZSQB904Z2-QQERyHMNTlCFknwpX";

const MUSIC_DIR = path.join(__dirname, "../music");
const OUTPUT_JSON = path.join(__dirname, "../mymusic.json");

// Create music folder if it doesn't exist
if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

async function run() {
  console.log("🌌 Fetching playlist...");

  let info;
  try {
    info = await youtubedl(PLAYLIST_URL, {
      dumpSingleJson: true,
      noWarnings: true,
      flatPlaylist: true
    });
  } catch (err) {
    console.error("❌ Failed to fetch playlist:", err.message);
    return;
  }

  const entries = info.entries || [];

  let playlist = [];

  for (let i = 0; i < entries.length; i++) {
    const video = entries[i];

    if (!video || !video.url) continue;

    const url = video.url.includes("http")
      ? video.url
      : `https://www.youtube.com/watch?v=${video.url}`;

    try {
      console.log(`⬇️ Downloading: ${video.title}`);

      const safeName = `song_${i}`;

      await youtubedl(url, {
        format: "bestaudio",
        extractAudio: true,
        audioFormat: "mp3",
        noPlaylist: true,
        output: path.join(MUSIC_DIR, `${safeName}.%(ext)s`)
      });

      playlist.push({
        name: video.title,
        file: `music/${safeName}.mp3`
      });

    } catch (err) {
      console.log(`⚠️ Skipped: ${video.title}`);
      continue;
    }
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(playlist, null, 2));

  console.log("✨ DONE — playlist generated!");
}

run();