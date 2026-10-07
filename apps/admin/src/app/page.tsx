import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-session";

export default async function Page() {
  const session = await requireAdminSession();
  return (
    <AdminShell session={session}>
      <section className="dashboard">
        <p className="eyebrow">Daily operations</p>
        <h1>Good service starts here.</h1>
        <p>
          Manage today’s reservations, menu, editorial content and opening hours without database
          access.
        </p>
        <div className="quick-links">
          {session.user.role !== "CONTENT_EDITOR" ? (
            <Link href="/reservations">View reservations</Link>
          ) : null}
          {session.user.role !== "HOST" ? (
            <Link href="/content/menu/dinner">Edit menu &amp; content</Link>
          ) : null}
          {session.user.role === "ADMIN" ? (
            <Link href="/operations">Opening hours &amp; closures</Link>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}
