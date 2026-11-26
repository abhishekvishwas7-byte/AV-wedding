// Keeps the site and its songs available with no internet at the venue.
const CACHE = "av-ceremony-v36";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon.svg"];
const SONGS = ["songs/abhishek-in-christ-alone.mp3", "songs/beautiful-in-white.mp3", "songs/abhishek-sand-drawing.mp3", "songs/bridesmaids-the-blessing.mp3", "songs/congratulations.mp3", "songs/gaither-there.m4a", "songs/first-dance.mp3", "songs/groomsmen-gratitude.mp3", "songs/guests-arriving-1.mp3", "songs/guests-arriving-2.mp3", "songs/guests-arriving-3.mp3", "songs/postlude-haazir.mp3", "songs/postlude-washed.mp3", "songs/reception-deewana.mp3", "songs/reception-kaise-bataein.mp3", "songs/reception-naya-savera.mp3", "songs/recessional-gawahi.mp3", "songs/signing-way-maker.mp3", "songs/valerie-goodness-of-god.mp3"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(CORE.map(u => new Request(u, { cache: "reload" })));
    // Songs are large: cache each one on its own so one slow download can't block the rest.
    await Promise.all(SONGS.map(s => c.add(new Request(s, { cache: "reload" })).catch(() => {})));
  }));
  self.skipWaiting();
});
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Audio: serve from cache when available (with range support for seeking), otherwise from the network.
  if (url.pathname.includes("/songs/")) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(url.pathname.replace(/^.*\/songs\//, "songs/")) || await c.match(e.request, { ignoreSearch: true });
      if (!hit) return fetch(e.request);
      const range = e.request.headers.get("range");
      if (!range) return hit;
      const buf = await hit.arrayBuffer();
      const m = /bytes=(\d+)-(\d*)/.exec(range);
      const start = +m[1], end = m[2] ? +m[2] : buf.byteLength - 1;
      return new Response(buf.slice(start, end + 1), { status: 206, headers: {
        "Content-Type": hit.headers.get("Content-Type") || "audio/mpeg", "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`, "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" } });
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
