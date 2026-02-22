"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const API_BASE = "https://ss-supplement-website.onrender.com" // process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface WishlistContextType {
  wishlistIds: string[]
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => void
  getWishlistCount: () => number
}

const STORAGE_KEY = "ss_wishlist"

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setWishlistIds(Array.isArray(parsed) ? parsed : [])
      }
    } catch {
      setWishlistIds([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds))
  }, [wishlistIds])

  const addToWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    )
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId))
  }

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const getWishlistCount = () => wishlistIds.length

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}
