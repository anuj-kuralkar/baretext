import { Suspense } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession } from "@/lib/session";
import { getInitials } from "@/lib/utils";

function ProfileFieldsSkeleton() {
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel>Profile Picture</FieldLabel>
        </FieldContent>
        <Skeleton className="size-20 rounded-full" />
      </Field>

      <FieldSeparator />

      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="name">Name</FieldLabel>
        </FieldContent>
        <Skeleton className="h-8 w-full rounded-lg" />
      </Field>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
        </FieldContent>
        <Skeleton className="h-8 w-full rounded-lg" />
      </Field>
    </FieldGroup>
  );
}

async function ProfileFields() {
  const session = await requireSession();
  const user = session.user;

  return (
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
  );
}

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>How you appear across your notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProfileFieldsSkeleton />}>
            <ProfileFields />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
