import Image from "next/image";
import Link from "next/link";

export const HeaderLogo = () => {
  return (
    <Link href="/courses">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={60}
        height={60}
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Link>
  );
};
