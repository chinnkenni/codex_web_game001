# 手机临时预览

这个项目使用“只读本地服务 + 长分享码 + Cloudflare Quick Tunnel”的方式给手机预览。

不要使用 Tailscale Exit Node。手机可以继续保持小火箭开启，用于访问 Google、Codex 远程控制等外网服务。

## 一键启动

```bash
npm run phone:preview
```

启动后终端会输出：

- 手机访问链接：Cloudflare 临时 HTTPS 地址
- 分享码：每次启动自动生成的一次性长码
- 停止方式：在终端按 `Ctrl+C`

手机端保持小火箭开启，直接打开 Cloudflare 链接，输入分享码即可。

默认本地端口是 `8787`，只绑定 `127.0.0.1`。

## 安全设计

- 本地服务只监听 `127.0.0.1`。
- Cloudflare Quick Tunnel 只转发本地只读服务。
- 未验证分享码时，只显示“临时预览”页面。
- 分享码正确后，服务写入 `HttpOnly; SameSite=Lax` Cookie。
- 未验证 Cookie 时不能直接访问项目内容。
- 所有响应都禁止缓存。
- 服务只支持静态文件读取，不提供写入能力。
- 默认拒绝访问隐藏文件路径。

## 文件

- `tools/secure-preview.mjs`：只读分享码预览服务。
- `tools/start-phone-preview.mjs`：生成分享码，启动本地服务和 Cloudflare Quick Tunnel。

## 常用参数

```bash
PHONE_PREVIEW_PORT=4180 npm run phone:preview
```

如果 `cloudflared` 不在默认位置：

```bash
CLOUDFLARED_BIN=/path/to/cloudflared npm run phone:preview
```
