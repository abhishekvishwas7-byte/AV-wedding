# Abhishek & Valerie · Ceremony Music

A static website (no server code, no build step). Upload this whole folder to any static host.

## Host it (pick one)
- **Netlify Drop:** go to https://app.netlify.com/drop and drag this folder onto the page. You get a link right away.
- **GitHub Pages:** push these files to a repository, then Settings → Pages → deploy from the main branch.
- **Vercel / Cloudflare Pages:** create a new project from this folder; there is no build command and the output directory is the folder itself.
- **Your own computer:** run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

## Good to know
- Songs you add are stored in that browser on that device (IndexedDB). They are never uploaded to the host.
  Load the songs on the device you will use at the ceremony.
- After the first visit the page works offline, so venue Wi-Fi doesn't matter.
  On a phone you can also "Add to Home Screen" to open it like an app.
- Keyboard: Space = Go (next cue), Esc = fade out.
