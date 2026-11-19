# Abhishek & Valerie · Ceremony Music

A static website: no build step, no server code. Vercel, Netlify or GitHub Pages can host this repository as it is.

## Files
- `index.html` — the player
- `songs/` — every song the player uses. **Keep this folder name and these file names**, or the player can't find the music.
  The 57-minute prelude is split into `guests-arriving-1/2/3.mp3` (each under GitHub's 25 MB upload limit); they play back to back.
- `sw.js`, `manifest.webmanifest`, `icon.svg` — offline support and the home-screen icon
- `Abhishek-Valerie-Ceremony-Music.html` — a separate single-file copy with every song built in, for opening directly on a laptop

## On the day
- Open the site once on the ceremony device while on Wi-Fi and leave it open a few minutes so the songs download for offline use.
- Space plays the next song, Esc fades out.
