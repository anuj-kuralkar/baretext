"use client";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginWithOAuth } from "@/module/auth/actions";

function LoginWithOAuthForm() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full"
        onClick={() => loginWithOAuth("google")}
        type="button"
        variant="outline"
      >
        <GoogleIcon />
        Login with Google
      </Button>
      <Button
        className="w-full"
        onClick={() => loginWithOAuth("github")}
        type="button"
        variant="outline"
      >
        <GithubIcon />
        Login with Github
      </Button>
    </div>
  );
}

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginWithOAuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
