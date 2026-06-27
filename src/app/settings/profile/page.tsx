import { AvatarUpdateForm } from "@/components/avatar-update-form";
import { EmailUpdateForm } from "@/components/email-update-form";
import { NameUpdateForm } from "@/components/name-update-form";
import { env } from "@/lib/env";
import { requireSession } from "@/lib/session";

export default async function Page() {
  const session = await requireSession();
  const user = session.user;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6 pb-16">
      <AvatarUpdateForm src={user.image ?? undefined} />
      <NameUpdateForm name={user.name} />
      <EmailUpdateForm email={user.email} />
    </div>
  );
}
