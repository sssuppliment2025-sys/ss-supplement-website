"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check, Clock, Package, Search, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
  userId?: string
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "")
  const [searchedOrderId, setSearchedOrderId] = useState(searchParams.get("orderId") || "")
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("ss_orders") || "[]")
    setOrders(storedOrders)
  }, [])

  const matchedOrder = useMemo(() => {
    const normalized = searchedOrderId.trim().toLowerCase()
    if (!normalized) return null
    return orders.find((order) => order.id.toLowerCase() === normalized) || null
  }, [orders, searchedOrderId])

  const hasSearched = searchedOrderId.trim().length > 0

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchedOrderId(orderId.trim())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
      case "paid":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/20 text-primary"
      case "shipped":
        return "bg-accent/20 text-accent"
      case "delivered":
      case "paid":
        return "bg-success/20 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPaymentLabel = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "cod":
        return "Cash on Delivery"
      case "upi":
        return "UPI"
      case "online":
        return "Online Payment"
      default:
        return paymentMethod
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Track Order</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Enter your order ID to view order details and latest status from your order history.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-3xl space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="order-id" className="mb-2 block text-sm font-medium text-foreground">
                      Enter your Order ID
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="order-id"
                        value={orderId}
                        onChange={(event) => setOrderId(event.target.value)}
                        placeholder="Example: ORD-123456789"
                        className="border-border bg-secondary"
                      />
                      <Button type="submit" className="sm:min-w-36">
                        <Search className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use the same order ID shown in your <Link href="/orders" className="text-primary hover:underline">My Orders</Link> section.
                  </p>
                </form>
              </CardContent>
            </Card>

            {matchedOrder ? (
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold text-foreground">{matchedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="text-foreground">
                        {new Date(matchedOrder.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold text-foreground">Rs. {matchedOrder.total}</p>
                    </div>
                    <Badge className={`${getStatusColor(matchedOrder.status)} flex items-center gap-1`}>
                      {getStatusIcon(matchedOrder.status)}
                      {matchedOrder.status.charAt(0).toUpperCase() + matchedOrder.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="mb-2 text-sm text-muted-foreground">Items</p>
                    <div className="space-y-2">
                      {matchedOrder.items.map((item, index) => (
                        <div key={`${matchedOrder.id}-${index}`} className="flex justify-between gap-4 text-sm">
                          <span className="text-foreground">
                            {item.product} ({item.flavor}, {item.weight}) x{item.quantity}
                          </span>
                          <span className="text-foreground">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <p className="mb-1 text-sm text-muted-foreground">Delivery Address</p>
                    <p className="text-sm text-foreground">
                      {matchedOrder.address.fullName}, {matchedOrder.address.address}, {matchedOrder.address.city},{" "}
                      {matchedOrder.address.state} - {matchedOrder.address.pincode}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Phone: {matchedOrder.address.phone}</p>
                  </div>

                  <div className="mt-4 border-t border-border pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="text-foreground">{getPaymentLabel(matchedOrder.paymentMethod)}</p>
                    </div>
                    <a
                      href={`https://wa.me/919547899170?text=${encodeURIComponent(`Hi, I'd like to get updates on my order ${matchedOrder.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ebe57]"
                    >
                      Get Order Updates
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : hasSearched ? (
              <Card className="border-border bg-card">
                <CardContent className="p-10 text-center">
                  <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
                  <h2 className="mb-2 text-xl font-semibold text-foreground">Order not found</h2>
                  <p className="text-muted-foreground">
                    Please check your order ID and try again. You can also open your{" "}
                    <Link href="/orders" className="text-primary hover:underline">
                      My Orders
                    </Link>{" "}
                    page to copy the exact ID.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
