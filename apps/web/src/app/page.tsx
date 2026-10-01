import { Container, Stack } from "@ember-and-oak/ui";

export default function Page() {
  return (
    <main className="foundation-page">
      <Container size="reading">
        <Stack gap="6">
          <p className="eyebrow">Public web · engineering foundation</p>
          <h1>Ember &amp; Oak</h1>
          <p>Application scaffold is ready. Product content and feature UI begin in Phase 6.</p>
        </Stack>
      </Container>
    </main>
  );
}
