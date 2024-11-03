import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Footer } from "../_components/footer/footer";
import { ConfettiProvider } from "@/providers/confetti-provider";
import { MainHeader } from "./_components/main-header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  return (
    <>
      <ConfettiProvider />
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
