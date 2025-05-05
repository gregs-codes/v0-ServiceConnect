import { Inter } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ServiceConnect - Find and Hire Service Professionals",
  description: "Connect with skilled service providers for your projects",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
