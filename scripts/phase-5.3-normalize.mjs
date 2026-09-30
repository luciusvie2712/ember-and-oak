import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = process.cwd()

async function readJson(path) {
    return JSON.parse(await readFile(path, 'utf8'))
}

async function writeJson(path, value) {
    await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

async function normalizePackage(relativePath, name, scripts) {
    const packagePath = resolve(root, relativePath, "package.json")
    const pkg = await readJson(packagePath)

    pkg.name = name
    pkg.version = "0.0.0"
    pkg.private = true

    pkg.scripts = { 
        ...pkg.scripts,
        ...scripts
    }

    await writeJson(packagePath, pkg)
}

await normalizePackage("apps/web", "@ember-and-oak/web", {
  dev: "next dev --port 3000",
  start: "next start --port 3000",
  lint: "eslint .",
  typecheck: "tsc --noEmit",
});

await normalizePackage("apps/admin", "@ember-and-oak/admin", {
  dev: "next dev --port 3001",
  start: "next start --port 3001",
  lint: "eslint .",
  typecheck: "tsc --noEmit",
});

await normalizePackage("apps/api", "@ember-and-oak/api", {
  dev: "nest start --watch",
  start: "nest start",
  "start:prod": "node dist/main.js",
  typecheck: "tsc --noEmit",
});