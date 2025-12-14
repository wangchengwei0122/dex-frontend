import type { Metadata } from "next"
import { WalletProvider } from "@/providers/wallet-provider"
import { AppNavbar } from "@/components/app/app-navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "DEX Frontend",
  description: "DEX Frontend",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0A0A0C] text-zinc-50">
        <WalletProvider>
          <AppNavbar />
          <main className="pt-16">
            <div className="max-w-screen-xl mx-auto px-4">{children}</div>
          </main>
        </WalletProvider>
      </body>
    </html>
  )
}
