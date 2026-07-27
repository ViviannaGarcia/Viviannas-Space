const fs = require("fs");
const path = require("path");

const musicFolder = "./music";

const files = fs.readdirSync(musicFolder)
  .filter(file =>
    file.endsWith(".mp3") ||
    file.endsWith(".wav") ||
    file.endsWith(".ogg")
  );

const playlist = files.map(file => ({
  name: file.replace(/\.[^/.]+$/, ""),
  file: "music/" + file
}));

fs.writeFileSync(
  "mymusic.json",
  JSON.stringify(playlist, null, 2)
);

console.log("Playlist generated:", playlist.length, "songs");