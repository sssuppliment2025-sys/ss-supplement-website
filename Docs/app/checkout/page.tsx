"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, CreditCard, Check, Loader2, QrCode, Copy, CheckCircle, Coins, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
const ADMIN_UPI_ID = "8001101055-5@ybl"

interface OrderQuote {
  points: number
  items_subtotal: number
  shipping_fee: number
  is_free_shipping: boolean
  cart_total_with_shipping: number
  max_coins_allowed: number
  coins_used: number
  coin_discount: number
  final_total: number
  coin_value: number
  coin_percent: number
  earned_points: number
}

async function parseJsonSafe(res: Response) {
  const raw = await res.text()
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    const preview = raw.slice(0, 120).replace(/\s+/g, " ").trim()
    throw new Error(
      `Invalid server response (${res.status}). Expected JSON, got: ${preview || "empty response"}`
    )
  }
}

const normalizePhoneForRazorpay = (value: string) => {
  const digits = (value || "").replace(/\D/g, "")
  if (digits.length >= 10) return digits.slice(-10)
  return digits
}

const resolveEmailJsConfig = () => {
  const serviceId =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
    process.env.NEXT_PUBLIC_SERVICE_ID ||
    (typeof window !== "undefined" ? localStorage.getItem("NEXT_PUBLIC_EMAILJS_SERVICE_ID") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("EMAILJS_SERVICE_ID") : null)

  const templateId =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_TEMPLATE_ID ||
    (typeof window !== "undefined" ? localStorage.getItem("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("EMAILJS_TEMPLATE_ID") : null)

  const publicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_KEY ||
    process.env.NEXT_PUBLIC_PUBLIC_KEY ||
    (typeof window !== "undefined" ? localStorage.getItem("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("EMAILJS_PUBLIC_KEY") : null)

  return {
    serviceId: serviceId?.trim() || "",
    templateId: templateId?.trim() || "",
    publicKey: publicKey?.trim() || "",
  }
}

// Shipping configuration
const SHIPPING_THRESHOLD = 1000
const SHIPPING_FEE = 50

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  // ✅ FLEXIBLE COINS STATE
  const [points, setPoints] = useState<number>(0)
  const [earnedPoints, setEarnedPoints] = useState<number>(0)
  const [loadingPoints, setLoadingPoints] = useState(true)
  const [useCoins, setUseCoins] = useState(false)
  const [quote, setQuote] = useState<OrderQuote | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)

  // Form & UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "online">("online")
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
    uniqueCode: "",
  })

  useEffect(() => {
    if (!user) return
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || user.username || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
    }))
  }, [user])

  const quoteItemsPayload = items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    quantity: item.quantity,
    price: typeof item.product.flavors === "string"
      ? item.product.price
      : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price,
    selectedFlavor: item.selectedFlavor,
    selectedWeight: item.selectedWeight,
  }))

  /* ================= FETCH COINS + ORDER QUOTE FROM BACKEND ================= */
  useEffect(() => {
    if (items.length === 0) {
      setLoadingPoints(false)
      setLoadingQuote(false)
      setQuote(null)
      return
    }

    if (!isAuthenticated) {
      setLoadingPoints(false)
      setLoadingQuote(false)
      setQuote(null)
      return
    }

    const token = localStorage.getItem("token") || localStorage.getItem("access")
    if (!token) {
      setLoadingPoints(false)
      setLoadingQuote(false)
      setQuote(null)
      return
    }

    setLoadingQuote(true)
    fetch(`${API_URL}/api/orders/quote/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: quoteItemsPayload,
        use_coins: useCoins,
      }),
    })
      .then(async (res) => {
        const payload = await parseJsonSafe(res)
        if (!res.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to calculate checkout summary")
        }

        const backendQuote = payload.data as OrderQuote
        setQuote(backendQuote)
        setPoints(backendQuote.points || 0)
      })
      .catch((error) => {
        setQuote(null)
        toast({
          title: "Error",
          description: error?.message || "Failed to load reward coins",
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoadingPoints(false)
        setLoadingQuote(false)
      })
  }, [isAuthenticated, toast, useCoins, items])

  /* ================= ✅ CONDITIONAL SHIPPING CALCULATION ================= */
  // Items subtotal only (no shipping included)
  const localItemsSubtotal = items.reduce((total, item) => {
    const price = typeof item.product.flavors === "string"
      ? item.product.price
      : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price
    return total + (price * item.quantity)
  }, 0)

  // Shipping is free for all orders
  const localIsFreeShipping = true
  const localShippingFee = SHIPPING_FEE

  // ✅ Cart total WITH shipping (for 4% coin calculation)
  const localCartTotalWithShipping = localItemsSubtotal + localShippingFee

  // ✅ Backend payload fields
  const COIN_VALUE = quote?.coin_value ?? 0.2

  const itemsSubtotal = quote?.items_subtotal ?? localItemsSubtotal
  const isFreeShipping = quote?.is_free_shipping ?? localIsFreeShipping
  const shippingFee = quote?.shipping_fee ?? localShippingFee
  const cartTotalWithShipping = quote?.cart_total_with_shipping ?? localCartTotalWithShipping
  const maxCoinsAllowed = quote?.max_coins_allowed ?? 0
  const coinsToUse = quote?.coins_used ?? 0

  // ✅ Final payment = itemsSubtotal + shipping - coin discount
  const coinDiscount = quote?.coin_discount ?? (coinsToUse * COIN_VALUE)
  const finalTotal = Number((quote?.final_total ?? (itemsSubtotal + shippingFee - coinDiscount)).toFixed(2))

  const hasEnoughForMax = points >= maxCoinsAllowed
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

  const loadRazorpayScript = async () => {
    if (typeof window === "undefined") return false

    if (document.getElementById("razorpay-script")) {
      return true
    }

    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.id = "razorpay-script"
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const verifyRazorpayPayment = async (paymentData: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => {
    const token = localStorage.getItem("token") || localStorage.getItem("access")
    if (!token) throw new Error("Authentication token is missing.")

    const response = await fetch(`${API_URL}/api/orders/razorpay/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...paymentData,
        items: quoteItemsPayload,
        use_coins: useCoins,
        address: formData,
      }),
    })

    const result = await parseJsonSafe(response)
    if (!response.ok || !result?.success) {
      throw new Error(result?.error || "Payment verification failed.")
    }

    return result
  }

  const handleOnlinePayment = async () => {
    if (!quote) {
      toast({
        title: "Please wait",
        description: "Calculating latest totals from backend...",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access")
      if (!token) {
        throw new Error("Please log in before continuing to payment.")
      }

      const createResponse = await fetch(`${API_URL}/api/orders/razorpay/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: quoteItemsPayload,
          use_coins: useCoins,
        }),
      })

      const createData = await parseJsonSafe(createResponse)
      if (!createResponse.ok || !createData?.success) {
        throw new Error(createData?.error || "Failed to create Razorpay payment order.")
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay payment script.")
      }

      const options = {
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: "SS Supplement",
        description: "Online payment via Razorpay",
        order_id: createData.razorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: normalizePhoneForRazorpay(user?.phone || formData.phone),
        },
        theme: {
          color: "#2563eb",
        },
        handler: async (response: any) => {
          try {
            const verifyData = await verifyRazorpayPayment(response)
            const earnedPointsFromBackend = verifyData.order?.earnedPoints || verifyData.earnedPoints || 0
            setEarnedPoints(earnedPointsFromBackend)

            const newTotalPoints = verifyData.user?.points ?? points
            setPoints(newTotalPoints)
            setOrderId(verifyData.order?.id || "SUCCESS")

            if (formData.email.trim()) {
              const otpCode = generateOtpCode()
              try {
                await sendOtpEmail(formData.email.trim(), otpCode)
                toast({
                  title: "OTP Sent",
                  description: "OTP sent to your email. It is valid for 10 minutes.",
                })
              } catch (mailError: unknown) {
                console.error("Email OTP error:", mailError)
                toast({
                  title: "Email Error",
                  description: "Order paid, but OTP email could not be sent.",
                  variant: "destructive",
                })
              }
            }

            const savedOrderId = verifyData.order?.id || `ORD-${Date.now()}`
            const localOrder = {
              id: savedOrderId,
              items: items.map((item) => {
                const price = typeof item.product.flavors === "string"
                  ? item.product.price
                  : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price
                return {
                  product: item.product.name,
                  flavor: item.selectedFlavor || "",
                  weight: item.selectedWeight || "",
                  quantity: item.quantity,
                  price,
                }
              }),
              total: Number(finalTotal.toFixed(2)),
              address: formData,
              paymentMethod,
              status: "paid",
              createdAt: new Date().toISOString(),
              userId: user?.id,
            }
            const existingOrders = JSON.parse(localStorage.getItem("ss_orders") || "[]")
            existingOrders.push(localOrder)
            localStorage.setItem("ss_orders", JSON.stringify(existingOrders))

            toast({
              title: "✅ Payment Successful!",
              description: `Order #${verifyData.order?.id || savedOrderId} placed successfully. Pay ₹${finalTotal.toLocaleString()}`,
            })

            clearCart()
            setOrderPlaced(true)
          } catch (error: any) {
            console.error("Razorpay verification error:", error)
            toast({
              title: "Payment Failed",
              description: error?.message || "Unable to verify payment.",
              variant: "destructive",
            })
          } finally {
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
          },
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (err: any) {
      console.error("Online payment error:", err)
      toast({
        title: "Payment Error",
        description: err.message || "Unable to start online payment.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString()

  const sendOtpEmail = async (email: string, otpCode: string) => {
    const { serviceId, templateId, publicKey } = resolveEmailJsConfig()

    if (!serviceId || !templateId || !publicKey) {
      throw new Error("Email service is not configured. Missing EmailJS environment variables.")
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        otp: otpCode,
        subject: "Password Reset OTP",
        message: `Your OTP: ${otpCode}\n\nValid for 10 minutes.`,
      },
      publicKey,
    )
  }

  /* ================= FORM VALIDATION ================= */
  const handleProceedToPayment = async () => {
    if (loadingQuote || !quote) {
      toast({
        title: "Please wait",
        description: "Calculating latest totals from backend...",
      })
      return
    }

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

    if (paymentMethod !== "online") {
      setPaymentMethod("online")
      toast({
        title: "Online Payment Required",
        description: "Please pay with Razorpay to place your order.",
      })
      return
    }

    await handleOnlinePayment()
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
      
      console.log("✅ BACKEND QUOTE DEBUG:", {
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
          items: quoteItemsPayload,
          use_coins: useCoins,
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

      const orderData = await parseJsonSafe(orderRes) as ApiResponse
      
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

      const newTotalPoints = successData.user?.points ?? points
      setPoints(newTotalPoints)

      setOrderId(successData.order?.id || "SUCCESS")

      if (formData.email.trim()) {
        const otpCode = generateOtpCode()
        try {
          await sendOtpEmail(formData.email.trim(), otpCode)
          toast({
            title: "OTP Sent",
            description: "OTP sent to your email. It is valid for 10 minutes.",
          })
        } catch (mailError: unknown) {
          console.error("Email OTP error:", mailError)
          toast({
            title: "Email Error",
            description: "Order placed, but OTP email could not be sent.",
            variant: "destructive",
          })
        }
      }

      // ✅ Save order to localStorage for "My Orders" page
      const savedOrderId = successData.order?.id || `ORD-${Date.now()}`
      const localOrder = {
        id: savedOrderId,
        items: items.map((item) => {
          const price = typeof item.product.flavors === "string"
            ? item.product.price
            : item.product.flavors.find((f) => f.name === item.selectedFlavor)?.price || item.product.price
          return {
            product: item.product.name,
            flavor: item.selectedFlavor || "",
            weight: item.selectedWeight || "",
            quantity: item.quantity,
            price,
          }
        }),
        total: Number(finalTotal.toFixed(2)),
        address: formData,
        paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
        userId: user?.id,
      }
      const existingOrders = JSON.parse(localStorage.getItem("ss_orders") || "[]")
      existingOrders.push(localOrder)
      localStorage.setItem("ss_orders", JSON.stringify(existingOrders))

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
              Your order has been saved in our system.
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
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${ADMIN_UPI_ID}&pn=Punjab%20National%20Bank%20-%200653&cu=INR`}
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
                      "Confirm Order"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  After payment, enter UTR and confirm your order
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

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div>
                  <Label htmlFor="uniqueCode">Unique Code (Optional)</Label>
                  <Input
                    id="uniqueCode"
                    name="uniqueCode"
                    value={formData.uniqueCode}
                    onChange={handleInputChange}
                    className="bg-secondary border-border"
                    placeholder="Enter your unique code"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="font-medium text-foreground">Razorpay Secure Payment</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment mode is fixed to online payment via Razorpay.
                  </p>
                </div>
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
                      disabled={loadingPoints || loadingQuote || points === 0}
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
                  disabled={isSubmitting || loadingPoints || loadingQuote}
                >
                  {`Pay Now with Razorpay (Rs.${finalTotal.toLocaleString()})`}
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


