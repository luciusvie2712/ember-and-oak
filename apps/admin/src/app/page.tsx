import { Container, Stack } from "@ember-and-oak/ui";
import Link from "next/link";

export default function Page() {
  return (
    <main className="foundation-page">
      <Container size="content">
        <Stack gap="6">
          <p className="eyebrow">Admin · engineering foundation</p>
          <h1>Ember &amp; Oak Admin</h1>
          <p>
            Phase 7 content publishing is available as a minimal protected editor. Reservation
            management remains scheduled for the full backoffice phase.
          </p>
          <Link href="/content/menu/dinner">Open content editor</Link>
        </Stack>
      </Container>
    </main>
  );
}
