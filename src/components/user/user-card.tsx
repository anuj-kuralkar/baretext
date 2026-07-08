import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface UserCardProps {
  image: string;
  name: string;
}

export function UserCard({ image, name }: UserCardProps) {
  return (
    <div className="flex h-10 items-center gap-1.5 p-2">
      <Avatar>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="select-none truncate font-medium text-sm leading-none">
        {name}
      </span>
    </div>
  );
}
