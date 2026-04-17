"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, User, Shield, Gift, Mail } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirect = searchParams.get("redirect") || "/"
  const refFromUrl = searchParams.get("ref")

  const { login, signup, adminLogin, isAuthenticated, forgotPassword } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] =
    useState<"login" | "signup" | "admin">("login")

  const [showPassword, setShowPassword] = useState(false)

  const [loginLoading, setLoginLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  const [loginData, setLoginData] = useState({ phone: "", password: "" })
  const [adminData, setAdminData] = useState({ phone: "", password: "" })
  const [forgotEmail, setForgotEmail] = useState("")

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  })

  const normalizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 10)
  const isValidPhone = (value: string) => /^\d{10}$/.test(value)
  const isValidEmail = (value: string) => value.includes("@")

  /* ================= SAVE REFERRAL FROM URL ================= */
  useEffect(() => {
    if (refFromUrl) {
      localStorage.setItem("referral_code", refFromUrl)
    }
  }, [refFromUrl])

  /* ================= AUTO LOAD REFERRAL ================= */
  useEffect(() => {
    const storedRef = localStorage.getItem("referral_code")
    if (storedRef) {
      setSignupData((prev) => ({
        ...prev,
        referralCode: storedRef,
      }))
      setActiveTab("signup")
    }
  }, [])

  /* ================= AUTO REDIRECT IF LOGGED IN ================= */
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect)
    }
  }, [isAuthenticated, router, redirect])

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = async () => {
    setForgotLoading(true)

    try {
      const result = await forgotPassword(forgotEmail.trim())
      
      if (result.success) {
        toast({ 
          title: "Success!", 
          description: result.message || "Password reset email sent!" 
        })
        setForgotEmail("")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email",
        variant: "destructive",
      })
    } finally {
      setForgotLoading(false)
    }
  }

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedPhone = normalizePhone(loginData.phone)
    if (!isValidPhone(normalizedPhone)) {
      toast({
        title: "Invalid Phone",
        description: "Phone number must be exactly 10 digits.",
        variant: "destructive",
      })
      return
    }

    setLoginLoading(true)
    const result = await login(normalizedPhone, loginData.password)

    if (result.success) {
      toast({ title: "Success", description: result.message })
      router.replace(redirect)
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setLoginLoading(false)
  }

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedPhone = normalizePhone(signupData.phone)
    const normalizedEmail = signupData.email.trim().toLowerCase()

    if (!isValidPhone(normalizedPhone)) {
      toast({
        title: "Invalid Phone",
        description: "Phone number must be exactly 10 digits.",
        variant: "destructive",
      })
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email with '@'.",
        variant: "destructive",
      })
      return
    }

    setSignupLoading(true)

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setSignupLoading(false)
      return
    }

    const result = await signup(
      signupData.name.trim(),
      normalizedEmail,
      normalizedPhone,
      signupData.password,
      signupData.referralCode || undefined
    )

    if (result.success) {
      toast({ title: "Success", description: result.message })

      // ✅ clear referral after success
      localStorage.removeItem("referral_code")

      setActiveTab("login")
      setLoginData({ phone: normalizedPhone, password: "" })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setSignupLoading(false)
  }

  /* ================= ADMIN ================= */
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminLoading(true)

    const result = await adminLogin(adminData.phone, adminData.password)

    if (result.success) {
      toast({ title: "Success", description: result.message })
      router.replace("/admin")
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setAdminLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (value === "login" || value === "signup" || value === "admin") {
                setActiveTab(value)
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2">
                    <User /> Login
                  </CardTitle>
                  <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit phone number"
                        value={loginData.phone}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            phone: normalizePhone(e.target.value),
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <Button className="w-full" disabled={loginLoading}>
                      {loginLoading ? "Logging in..." : "Login"}
                    </Button>

                    {/* ✅ FIXED: Navigate to Forgot Password Page */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="link"
                        className="w-full justify-start p-0 h-auto text-sm text-muted-foreground hover:text-foreground no-underline"
                        onClick={() => router.push('/forgot-password')}
                        disabled={forgotLoading}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Forgot Password?
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2">
                    <Gift /> Sign Up
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit phone number"
                      value={signupData.phone}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          phone: normalizePhone(e.target.value),
                        })
                      }
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />

                    {/* Referral (auto) */}
                    <Input
                      placeholder="Referral Code"
                      value={signupData.referralCode}
                      readOnly
                    />

                    <Button className="w-full" disabled={signupLoading}>
                      {signupLoading ? "Creating..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ADMIN */}
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2">
                    <Shield /> Admin Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <Input
                      placeholder="Phone"
                      value={adminData.phone}
                      onChange={(e) =>
                        setAdminData({
                          ...adminData,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={adminData.password}
                      onChange={(e) =>
                        setAdminData({
                          ...adminData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <Button className="w-full" disabled={adminLoading}>
                      {adminLoading ? "Logging in..." : "Admin Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
