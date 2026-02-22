"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, CreditCard, Banknote, Check, Loader2, QrCode, Copy, CheckCircle, Coins, AlertCircle, Truck } from "lucide-react"
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

// ✅ CONDITIONAL SHIPPING CONFIGURATION
const SHIPPING_THRESHOLD = 1000  // Free shipping above ₹999
const SHIPPING_FEE = 50         // ₹50 if below threshold

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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod")
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

  /* ================= ✅ CONDITIONAL SHIPPING CALCULATION ================= */
  // Items subtotal only (no shipping included)
  const itemsSubtotal = items.reduce((total, item) => {
    const price = typeof item.product.flavors === "string"
      ? item.product.price
      : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price
    return total + (price * item.quantity)
  }, 0)

  // ✅ DYNAMIC SHIPPING based on itemsSubtotal
  const isFreeShipping = itemsSubtotal >= SHIPPING_THRESHOLD
  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE

  // ✅ Cart total WITH shipping (for 4% coin calculation)
  const cartTotalWithShipping = itemsSubtotal + shippingFee

  // ✅ Backend payload fields
  const COIN_PERCENT = 0.04      // MAX 4% of cartTotalWithShipping
  const COIN_VALUE = 0.2         // 1 coin = ₹0.2

  const maxCoinDiscountValue = cartTotalWithShipping * COIN_PERCENT
  const maxCoinsAllowed = Math.floor(maxCoinDiscountValue / COIN_VALUE)
  const coinsToUse = useCoins ? Math.min(points, maxCoinsAllowed) : 0

  // ✅ Final payment = itemsSubtotal + shipping - coin discount
  const coinDiscount = coinsToUse * COIN_VALUE
  const finalTotal = Number((itemsSubtotal + shippingFee - coinDiscount).toFixed(2))

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
      .join("\\n")

    const paymentInfo = paymentMethod === "upi" 
      ? `💳 *Payment:* UPI\\n📱 UTR: ${utrNumber}\\n👛 UPI ID: ${ADMIN_UPI_ID}`
      : "💰 *Payment:* Cash on Delivery"

    const shippingInfo = isFreeShipping 
      ? "🚚 *FREE Shipping* (Order > ₹999)"
      : `🚚 *Shipping:* ₹${shippingFee.toLocaleString()}`

    const coinsInfo = coinsToUse > 0 
      ? `🪙 Coins Used: ${coinsToUse} (${((coinsToUse * COIN_VALUE / cartTotalWithShipping) * 100).toFixed(1)}% of total)`
      : "🪙 No coins used"

    const message = `
🛒 *NEW ORDER #${orderId || "TEMP"} - SS Supplement*

📦 *Order Items:*
${orderItems}

💰 *Billing Breakdown:*
Items: ₹${itemsSubtotal.toLocaleString()}
${shippingInfo}
Cart Total: ₹${cartTotalWithShipping.toLocaleString()}
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

  /* ================= ✅ BACKEND PAYLOAD WITH CONDITIONAL SHIPPING ================= */
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
      
      console.log("✅ CONDITIONAL SHIPPING DEBUG:", {
        items_subtotal: Number(itemsSubtotal.toFixed(2)),
        shipping_fee: shippingFee,
        is_free_shipping: isFreeShipping,
        cart_total_with_shipping: Number(cartTotalWithShipping.toFixed(2)),
        coins_used: coinsToUse,
        coin_discount: Number(coinDiscount.toFixed(2)),
        final_total: Number(finalTotal.toFixed(2))
      })

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
          // ✅ Backend expects THESE exact fields:
          items_subtotal: Number(itemsSubtotal.toFixed(2)),
          shipping_fee: shippingFee,                    // 50 or 0
          display_subtotal: Number(cartTotalWithShipping.toFixed(2)), // for 4% coins
          total: Number(finalTotal.toFixed(2)),
          coins_used: coinsToUse,
          is_free_shipping: isFreeShipping,
          payment_method: paymentMethod,
          utr_number: paymentMethod === "upi" ? utrNumber : null,
          address: formData,
        }),
      })

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
        const error = orderData as ApiError
        console.error("Order error:", error)
        throw new Error(
          error.error || 
          error.detail || 
          error.message || 
          "Failed to create order"
        )
      }

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
        description: `Order #${successData.order?.id || orderId}. ${isFreeShipping ? 'FREE' : '₹50'} shipping. Used ${coinsToUse.toLocaleString()} coins. Pay ₹${finalTotal.toLocaleString()}`,
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
                  <span>Shipping:</span>
                  <span className={isFreeShipping ? "text-success font-semibold" : ""}>
                    {isFreeShipping ? "FREE" : `₹${shippingFee.toLocaleString()}`}
                  </span>
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
              <a
                href={`https://wa.me/919547899170?text=${encodeURIComponent(`Hi! I just placed an order (Order ID: ${orderId}). I'd like to receive updates on my order status. 🙏`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Get Order Updates on WhatsApp
              </a>
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
                  {isFreeShipping ? "🎉 FREE Shipping" : "🚚 Shipping included"} • {coinsToUse > 0 ? `+ ${coinsToUse.toLocaleString()} coins used` : "No coins used"}
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
                <RadioGroup value={paymentMethod} onValueChange={(value: "cod" | "upi") => setPaymentMethod(value)} className="space-y-3">
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
                        <p className="text-sm text-muted-foreground">
                          Pay ₹{finalTotal.toLocaleString()} when you receive order 
                          <span className={isFreeShipping ? "text-success font-semibold" : "text-muted-foreground"}>
                            ({isFreeShipping ? "FREE" : "₹50"} shipping)
                          </span>
                        </p>
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
                        <p className="text-sm text-muted-foreground">
                          Pay ₹{finalTotal.toLocaleString()} via QR/PhonePe/GPay 
                          <span className={isFreeShipping ? "text-success font-semibold" : "text-muted-foreground"}>
                            ({isFreeShipping ? "FREE" : "₹50"} shipping)
                          </span>
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary WITH CONDITIONAL SHIPPING */}
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

                {/* FREE SHIPPING BANNER */}
                {isFreeShipping && (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200/50 rounded-xl p-4 text-center">
                    <Truck className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                      🎉 FREE Shipping!
                    </p>
                    {/*<p className="text-xs text-emerald-700">Order value ₹{itemsSubtotal.toLocaleString()} ≥ ₹999</p> */}
                  </div>
                )}

                {/* Coins Section */}
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
                        <span className="text-xs font-medium text-success">
                          Max 4% of total (₹{cartTotalWithShipping.toLocaleString()})
                        </span>
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

                {/* Price Summary WITH CONDITIONAL SHIPPING */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Items ({items.length})</span>
                    <span>₹{itemsSubtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className={`flex justify-between text-sm font-medium ${isFreeShipping ? "text-success" : "text-muted-foreground"}`}>
                    <span className="flex items-center gap-1">
                      <Truck className={`h-4 w-4 ${isFreeShipping ? "text-success" : ""}`} />
                      Shipping
                    </span>
                    <span className={isFreeShipping ? "text-success font-semibold" : ""}>
                      {isFreeShipping ? "FREE" : `₹${shippingFee.toLocaleString()}`}
                    </span>
                  </div>

                  {useCoins && coinsToUse > 0 && (
                    <div className="flex justify-between text-success font-semibold text-sm">
                      <span>🪙 Coins Discount (4% max)</span>
                      <span>-₹{(coinsToUse * COIN_VALUE).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                  )}

                  <div className="h-px bg-border my-2" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total to Pay</span>
                    <span className="text-2xl text-primary">₹{finalTotal.toLocaleString()}</span>
                  </div>
                  {/*<p className="text-xs text-muted-foreground text-center">
                    {useCoins && coinsToUse > 0 
                      ? `${coinsToUse.toLocaleString()} coins used - ${isFreeShipping ? "FREE" : "₹50"} shipping`
                      : isFreeShipping 
                      ? `🎉 FREE shipping (₹${itemsSubtotal.toLocaleString()} ≥ ₹999)`
                      : `🚚 Shipping ₹${shippingFee.toLocaleString()} included`
                    }
                  </p>*/}
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleProceedToPayment}
                  className="w-full h-12 text-lg"
                  size="lg"
                  disabled={isSubmitting || loadingPoints}
                >
                  {paymentMethod === "upi" 
                    ? `Proceed to UPI (₹${finalTotal.toLocaleString()})` 
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
