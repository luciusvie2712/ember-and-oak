import type { OpeningHours } from "@ember-and-oak/types";
import { AdminShell } from "@/components/admin-shell";
import { authenticatedAdminRequest, requireAdminSession } from "@/lib/admin-session";
import { createClosureAction, deactivateClosureAction, saveHoursAction } from "./actions";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
type Closure = {
  id: string;
  date: string;
  type: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  publicMessage?: string;
  isActive: boolean;
};
export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await requireAdminSession(["ADMIN"]);
  const status = await searchParams;
  const [hours, closures] = await Promise.all([
    authenticatedAdminRequest<OpeningHours[]>("api/v1/admin/operations/opening-hours"),
    authenticatedAdminRequest<Closure[]>("api/v1/admin/operations/special-closures"),
  ]);
  return (
    <AdminShell session={session}>
      <section className="admin-section">
        <p className="eyebrow">Operational controls</p>
        <h1>Hours &amp; closures</h1>
        {Object.keys(status).length ? (
          <p className="notice">
            Changes saved. Public operations and availability now use the updated data.
          </p>
        ) : null}
        <h2>Weekly opening hours</h2>
        <div className="hours-list">
          {hours.map((entry) => (
            <form action={saveHoursAction} className="inline-form" key={entry.dayOfWeek}>
              <input type="hidden" name="dayOfWeek" value={entry.dayOfWeek} />
              <strong>{days[entry.dayOfWeek]}</strong>
              <label>
                Closed <input name="isClosed" type="checkbox" defaultChecked={entry.isClosed} />
              </label>
              <label>
                Open <input name="openTime" type="time" defaultValue={entry.openTime} />
              </label>
              <label>
                Close <input name="closeTime" type="time" defaultValue={entry.closeTime} />
              </label>
              <button>Save</button>
            </form>
          ))}
        </div>
        <h2>Special closures</h2>
        <form action={createClosureAction} className="stack-form">
          <label>
            Date
            <input name="date" type="date" required />
          </label>
          <label>
            Type
            <select name="type">
              <option>FULL_DAY</option>
              <option>PARTIAL_DAY</option>
            </select>
          </label>
          <label>
            Start
            <input name="startTime" type="time" />
          </label>
          <label>
            End
            <input name="endTime" type="time" />
          </label>
          <label>
            Internal reason
            <input name="reason" maxLength={500} required />
          </label>
          <label>
            Public message
            <input name="publicMessage" maxLength={500} />
          </label>
          <button>Add closure</button>
        </form>
        <div className="closure-list">
          {closures.map((entry) => (
            <article key={entry.id}>
              <strong>
                {entry.date} · {entry.type}
              </strong>
              <p>{entry.publicMessage ?? entry.reason}</p>
              <span>{entry.isActive ? "Active" : "Inactive"}</span>
              {entry.isActive ? (
                <form action={deactivateClosureAction}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button>Deactivate</button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
