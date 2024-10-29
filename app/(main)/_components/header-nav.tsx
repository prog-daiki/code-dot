"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderNavProps {
  isAdmin: boolean;
}

interface NavItem {
  href: string;
  label: string;
  adminOnly?: boolean;
}

export const HeaderNav = ({ isAdmin }: HeaderNavProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems: NavItem[] = [
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin mode", adminOnly: true },
  ];

  return (
    <nav className="space-x-4 text-muted-foreground text-sm hidden xl:flex">
      {navItems.map(
        (item) =>
          (isAdmin || !item.adminOnly) && (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(isActive(item.href) && "bg-gray-100")}
              >
                {item.label}
              </Button>
            </Link>
          ),
      )}
    </nav>
  );
};
