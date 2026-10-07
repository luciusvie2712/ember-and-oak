import type { AdminReservationDetail, ReservationStatus } from "@ember-and-oak/types";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { authenticatedAdminRequest, requireAdminSession } from "@/lib/admin-session";
import { noteAction, transitionAction } from "./actions";

const next: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SEATED", "NO_SHOW", "CANCELLED"],
  SEATED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export default async function ReservationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; saved?: string }>;
}) {
  const session = await requireAdminSession(["ADMIN", "HOST"]);
  const { id } = await params;
  const notice = await searchParams;
  const item = await authenticatedAdminRequest<AdminReservationDetail>(
    `api/v1/admin/reservations/${encodeURIComponent(id)}`,
  );
  return (
    <AdminShell session={session}>
      <section className="admin-section">
        <Link href="/reservations">← Reservations</Link>
        <header>
          <p className="eyebrow">{item.reservationCode}</p>
          <h1>{item.guestName}</h1>
          <span className="status">{item.status}</span>
        </header>
        {notice.updated ? <p className="notice">Reservation status updated.</p> : null}
        {notice.saved ? <p className="notice">Internal note saved.</p> : null}
        <dl className="detail-grid">
          <div>
            <dt>Date &amp; time</dt>
            <dd>
              {item.date} · {item.startTime}
            </dd>
          </div>
          <div>
            <dt>Guests</dt>
            <dd>{item.guestCount}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{item.guest.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{item.guest.phone}</dd>
          </div>
          <div>
            <dt>Special request</dt>
            <dd>{item.specialRequest ?? "None"}</dd>
          </div>
        </dl>
        {next[item.status].length ? (
          <section>
            <h2>Update status</h2>
            <div className="action-row">
              {next[item.status].map((status) => (
                <form action={transitionAction} key={status}>
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="expectedStatus" value={item.status} />
                  <input type="hidden" name="toStatus" value={status} />
                  {status === "CANCELLED" ? (
                    <label>
                      Cancellation reason
                      <input name="reason" maxLength={500} required />
                    </label>
                  ) : null}
                  <button>{status.replace("_", " ")}</button>
                </form>
              ))}
            </div>
          </section>
        ) : null}
        <form action={noteAction} className="stack-form">
          <input type="hidden" name="id" value={id} />
          <label htmlFor="internalNote">Internal note</label>
          <textarea
            id="internalNote"
            name="internalNote"
            defaultValue={item.internalNote}
            maxLength={2000}
          />
          <button>Save note</button>
        </form>
        <section>
          <h2>Status history</h2>
          {item.statusHistory.length ? (
            <ol className="timeline">
              {item.statusHistory.map((event) => (
                <li key={event.id}>
                  <strong>
                    {event.fromStatus} → {event.toStatus}
                  </strong>
                  <span>
                    {event.actorDisplayName} · {new Date(event.createdAt).toLocaleString()}
                  </span>
                  {event.reason ? <p>{event.reason}</p> : null}
                </li>
              ))}
            </ol>
          ) : (
            <p>No staff changes yet.</p>
          )}
        </section>
      </section>
    </AdminShell>
  );
}
