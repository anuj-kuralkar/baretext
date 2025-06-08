import { Envelope, Github, Google } from "react-bootstrap-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <form>
                <Button variant="outline" className="w-full">
                  <Google />
                  Login with Google
                </Button>
              </form>
              <form>
                <Button variant="outline" className="w-full">
                  <Github />
                  Login with Github
                </Button>
              </form>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
