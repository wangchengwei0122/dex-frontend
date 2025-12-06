import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletProvider } from "@/providers/wallet-provider";
import { AppNavbar } from "@/components/app/app-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEX Frontend",
  description: "DEX Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0C] text-zinc-50`}
      >
        <WalletProvider>
          <AppNavbar />
          <main className="pt-16">
            <div className="max-w-screen-xl mx-auto px-4">
              {children}
            </div>
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
