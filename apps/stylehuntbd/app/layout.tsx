import { auth } from "@/auth";
import AuthProvider from "@/components/auth/AuthProvider";
import Navbar from "@/components/Navbar";
import WishlistInitializer from "@/components/wishlist/WishlistInitializer";
import { siteConfig } from "@/lib/site-config";
import { FacebookPixel } from "@cofounder/ui";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: `${siteConfig.name} - Premium Fashion Store`,
  description: siteConfig.description,
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <AuthProvider session={session}>
      <WishlistInitializer />
      <html lang="en">
        <body className={inter.className}>
          <FacebookPixel pixelId="3919035388228710" />
          <Navbar />
          {children}
          <Toaster position="top-right" richColors offset="80px" />
        </body>
      </html>
    </AuthProvider>
  );
}
