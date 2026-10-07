import type { AdminReservationListItem } from "@ember-and-oak/types";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { authenticatedAdminRequest, requireAdminSession } from "@/lib/admin-session";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await requireAdminSession(["ADMIN", "HOST"]);
  const params = await searchParams;
  const date =
    params.date ??
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const query = new URLSearchParams({ date, limit: "50" });
  if (params.status) query.set("status", params.status);
  if (params.q) query.set("q", params.q);
  const result = await authenticatedAdminRequest<{
    items: AdminReservationListItem[];
    nextCursor?: string;
  }>(`api/v1/admin/reservations?${query}`);
  return (
    <AdminShell session={session}>
      <section className="admin-section">
        <header>
          <p className="eyebrow">Front of house</p>
          <h1>Reservations</h1>
        </header>
        <form className="filters">
          <label>
            Date
            <input name="date" type="date" defaultValue={date} />
          </label>
          <label>
            Status
            <select name="status" defaultValue={params.status ?? ""}>
              <option value="">All</option>
              {["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Search
            <input name="q" defaultValue={params.q ?? ""} placeholder="Guest, code or contact" />
          </label>
          <button>Apply</button>
        </form>
        {result.items.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Guest</th>
                  <th>Party</th>
                  <th>Status</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.startTime}</td>
                    <td>
                      <Link href={`/reservations/${item.id}`}>{item.guestName}</Link>
                    </td>
                    <td>{item.guestCount}</td>
                    <td>
                      <span className="status">{item.status}</span>
                    </td>
                    <td>{item.reservationCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No reservations for this date.</p>
        )}
      </section>
    </AdminShell>
  );
}
