"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ChevronRight } from "lucide-react"
import { useProducts } from "@/context/product-context"

const brandAliases: Record<string, string[]> = {
  MB: ["MB", "MuscleBlaze", "Muscleblaze"],
  ON: ["ON", "Optimum Nutrition", "Optimum Nutrition(ON)"],
  MUSCLETECH: ["MUSCLETECH", "MuscleTech", "Muscletech"],
  ISOPURE: ["ISOPURE", "Isopure"],
  LABRADA: ["LABRADA", "Labrada"],
  AVVATAR: ["AVVATAR", "Avvatar"],
  "WELLBEING NUTRITION": ["WELLBEING NUTRITION", "Wellbeing Nutrition", "WELLBEINGS"],
  WELLCORE: ["WELLCORE", "Wellcore"],
  PINTOLA: ["PINTOLA", "Pintola"],
  "FAST & UP": ["FAST & UP", "Fast & Up"],
  "MAX PROTIEN": ["MAX PROTIEN", "Max Protein"],
  KAPIVA: ["KAPIVA", "Kapiva"],
  ATTOM: ["ATTOM", "Attom"],
  FUELONE: ["FUELONE", "Fuelone"],
  MYFITNESS: ["MYFITNESS", "MyFitness"],
}

export default function BrandPage() {
  const params = useParams()
  const brand = decodeURIComponent(params.slug as string)
  const normalizedBrand = brand.toUpperCase()
  const { products } = useProducts()

  const selectedBrands = useMemo(() => {
    const aliases = brandAliases[normalizedBrand] ?? [brand]
    const aliasSet = new Set(aliases.map((alias) => alias.toLowerCase()))
    return [...new Set(products.map((product) => product.brand))]
      .filter((productBrand) => aliasSet.has(productBrand.toLowerCase()))
      .sort()
  }, [brand, normalizedBrand, products])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Elite Partner</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{brand}</span>
        </nav>

        <h1 className="text-3xl font-bold text-foreground mb-2">{brand}</h1>
        <p className="text-muted-foreground mb-4">
          Shop authentic {brand} products from SS Supplements.
        </p>

        <ProductGrid selectedBrands={selectedBrands.length > 0 ? selectedBrands : [brand]} />
      </main>
      <Footer />
    </div>
  )
}
