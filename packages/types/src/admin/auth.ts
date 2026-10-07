export const adminRoles = ["ADMIN", "HOST", "CONTENT_EDITOR"] as const;

export type AdminRole = (typeof adminRoles)[number];

export type AdminUser = Readonly<{
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
}>;

export type AdminLoginInput = Readonly<{ email: string; password: string }>;

export type AdminLoginResult = Readonly<{
  sessionToken: string;
  expiresAt: string;
  user: AdminUser;
}>;

export type AdminSessionView = Readonly<{
  user: AdminUser;
  expiresAt: string;
}>;
