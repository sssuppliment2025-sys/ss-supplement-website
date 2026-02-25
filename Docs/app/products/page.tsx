"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ChevronRight } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">All Products</span>
        </nav>

        <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
        <p className="text-muted-foreground mb-4">Browse our complete supplement collection.</p>

        <ProductGrid />
      </main>
      <Footer />
    </div>
  )
}
