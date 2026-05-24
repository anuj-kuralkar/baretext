import Image from "next/image";
import Link from "next/link";

export function BrandLink() {
  return (
    <Link className="flex h-10 items-center gap-2 px-2 py-1" href="/">
      <Image alt="Baretext" height={32} src="/baretext.svg" width={32} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Baretext</span>
      </div>
    </Link>
  );
}
