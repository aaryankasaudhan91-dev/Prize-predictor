import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SettingsProvider } from "@/context/SettingsContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Navi Mumbai House Price Predictor",
  description: "AI-powered real estate valuation for Navi Mumbai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased bg-page text-black font-mono`}
      >
        <SettingsProvider>
          {children}
          <SpeedInsights />
        </SettingsProvider>
      </body>
    </html>
  );
}
