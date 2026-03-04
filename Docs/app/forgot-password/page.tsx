"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, Shield, Key, CheckCircle, Eye, EyeOff } from "lucide-react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

const resolveEmailJsConfig = () => {
  const serviceId =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
    process.env.NEXT_PUBLIC_SERVICE_ID ||
    (typeof window !== "undefined" ? localStorage.getItem("NEXT_PUBLIC_EMAILJS_SERVICE_ID") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("EMAILJS_SERVICE_ID") : null)

  const templateId =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_TEMPLATE_ID ||
    (typeof window !== "undefined" ? localStorage.getItem("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("EMAILJS_TEMPLATE_ID") : null)

  const publicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_KEY ||
    process.env.NEXT_PUBLIC_PUBLIC_KEY ||
    (typeof window !== "undefined" ? localStorage.getItem("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("EMAILJS_PUBLIC_KEY") : null)

  return {
    serviceId: serviceId?.trim() || "",
    templateId: templateId?.trim() || "",
    publicKey: publicKey?.trim() || "",
  }
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { forgotPassword, verifyOTP, resetPassword } = useAuth()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  })

  const normalizePhone = (phone: string) => phone.replace(/\D/g, "").slice(-10)

  const sendOTPEmail = async (userData: { name?: string; email: string; phone: string; otp: string }) => {
    const otpCode = String(userData?.otp ?? "").trim()
    if (!otpCode || otpCode === "XXXXX") {
      throw new Error("OTP not available from backend")
    }

    const { serviceId, templateId, publicKey } = resolveEmailJsConfig()
    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        "Email service not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
      )
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: userData.email,
        to_name: userData.name || "User",
        otp: otpCode,
        otp_code: otpCode,
        phone: userData.phone,
        subject: "Password Reset OTP",
        message: `Your OTP: ${otpCode}\n\nValid for 10 minutes.`,
      },
      publicKey,
    )
  }

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const normalizedPhone = normalizePhone(formData.phone)
      if (normalizedPhone.length !== 10) {
        toast({
          title: "Invalid Phone",
          description: "Enter a valid 10-digit phone number.",
          variant: "destructive",
        })
        return
      }

      const result = await forgotPassword(formData.email.trim(), normalizedPhone)
      if (!result.success || !result.data) {
        toast({
          title: "Error",
          description: result.message || result.error || "Failed to generate OTP",
          variant: "destructive",
        })
        return
      }

      await sendOTPEmail(result.data)
      setFormData((prev) => ({ ...prev, phone: normalizedPhone, email: formData.email.trim() }))
      toast({
        title: "Email Sent",
        description: "OTP sent to your email. Check inbox/spam.",
      })
      setStep(2)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unable to send OTP email",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await verifyOTP(formData.email.trim(), normalizePhone(formData.phone), formData.otp)
      if (result.success) {
        toast({ title: "OTP Verified", description: "You can set a new password now." })
        setStep(3)
      } else {
        toast({
          title: "Invalid OTP",
          description: result.error || "Please check OTP and try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.new_password !== formData.confirm_password) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }
    if (formData.new_password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const result = await resetPassword(
        formData.email.trim(),
        normalizePhone(formData.phone),
        formData.otp,
        formData.new_password,
      )
      if (result.success) {
        toast({ title: "Success", description: "Password reset successful. Redirecting..." })
        setTimeout(() => router.push("/login"), 1200)
      } else {
        toast({
          title: "Error",
          description: result.error || "Password reset failed",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
      return
    }
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 px-4 border border-input rounded-xl hover:bg-accent hover:border-border"
              onClick={goBack}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? "Back to Login" : "Back"}
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-background" />
              </div>
              <CardTitle className="text-2xl font-bold flex flex-col items-center gap-2">
                {step === 1 && <><span>Forgot Password?</span><span className="text-sm text-muted-foreground">Step 1 of 3</span></>}
                {step === 2 && <><span>Verify OTP</span><span className="text-sm text-muted-foreground">Step 2 of 3</span></>}
                {step === 3 && <><span>Set New Password</span><span className="text-sm text-muted-foreground">Step 3 of 3</span></>}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 1 && "Enter your phone and email to receive OTP."}
                {step === 2 && `Enter the 6-digit OTP sent to ${formData.email || "your email"}.`}
                {step === 3 && "Create a new password (min 6 characters)."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g. +91XXXXXXXXXX"
                        className="pl-10 h-12"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 h-12"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={loading || !formData.phone || !formData.email}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone</Label>
                    <Input value={formData.phone} readOnly className="bg-muted/50 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input value={formData.email} readOnly className="bg-muted/50 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium">Enter OTP</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        className="pl-10 h-14 text-lg font-mono tracking-widest text-center"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={loading || formData.otp.length !== 6}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone</Label>
                    <Input value={formData.phone} readOnly className="bg-muted/50 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input value={formData.email} readOnly className="bg-muted/50 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        className="pl-10 pr-12 h-12"
                        value={formData.new_password}
                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                        minLength={6}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat new password"
                        className="pl-10 pr-12 h-12"
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={loading || formData.new_password !== formData.confirm_password || formData.new_password.length < 6}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
