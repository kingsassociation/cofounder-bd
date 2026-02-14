import { FacebookPixel } from "@cofounder/ui";
import type { Metadata } from "next";
import { Cinzel, Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Joghonno Brand | Digital Growth Agency",
  description: "Premium Digital Growth Strategy & Web Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cinzel.variable} ${hindSiliguri.variable} antialiased`}
      >
        <FacebookPixel pixelId="3919035388228710" />
        {children}
      </body>
    </html>
  );
}
