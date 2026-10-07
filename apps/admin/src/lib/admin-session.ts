import "server-only";

import type { AdminRole, AdminSessionView } from "@ember-and-oak/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminApiError, adminApiRequest } from "./admin-api";

export const ADMIN_COOKIE = "eo_admin_session";

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(ADMIN_COOKIE)?.value;
}

export async function getAdminSession(): Promise<AdminSessionView | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    return await adminApiRequest<AdminSessionView>("api/v1/admin/auth/me", {
      headers: { authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) return null;
    throw error;
  }
}

export async function requireAdminSession(roles?: readonly AdminRole[]): Promise<AdminSessionView> {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  if (roles?.length && session.user.role !== "ADMIN" && !roles.includes(session.user.role))
    redirect("/forbidden");
  return session;
}

export async function authenticatedAdminRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await sessionToken();
  if (!token) redirect("/login");
  try {
    return await adminApiRequest<T>(path, {
      ...init,
      headers: { authorization: `Bearer ${token}`, ...init.headers },
    });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) redirect("/login");
    throw error;
  }
}
