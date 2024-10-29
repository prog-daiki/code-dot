"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { HeaderLogo } from "@/app/_components/header/header-logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface MobileHeaderNavProps {
  isAdmin: boolean;
}

export const MobileHeaderNav = ({ isAdmin }: MobileHeaderNavProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pr-4 transition hover:bg-opacity-75 xl:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent className="bg-white" side="left">
        <HeaderLogo />
        <Sidebar isAdmin={isAdmin} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};
