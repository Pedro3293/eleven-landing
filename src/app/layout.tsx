import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Oswald, Inter } from "next/font/google";
import { content } from "@/data/content";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: sustituir por el dominio real de producción cuando el cliente lo confirme.
  metadataBase: new URL("https://elevenlevelgroup.com"),
  title: content.seo.title,
  description: content.seo.description,
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" className={`${oswald.variable} ${inter.variable}`}>
      <body className="bg-black-950 font-body text-white antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
