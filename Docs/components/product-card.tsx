"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/app/types/product"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const selectedFlavor = product.flavors?.[0]?.name || "Default"
  const selectedWeight = product.weight || product.weights?.[0] || ""
  const canAddToCart = product.inStock && Boolean(selectedWeight)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently unavailable.`,
      })
      return
    }

    if (!selectedWeight) {
      toast({
        title: "Variant unavailable",
        description: "Weight information is missing for this product.",
      })
      return
    }

    addToCart(product, selectedFlavor, selectedWeight)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        id={`product-card-${product.id}`}
        className="group bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden h-full"
      >
        <CardContent className="p-0">
          <div className="relative aspect-square bg-secondary/50 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {product.discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                Out of Stock
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-2 right-2 h-10 w-10 rounded-full border border-white/50 bg-white/35 text-zinc-900 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-100 backdrop-blur-md shadow-sm hover:bg-white/55 hover:scale-105 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
            >
              <ShoppingCart className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
            </Button>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 min-h-10">{product.name}</h3>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5 bg-success/20 text-success px-1.5 py-0.5 rounded text-xs">
                <span>{product.rating}</span>
                <Star className="h-3 w-3 fill-current" />
              </div>
              <span className="text-xs text-muted-foreground">({(product.reviews / 1000).toFixed(1)}k)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedFlavor} • {selectedWeight || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
