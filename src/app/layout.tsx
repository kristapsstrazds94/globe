import { Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const titleFont = Outfit({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-title",
});

export const metadata: Metadata = {
  title: "Pintrip",
  description: "Explore countries on an interactive 3D globe — plan your next trip.",
  icons: {
    icon: `${basePath}/brand/globe-logo.svg`,
    apple: `${basePath}/brand/globe-logo.svg`,
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
