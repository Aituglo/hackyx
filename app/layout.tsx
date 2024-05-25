import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import PlausibleProvider from "next-plausible";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackyx",
  description: "The Search Engine for Hackers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <PlausibleProvider domain="hackyx.io">
      <body className={`${inter.className}`}>
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
      </PlausibleProvider>
    </html>
  );
}
