import React from "react";

import { Footer } from "../_components/footer/footer";
import { MarketingHeader } from "./_components/marketing-header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout = async ({ children }: MarketingLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex flex-1 flex-col items-center justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
