const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
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
          "Content-Type": `${types[path.extname(file)]}; charset=utf-8`,
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
