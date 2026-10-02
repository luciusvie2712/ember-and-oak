import { createHmac, timingSafeEqual } from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "@ember-and-oak/validation";

const payloadSchema = z.object({
  eventId: z.string().uuid(),
  tags: z.array(z.string().min(1).max(256)).max(128),
  paths: z.array(z.enum(["/", "/menu", "/our-story", "/gallery"])),
  timestamp: z.number().int().positive(),
});

function signaturesMatch(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.WEB_REVALIDATION_SECRET;
  const signature = request.headers.get("x-content-signature") ?? "";
  const rawBody = await request.text();

  if (!secret || !signaturesMatch(rawBody, signature, secret)) {
    return Response.json({ error: "Invalid revalidation signature" }, { status: 401 });
  }

  const result = payloadSchema.safeParse(JSON.parse(rawBody));
  if (!result.success || Math.abs(Date.now() - result.data.timestamp) > 5 * 60 * 1000) {
    return Response.json({ error: "Invalid or expired revalidation payload" }, { status: 400 });
  }

  for (const tag of new Set(result.data.tags)) revalidateTag(tag, { expire: 0 });
  for (const path of new Set(result.data.paths)) revalidatePath(path);

  return Response.json({ revalidated: true, eventId: result.data.eventId });
}
