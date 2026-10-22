import { Background } from "@/components/background";
import { BrandLink } from "@/components/brand-link";
import { LoginForm } from "@/components/forms/login";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <Background />
      <div className="z-10 flex w-full max-w-sm starting:translate-y-2 flex-col items-center opacity-100 starting:opacity-0 transition-all duration-300 ease-out">
        <BrandLink />
        <div className="mt-8 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
