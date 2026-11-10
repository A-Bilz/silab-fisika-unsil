const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
function createServer() {
  return http.createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      response.writeHead(400).end("Bad request");
      return;
    }
    const file = path.resolve(
      root,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    if (!file.startsWith(root + path.sep) || !types[path.extname(file)]) {
      response.writeHead(404).end("Not found");
      return;
    }
    fs.readFile(file, (error, content) => {
      if (error) {
        response.writeHead(404).end("Not found");
        return;
      }
      response
        .writeHead(200, {
          "Content-Type": types[path.extname(file)],
          "Cache-Control": "no-store",
        })
        .end(content);
    });
  });
}
module.exports = { createServer };
if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  createServer().listen(port, "127.0.0.1", () =>
    console.log(`SILAB: http://127.0.0.1:${port}`),
  );
}
