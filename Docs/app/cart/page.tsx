"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Coins, Truck } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  // ✅ UPDATED: Added new cart functions
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartSubtotal, 
    getShippingFee,
    getCartItemPrice 
  } = useCart()
  const { isAuthenticated } = useAuth()

  const [points, setPoints] = useState<number>(0)
  const [loadingPoints, setLoadingPoints] = useState(true)

  /* ================= FETCH USER POINTS ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingPoints(false)
      return
    }

    const token = localStorage.getItem("access")
    if (!token) {
      setLoadingPoints(false)
      return
    }

    fetch(`${API_URL}/api/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setPoints(data.points || 0)
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load reward coins",
        })
      })
      .finally(() => setLoadingPoints(false))
  }, [isAuthenticated, toast])

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  /* ================= EMPTY CART ================= */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything yet.
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

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">
          Shopping Cart ({items.length} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const itemPrice = getCartItemPrice(
                item.product.id, 
                item.selectedFlavor, 
                item.selectedWeight
              )
              const totalPrice = itemPrice * item.quantity

              return (
                <Card
                  key={`${item.product.id}-${item.selectedFlavor}-${item.selectedWeight}`}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className="relative w-24 h-24 bg-secondary rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-1">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-semibold hover:text-primary">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedFlavor} • <strong>{item.selectedWeight}</strong>
                      </p>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        ₹{itemPrice} / {item.selectedWeight}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedFlavor,
                                item.selectedWeight,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="font-semibold w-6 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedFlavor,
                                item.selectedWeight,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="font-bold text-lg">
                          ₹{totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedFlavor,
                          item.selectedWeight
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* ORDER SUMMARY - ✅ FULLY UPDATED */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold">Order Summary</h2>

                {/* ✅ SUBTOTAL (without shipping) */}
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{getCartSubtotal().toLocaleString()}</span>
                </div>

                {/* ✅ DYNAMIC SHIPPING FEE */}
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    Shipping
                  </span>
                  <span className={getShippingFee() === 0 ? "text-success font-medium" : "text-foreground"}>
                    {getShippingFee() === 0 ? "FREE" : `₹${getShippingFee()}`}
                  </span>
                </div>

                {/* COINS */}
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    Your Coins
                  </span>
                  <span className="font-semibold">
                    {loadingPoints ? "…" : points}
                  </span>
                </div>

                {/* ✅ FINAL TOTAL (subtotal + shipping) */}
                <div className="border-t pt-3 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
