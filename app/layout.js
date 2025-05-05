import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ServiceConnect - Find Qualified Service Providers",
  description: "Connect with qualified professionals for your home, business, or personal projects",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-100 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-600">© {new Date().getFullYear()} ServiceConnect. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
