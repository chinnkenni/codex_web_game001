#!/usr/bin/env node
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const host = "127.0.0.1";
const port = Number(process.env.PHONE_PREVIEW_PORT || 8787);
const origin = `http://${host}:${port}`;
const shareCode = randomBytes(24).toString("base64url");
const sessionToken = randomBytes(32).toString("base64url");
const cloudflaredBin = process.env.CLOUDFLARED_BIN || "/opt/homebrew/bin/cloudflared";

if (!existsSync(cloudflaredBin)) {
  console.error(`cloudflared not found at ${cloudflaredBin}. Set CLOUDFLARED_BIN to override.`);
  process.exit(1);
}

const children = new Set();
let tunnelUrl = "";
let printed = false;

function spawnChild(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  });
  children.add(child);
  child.on("exit", () => children.delete(child));
  return child;
}

function printSummary() {
  if (!tunnelUrl || printed) return;
  printed = true;
  console.log("");
  console.log("========================================");
  console.log("手机临时预览已启动");
  console.log("");
  console.log(`手机访问链接: ${tunnelUrl}`);
  console.log(`分享码: ${shareCode}`);
  console.log("");
  console.log("停止方式: 在这个终端按 Ctrl+C");
  console.log("手机端: 保持小火箭开启，打开上面的 HTTPS 链接，输入分享码。");
  console.log("========================================");
  console.log("");
}

function scanTunnelUrl(chunk) {
  const text = chunk.toString();
  const match = text.match(/https:\/\/[-a-zA-Z0-9.]+\.trycloudflare\.com/);
  if (match && !tunnelUrl) {
    tunnelUrl = match[0];
    printSummary();
  }
}

const server = spawnChild(process.execPath, ["tools/secure-preview.mjs"], {
  env: {
    ...process.env,
    PREVIEW_ROOT: projectRoot,
    PREVIEW_HOST: host,
    PREVIEW_PORT: String(port),
    PREVIEW_SHARE_CODE: shareCode,
    PREVIEW_SESSION_TOKEN: sessionToken
  }
});

server.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  if (text.includes("secure-preview-ready")) {
    const tunnel = spawnChild(cloudflaredBin, [
      "tunnel",
      "--url",
      origin,
      "--no-autoupdate"
    ]);

    tunnel.stdout.on("data", scanTunnelUrl);
    tunnel.stderr.on("data", scanTunnelUrl);
    tunnel.on("exit", (code) => {
      if (code !== 0 && !tunnelUrl) {
        console.error("cloudflared exited before creating a Quick Tunnel.");
      }
      stopAll(code || 0);
    });
  }
});

server.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

server.on("exit", (code) => {
  if (!printed) {
    console.error("secure preview server exited before the tunnel was ready.");
  }
  stopAll(code || 0);
});

setTimeout(() => {
  if (!printed) {
    console.log("等待 Cloudflare Quick Tunnel 链接生成中...");
    console.log(`本地只读服务: ${origin}`);
    console.log(`分享码: ${shareCode}`);
  }
}, 6000);

function stopAll(code = 0) {
  for (const child of children) {
    child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 100);
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
