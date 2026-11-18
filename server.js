// Tiny static server for Xtrade. Usage: node server.js [port]
// /       -> trading platform (index.html)
// /admin  -> admin console (admin.html)
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = __dirname, PORT = +process.argv[2] || 5173;
const ROUTES = { "/": "index.html", "/admin": "admin.html", "/admin/": "admin.html" };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const rel = ROUTES[url] || url.replace(/^\/+/, "");
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) || /server\.js$/.test(file)) { res.writeHead(404); return res.end("Not found"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store, max-age=0" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log("Xtrade on http://127.0.0.1:" + PORT + "  (admin: /admin)"));
