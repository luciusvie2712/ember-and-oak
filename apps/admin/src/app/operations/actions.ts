"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticatedAdminRequest } from "@/lib/admin-session";

export async function saveHoursAction(data: FormData): Promise<never> {
  const day = String(data.get("dayOfWeek"));
  const isClosed = data.get("isClosed") === "on";
  await authenticatedAdminRequest(`api/v1/admin/operations/opening-hours/${day}`, {
    method: "PATCH",
    body: JSON.stringify({
      isClosed,
      openTime: isClosed ? undefined : data.get("openTime"),
      closeTime: isClosed ? undefined : data.get("closeTime"),
    }),
  });
  revalidatePath("/operations");
  redirect("/operations?saved=1");
}
export async function createClosureAction(data: FormData): Promise<never> {
  const type = String(data.get("type"));
  await authenticatedAdminRequest("api/v1/admin/operations/special-closures", {
    method: "POST",
    body: JSON.stringify({
      date: data.get("date"),
      type,
      startTime: type === "PARTIAL_DAY" ? data.get("startTime") : undefined,
      endTime: type === "PARTIAL_DAY" ? data.get("endTime") : undefined,
      reason: data.get("reason"),
      publicMessage: data.get("publicMessage") || undefined,
    }),
  });
  revalidatePath("/operations");
  redirect("/operations?closure=1");
}
export async function deactivateClosureAction(data: FormData): Promise<never> {
  await authenticatedAdminRequest(`api/v1/admin/operations/special-closures/${data.get("id")}`, {
    method: "DELETE",
  });
  revalidatePath("/operations");
  redirect("/operations?closed=1");
}
