import type { MediaAsset } from "@ember-and-oak/types";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { authenticatedAdminRequest, requireAdminSession } from "@/lib/admin-session";

type MediaDocument = {
  slug: string;
  draft: MediaAsset | null;
  published: MediaAsset | null;
  publishState: string;
};
export default async function MediaPage() {
  const session = await requireAdminSession(["ADMIN", "CONTENT_EDITOR"]);
  const documents = await authenticatedAdminRequest<MediaDocument[]>("api/v1/admin/content/media");
  return (
    <AdminShell session={session}>
      <section className="admin-section">
        <p className="eyebrow">Asset library</p>
        <h1>Media</h1>
        <p>
          Browse and select existing media references. Binary upload remains provider-dependent.
        </p>
        <div className="media-grid">
          {documents.map((document) => {
            const asset = document.draft ?? document.published;
            return (
              <article key={document.slug}>
                {asset?.sourceUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.sourceUrl}
                      alt={asset.isDecorative ? "" : (asset.altText ?? "")}
                    />
                  </>
                ) : null}
                <h2>{document.slug}</h2>
                <p>{asset?.altText ?? (asset?.isDecorative ? "Decorative" : "No alt text")}</p>
                <span>{document.publishState}</span>
                <Link href={`/content/media/${document.slug}`}>Edit metadata</Link>
              </article>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
