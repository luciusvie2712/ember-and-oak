import "server-only";
import { authenticatedAdminRequest } from "./admin-session";

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

export class ContentApiError extends Error {
  constructor(
    readonly status: number,
    body: string,
  ) {
    super(`Content API ${status}: ${body.slice(0, 500)}`);
  }
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  return authenticatedAdminRequest(path, init);
}

export async function getAdminDocument(type: string, slug: string): Promise<AdminDocument> {
  return (await request(
    `api/v1/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`,
  )) as AdminDocument;
}

export function saveAdminDraft(
  type: string,
  slug: string,
  content: unknown,
  expectedVersion?: number,
) {
  return request(
    `api/v1/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/draft`,
    { method: "PUT", body: JSON.stringify({ content, expectedVersion }) },
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
