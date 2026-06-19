import { cp, mkdir, rm } from "node:fs/promises";
import { basename, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(join(root, "index.html"), join(dist, "index.html"));
await cp(join(root, "story-dev.html"), join(dist, "story-dev.html"));
const filter = (path) => basename(path) !== ".DS_Store";
await cp(join(root, "src"), join(dist, "src"), { recursive: true, filter });
await cp(join(root, "assets"), join(dist, "assets"), { recursive: true, filter });

console.log("Built static site into dist/");
