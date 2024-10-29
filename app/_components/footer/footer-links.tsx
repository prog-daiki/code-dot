import Link from "next/link";

const footerLinks = [
  { href: "/terms", text: "利用規約" },
  { href: "/privacy", text: "プライバシーポリシー" },
];

export const FooterLinks = () => {
  return (
    <div className="flex items-center gap-x-4">
      {footerLinks.map(({ href, text }) => (
        <Link className="transition hover:underline" href={href} key={href}>
          {text}
        </Link>
      ))}
    </div>
  );
};
