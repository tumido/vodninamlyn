import type { Metadata } from "next";
import { Geist_Mono, Fleur_De_Leah, Bilbo, Offside } from "next/font/google";
import { ErrorBoundary } from "./lib/errors/ErrorBoundary";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fleurDeLeah = Fleur_De_Leah({
  weight: "400",
  variable: "--font-fleur-de-leah",
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

export const metadata: Metadata = {
  title: "Naše Svatba",
  description: "Srdečně vás zveme na naši svatbu",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${geistMono.variable} ${fleurDeLeah.variable} ${bilbo.variable} ${offside.variable} antialiased`}
    >
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
