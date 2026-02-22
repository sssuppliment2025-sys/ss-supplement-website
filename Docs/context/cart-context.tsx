"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "./product-context"

export interface CartItem {
  product: Product
  quantity: number
  selectedFlavor: string
  selectedWeight: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, flavor: string, weight: string, quantity?: number) => void
  removeFromCart: (productId: string, flavor: string, weight: string) => void
  updateQuantity: (productId: string, flavor: string, weight: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number                   
  getCartSubtotal: () => number                 
  getShippingFee: () => number                  
  getCartCount: () => number
  getCartItemPrice: (productId: string, flavor: string, weight: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem("ss_cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ss_cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, flavor: string, weight: string, quantity = 1) => {
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
        return newItems
      }

      return [...prev, { product, quantity, selectedFlavor: flavor, selectedWeight: weight }]
    })
  }

  const removeFromCart = (productId: string, flavor: string, weight: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedFlavor === flavor && item.selectedWeight === weight)
      )
    )
  }

  const updateQuantity = (productId: string, flavor: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, flavor, weight)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && 
        item.selectedFlavor === flavor && 
        item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  
  const getItemPrice = (product: Product, flavor: string, weight: string): number => {
    let price = product.price 

    
    if (Array.isArray(product.flavors) && product.flavors.length > 0) {
      const flavorObj = product.flavors.find((f) => {
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

    
    if (weight && (product.weights || product.weightVariants)) {
      const weightsArray = product.weights || product.weightVariants || []
      const weightVariant = weightsArray.find((w: any) => 
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
    return subtotal <= 999 ? 50 : 0
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
