import type { Metadata, Viewport } from "next";
import { Geist_Mono, Bilbo, Offside } from "next/font/google";
import "./globals.css";
import { WEDDING_INFO } from "./lib/constants";
import { PageTracker } from "./components/PageTracker";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const bilbo = Bilbo({
  subsets: ["latin"],
  variable: "--font-bilbo",
  weight: "400",
});

const offside = Offside({
  subsets: ["latin"],
  variable: "--font-offside",
  weight: "400",
});

export const viewport: Viewport = {
  themeColor: "#ebe1d1",
};

export const metadata: Metadata = {
  description: `${WEDDING_INFO.couple.groom} & ${WEDDING_INFO.couple.bride} · ${WEDDING_INFO.date.display} · ${WEDDING_INFO.venue.name}`,
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
  robots: "noindex, nofollow",
  title: WEDDING_INFO.couple.heading,
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
      <body>
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
