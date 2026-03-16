import { Empty } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <Empty.Root className="h-full">
      <Spinner className="size-12" />
    </Empty.Root>
  );
}
