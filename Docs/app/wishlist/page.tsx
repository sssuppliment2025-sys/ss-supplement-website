"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { useProducts } from "@/context/product-context"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { wishlistIds, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { getProductById } = useProducts()
  const { toast } = useToast()

  const products = wishlistIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p != null)

  const handleAddToCart = (productId: string) => {
    const product = getProductById(productId)
    if (!product) return
    const flavors = product.flavors
    const flavor = Array.isArray(flavors) && flavors.length > 0
      ? (typeof flavors[0] === "string" ? flavors[0] : (flavors[0] as { name: string }).name)
      : ""
    const weights = product.weights
    const weight = product.weight || (Array.isArray(weights) && weights.length > 0 ? weights[0] : "")
    if (!weight) {
      toast({ title: "Select variant on product page", description: "This product has options." })
      return
    }
    addToCart(product, flavor, weight, 1)
    toast({ title: "Added to cart", description: product.name })
  }

  if (wishlistIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-6">
              Save items you like by clicking the heart on product pages.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">
          Wishlist ({products.length} {products.length === 1 ? "item" : "items"})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 flex gap-4">
                <Link href={`/product/${product.id}`} className="relative w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold hover:text-primary line-clamp-2">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    ₹{product.price?.toLocaleString() ?? "—"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
