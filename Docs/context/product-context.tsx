"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "@/app/types/product"

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
  [p.image, p.image1, p.image2, p.image3, ...(Array.isArray(p.images) ? p.images : [])].filter(Boolean) as string[]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

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
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  }

  if (!Array.isArray(value)) return undefined
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
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
          const name = typeof (item as { name?: unknown }).name === "string" ? (item as { name: string }).name.trim() : ""
          const price =
            typeof (item as { price?: unknown }).price === "number"
              ? (item as { price: number }).price
              : fallbackPrice
          if (!name) return null
          return { name, price }
        }
        if (typeof item === "string" && item.trim()) {
          return { name: item.trim(), price: fallbackPrice }
        }
        return null
      })
      .filter((f): f is { name: string; price: number } => Boolean(f))
    if (normalized.length > 0) return normalized
  }

  if (typeof fallbackFlavor === "string" && fallbackFlavor.trim()) {
    return [{ name: fallbackFlavor.trim(), price: fallbackPrice }]
  }
  return [{ name: "Default", price: fallbackPrice }]
}

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

const normalizeProduct = (raw: unknown): Product | null => {
  if (!raw || typeof raw !== "object") return null
  const row = raw as Record<string, unknown>

  const id = String(row.id ?? row._id ?? "").trim()
  if (!id) return null

  const price = toNumber(row.price)
  const originalPrice = toNumber(row.originalPrice, price)
  const computedDiscount =
    originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const weightsFromField = toStringArray(row.weights)
  const weightFromField = typeof row.weight === "string" ? row.weight.trim() : ""
  const weights = weightsFromField && weightsFromField.length > 0
    ? weightsFromField
    : (weightFromField ? [weightFromField] : [])

  const keyBenefits =
    toStringArray(row.keyBenefits) ??
    (typeof row.keyBenefits === "string"
      ? row.keyBenefits
          .split(/\r?\n|,/)
          .map((b) => b.trim())
          .filter(Boolean)
      : [])

  const product: Product = {
    id,
    name: typeof row.name === "string" ? row.name : "",
    brand: typeof row.brand === "string" ? row.brand : "",
    category: typeof row.category === "string" ? row.category : "",
    price,
    originalPrice,
    discount: toNumber(row.discount, computedDiscount),
    rating: toNumber(row.rating),
    reviews: Math.max(0, Math.round(toNumber(row.reviews))),
    image: cleanQuotedString(row.image),
    image1: cleanQuotedString(row.image1) || undefined,
    image2: cleanQuotedString(row.image2) || undefined,
    image3: cleanQuotedString(row.image3) || undefined,
    images: [],
    flavors: toFlavorArray(row.flavors, row.flavor, price),
    weight: weightFromField || undefined,
    weights,
    description: typeof row.description === "string" ? row.description : "",
    keyBenefits,
    nutritionalInfo: typeof row.nutritionalInfo === "string" ? row.nutritionalInfo : "",
    inStock: typeof row.inStock === "boolean" ? row.inStock : true,
  }

  product.images = buildImagesArray(product)
  return product
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

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
        if (!mounted) return

        const normalized = remoteRows
          .map((row) => normalizeProduct(row))
          .filter((row): row is Product => Boolean(row))

        setProducts(normalized)
      } catch (error) {
        console.warn("Failed to load products from backend:", error)
        if (mounted) {
          setProducts([])
        }
      }
    }

    loadProductsFromBackend()
    return () => {
      mounted = false
    }
  }, [])

  const addProduct = (product: Product) => {
    console.warn("addProduct is disabled in storefront. Use admin backend.", product.id)
  }

  const updateProduct = (id: string, data: Partial<Product>) => {
    console.warn("updateProduct is disabled in storefront. Use admin backend.", id, data)
  }

  const deleteProduct = (id: string) => {
    console.warn("deleteProduct is disabled in storefront. Use admin backend.", id)
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
