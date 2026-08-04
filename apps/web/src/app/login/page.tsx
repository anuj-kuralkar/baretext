import { redirect } from "next/navigation";
import { BrandLink } from "@/components/brand-link";
import { LoginForm } from "@/components/forms/login";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <div className="z-10 flex w-full max-w-sm flex-col items-center">
        <BrandLink />
        <div className="mt-8 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
