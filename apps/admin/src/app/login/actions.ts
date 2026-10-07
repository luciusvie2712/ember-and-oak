"use server";

import type { AdminLoginResult } from "@ember-and-oak/types";
import { adminLoginSchema } from "@ember-and-oak/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminApiRequest } from "@/lib/admin-api";
import { ADMIN_COOKIE } from "@/lib/admin-session";

export async function loginAction(formData: FormData): Promise<never> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/login?error=invalid");
  try {
    const result = await adminApiRequest<AdminLoginResult>("api/v1/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    const expires = new Date(result.expiresAt);
    (await cookies()).set(ADMIN_COOKIE, result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.ADMIN_COOKIE_SECURE !== "false",
      sameSite: "lax",
      path: "/",
      expires,
    });
  } catch {
    redirect("/login?error=credentials");
  }
  redirect("/");
}

export async function logoutAction(): Promise<never> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (token) {
    await adminApiRequest("api/v1/admin/auth/logout", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: "{}",
    }).catch(() => undefined);
  }
  store.delete(ADMIN_COOKIE);
  redirect("/login");
}
