import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = 56 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label="Asteria Store — Inicio">
      <Image
        src="/logo.png"
        alt="Asteria Store"
        width={size}
        height={Math.round((size * 370) / 391)}
        style={{ width: size, height: "auto" }}
        priority
      />
    </Link>
  );
}
