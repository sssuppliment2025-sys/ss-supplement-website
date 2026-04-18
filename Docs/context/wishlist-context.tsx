"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/auth-context"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

interface WishlistActionResult {
  success: boolean
  message?: string
}

interface WishlistContextType {
  wishlistIds: string[]
  addToWishlist: (productId: string) => Promise<WishlistActionResult>
  removeFromWishlist: (productId: string) => Promise<WishlistActionResult>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => Promise<WishlistActionResult>
  getWishlistCount: () => number
}

const STORAGE_KEY = "ss_wishlist"

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const { isAuthenticated } = useAuth()

  const parseJsonSafe = async (response: Response) => {
    const raw = await response.text()
    try {
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  const getAuthToken = () => localStorage.getItem("access") || localStorage.getItem("token")

  const readLocalWishlist = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return [] as string[]
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return [] as string[]
    }
  }

  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated) {
        setWishlistIds(readLocalWishlist())
        return
      }

      const token = getAuthToken()
      if (!token) {
        setWishlistIds([])
        return
      }

      try {
        const response = await fetch(`${API_BASE}/api/wishlist/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const payload = await parseJsonSafe(response)
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to load wishlist")
        }
        const serverIds = Array.isArray(payload?.data?.product_ids) ? payload.data.product_ids.map(String) : []
        setWishlistIds(serverIds)
      } catch (error) {
        console.error("Failed to load wishlist from backend:", error)
      }
    }

    void loadWishlist()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds))
    }
  }, [wishlistIds, isAuthenticated])

  const addToWishlist = async (productId: string): Promise<WishlistActionResult> => {
    if (!isAuthenticated) {
      setWishlistIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
      return { success: true }
    }

    const token = getAuthToken()
    if (!token) return { success: false, message: "Please login again." }

    try {
      const response = await fetch(`${API_BASE}/api/wishlist/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })
      const payload = await parseJsonSafe(response)
      if (!response.ok || !payload?.success) {
        return { success: false, message: payload?.error || "Unable to add in wishlist." }
      }
      const serverIds = Array.isArray(payload?.data?.product_ids) ? payload.data.product_ids.map(String) : []
      setWishlistIds(serverIds)
      return { success: true }
    } catch (error) {
      console.error("addToWishlist backend error:", error)
      return { success: false, message: "Network issue while updating wishlist." }
    }
  }

  const removeFromWishlist = async (productId: string): Promise<WishlistActionResult> => {
    if (!isAuthenticated) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId))
      return { success: true }
    }

    const token = getAuthToken()
    if (!token) return { success: false, message: "Please login again." }

    try {
      const response = await fetch(`${API_BASE}/api/wishlist/items/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })
      const payload = await parseJsonSafe(response)
      if (!response.ok || !payload?.success) {
        return { success: false, message: payload?.error || "Unable to remove from wishlist." }
      }
      const serverIds = Array.isArray(payload?.data?.product_ids) ? payload.data.product_ids.map(String) : []
      setWishlistIds(serverIds)
      return { success: true }
    } catch (error) {
      console.error("removeFromWishlist backend error:", error)
      return { success: false, message: "Network issue while updating wishlist." }
    }
  }

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  const toggleWishlist = async (productId: string): Promise<WishlistActionResult> => {
    if (wishlistIds.includes(productId)) {
      return removeFromWishlist(productId)
    }
    return addToWishlist(productId)
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
