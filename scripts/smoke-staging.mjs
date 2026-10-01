const targets = [
  ["web", process.env.WEB_STAGING_URL, "/"],
  ["admin", process.env.ADMIN_STAGING_URL, "/"],
  ["api", process.env.API_STAGING_URL, "/api"],
];

for (const [name, baseUrl, path] of targets) {
  if (!baseUrl) throw new Error(`Missing ${name.toUpperCase()}_STAGING_URL`);
  const response = await fetch(new URL(path, baseUrl), { redirect: "follow" });
  if (!response.ok) throw new Error(`${name} smoke test failed with HTTP ${response.status}`);
  process.stdout.write(`${name}: ${response.status}\n`);
}
