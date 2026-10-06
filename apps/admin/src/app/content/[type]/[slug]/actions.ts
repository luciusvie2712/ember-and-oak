"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "@ember-and-oak/validation";

import { archiveAdminDocument, publishAdminDocument, saveAdminDraft } from "@/lib/content-api";

const identitySchema = z.object({
  type: z.enum([
    "menu",
    "story",
    "gallery",
    "home",
    "chef",
    "media",
    "private-dining",
    "operations",
  ]),
  slug: z.string().trim().min(1).max(128),
});

function identity(formData: FormData) {
  return identitySchema.parse({
    type: formData.get("type"),
    slug: formData.get("slug"),
  });
}

export async function saveDraftAction(formData: FormData): Promise<never> {
  const document = identity(formData);
  const source = z.string().min(2).parse(formData.get("content"));
  await saveAdminDraft(document.type, document.slug, JSON.parse(source));
  const path = `/content/${document.type}/${document.slug}`;
  revalidatePath(path);
  redirect(`${path}?saved=1`);
}

export async function publishAction(formData: FormData): Promise<never> {
  const document = identity(formData);
  await publishAdminDocument(document.type, document.slug);
  const path = `/content/${document.type}/${document.slug}`;
  revalidatePath(path);
  redirect(`${path}?published=1`);
}

export async function archiveAction(formData: FormData): Promise<never> {
  const document = identity(formData);
  await archiveAdminDocument(document.type, document.slug);
  const path = `/content/${document.type}/${document.slug}`;
  revalidatePath(path);
  redirect(`${path}?archived=1`);
}
