import Image from "next/image";
import Link from "next/link";

export function BrandLink() {
  return (
    <Link className={"flex h-10 items-center gap-1.5 tracking-tight"} href="/">
      <Image alt="Baretext" height={32} src="/baretext.svg" width={32} />
      <span className="text-lg font-medium">Baretext</span>
    </Link>
  );
}
