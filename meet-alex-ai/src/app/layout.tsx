import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";

// Cormorant Garamond and Manrope are variable fonts, so no `weight` is needed.
// Space Mono is not variable, so its weights must be listed explicitly.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Tu N (Alex) Tran | Neural Interface",
  description: "Interactive AI Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className={`${manrope.className} min-h-full flex flex-col bg-[#0a0609]`}>{children}</body>
    </html>
  );
}
