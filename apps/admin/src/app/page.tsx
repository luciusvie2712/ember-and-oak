import { Container, Stack } from "@ember-and-oak/ui";

export default function Page() {
  return (
    <main className="foundation-page">
      <Container size="content">
        <Stack gap="6">
          <p className="eyebrow">Admin · engineering foundation</p>
          <h1>Ember &amp; Oak Admin</h1>
          <p>
            Application shell only. Authentication and reservation management are not implemented.
          </p>
        </Stack>
      </Container>
    </main>
  );
}
