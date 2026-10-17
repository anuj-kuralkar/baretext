import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession } from "@/lib/session";
import { getInitials } from "@/lib/utils";

export function UserCardSkeleton() {
  return (
    <div className="flex h-10 items-center gap-1.5 p-2">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export async function UserCard() {
  const session = await requireSession();
  const user = session.user;

  return (
    <div className="flex h-10 items-center gap-1.5 p-2">
      <Avatar>
        <AvatarImage src={user.image ?? undefined} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <span className="select-none truncate font-medium text-sm leading-none">
        {user.name}
      </span>
    </div>
  );
}
