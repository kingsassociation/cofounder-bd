"use client";

import { siteConfig } from "@/lib/site-config";
import { Footer as SharedFooter } from "@cofounder/ui";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com" },
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Instagram, href: "https://instagram.com" },
  ];

  return (
    <SharedFooter 
      tagline={siteConfig.tagline}
      socialLinks={socialLinks}
      className="mt-20"
      logoComponent={<Logo variant="full" />}
    />
  );
}
