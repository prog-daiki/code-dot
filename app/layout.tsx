import React from "react";
import { jaJP } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Noto_Sans_JP } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "code.",
  description: "code. | プログラミング学習サービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja" className={`${notoSansJP.variable} font-sans`}>
        <body className={`${inter.variable} ${notoSansJP.variable}`}>
          <QueryProvider>
            <Toaster />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
