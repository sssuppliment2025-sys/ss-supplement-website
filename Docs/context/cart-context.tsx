"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "./product-context"
import { useAuth } from "@/context/auth-context"

export interface CartItem {
  product: Product
  quantity: number
  selectedFlavor: string
  selectedWeight: string
}

export interface CartActionResult {
  success: boolean
  message?: string
}

type FlavorOption = string | { name: string; price?: number }
type WeightOption = string | { weight?: string; name?: string; price?: number }
type ProductWithLegacyWeights = Product & { weightVariants?: WeightOption[] }

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, flavor: string, weight: string, quantity?: number) => Promise<CartActionResult>
  removeFromCart: (productId: string, flavor: string, weight: string) => Promise<CartActionResult>
  updateQuantity: (productId: string, flavor: string, weight: string, quantity: number) => Promise<CartActionResult>
  clearCart: () => Promise<CartActionResult>
  getCartTotal: () => number                   
  getCartSubtotal: () => number                 
  getShippingFee: () => number                  
  getCartCount: () => number
  getCartItemPrice: (productId: string, flavor: string, weight: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_FREE_SHIPPING_THRESHOLD = 0
const CART_SHIPPING_FEE = 0
const LOCAL_CART_KEY = "ss_cart"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  const readLocalCart = () => {
    const storedCart = localStorage.getItem(LOCAL_CART_KEY)
    if (!storedCart) return [] as CartItem[]
    try {
      const parsed = JSON.parse(storedCart)
      return Array.isArray(parsed) ? (parsed as CartItem[]) : []
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error)
      return [] as CartItem[]
    }
  }

  const writeLocalCart = (nextItems: CartItem[]) => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(nextItems))
  }

  const getAuthToken = () => localStorage.getItem("access") || localStorage.getItem("token")

  const parseJsonSafe = async (response: Response) => {
    const raw = await response.text()
    try {
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  const normalizeServerCartItems = (serverItems: unknown): CartItem[] => {
    if (!Array.isArray(serverItems)) return []

    return serverItems
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null
        const item = entry as Record<string, unknown>
        const product = item.product
        if (!product || typeof product !== "object") return null

        return {
          product: product as Product,
          quantity: Math.max(1, Number(item.quantity || 1)),
          selectedFlavor: String(item.selectedFlavor || ""),
          selectedWeight: String(item.selectedWeight || ""),
        } as CartItem
      })
      .filter((entry): entry is CartItem => Boolean(entry))
  }

  const setItemsFromServerPayload = (payload: any) => {
    const serverItems = normalizeServerCartItems(payload?.data?.items || [])
    setItems(serverItems)
  }

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setItems(readLocalCart())
        return
      }

      const token = getAuthToken()
      if (!token) {
        setItems([])
        return
      }

      try {
        const response = await fetch(`${API_BASE}/api/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const payload = await parseJsonSafe(response)
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to load cart from server")
        }
        setItemsFromServerPayload(payload)
      } catch (error) {
        console.error("Failed to load cart from backend:", error)
      }
    }

    void loadCart()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      writeLocalCart(items)
    }
  }, [items, isAuthenticated])

  const addToCartLocal = (product: Product, flavor: string, weight: string, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.selectedFlavor === flavor && 
          item.selectedWeight === weight
      )

      if (existingIndex > -1) {
        const newItems = [...prev]
        newItems[existingIndex].quantity += quantity
        writeLocalCart(newItems)
        return newItems
      }

      const newItems = [...prev, { product, quantity, selectedFlavor: flavor, selectedWeight: weight }]
      writeLocalCart(newItems)
      return newItems
    })
  }

  const removeFromCartLocal = (productId: string, flavor: string, weight: string) => {
    setItems((prev) => {
      const newItems = prev.filter(
        (item) => !(item.product.id === productId && item.selectedFlavor === flavor && item.selectedWeight === weight)
      )
      writeLocalCart(newItems)
      return newItems
    })
  }

  const updateQuantityLocal = (productId: string, flavor: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartLocal(productId, flavor, weight)
      return
    }

    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.product.id === productId && 
        item.selectedFlavor === flavor && 
        item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
      writeLocalCart(newItems)
      return newItems
    })
  }

  const clearCartLocal = () => {
    setItems([])
    writeLocalCart([])
  }

  const addToCart = async (product: Product, flavor: string, weight: string, quantity = 1): Promise<CartActionResult> => {
    if (!isAuthenticated) {
      addToCartLocal(product, flavor, weight, quantity)
      return { success: true }
    }

    const token = getAuthToken()
    if (!token) return { success: false, message: "Please login again." }

    try {
      const response = await fetch(`${API_BASE}/api/cart/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item: {
            productId: product.id,
            selectedFlavor: flavor,
            selectedWeight: weight,
            quantity,
            product,
          },
        }),
      })

      const payload = await parseJsonSafe(response)
      if (!response.ok || !payload?.success) {
        return { success: false, message: payload?.error || "Unable to add product to cart." }
      }
      setItemsFromServerPayload(payload)
      return { success: true }
    } catch (error) {
      console.error("addToCart backend error:", error)
      return { success: false, message: "Network issue while updating cart." }
    }
  }

  const removeFromCart = async (productId: string, flavor: string, weight: string): Promise<CartActionResult> => {
    if (!isAuthenticated) {
      removeFromCartLocal(productId, flavor, weight)
      return { success: true }
    }

    const token = getAuthToken()
    if (!token) return { success: false, message: "Please login again." }

    try {
      const response = await fetch(`${API_BASE}/api/cart/items/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          selectedFlavor: flavor,
          selectedWeight: weight,
        }),
      })

      const payload = await parseJsonSafe(response)
      if (!response.ok || !payload?.success) {
        return { success: false, message: payload?.error || "Unable to remove cart item." }
      }
      setItemsFromServerPayload(payload)
      return { success: true }
    } catch (error) {
      console.error("removeFromCart backend error:", error)
      return { success: false, message: "Network issue while updating cart." }
    }
  }

  const updateQuantity = async (productId: string, flavor: string, weight: string, quantity: number): Promise<CartActionResult> => {
    if (!isAuthenticated) {
      updateQuantityLocal(productId, flavor, weight, quantity)
      return { success: true }
    }

    const token = getAuthToken()
    if (!token) return { success: false, message: "Please login again." }

    try {
      const response = await fetch(`${API_BASE}/api/cart/items/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          selectedFlavor: flavor,
          selectedWeight: weight,
          quantity,
        }),
      })

      const payload = await parseJsonSafe(response)
      if (!response.ok || !payload?.success) {
        return { success: false, message: payload?.error || "Unable to update quantity." }
      }
      setItemsFromServerPayload(payload)
      return { success: true }
    } catch (error) {
      console.error("updateQuantity backend error:", error)
      return { success: false, message: "Network issue while updating cart." }
    }
  }

  const clearCart = async (): Promise<CartActionResult> => {
    if (!isAuthenticated) {
      clearCartLocal()
      return { success: true }
    }

    const token = getAuthToken()
    if (!token) return { success: false, message: "Please login again." }

    clearCartLocal()

    try {
      const response = await fetch(`${API_BASE}/api/cart/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const payload = await parseJsonSafe(response)
      if (!response.ok || !payload?.success) {
        return { success: false, message: payload?.error || "Unable to clear cart on server." }
      }
      setItemsFromServerPayload(payload)
      return { success: true }
    } catch (error) {
      console.error("clearCart backend error:", error)
      return { success: false, message: "Network issue while clearing cart." }
    }
  }

  
  const getItemPrice = (product: Product, flavor: string, weight: string): number => {
    let price = product.price 

    
    const flavors = product.flavors as FlavorOption[]
    if (Array.isArray(flavors) && flavors.length > 0) {
      const flavorObj = flavors.find((f) => {
        if (typeof f === "string") {
          return f === flavor
        }
        return f.name === flavor
      })
      if (flavorObj && typeof flavorObj !== "string" && flavorObj.price) {
        price = flavorObj.price
      }
    } else if (typeof product.flavors === "string" && product.flavors === flavor) {
      price = product.price
    }

    
    const productWithLegacyWeights = product as ProductWithLegacyWeights
    if (weight && (productWithLegacyWeights.weights || productWithLegacyWeights.weightVariants)) {
      const weightsArray: WeightOption[] = productWithLegacyWeights.weightVariants || productWithLegacyWeights.weights || []
      const weightVariant = weightsArray.find((w) => 
        (typeof w === "string" ? w : w.weight || w.name) === weight
      )
      if (weightVariant && typeof weightVariant !== "string" && weightVariant.price) {
        price = weightVariant.price
      }
    }

    
    return price || product.originalPrice || 0
  }

 
  const getCartSubtotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = getItemPrice(item.product, item.selectedFlavor, item.selectedWeight)
      return total + (itemPrice * item.quantity)
    }, 0)
  }

  
  const getShippingFee = () => {
    const subtotal = getCartSubtotal()
    return subtotal <= CART_FREE_SHIPPING_THRESHOLD ? CART_SHIPPING_FEE : 0
  }

  
  const getCartTotal = () => {
    return getCartSubtotal() + getShippingFee()
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartItemPrice = (productId: string, flavor: string, weight: string) => {
    const item = items.find(
      (i) => i.product.id === productId && i.selectedFlavor === flavor && i.selectedWeight === weight
    )
    if (!item) return 0
    return getItemPrice(item.product, flavor, weight)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,      
        getCartSubtotal,  
        getShippingFee,    
        getCartCount,
        getCartItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
