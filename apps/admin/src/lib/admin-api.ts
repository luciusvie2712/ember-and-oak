import "server-only";

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`Admin API ${status}: ${body.slice(0, 300)}`);
  }
}

function baseUrl(): string {
  const value = process.env.ADMIN_API_URL ?? process.env.CONTENT_API_URL;
  if (!value) throw new Error("ADMIN_API_URL is not configured");
  return value.endsWith("/") ? value : `${value}/`;
}

export async function adminApiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(new URL(path, baseUrl()), {
    ...init,
    cache: "no-store",
    headers: { accept: "application/json", "content-type": "application/json", ...init.headers },
  });
  if (!response.ok) throw new AdminApiError(response.status, await response.text());
  const envelope = (await response.json()) as { data: T };
  return envelope.data;
}
