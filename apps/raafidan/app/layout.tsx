import { FacebookPixel } from "@cofounder/ui";
import type { Metadata } from "next";
import { Cinzel, Hind_Siliguri, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
  title: "Raafidan | Islamic Fragrance House",
  description: "Premium Attar & Fragrance Crafted for Purity & Presence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${hindSiliguri.variable} antialiased`}
      >
        <FacebookPixel pixelId="1971491320917937" />
        {children}
      </body>
    </html>
  );
}
