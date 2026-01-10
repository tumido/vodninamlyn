import type { Metadata } from "next";
import { Geist, Geist_Mono, Fleur_De_Leah, Bilbo, Offside } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fleurDeLeah.variable} ${bilbo.variable} ${offside.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
