import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-session";

export default async function ForbiddenPage() {
  await requireAdminSession();
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Access denied</h1>
        <p>Your role does not have access to this area.</p>
        <Link href="/">Back to dashboard</Link>
      </section>
    </main>
  );
}
