// Keeps the site and its songs available with no internet at the venue.
const CACHE = "av-ceremony-v17";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon.svg"];
const SONGS = ["songs/guests-arriving.mp3", "songs/abhishek-in-christ-alone.mp3", "songs/groomsmen-gratitude.mp3", "songs/valerie-goodness-of-god.mp3", "songs/signing-way-maker.mp3", "songs/bridesmaids-the-blessing.mp3", "songs/postlude-haazir.mp3", "songs/abhishek-sand-drawing.mp3", "songs/recessional-gawahi.mp3", "songs/postlude-washed.mp3", "songs/congratulations.mp3"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(CORE);
    // Songs are large: cache each one on its own so one slow download can't block the rest.
    await Promise.all(SONGS.map(s => c.add(s).catch(() => {})));
  }));
  self.skipWaiting();
});
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Audio: serve from cache first (supports seeking via full cached file), fall back to network.
  if (url.pathname.includes("/songs/")) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(url.pathname.replace(/^.*\/songs\//, "songs/")) || await c.match(e.request, { ignoreSearch: true });
      if (hit && !e.request.headers.get("range")) return hit;
      if (hit && e.request.headers.get("range")) {
        const buf = await hit.arrayBuffer();
        const m = /bytes=(\d+)-(\d*)/.exec(e.request.headers.get("range"));
        const start = +m[1], end = m[2] ? +m[2] : buf.byteLength - 1;
        return new Response(buf.slice(start, end + 1), { status: 206, headers: {
          "Content-Type": "audio/mpeg", "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`, "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" } });
      }
      return fetch(e.request);
    }));
    return;
  }
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && (r.type === "basic" || r.type === "cors")) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html")))
  );
});
