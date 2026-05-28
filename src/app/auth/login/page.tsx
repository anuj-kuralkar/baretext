import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Image alt="Baretext" height={32} src="/baretext.svg" width={32} />
          </div>
          Baretext
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
