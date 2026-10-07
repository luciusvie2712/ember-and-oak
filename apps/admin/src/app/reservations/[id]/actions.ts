"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticatedAdminRequest } from "@/lib/admin-session";

export async function transitionAction(formData: FormData): Promise<never> {
  const id = String(formData.get("id"));
  await authenticatedAdminRequest(`api/v1/admin/reservations/${encodeURIComponent(id)}/status`, {
    method: "POST",
    body: JSON.stringify({
      toStatus: formData.get("toStatus"),
      expectedStatus: formData.get("expectedStatus"),
      reason: formData.get("reason") || null,
    }),
  });
  revalidatePath(`/reservations/${id}`);
  redirect(`/reservations/${id}?updated=1`);
}

export async function noteAction(formData: FormData): Promise<never> {
  const id = String(formData.get("id"));
  await authenticatedAdminRequest(
    `api/v1/admin/reservations/${encodeURIComponent(id)}/internal-note`,
    {
      method: "PATCH",
      body: JSON.stringify({ internalNote: formData.get("internalNote") || null }),
    },
  );
  revalidatePath(`/reservations/${id}`);
  redirect(`/reservations/${id}?saved=1`);
}
