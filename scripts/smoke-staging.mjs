const targets = [
  ["web", process.env.WEB_STAGING_URL, "/"],
  ["admin", process.env.ADMIN_STAGING_URL, "/"],
  ["api", process.env.API_STAGING_URL, "/api"],
];

const timeoutMs = Number(process.env.STAGING_SMOKE_TIMEOUT_MS ?? 300_000);

const intervalMs = Number(process.env.STAGING_SMOKE_INTERVAL_MS ?? 10_000);

const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

async function waitForTarget(name, baseUrl, path) {
  if (!baseUrl) {
    throw new Error(`Missing ${name.toUpperCase()}_STAGING_URL`);
  }

  const url = new URL(path, baseUrl);
  const deadline = Date.now() + timeoutMs;

  let attempt = 0;
  let lastResult = "not requested";

  while (Date.now() < deadline) {
    attempt += 1;

    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "user-agent": "ember-and-oak-staging-smoke",
        },
      });

      if (response.ok) {
        process.stdout.write(`${name}: ready (${response.status}) ${url}\n`);

        return;
      }

      lastResult = `HTTP ${response.status}`;

      process.stdout.write(`${name}: attempt ${attempt} returned ${lastResult}; retrying...\n`);
    } catch (error) {
      lastResult = error instanceof Error ? error.message : String(error);

      process.stdout.write(`${name}: attempt ${attempt} failed (${lastResult}); retrying...\n`);
    }

    await sleep(intervalMs);
  }

  throw new Error(
    `${name} staging did not become healthy within ${timeoutMs}ms. Last result: ${lastResult}. URL: ${url}`,
  );
}

await Promise.all(targets.map(([name, baseUrl, path]) => waitForTarget(name, baseUrl, path)));

process.stdout.write("All staging smoke checks passed.\n");
