import type { PublicOperations } from "@ember-and-oak/types";
import { publicOperationsSchema } from "@ember-and-oak/validation";

export async function getPublicOperations(): Promise<PublicOperations | null> {
  const baseUrl = process.env.CONTENT_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error("Operations API URL is not configured");
  const response = await fetch(new URL("/api/v1/operations", baseUrl), {
    headers: { accept: "application/json" },
    next: { revalidate: 300, tags: ["operations"] },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Operations API request failed");
  const envelope = (await response.json()) as { data?: unknown };
  return publicOperationsSchema.parse(envelope.data);
}
