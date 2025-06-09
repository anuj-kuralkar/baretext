"use client";

import { Envelope, Github, Google } from "react-bootstrap-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginWithOAuthForm() {
  return (
    <form>
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          name="provider"
          value="google"
          variant="outline"
          className="w-full"
        >
          <Google />
          Login with Google
        </Button>
        <Button
          type="submit"
          name="provider"
          value="github"
          variant="outline"
          className="w-full"
        >
          <Github />
          Login with Github
        </Button>
      </div>
    </form>
  );
}

function LoginWithEmailForm() {
  return (
    <form>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="me@example.com"
            type="email"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          <Envelope />
          Login with Email
        </Button>
      </div>
    </form>
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
          <div className="grid gap-6">
            <LoginWithOAuthForm />
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <LoginWithEmailForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
