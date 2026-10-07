import type { AdminSessionView } from "@ember-and-oak/types";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/login/actions";

export function AdminShell({
  session,
  children,
}: {
  session: AdminSessionView;
  children: ReactNode;
}) {
  const role = session.user.role;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          Ember &amp; Oak
        </Link>
        <nav aria-label="Admin navigation">
          {role === "ADMIN" || role === "HOST" ? (
            <Link href="/reservations">Reservations</Link>
          ) : null}
          {role === "ADMIN" || role === "CONTENT_EDITOR" ? (
            <>
              <Link href="/content/menu/dinner">Menu</Link>
              <Link href="/content/home/home">Content</Link>
              <Link href="/media">Media</Link>
            </>
          ) : null}
          {role === "ADMIN" ? <Link href="/operations">Operations</Link> : null}
        </nav>
        <div className="admin-user">
          <strong>{session.user.displayName}</strong>
          <span>{role.replace("_", " ")}</span>
          <form action={logoutAction}>
            <button type="submit">Log out</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
