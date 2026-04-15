"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

async function parseJsonSafe(res: Response) {
  const raw = await res.text()
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    const preview = raw.slice(0, 120).replace(/\s+/g, " ").trim()
    throw new Error(`Invalid server response (${res.status}): ${preview || "empty"}`)
  }
}

// ================= TYPES =================
interface User {
  id: number
  username: string
  phone: string
  email: string
  isAdmin: boolean
}

interface OTPData {
  name: string
  phone: string
  email: string
  otp: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  // 🔥 OTP FLOW (Frontend handles email)
  otpData: OTPData | null
  setOtpData: (data: OTPData | null) => void
  forgotPassword: (email: string, phone: string) => Promise<{ 
    success: boolean; 
    message: string; 
    error?: string;
    data?: OTPData;
  }>
  verifyOTP: (email: string, phone: string, otp: string) => Promise<{ 
    success: boolean; 
    message: string; 
    error?: string 
  }>
  resetPassword: (email: string, phone: string, otp: string, newPassword: string) => Promise<{ 
    success: boolean; 
    message: string; 
    error?: string 
  }>
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (
    name: string,
    email: string,
    phone: string,
    password: string,
    referralCode?: string
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  adminLogin: (phone: string, password: string) => Promise<{ success: boolean; message: string }>
}

// ================= CONTEXT =================
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ================= PROVIDER =================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [otpData, setOtpData] = useState<OTPData | null>(null)

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

      const data = await parseJsonSafe(res)

      setUser({
        id: data.id,
        username: data.name || data.phone,
        phone: data.phone || "",
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

      const data = await parseJsonSafe(res)

      if (!res.ok) {
        return { success: false, message: data.detail || "Login failed...." }
      }

      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)

      setUser({
        id: data.user.id,
        username: data.user.name || data.user.phone,
        phone: data.user.phone || "",
        email: data.user.email,
        isAdmin: data.user.is_staff || false,
      })

      return { success: true, message: "Login successful...." }
    } catch {
      return { success: false, message: "Password Incorrect...." }
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

      const data = await parseJsonSafe(res)

      if (!res.ok) {
        return { success: false, message: data.detail || "Admin login failed" }
      }

      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)

      setUser({
        id: data.user.id,
        username: data.user.name || data.user.phone,
        phone: data.user.phone || "",
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
        confirmPassword: password,
      }

      if (referralCode) body.referralCode = referralCode

      const res = await fetch(`${API_BASE}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await parseJsonSafe(res)

      if (!res.ok) {
        return { success: false, message: JSON.stringify(data) }
      }

      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)

      setUser({
        id: data.user.id,
        username: data.user.name || data.user.phone,
        phone: data.user.phone || "",
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
    setOtpData(null) // Clear OTP data
  }

  // 🔥 ================= FORGOT PASSWORD - GET OTP DATA =================
  const forgotPassword = async (email: string, phone: string) => {
    console.log("🔥 forgotPassword called:", { email, phone })
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email }),
      })

      const data = await parseJsonSafe(res)
      console.log("🔥 forgotPassword response:", data)

      if (!res.ok) {
        return { 
          success: false, 
          message: data.error || data.detail || "Failed to generate OTP",
          error: data.error || data.detail
        }
      }

      // 🔥 STORE OTP DATA FOR FRONTEND EMAIL SENDING
      if (data.success && data.data) {
        setOtpData(data.data)
        console.log("🔥 OTP Data stored for email:", data.data)
      }

      return { 
        success: true, 
        message: data.message || "OTP ready - email will be sent from frontend",
        data: data.data
      }
    } catch (error) {
      console.error("🔥 forgotPassword error:", error)
      return { 
        success: false, 
        message: "Network error. Please try again.",
        error: "Network error"
      }
    }
  }

  // 🔥 ================= VERIFY OTP =================
  const verifyOTP = async (email: string, phone: string, otp: string) => {
    console.log("🔥 verifyOTP called:", { email, phone, otp })
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email, otp }),
      })

      const data = await parseJsonSafe(res)
      console.log("🔥 verifyOTP response:", data)

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
      console.error("🔥 verifyOTP error:", error)
      return { 
        success: false, 
        message: "Verification failed. Please try again.",
        error: "Network error"
      }
    }
  }

  // 🔥 ================= RESET PASSWORD =================
  const resetPassword = async (email: string, phone: string, otp: string, newPassword: string) => {
    console.log("🔥 resetPassword called:", { email, phone, otp, newPassword })
    
    const safePassword = newPassword || ''
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone,
          email,
          otp,
          new_password: safePassword 
        }),
      })

      const data = await parseJsonSafe(res)
      console.log("🔥 resetPassword response:", data)

      if (!res.ok) {
        return { 
          success: false, 
          message: data.error || "Password reset failed",
          error: data.error
        }
      }

      // Clear OTP data after success
      setOtpData(null)

      return { 
        success: true, 
        message: data.message || "Password reset successfully"
      }
    } catch (error) {
      console.error("🔥 resetPassword error:", error)
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
        otpData,           // 🔥 NEW: OTP data for frontend  email
        setOtpData,        // 🔥 NEW: Set OTP data manually
        login,
        signup,
        logout,
        forgotPassword,    // 🔥 UPDATED: Returns OTP data
        verifyOTP,
        resetPassword,     // 🔥 UPDATED: Clears OTP data
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
