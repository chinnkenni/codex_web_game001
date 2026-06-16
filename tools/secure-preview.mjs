#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, relative, resolve, sep } from "node:path";
import { timingSafeEqual } from "node:crypto";

const projectRoot = resolve(process.env.PREVIEW_ROOT || process.cwd());
const host = process.env.PREVIEW_HOST || "127.0.0.1";
const port = Number(process.env.PREVIEW_PORT || 4173);
const shareCode = process.env.PREVIEW_SHARE_CODE;
const sessionToken = process.env.PREVIEW_SESSION_TOKEN;

if (!shareCode || !sessionToken) {
  console.error("PREVIEW_SHARE_CODE and PREVIEW_SESSION_TOKEN are required.");
  process.exit(1);
}

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

function noCacheHeaders(extra = {}) {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extra
  };
}

function send(res, status, body, headers = {}) {
  const payload = Buffer.from(body);
  res.writeHead(status, noCacheHeaders({
    "Content-Length": payload.length,
    ...headers
  }));
  res.end(payload);
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function parseCookies(header = "") {
  const cookies = new Map();
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    cookies.set(key, decodeURIComponent(value));
  }
  return cookies;
}

function isVerified(req) {
  const token = parseCookies(req.headers.cookie).get("preview_session");
  return token && safeEqual(token, sessionToken);
}

function loginPage(error = "") {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>临时预览</title>
    <style>
      :root { color-scheme: dark; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #101317; color: #f1eadf; }
      main { width: min(420px, calc(100vw - 32px)); border: 1px solid #3b424c; background: #181c22; padding: 24px; box-shadow: 0 18px 48px rgba(0,0,0,.35); }
      h1 { margin: 0 0 8px; font-size: 1.35rem; }
      p { color: #b9b1a6; line-height: 1.6; margin: 0 0 18px; }
      label { display: grid; gap: 8px; color: #d9d0c3; font-weight: 700; }
      input { width: 100%; box-sizing: border-box; border: 1px solid #444c56; background: #101317; color: #f1eadf; padding: 12px; font: inherit; margin-top: 8px; }
      button { width: 100%; border: 1px solid #d8aa63; background: #241d14; color: #f4d7a7; padding: 12px; font: inherit; font-weight: 700; margin-top: 14px; }
      .error { color: #ffb5aa; margin-top: 12px; min-height: 1.4em; }
    </style>
  </head>
  <body>
    <main>
      <h1>临时预览</h1>
      <p>这是一次性手机预览入口。请输入本次启动生成的长分享码。</p>
      <form method="post" action="/__preview_auth" autocomplete="off">
        <label>
          分享码
          <input name="code" inputmode="text" autocapitalize="none" spellcheck="false" autofocus />
        </label>
        <button type="submit">进入预览</button>
        <div class="error">${escapeHtml(error)}</div>
      </form>
    </main>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function redirectToLogin(res) {
  res.writeHead(303, noCacheHeaders({ Location: "/__preview_login" }));
  res.end();
}

async function readRequestBody(req, maxBytes = 8192) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > maxBytes) throw new Error("Request body too large");
  }
  return body;
}

function getSafeFilePath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }

  if (pathname === "/") pathname = "/index.html";
  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const candidate = resolve(join(projectRoot, normalized));
  const rel = relative(projectRoot, candidate);

  if (rel.startsWith("..") || rel === "" || rel.split(sep).some((part) => part.startsWith("."))) {
    return null;
  }

  return candidate;
}

async function serveFile(req, res) {
  if (!isVerified(req)) {
    redirectToLogin(res);
    return;
  }

  const filePath = getSafeFilePath(req.url || "/");
  if (!filePath) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (!fileStat.isFile()) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const type = mimeTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";
  res.writeHead(200, noCacheHeaders({
    "Content-Type": type,
    "Content-Length": fileStat.size
  }));

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    if (!["GET", "HEAD", "POST"].includes(req.method || "")) {
      send(res, 405, "Method not allowed", {
        "Allow": "GET, HEAD, POST",
        "Content-Type": "text/plain; charset=utf-8"
      });
      return;
    }

    if (req.url?.startsWith("/__preview_login")) {
      send(res, 200, loginPage(), { "Content-Type": "text/html; charset=utf-8" });
      return;
    }

    if (req.url?.startsWith("/__preview_auth")) {
      if (req.method !== "POST") {
        redirectToLogin(res);
        return;
      }
      const body = await readRequestBody(req);
      const params = new URLSearchParams(body);
      if (!safeEqual(params.get("code") || "", shareCode)) {
        send(res, 401, loginPage("分享码不正确，请重新输入。"), {
          "Content-Type": "text/html; charset=utf-8"
        });
        return;
      }

      res.writeHead(303, noCacheHeaders({
        "Location": "/",
        "Set-Cookie": `preview_session=${encodeURIComponent(sessionToken)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`
      }));
      res.end();
      return;
    }

    if (req.method === "POST") {
      send(res, 405, "Method not allowed", {
        "Allow": "GET, HEAD",
        "Content-Type": "text/plain; charset=utf-8"
      });
      return;
    }

    await serveFile(req, res);
  } catch (error) {
    send(res, 500, "Preview server error", { "Content-Type": "text/plain; charset=utf-8" });
  }
});

server.listen(port, host, () => {
  console.log(`secure-preview-ready http://${host}:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
