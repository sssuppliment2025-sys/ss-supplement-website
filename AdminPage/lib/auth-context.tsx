"use client"

import { createContext, useContext, useState, useEffect } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/admin-api/auth/me/", {
          method: "GET",
          cache: "no-store",
        })
        setIsAuthenticated(res.ok)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/admin-api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = async () => {
    await fetch("/admin-api/auth/logout/", {
      method: "POST",
    })
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
