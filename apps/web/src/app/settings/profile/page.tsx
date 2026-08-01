import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requireSession } from "@/lib/session";
import { getInitials } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await requireSession();
  const user = session.user;

  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>How you appear across your notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel>Profile Picture</FieldLabel>
              </FieldContent>
              <div>
                <Avatar className="size-20 text-xl">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
              </FieldContent>
              <Input id="name" defaultValue={user.name} disabled />
            </Field>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
              </FieldContent>
              <Input id="email" defaultValue={user.email} disabled />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
