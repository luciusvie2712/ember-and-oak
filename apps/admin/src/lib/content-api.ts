import "server-only";

type AdminDocument = Readonly<{
  type: string;
  slug: string;
  draft: unknown;
  published: unknown;
  publishState: string;
  version: number;
  updatedAt: string;
  publishedAt?: string | undefined;
}>;

function apiConfiguration() {
  const baseUrl = process.env.CONTENT_API_URL;
  const apiKey = process.env.ADMIN_CONTENT_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Admin content API is not configured");
  return { baseUrl: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`, apiKey };
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const { baseUrl, apiKey } = apiConfiguration();
  const response = await fetch(new URL(path, baseUrl), {
    ...init,
    cache: "no-store",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-content-api-key": apiKey,
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Content API ${response.status}: ${body.slice(0, 500)}`);
  }
  const envelope = (await response.json()) as { data: unknown };
  return envelope.data;
}

export async function getAdminDocument(type: string, slug: string): Promise<AdminDocument> {
  return (await request(
    `api/v1/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`,
  )) as AdminDocument;
}

export function saveAdminDraft(type: string, slug: string, content: unknown) {
  return request(
    `api/v1/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/draft`,
    { method: "PUT", body: JSON.stringify(content) },
  );
}

export function publishAdminDocument(type: string, slug: string) {
  return request(
    `api/v1/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/publish`,
    { method: "POST", body: "{}" },
  );
}

export function archiveAdminDocument(type: string, slug: string) {
  return request(
    `api/v1/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/archive`,
    { method: "POST", body: "{}" },
  );
}
