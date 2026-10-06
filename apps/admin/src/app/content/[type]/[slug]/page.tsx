import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentApiError, getAdminDocument } from "@/lib/content-api";

import { archiveAction, publishAction, saveDraftAction } from "./actions";
import styles from "./page.module.css";

const documents = [
  ["menu", "dinner", "Menu"],
  ["story", "our-story", "Our Story"],
  ["gallery", "gallery", "Gallery"],
  ["home", "home", "Home"],
  ["chef", "executive-chef", "Executive Chef"],
  ["private-dining", "private-dining", "Private Dining"],
  ["operations", "primary", "Operations"],
] as const;

const emptyOperations = {
  slug: "primary",
  location: {
    name: "Ember & Oak",
    addressLine1: "",
    city: "",
    countryCode: "",
    timezone: "Asia/Ho_Chi_Minh",
  },
  contact: { email: "", phoneDisplay: "", phoneE164: "" },
  policies: [],
  publishState: "DRAFT",
};

type EditorPageProps = Readonly<{
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<{ saved?: string; published?: string; archived?: string }>;
}>;

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const { type, slug } = await params;
  const status = await searchParams;
  const known = documents.some(([itemType, itemSlug]) => itemType === type && itemSlug === slug);
  if (!known && type !== "media") notFound();

  const document = await getAdminDocument(type, slug).catch((error: unknown) => {
    if (error instanceof ContentApiError && error.status === 404) return null;
    throw error;
  });
  if (!document && type !== "operations") notFound();

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/">
          Ember &amp; Oak
        </Link>
        <nav aria-label="Content documents">
          {documents.map(([itemType, itemSlug, label]) => (
            <Link
              aria-current={itemType === type && itemSlug === slug ? "page" : undefined}
              href={`/content/${itemType}/${itemSlug}`}
              key={`${itemType}:${itemSlug}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className={styles.editor}>
        <header className={styles.header}>
          <div>
            <p>Content editor</p>
            <h1>
              {documents.find(
                ([itemType, itemSlug]) => itemType === type && itemSlug === slug,
              )?.[2] ?? slug}
            </h1>
          </div>
          <dl>
            <div>
              <dt>State</dt>
              <dd>{document?.publishState ?? "NOT CREATED"}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{document?.version ?? 0}</dd>
            </div>
          </dl>
        </header>

        {status.saved ? <p className={styles.notice}>Draft saved and validated.</p> : null}
        {status.published ? (
          <p className={styles.notice}>Published. Public revalidation has been requested.</p>
        ) : null}
        {status.archived ? (
          <p className={styles.notice}>Archived. This document is no longer public.</p>
        ) : null}

        {type === "operations" ? (
          <p className={styles.notice}>
            Enter only owner-confirmed address and contact details. Blank fields in this template
            must be completed before a draft can be saved. Keep publishState as DRAFT until the
            production details and policies are approved.
          </p>
        ) : null}

        <form action={saveDraftAction} className={styles.form}>
          <input name="type" type="hidden" value={type} />
          <input name="slug" type="hidden" value={slug} />
          <label htmlFor="content">Canonical content JSON</label>
          <p>
            Save validates the canonical contract. Publish runs the stricter public-content and
            relation guardrails before replacing the live revision.
          </p>
          <textarea
            defaultValue={JSON.stringify(
              document?.draft ?? document?.published ?? emptyOperations,
              null,
              2,
            )}
            id="content"
            name="content"
            spellCheck={false}
          />
          <button type="submit">Save draft</button>
        </form>

        {document ? (
          <form action={publishAction} className={styles.publishForm}>
            <input name="type" type="hidden" value={type} />
            <input name="slug" type="hidden" value={slug} />
            <button type="submit">Publish validated draft</button>
          </form>
        ) : null}

        {document ? (
          <form action={archiveAction} className={styles.archiveForm}>
            <input name="type" type="hidden" value={type} />
            <input name="slug" type="hidden" value={slug} />
            <button type="submit">Archive public document</button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
