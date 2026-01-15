import type { Metadata, Viewport } from "next";
import { Geist_Mono, Bilbo, Offside } from "next/font/google";
import "./globals.css";
import { WEDDING_INFO } from "./lib/constants";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bilbo = Bilbo({
  weight: "400",
  variable: "--font-bilbo",
  subsets: ["latin"],
});

const offside = Offside({
  weight: "400",
  variable: "--font-offside",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ebe1d1",
};

export const metadata: Metadata = {
  title: WEDDING_INFO.couple.heading,
  description: `${WEDDING_INFO.couple.groom} & ${WEDDING_INFO.couple.bride} · ${WEDDING_INFO.date.display} · ${WEDDING_INFO.venue.name}`,
  robots: "noindex, nofollow",
  icons: [
    {
      rel: "icon",
      sizes: "96x96",
      type: "image/png",
      url: "/icon-light-96.png",
    },
    {
      rel: "icon",
      sizes: "192x192",
      type: "image/png",
      url: "/icon-light-192.png",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
    {
      media: "(prefers-color-scheme: light)",
      rel: "icon",
      type: "image/svg+xml",
      url: "/icon-light.svg",
    },
    {
      media: "(prefers-color-scheme: dark)",
      rel: "icon",
      type: "image/svg+xml",
      url: "/icon-dark.svg",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
  ],
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${geistMono.variable} ${bilbo.variable} ${offside.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
