import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Footer } from "../_components/footer/footer";
import { MarketingHeader } from "./_components/marketing-header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout = async ({ children }: MarketingLayoutProps) => {
  const { userId } = await auth();
  if (userId) {
    return redirect("/courses");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex flex-1 flex-col items-center justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
