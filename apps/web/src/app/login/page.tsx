import { Background } from "@/components/background";
import { BrandLink } from "@/components/brand-link";
import { LoginForm } from "@/components/forms/login";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <Background />
      <div className="z-10 flex w-full max-w-[380px] flex-col items-center">
        <BrandLink />
        <div className="mt-8 w-full">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-muted-foreground text-xs leading-relaxed">
          By continuing, you agree to Baretext&apos;s{" "}
          <span className="underline underline-offset-4">Terms of Service</span>{" "}
          and{" "}
          <span className="underline underline-offset-4">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
