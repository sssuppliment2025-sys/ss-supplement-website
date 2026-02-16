"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ================= TYPES =================
interface User {
  id: number
  username: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (
    name: string,
    email: string,
    phone: string,
    password: string,
    referralCode?: string
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  // ✅ NEW OTP FUNCTIONS
  forgotPassword: (email: string, phone: string) => Promise<{ success: boolean; message: string; error?: string }>
  verifyOTP: (email: string, phone: string, otp: string) => Promise<{ success: boolean; message: string; error?: string }>
  resetPassword: (email: string, phone: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string; error?: string }>
  adminLogin: (phone: string, password: string) => Promise<{ success: boolean; message: string }>
}

// ================= CONTEXT =================
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ================= PROVIDER =================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ================= FETCH CURRENT USER =================
  const fetchCurrentUser = async () => {
    const access = localStorage.getItem("access")
    if (!access) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })

      if (!res.ok) throw new Error("Unauthorized")

      const data = await res.json()

      setUser({
        id: data.id,
        username: data.name || data.phone,
        email: data.email,
        isAdmin: data.is_staff || false,
      })
    } catch {
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  // ================= LOGIN =================
  const login = async (phone: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.detail || "Login failed" }
      }

      // Save JWT tokens
      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)

      setUser({
        id: data.user.id,
        username: data.user.name || data.user.phone,
        email: data.user.email,
        isAdmin: data.user.is_staff || false,
      })

      return { success: true, message: "Login successful" }
    } catch {
      return { success: false, message: "Server error" }
    }
  }

  // ================= ADMIN LOGIN =================
  const adminLogin = async (phone: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.detail || "Admin login failed" }
      }

      // Save JWT tokens
      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)

      setUser({
        id: data.user.id,
        username: data.user.name || data.user.phone,
        email: data.user.email,
        isAdmin: data.user.is_staff || true,
      })

      return { success: true, message: "Admin login successful" }
    } catch {
      return { success: false, message: "Server error" }
    }
  }

  // ================= SIGNUP =================
  const signup = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    referralCode?: string
  ) => {
    try {
      const body: any = {
        name,
        email,
        phone,
        password,
        confirmPassword: password, // REQUIRED BY BACKEND
      }

      if (referralCode) body.referralCode = referralCode

      const res = await fetch(`${API_BASE}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: JSON.stringify(data) }
      }

      // Save tokens
      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)

      setUser({
        id: data.user.id,
        username: data.user.name || data.user.phone,
        email: data.user.email,
        isAdmin: false,
      })

      return { success: true, message: "Signup successful" }
    } catch {
      return { success: false, message: "Server error" }
    }
  }

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setUser(null)
  }

  // ================= FORGOT PASSWORD - SEND OTP =================
  const forgotPassword = async (email: string, phone: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { 
          success: false, 
          message: data.error || data.detail || "Failed to send OTP",
          error: data.error || data.detail
        }
      }

      return { 
        success: true, 
        message: data.message || "OTP sent successfully"
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Network error. Please try again.",
        error: "Network error"
      }
    }
  }

  // ================= VERIFY OTP =================
  const verifyOTP = async (email: string, phone: string, otp: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { 
          success: false, 
          message: data.error || "Invalid or expired OTP",
          error: data.error
        }
      }

      return { 
        success: true, 
        message: data.message || "OTP verified successfully"
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Verification failed. Please try again.",
        error: "Network error"
      }
    }
  }

  // ================= RESET PASSWORD =================
  const resetPassword = async (email: string, phone: string, otp: string, newPassword: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, otp, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { 
          success: false, 
          message: data.error || "Password reset failed",
          error: data.error
        }
      }

      return { 
        success: true, 
        message: data.message || "Password reset successfully"
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Password reset failed. Please try again.",
        error: "Network error"
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        verifyOTP,
        resetPassword,
        adminLogin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

// ================= HOOK =================
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
