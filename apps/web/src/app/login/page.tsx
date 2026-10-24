import { Background } from "@/components/background";
import { BrandLink } from "@/components/brand-link";
import { LoginForm } from "@/components/forms/login";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <Background />
      <div className="z-10 flex w-full max-w-sm flex-col items-center">
        <BrandLink />
        <div className="mt-8 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
