"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Check,
  CheckCheck,
  CircleDashed,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { useProducts } from "@/context/product-context"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"

type CanonicalStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
type StepState = "complete" | "current" | "upcoming" | "cancelled"

interface OrderItem {
  product: string
  flavor: string
  weight: string
  quantity: number
  price: number
}

interface Order {
  id: string
  items: OrderItem[]
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

interface PreviewStep {
  key: string
  label: string
  icon: LucideIcon
  state: StepState
}

interface TimelineStep {
  key: string
  title: string
  detail: string
  timeLabel: string
  icon: LucideIcon
  state: StepState
}

const STATUS_RANK: Record<Exclude<CanonicalStatus, "cancelled">, number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
}

const PREVIEW_BLUEPRINT: Array<{ key: Exclude<CanonicalStatus, "cancelled">; label: string; icon: LucideIcon }> = [
  { key: "pending", label: "Placed", icon: ShoppingBag },
  { key: "confirmed", label: "Confirmed", icon: CheckCheck },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
]

function normalizeStatus(status: string): CanonicalStatus {
  switch (status) {
    case "paid":
      return "confirmed"
    case "cod":
      return "pending"
    case "cancelled":
      return "cancelled"
    case "confirmed":
    case "shipped":
    case "delivered":
      return status
    default:
      return "pending"
  }
}

function parseDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function addHours(value: Date, hours: number) {
  const date = new Date(value)
  date.setHours(date.getHours() + hours)
  return date
}

function addDays(value: Date, days: number) {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date
}

function formatDate(value: string) {
  if (!value) return "Not available"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatDateTime(value: Date) {
  return value.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatCurrency(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`
}

function getPaymentLabel(paymentMethod: string) {
  switch (paymentMethod) {
    case "cod":
      return "Pay on Delivery"
    case "upi":
      return "UPI"
    case "online":
      return "Online Payment"
    default:
      return paymentMethod || "Not available"
  }
}

function getStatusMeta(status: string) {
  switch (normalizeStatus(status)) {
    case "cancelled":
      return {
        label: "Cancelled",
        title: "Order cancelled",
        note: "This order is no longer being processed.",
        badgeClass: "border-red-200 bg-red-50 text-red-700",
        dotClass: "bg-red-500",
      }
    case "confirmed":
      return {
        label: "Confirmed",
        title: "Order confirmed",
        note: "We have confirmed your order and started processing it.",
        badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
        dotClass: "bg-sky-500",
      }
    case "shipped":
      return {
        label: "Shipped",
        title: "On the way",
        note: "Your package has been handed to the courier partner.",
        badgeClass: "border-indigo-200 bg-indigo-50 text-indigo-700",
        dotClass: "bg-indigo-500",
      }
    case "delivered":
      return {
        label: "Delivered",
        title: "Delivered successfully",
        note: "Your order has reached the delivery address.",
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
        dotClass: "bg-emerald-500",
      }
    case "pending":
    default:
      return {
        label: "Pending",
        title: "Awaiting confirmation",
        note: "We have received your order and will confirm it shortly.",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
        dotClass: "bg-amber-500",
      }
  }
}

function getPrimaryItem(order: Order): OrderItem {
  return (
    order.items[0] || {
      product: "Order item",
      flavor: "",
      weight: "",
      quantity: 1,
      price: order.total,
    }
  )
}

function getItemSubtitle(item: OrderItem) {
  return [item.flavor, item.weight].filter(Boolean).join(" / ") || "Standard variant"
}

function getPreviewSteps(status: string): PreviewStep[] {
  const canonicalStatus = normalizeStatus(status)

  if (canonicalStatus === "cancelled") {
    return [
      { key: "pending", label: "Placed", icon: ShoppingBag, state: "complete" },
      { key: "cancelled", label: "Cancelled", icon: XCircle, state: "cancelled" },
    ]
  }

  const rank = STATUS_RANK[canonicalStatus]

  return PREVIEW_BLUEPRINT.map((step) => {
    const stepRank = STATUS_RANK[step.key]
    let state: StepState = "upcoming"

    if (step.key === canonicalStatus) {
      state = "current"
    } else if (stepRank < rank) {
      state = "complete"
    }

    return { ...step, state }
  })
}

function buildTimelineSteps(order: Order): TimelineStep[] {
  const baseDate = parseDate(order.createdAt)
  const paymentLabel = getPaymentLabel(order.paymentMethod)
  const canonicalStatus = normalizeStatus(order.status)

  if (canonicalStatus === "cancelled") {
    return [
      {
        key: "placed",
        title: "Order placed",
        detail: `Your order was created with ${paymentLabel}.`,
        timeLabel: formatDateTime(baseDate),
        icon: ShoppingBag,
        state: "complete",
      },
      {
        key: "cancelled",
        title: "Order cancelled",
        detail: "This order was cancelled before delivery. Please contact support if you need help.",
        timeLabel: formatDateTime(addHours(baseDate, 6)),
        icon: XCircle,
        state: "cancelled",
      },
    ]
  }

  const timelineStateByStatus: Record<Exclude<CanonicalStatus, "cancelled">, Record<string, StepState>> = {
    pending: {
      placed: "current",
      confirmed: "upcoming",
      packed: "upcoming",
      shipped: "upcoming",
      out: "upcoming",
      delivered: "upcoming",
    },
    confirmed: {
      placed: "complete",
      confirmed: "current",
      packed: "upcoming",
      shipped: "upcoming",
      out: "upcoming",
      delivered: "upcoming",
    },
    shipped: {
      placed: "complete",
      confirmed: "complete",
      packed: "complete",
      shipped: "current",
      out: "upcoming",
      delivered: "upcoming",
    },
    delivered: {
      placed: "complete",
      confirmed: "complete",
      packed: "complete",
      shipped: "complete",
      out: "complete",
      delivered: "current",
    },
  }

  const states = timelineStateByStatus[canonicalStatus]

  return [
    {
      key: "placed",
      title: "Order placed",
      detail: `Order received with ${paymentLabel}.`,
      timeLabel: formatDateTime(baseDate),
      icon: ShoppingBag,
      state: states.placed,
    },
    {
      key: "confirmed",
      title: "Order confirmed",
      detail: "Our team has reviewed the order and started processing it.",
      timeLabel: formatDateTime(addHours(baseDate, 2)),
      icon: CheckCheck,
      state: states.confirmed,
    },
    {
      key: "packed",
      title: "Packed and ready",
      detail: "Your items have been packed and prepared for handoff.",
      timeLabel: formatDateTime(addHours(baseDate, 8)),
      icon: Package,
      state: states.packed,
    },
    {
      key: "shipped",
      title: "Shipped",
      detail: "The courier partner has picked up your package.",
      timeLabel: formatDateTime(addDays(baseDate, 1)),
      icon: Truck,
      state: states.shipped,
    },
    {
      key: "out",
      title: "Out for delivery",
      detail: "The package is on the final delivery run to your address.",
      timeLabel: formatDateTime(addDays(baseDate, 3)),
      icon: MapPin,
      state: states.out,
    },
    {
      key: "delivered",
      title: "Delivered",
      detail: "Your order has been delivered successfully.",
      timeLabel: formatDateTime(addDays(baseDate, 3)),
      icon: PackageCheck,
      state: states.delivered,
    },
  ]
}

function getTimelineDotClasses(state: StepState) {
  switch (state) {
    case "complete":
      return "border-emerald-500 bg-emerald-500 text-white"
    case "current":
      return "border-primary bg-primary text-primary-foreground"
    case "cancelled":
      return "border-red-500 bg-red-500 text-white"
    case "upcoming":
    default:
      return "border-border bg-background text-muted-foreground"
  }
}

function getPreviewDotClasses(state: StepState) {
  switch (state) {
    case "complete":
      return "border-emerald-500 bg-emerald-500 text-white"
    case "current":
      return "border-primary bg-primary text-primary-foreground"
    case "cancelled":
      return "border-red-500 bg-red-500 text-white"
    case "upcoming":
    default:
      return "border-border bg-background text-muted-foreground"
  }
}

function getPreviewConnectorClasses(current: StepState, next: StepState) {
  if (current === "cancelled" || next === "cancelled") {
    return "bg-red-200"
  }
  if (current === "complete" && (next === "complete" || next === "current")) {
    return "bg-emerald-400"
  }
  if (current === "current") {
    return "bg-primary/30"
  }
  return "bg-border"
}

function OrderRoadmapDialog({
  order,
  imageSrc,
}: {
  order: Order
  imageSrc: string
}) {
  const primaryItem = getPrimaryItem(order)
  const statusMeta = getStatusMeta(order.status)
  const timeline = buildTimelineSteps(order)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#2874f0] text-white hover:bg-[#1f63cf]">View more</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden border-border p-0">
        <DialogHeader className="border-b border-border bg-muted/20 px-6 py-5">
          <DialogTitle className="text-xl text-foreground">Order Roadmap</DialogTitle>
          <DialogDescription>
            Order #{order.id} . {statusMeta.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[80vh] gap-0 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="border-b border-border bg-card p-6 lg:border-r lg:border-b-0">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                <Image
                  src={imageSrc}
                  alt={primaryItem.product}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold text-foreground">{primaryItem.product}</p>
                <p className="mt-1 text-xs text-muted-foreground">{getItemSubtitle(primaryItem)}</p>
                <p className="mt-3 text-lg font-semibold text-foreground">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
                <div
                  className={cn(
                    "mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                    statusMeta.badgeClass,
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dotClass)} />
                  {statusMeta.label}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Address</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {order.address.fullName}
                  <br />
                  {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                  <br />
                  {order.address.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment</p>
                <p className="mt-2 text-foreground">{getPaymentLabel(order.paymentMethod)}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Items</p>
                <div className="mt-2 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="rounded-md border border-border/80 px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{item.product}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {getItemSubtitle(item)} x{item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            <div className="relative pl-2">
              <div className="absolute bottom-0 left-3 top-3 w-px bg-border" />
              <div className="space-y-6">
                {timeline.map((step) => {
                  const StepIcon = step.icon

                  return (
                    <div key={step.key} className="relative pl-10">
                      <div
                        className={cn(
                          "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2",
                          getTimelineDotClasses(step.state),
                        )}
                      >
                        <StepIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1 pb-2">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{step.detail}</p>
                        <p className="text-xs font-medium text-muted-foreground">{step.timeLabel}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { products } = useProducts()
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
  }, [isAuthenticated, router, user])

  const normalizedProducts = useMemo(
    () =>
      products.map((product) => ({
        product,
        name: product.name.trim().toLowerCase(),
        weight: (product.weight || "").trim().toLowerCase(),
        flavors: product.flavors.map((flavor) => flavor.name.trim().toLowerCase()),
      })),
    [products],
  )

  const resolveProductImage = (item: OrderItem) => {
    const normalizedName = item.product.trim().toLowerCase()
    const normalizedWeight = item.weight.trim().toLowerCase()
    const normalizedFlavor = item.flavor.trim().toLowerCase()

    const exactVariant = normalizedProducts.find(
      ({ name, weight, flavors }) =>
        name === normalizedName &&
        (!normalizedWeight || weight === normalizedWeight) &&
        (!normalizedFlavor || flavors.includes(normalizedFlavor)),
    )

    if (exactVariant?.product.image) return exactVariant.product.image

    const sameNameProduct = normalizedProducts.find(({ name }) => name === normalizedName)
    if (sameNameProduct?.product.image) return sameNameProduct.product.image

    return "/placeholder.svg"
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">Recent purchases, live status, and delivery progress.</p>
        </div>

        {ordersError && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing saved orders from this device because the latest backend status could not be loaded: {ordersError}
          </div>
        )}

        {loadingOrders ? (
          <div className="rounded-lg border border-border bg-card px-6 py-16 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Loading your orders</h2>
            <p className="mt-2 text-sm text-muted-foreground">Fetching the latest status updates.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-6 py-16 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Once you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const primaryItem = getPrimaryItem(order)
              const productImage = resolveProductImage(primaryItem)
              const statusMeta = getStatusMeta(order.status)
              const previewSteps = getPreviewSteps(order.status)
              const extraItems = Math.max(order.items.length - 1, 0)

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-col gap-6 p-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                        <Image
                          src={productImage}
                          alt={primaryItem.product}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                            Order #{order.id}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </span>
                        </div>

                        <h2 className="mt-3 line-clamp-2 text-base font-semibold text-foreground sm:text-lg">
                          {primaryItem.product}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">{getItemSubtitle(primaryItem)}</p>
                        {extraItems > 0 && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            + {extraItems} more item{extraItems > 1 ? "s" : ""} in this order
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Amount</p>
                            <p className="mt-1 font-semibold text-foreground">{formatCurrency(order.total)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment</p>
                            <p className="mt-1 text-foreground">{getPaymentLabel(order.paymentMethod)}</p>
                          </div>
                          <div className="min-w-[180px]">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Delivery address
                            </p>
                            <p className="mt-1 line-clamp-2 text-foreground">
                              {order.address.city}, {order.address.state} - {order.address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full border-t border-border pt-5 lg:w-[290px] lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0">
                      <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-start gap-3">
                          <span className={cn("mt-1 h-3 w-3 rounded-full", statusMeta.dotClass)} />
                          <div>
                            <p className="font-semibold text-foreground">{statusMeta.title}</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{statusMeta.note}</p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                            statusMeta.badgeClass,
                          )}
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dotClass)} />
                          {statusMeta.label}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <OrderRoadmapDialog order={order} imageSrc={productImage} />
                        <Button asChild variant="outline">
                          <Link href={`/track-order?orderId=${encodeURIComponent(order.id)}`}>Track This Order</Link>
                        </Button>
                      </div>

                      <Button
                        asChild
                        variant="ghost"
                        className="mt-2 h-auto px-0 text-[#25D366] hover:bg-transparent hover:text-[#1ebe57]"
                      >
                        <a
                          href={`https://wa.me/919547899170?text=${encodeURIComponent(`Hi, I'd like to get updates on my order ${order.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Order Updates
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border bg-muted/10 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-y-3 overflow-x-auto">
                      {previewSteps.map((step, index) => {
                        const StepIcon = step.icon
                        const nextStep = previewSteps[index + 1]

                        return (
                          <div key={step.key} className="flex items-center">
                            <div className="flex min-w-[108px] items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                                  getPreviewDotClasses(step.state),
                                )}
                              >
                                {step.state === "upcoming" ? (
                                  <CircleDashed className="h-4 w-4" />
                                ) : step.state === "cancelled" ? (
                                  <XCircle className="h-4 w-4" />
                                ) : step.state === "complete" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <StepIcon className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{step.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {step.state === "complete"
                                    ? "Done"
                                    : step.state === "current"
                                      ? "Current"
                                      : step.state === "cancelled"
                                        ? "Stopped"
                                        : "Upcoming"}
                                </p>
                              </div>
                            </div>

                            {nextStep && (
                              <div
                                className={cn(
                                  "mx-3 hidden h-[2px] w-10 rounded-full sm:block",
                                  getPreviewConnectorClasses(step.state, nextStep.state),
                                )}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
