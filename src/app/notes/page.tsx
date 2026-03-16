import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Empty } from "@/components/ui/empty";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/auth/login");
  }
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Title>Create a new note</Empty.Title>
        <Empty.Description>Start by creating a new note.</Empty.Description>
      </Empty.Header>
    </Empty.Root>
  );
}
