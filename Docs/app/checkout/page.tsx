"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, CreditCard, Banknote, Check, Loader2, QrCode, Copy, CheckCircle, Coins, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL
const ADMIN_WHATSAPP = "919547899170"
const ADMIN_UPI_ID = "sssupplement@upi"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // ✅ FLEXIBLE COINS STATE
  const [points, setPoints] = useState<number>(0)
  const [earnedPoints, setEarnedPoints] = useState<number>(0)
  const [loadingPoints, setLoadingPoints] = useState(true)
  const [useCoins, setUseCoins] = useState(false)

  // Form & UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [utrNumber, setUtrNumber] = useState("")
  const [copied, setCopied] = useState(false)
  const [orderId, setOrderId] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  })

  /* ================= FETCH USER COINS ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingPoints(false)
      return
    }

    const token = localStorage.getItem("token") || localStorage.getItem("access")
    if (!token) {
      setLoadingPoints(false)
      return
    }

    fetch(`${API_URL}/api/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPoints(data.points || 0))
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load reward coins",
          variant: "destructive",
        })
      })
      .finally(() => setLoadingPoints(false))
  }, [isAuthenticated, toast])

  /* ================= ✅ FLEXIBLE 4% MAX COINS ================= */
  const subtotal = getCartTotal()
  const COIN_PERCENT = 0.04      // MAX 4%
  const COIN_VALUE = 0.2         // 1 coin = ₹0.2

  const maxCoinDiscountValue = subtotal * COIN_PERCENT
  const maxCoinsAllowed = Math.floor(maxCoinDiscountValue / COIN_VALUE)
  const coinsToUse = useCoins ? Math.min(points, maxCoinsAllowed) : 0
  const finalTotal = subtotal - (coinsToUse * COIN_VALUE)

  const hasEnoughForMax = points >= maxCoinsAllowed

  /* ================= WHATSAPP MESSAGE ================= */
  const generateWhatsAppMessage = (backendCoins: number, backendEarned: number) => {
    const orderItems = items
      .map((item) => {
        const price = typeof item.product.flavors === "string"
          ? item.product.price
          : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price
        return `• ${item.product.name} (${item.selectedFlavor}, ${item.selectedWeight}) x${item.quantity} = ₹${(price * item.quantity).toLocaleString()}`
      })
      .join("\n")

    const paymentInfo = paymentMethod === "upi" 
      ? `💳 *Payment:* UPI\n📱 UTR: ${utrNumber}\n👛 UPI ID: ${ADMIN_UPI_ID}`
      : "💰 *Payment:* Cash on Delivery"

    const coinsInfo = coinsToUse > 0 
      ? `🪙 Coins Used: ${coinsToUse} (${((coinsToUse * COIN_VALUE / subtotal) * 100).toFixed(1)}%)`
      : "🪙 No coins used"

    const message = `
🛒 *NEW ORDER #${orderId || "TEMP"} - SS Supplement*

📦 *Order Items:*
${orderItems}

💰 *Billing:*
Subtotal: ₹${subtotal.toLocaleString()}
${coinsInfo}
💳 Cash Paid: ₹${finalTotal.toLocaleString()}
Total: *₹${finalTotal.toLocaleString()}*

👛 *COINS UPDATE:*
🎉 *Earned:* +${backendEarned} coins
💰 *New Balance:* ${backendCoins} coins

${paymentInfo}

👤 *Customer Details:*
Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email || "N/A"}

📍 *Delivery Address:*
${formData.address}, ${formData.landmark ? `Landmark: ${formData.landmark}` : ""}
${formData.city}, ${formData.state} - ${formData.pincode}

⏰ *Order Time:* ${new Date().toLocaleString("en-IN")}
    `.trim()

    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const copyUpiId = () => {
    navigator.clipboard.writeText(ADMIN_UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ================= FORM VALIDATION ================= */
  const handleProceedToPayment = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "upi") {
      setShowQRCode(true)
    } else {
      handleSubmit()
    }
  }

  /* ================= ✅ FIXED ORDER SUBMIT - TYPE SAFE ================= */
  const handleSubmit = async () => {
    if (paymentMethod === "upi" && !utrNumber.trim()) {
      toast({
        title: "UTR Number Required",
        description: "Please enter UTR/Transaction number after payment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access")
      
      const orderRes = await fetch(`${API_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: typeof item.product.flavors === "string"
              ? item.product.price
              : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price,
            selectedFlavor: item.selectedFlavor,
            selectedWeight: item.selectedWeight,
          })),
          total: finalTotal,
          coins_used: coinsToUse,
          payment_method: paymentMethod,
          utr_number: paymentMethod === "upi" ? utrNumber : null,
          address: formData,
        }),
      })

      // ✅ TYPE SAFE: Define API response/error interfaces
      interface ApiError {
        error?: string
        detail?: string
        message?: string
      }

      interface ApiSuccess {
        order: {
          id: string
          earnedPoints: number
        }
        earnedPoints?: number
        user?: {
          points: number
        }
      }

      type ApiResponse = ApiError | ApiSuccess

      const orderData = await orderRes.json() as ApiResponse
      
      if (!orderRes.ok) {
        // ✅ TYPE SAFE ERROR HANDLING
        const error = orderData as ApiError
        console.error("Order error:", error)
        throw new Error(
          error.error || 
          error.detail || 
          error.message || 
          "Failed to create order"
        )
      }

      // ✅ TYPE SAFE SUCCESS HANDLING
      const successData = orderData as ApiSuccess
      const earnedPointsFromBackend = successData.order?.earnedPoints || successData.earnedPoints || 0
      setEarnedPoints(earnedPointsFromBackend)

      // ✅ REFRESH COINS
      const profileRes = await fetch(`${API_URL}/api/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const profileData = await profileRes.json()
      const newTotalPoints = profileData.points || 0
      setPoints(newTotalPoints)

      setOrderId(successData.order?.id || "SUCCESS")
      window.open(generateWhatsAppMessage(newTotalPoints, earnedPointsFromBackend), '_blank')

      toast({
        title: "✅ Order Placed Successfully! 🎉",
        description: `Order #${orderId}. Used ${coinsToUse.toLocaleString()} coins. Earned +${earnedPointsFromBackend.toLocaleString()}! Pay ₹${finalTotal.toLocaleString()}`,
      })

      clearCart()
      setOrderPlaced(true)

    } catch (err: any) {
      console.error("Order error:", err)
      toast({
        title: "❌ Order Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Early returns
  if (!isAuthenticated) {
    router.push("/login?redirect=/checkout")
    return null
  }

  if (items.length === 0 && !orderPlaced) {
    router.push("/cart")
    return null
  }

  // Success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Order details sent to WhatsApp. Please pay ₹{finalTotal.toLocaleString()}.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-500/10 to-success/10 border border-yellow-200/50 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="h-8 w-8 text-yellow-500 animate-bounce" />
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  +{earnedPoints.toLocaleString()} Coins Earned!
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Coins used:</span>
                  <span>{coinsToUse.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Earned this order:</span>
                  <span className="font-semibold text-yellow-600">+{earnedPoints.toLocaleString()}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-yellow-200 to-transparent my-2" />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>New Balance:</span>
                  <span className="text-2xl text-primary">{points.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => router.push("/orders")} className="w-full bg-primary">
                View My Orders
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // UPI screen
  if (showQRCode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto">
            <Card className="bg-card border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-foreground flex items-center justify-center gap-2 text-xl">
                  <QrCode className="h-6 w-6 text-primary" />
                  Pay ₹{finalTotal.toLocaleString()} via UPI
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {coinsToUse > 0 ? `+ ${coinsToUse.toLocaleString()} coins used` : "No coins used"}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-xl mx-auto w-fit shadow-lg">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${ADMIN_UPI_ID}&pn=SS%20Supplement&am=${finalTotal}&cu=INR`}
                    alt="UPI QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-bold text-primary">₹{finalTotal.toLocaleString()}</p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">Or send to UPI ID:</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-foreground font-mono text-lg bg-background px-2 py-1 rounded flex-1">
                      {ADMIN_UPI_ID}
                    </code>
                    <Button variant="outline" size="sm" onClick={copyUpiId}>
                      {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utr" className="text-foreground font-medium">
                    Enter UTR/Transaction Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="utr"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="Enter 12-digit UTR number from your UPI app"
                  />
                  <p className="text-xs text-muted-foreground">Find UTR in your UPI app → Transaction History</p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setShowQRCode(false)}
                    disabled={isSubmitting}
                  >
                    Back to Checkout
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !utrNumber.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      "Confirm & Send to WhatsApp"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  After payment, enter UTR and confirm to send order to WhatsApp
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="bg-secondary border-border" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-secondary border-border" />
                </div>
                <div>
                  <Label htmlFor="address">Complete Address <span className="text-destructive">*</span></Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} className="bg-secondary border-border min-h-[80px]" placeholder="House No., Street, Area, Colony" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode <span className="text-destructive">*</span></Label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} className="bg-secondary border-border" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input id="landmark" name="landmark" value={formData.landmark} onChange={handleInputChange} className="bg-secondary border-border" placeholder="Near temple, opposite school, etc." />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "cod" 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-border hover:bg-accent"
                  }`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-3 flex-1 p-0 m-0 h-auto">
                      <Banknote className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay ₹{finalTotal.toLocaleString()} when you receive order</p>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "upi" 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-border hover:bg-accent"
                  }`}>
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-3 flex-1 p-0 m-0 h-auto">
                      <QrCode className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">UPI Payment</p>
                        <p className="text-sm text-muted-foreground">Pay ₹{finalTotal.toLocaleString()} via QR/PhonePe/GPay</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const price = typeof item.product.flavors === "string"
                      ? item.product.price
                      : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price

                    return (
                      <div key={`${item.product.id}-${item.selectedFlavor}-${item.selectedWeight}`} className="flex gap-3 p-2 rounded-lg hover:bg-accent">
                        <div className="relative w-16 h-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1 text-foreground">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.selectedFlavor} • {item.selectedWeight}</p>
                          <p className="text-sm font-medium">
                            ₹{price} × {item.quantity} = <span className="font-bold">₹{(price * item.quantity).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ✅ FLEXIBLE COINS SECTION WITH CHECKBOX */}
                <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Available Coins</span>
                    </div>
                    <Checkbox
                      checked={useCoins}
                      onCheckedChange={setUseCoins}
                      disabled={loadingPoints || points === 0}
                    />
                  </div>

                  {useCoins && points > 0 && (
                    <div className="space-y-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-success">Max 4% discount</span>
                        <span className="text-sm font-bold text-success">
                          {coinsToUse.toLocaleString()} coins (-₹{(coinsToUse * COIN_VALUE).toLocaleString(undefined, {maximumFractionDigits: 0})})
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Max allowed:</span>
                        <span>{maxCoinsAllowed.toLocaleString()}</span>
                      </div>
                      {!hasEnoughForMax && (
                        <div className="text-xs text-destructive">
                          Only {points.toLocaleString()} available (need {maxCoinsAllowed.toLocaleString()})
                        </div>
                      )}
                    </div>
                  )}
                  {useCoins && points === 0 && (
                    <p className="text-xs text-muted-foreground text-center">No coins available</p>
                  )}
                </div>

                {/* Price Summary */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {useCoins && coinsToUse > 0 && (
                    <div className="flex justify-between text-success font-semibold text-sm">
                      <span>🪙 Coins Discount (up to 4%)</span>
                      <span>-₹{(coinsToUse * COIN_VALUE).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                  )}

                  <div className="h-px bg-border my-2" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total to Pay</span>
                    <span className="text-2xl text-primary">₹{finalTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {useCoins && coinsToUse > 0 
                      ? `${coinsToUse.toLocaleString()} coins used (${((coinsToUse * COIN_VALUE / subtotal) * 100).toFixed(1)}% discount)`
                      : "No coins discount applied"
                    }
                  </p>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleProceedToPayment}
                  className="w-full h-12 text-lg"
                  size="lg"
                  disabled={isSubmitting || loadingPoints}
                >
                  {paymentMethod === "upi" 
                    ? `Proceed to UPI Payment (₹${finalTotal.toLocaleString()})` 
                    : `Place Order - Pay ₹${finalTotal.toLocaleString()} (COD)`
                  }
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing order, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
