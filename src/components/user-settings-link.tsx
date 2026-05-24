import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import type { User } from "@/module/user/types";

export function UserSettingsLink({
  name,
  image,
}: Pick<User, "name" | "image">) {
  return (
    <Link
      className="group/settings flex items-center gap-2 px-1 py-1.5 text-left text-sm"
      href="/settings/profile"
    >
      <Avatar.Root>
        <Avatar.Image alt={name} src={image ?? undefined} />
        <Avatar.Fallback>
          <CircleUserRoundIcon />
        </Avatar.Fallback>
      </Avatar.Root>
      <span className="truncate font-medium">{name}</span>
    </Link>
  );
}
