import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { PageLoading } from "@/components/page-loading"
import { ProductProvider } from "@/context/product-context"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Buy Genuine Supplements Online | Whey, Creatine & Protein – SS Supplement",
  description:
    "Buy 100% genuine health supplements online in India. Shop whey protein, creatine, mass gainers, pre-workout & more from top brands at SS Supplement with fast delivery.",
  keywords: ["supplements", "whey protein", "creatine", "mass gainer", "fitness", "health", "gym"],
  generator: "SS Supplement",
  verification: {
    google: "Q5uqD1LgrSUbzpG58xJJsYFZ2OVF2FAfrzZX0H2arUU", 
  },
  icons: {
    icon: [
      {
        url: "/ss-supplements-logo-rounded.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/ss-supplements-logo-rounded.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/ss-supplements-logo-rounded.png",
        type: "image/png",
      },
    ],
    apple: "/ss-supplements-logo-rounded.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#e05a00",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Suspense fallback={null}>
          <PageLoading />
        </Suspense>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
