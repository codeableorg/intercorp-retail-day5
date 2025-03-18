import { AddForm } from "@/components/playground/add-form";
import { Container } from "@/components/ui";
import { getCount } from "@/lib/actions";

export default async function Page() {
  const count = await getCount();

  return (
    <Container>
      <AddForm count={count} />
    </Container>
  );
}
