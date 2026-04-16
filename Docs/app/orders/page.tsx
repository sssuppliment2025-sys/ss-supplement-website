"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Clock, Check, Truck, Loader2, XCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"

const ORDER_STEPS = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
]

interface Order {
  id: string
  items: {
    product: string
    flavor: string
    weight: string
    quantity: number
    price: number
  }[]
  total: number
  address: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
  status: string
  createdAt: string
  userId?: string | number
  shippingFee?: number
  coinsUsed?: number
  earnedPoints?: number
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/orders")
      return
    }

    const fetchOrders = async () => {
      setLoadingOrders(true)
      setOrdersError("")

      try {
        const token = localStorage.getItem("access") || localStorage.getItem("token")
        if (!token) throw new Error("Please log in again to view your orders.")

        const response = await fetch(`${API_URL}/api/orders/my/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(data.error || data.detail || "Unable to load orders from backend.")
        }

        setOrders(Array.isArray(data.data) ? data.data : [])
      } catch (error: any) {
        const allOrders = JSON.parse(localStorage.getItem("ss_orders") || "[]")
        const userOrders = allOrders.filter((order: Order) => String(order.userId) === String(user?.id))
        setOrders(userOrders.reverse())
        setOrdersError(error?.message || "Unable to load latest order status.")
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "confirmed":
      case "paid":
        return <Check className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cancelled":
        return "bg-destructive/20 text-destructive"
      case "paid":
      case "confirmed":
        return "bg-primary/20 text-primary"
      case "shipped":
        return "bg-accent/20 text-accent"
      case "delivered":
        return "bg-success/20 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid"
      case "cod":
        return "Pending"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getStepIndex = (status: string) => {
    switch (status) {
      case "delivered":
        return 3
      case "shipped":
        return 2
      case "confirmed":
      case "paid":
        return 1
      case "pending":
      default:
        return 0
    }
  }

  const formatDate = (value: string) => {
    if (!value) return "Not available"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Not available"
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getPaymentLabel = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "cod":
        return "Pay on Delivery"
      case "upi":
        return "UPI"
      case "online":
        return "Online Payment"
      default:
        return paymentMethod
    }
  }

  const renderStatusHierarchy = (status: string) => {
    if (status === "cancelled") {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-center gap-2 font-medium text-destructive">
            <XCircle className="h-5 w-5" />
            Order Cancelled
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            This order was cancelled from the admin panel.
          </p>
        </div>
      )
    }

    const currentStep = getStepIndex(status)

    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ORDER_STEPS.map((step, index) => {
          const StepIcon = step.icon
          const isComplete = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div
              key={step.key}
              className={`rounded-lg border p-3 ${
                isCurrent
                  ? "border-primary bg-primary/10"
                  : isComplete
                    ? "border-success/30 bg-success/10"
                    : "border-border bg-secondary/30"
              }`}
            >
              <div
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isComplete
                      ? "bg-success text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <StepIcon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground">
                {isCurrent ? "Current status" : isComplete ? "Completed" : "Waiting"}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

        {ordersError && (
          <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-muted-foreground">
            Showing saved orders from this device because latest backend orders could not be loaded: {ordersError}
          </div>
        )}

        {loadingOrders ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Loading your orders</h2>
              <p className="text-muted-foreground">Fetching the latest status from backend...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground">Start shopping to see your orders here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold text-foreground">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="text-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold text-foreground">₹{order.total}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Order Status</p>
                    {renderStatusHierarchy(order.status)}
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-foreground">
                            {item.product} ({item.flavor}, {item.weight}) x{item.quantity}
                          </span>
                          <span className="text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                    <p className="text-foreground text-sm">
                      {order.address.fullName}, {order.address.address}, {order.address.city}, {order.address.state} -{" "}
                      {order.address.pincode}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="text-foreground">{getPaymentLabel(order.paymentMethod)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/track-order?orderId=${encodeURIComponent(order.id)}`}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Track This Order
                      </Link>
                      <a
                        href={`https://wa.me/919547899170?text=${encodeURIComponent(`Hi, I'd like to get updates on my order ${order.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Get Order Updates
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
