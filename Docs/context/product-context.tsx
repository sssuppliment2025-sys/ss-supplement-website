"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "@/app/types/product"
import { products as defaultProducts } from "@/lib/products"

interface ProductVariant {
  id: string
  flavor: string
  weight: string
  price: number
  originalPrice: number
  image: string
}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductsByCategory: (category: string) => Product[]
  getProductById: (id: string) => Product | undefined
  searchProducts: (query: string) => Product[]
  getProductVariants: (productName: string, brand: string) => ProductVariant[]
  findProductByVariant: (productName: string, brand: string, flavor: string, weight: string) => Product | undefined
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)


const buildImagesArray = (p: Product): string[] =>
  [p.image, p.image1, p.image2, p.image3].filter(Boolean) as string[]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

const buildDefaultProducts = (): Product[] =>
  defaultProducts.map((p) => ({
    ...p,
    images: buildImagesArray(p),
    flavors: Array.isArray(p.flavors) ? p.flavors : [],
  }))

const cleanQuotedString = (value: unknown): string => {
  if (typeof value !== "string") return ""
  let cleaned = value.trim()
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim()
  }
  return cleaned
}

const toStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  return value.filter((v): v is string => typeof v === "string")
}

const toFlavorArray = (
  value: unknown,
  fallbackFlavor: unknown,
  fallbackPrice: number,
): { name: string; price: number }[] => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => {
        if (item && typeof item === "object") {
          const name = typeof (item as { name?: unknown }).name === "string" ? (item as { name: string }).name : ""
          const price = typeof (item as { price?: unknown }).price === "number" ? (item as { price: number }).price : fallbackPrice
          if (!name) return null
          return { name, price }
        }
        return null
      })
      .filter((f): f is { name: string; price: number } => Boolean(f))
    if (normalized.length > 0) return normalized
  }

  if (typeof fallbackFlavor === "string" && fallbackFlavor.trim()) {
    return [{ name: fallbackFlavor.trim(), price: fallbackPrice }]
  }
  return []
}

const mergeProductsById = (baseProducts: Product[], remoteRaw: unknown[]): Product[] => {
  const remoteById = new Map<string, Partial<Product>>()

  for (const raw of remoteRaw) {
    if (!raw || typeof raw !== "object") continue
    const row = raw as Record<string, unknown>
    const id = String(row.id ?? "").trim()
    if (!id) continue

    const remotePrice = typeof row.price === "number" ? row.price : 0
    const patch: Partial<Product> = {
      id,
      name: typeof row.name === "string" ? row.name : undefined,
      brand: typeof row.brand === "string" ? row.brand : undefined,
      category: typeof row.category === "string" ? row.category : undefined,
      price: typeof row.price === "number" ? row.price : undefined,
      originalPrice: typeof row.originalPrice === "number" ? row.originalPrice : undefined,
      discount: typeof row.discount === "number" ? row.discount : undefined,
      rating: typeof row.rating === "number" ? row.rating : undefined,
      reviews: typeof row.reviews === "number" ? row.reviews : undefined,
      image: cleanQuotedString(row.image) || undefined,
      image1: cleanQuotedString(row.image1) || undefined,
      image2: cleanQuotedString(row.image2) || undefined,
      image3: cleanQuotedString(row.image3) || undefined,
      weight: typeof row.weight === "string" ? row.weight : undefined,
      weights: toStringArray(row.weights),
      description: typeof row.description === "string" ? row.description : undefined,
      keyBenefits: toStringArray(row.keyBenefits),
      nutritionalInfo: typeof row.nutritionalInfo === "string" ? row.nutritionalInfo : undefined,
      inStock: typeof row.inStock === "boolean" ? row.inStock : undefined,
      flavors: toFlavorArray(row.flavors, row.flavor, remotePrice),
    }

    if (!patch.flavors || patch.flavors.length === 0) delete patch.flavors
    if (!patch.weights || patch.weights.length === 0) delete patch.weights
    if (!patch.keyBenefits || patch.keyBenefits.length === 0) delete patch.keyBenefits

    remoteById.set(id, patch)
  }

  const merged = baseProducts.map((base) => {
    const remote = remoteById.get(base.id)
    if (!remote) return base
    const next = { ...base, ...remote, id: base.id } as Product
    return {
      ...next,
      images: buildImagesArray(next),
      flavors: Array.isArray(next.flavors) ? next.flavors : base.flavors,
      weights: Array.isArray(next.weights) ? next.weights : base.weights,
      keyBenefits: Array.isArray(next.keyBenefits) ? next.keyBenefits : base.keyBenefits,
    }
  })

  return merged
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(buildDefaultProducts())

  useEffect(() => {
    let mounted = true

    const loadProductsFromBackend = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products-public/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) throw new Error(`Failed with status ${response.status}`)
        const payload = await response.json()
        const remoteRows = Array.isArray(payload?.data) ? payload.data : []
        if (!mounted || remoteRows.length === 0) return

        setProducts((base) => mergeProductsById(base, remoteRows))
      } catch (error) {
        // Keep local products.tsx as fallback when backend is unavailable
        console.warn("Using local product fallback:", error)
      }
    }

    loadProductsFromBackend()
    return () => {
      mounted = false
    }
  }, [])

  const addProduct = (product: Product) => {
    setProducts((prev) => [
      ...prev,
      { ...product, images: buildImagesArray(product) },
    ])
  }

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...data, images: buildImagesArray({ ...p, ...data } as Product) }
          : p
      )
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const getProductsByCategory = (category: string) =>
    category === "All" ? products : products.filter((p) => p.category === category)

  const getProductById = (id: string) =>
    products.find((p) => p.id === id)

  const searchProducts = (query: string) => {
    if (!query.trim()) return products
    const q = query.toLowerCase()

    return products.filter((p) =>
      `${p.name} ${p.brand} ${p.category} ${p.weight ?? ""} ${p.flavors
        .map((f) => f.name)
        .join(" ")}`.toLowerCase().includes(q)
    )
  }

  // Get all variants of a product by name and brand
  const getProductVariants = (productName: string, brand: string): ProductVariant[] => {
    const variants = products
      .filter((p) => p.name === productName && p.brand === brand)
      .map((p) => ({
        id: p.id,
        flavor: p.flavors.length > 0 ? p.flavors[0].name : "",
        weight: p.weight || "",
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
      }))
    return variants
  }

  // Find a specific product by variant (name, brand, flavor, weight)
  const findProductByVariant = (
    productName: string,
    brand: string,
    flavor: string,
    weight: string
  ): Product | undefined => {
    return products.find(
      (p) =>
        p.name === productName &&
        p.brand === brand &&
        p.weight === weight &&
        p.flavors.some((f) => f.name === flavor)
    )
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getProductById,
        searchProducts,
        getProductVariants,
        findProductByVariant,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error("useProducts must be used inside ProductProvider")
  return ctx
}
