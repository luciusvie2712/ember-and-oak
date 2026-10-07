import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) redirect("/");
  const { error } = await searchParams;
  return (
    <main className="auth-page">
      <form action={loginAction} className="auth-card">
        <p className="eyebrow">Staff backoffice</p>
        <h1>Welcome back</h1>
        <p>Sign in with your restaurant staff account.</p>
        {error ? (
          <p className="form-error" role="alert">
            Invalid email or password.
          </p>
        ) : null}
        <label htmlFor="email">Email</label>
        <input autoComplete="username" id="email" name="email" type="email" required />
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          type="password"
          minLength={12}
          required
        />
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
