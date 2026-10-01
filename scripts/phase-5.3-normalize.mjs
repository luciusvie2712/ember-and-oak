import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, data) {
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function normalizeNextApp({ directory, packageName, port }) {
  const packagePath = resolve(root, directory, "package.json");

  const pkg = await readJson(packagePath);

  pkg.name = packageName;
  pkg.version = "0.0.0";
  pkg.private = true;

  pkg.scripts = {
    ...pkg.scripts,

    dev: `next dev --port ${port}`,

    start: `next start --port ${port}`,

    lint: "eslint .",

    typecheck: "tsc --noEmit",

    clean: "node -e \"require('node:fs').rmSync('.next',{recursive:true,force:true})\"",
  };

  await writeJson(packagePath, pkg);
}

async function normalizeApi() {
  const packagePath = resolve(root, "apps/api/package.json");

  const pkg = await readJson(packagePath);

  pkg.name = "@ember-and-oak/api";
  pkg.version = "0.0.0";
  pkg.private = true;

  pkg.devDependencies ??= {};
  pkg.devDependencies.typescript = "5.9.3";

  pkg.scripts = {
    ...pkg.scripts,

    dev: "nest start --watch",

    typecheck: "tsc --noEmit",

    clean: "node -e \"require('node:fs').rmSync('dist',{recursive:true,force:true})\"",
  };

  await writeJson(packagePath, pkg);
}

async function normalizeRoot() {
  const packagePath = resolve(root, "package.json");

  const pkg = await readJson(packagePath);

  pkg.scripts = {
    ...pkg.scripts,

    "dev:web": "pnpm --filter @ember-and-oak/web dev",

    "dev:admin": "pnpm --filter @ember-and-oak/admin dev",

    "dev:api": "pnpm --filter @ember-and-oak/api dev",

    "build:web": "pnpm --filter @ember-and-oak/web build",

    "build:admin": "pnpm --filter @ember-and-oak/admin build",

    "build:api": "pnpm --filter @ember-and-oak/api build",
  };

  await writeJson(packagePath, pkg);
}

await normalizeNextApp({
  directory: "apps/web",
  packageName: "@ember-and-oak/web",
  port: 3000,
});

await normalizeNextApp({
  directory: "apps/admin",
  packageName: "@ember-and-oak/admin",
  port: 3001,
});

await normalizeApi();

await normalizeRoot();

console.log("Phase 5.3 normalization complete.");
