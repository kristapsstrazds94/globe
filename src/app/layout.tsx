import { Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const titleFont = Outfit({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-title",
});

export const metadata: Metadata = {
  title: "Pintrip",
  description: "Explore countries on an interactive 3D globe — plan your next trip.",
  icons: {
    icon: "/brand/globe-logo.webp",
    apple: "/brand/globe-logo.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={titleFont.variable}>
      <body>{children}</body>
    </html>
  );
}
