"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItem {
  href: string;
  label: string;
  adminOnly?: boolean;
}

export const Sidebar = ({ isAdmin, setOpen }: SidebarProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems: NavItem[] = [
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin mode", adminOnly: true },
  ];

  return (
    <nav className="flex flex-col space-y-4 text-muted-foreground text-sm w-full mt-8">
      {navItems.map(
        (item) =>
          (isAdmin || !item.adminOnly) && (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <Button variant="ghost" className={cn("justify-start w-full", isActive(item.href) && "bg-gray-100")}>
                {item.label}
              </Button>
            </Link>
          ),
      )}
    </nav>
  );
};
