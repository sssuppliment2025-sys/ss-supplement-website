"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, Shield, Key, CheckCircle, Eye, EyeOff } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { forgotPassword, verifyOTP, resetPassword } = useAuth()

  // Multi-step state
  const [step, setStep] = useState(1) // 1: Phone/Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form states for each step
  const [formData, setFormData] = useState({ phone: "", email: "" })
  const [otpData, setOtpData] = useState({ otp: "" })
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" })

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await forgotPassword(formData.email, formData.phone)
      
      if (result.success) {
        toast({
          title: "OTP Sent!",
          description: "Check your email for 6-digit verification code."
        })
        setStep(2) // Move to OTP step
        setOtpData({ otp: "" })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send OTP",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await verifyOTP(formData.email, formData.phone, otpData.otp)
      
      if (result.success) {
        toast({
          title: "OTP Verified!",
          description: "You can now set a new password."
        })
        setStep(3) // Move to password reset step
        setPasswordData({ newPassword: "", confirmPassword: "" })
      } else {
        toast({
          title: "Invalid OTP",
          description: result.error || "Please check OTP and try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "OTP verification failed.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await resetPassword(
        formData.email, 
        formData.phone, 
        otpData.otp, 
        passwordData.newPassword
      )
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Password reset successfully! Redirecting to login..."
        })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: result.error || "Password reset failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Password reset failed. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={goBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? "Back to Login" : "Back"}
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Set New Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 && "Enter your phone and email to receive a 6-digit OTP."}
              {step === 2 && "Enter the OTP sent to your email."}
              {step === 3 && "Create a strong new password (minimum 8 characters)."}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* STEP 1: Phone + Email */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+919876543210"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={loading || !formData.phone || !formData.email}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={formData.phone} 
                    readOnly 
                    className="bg-muted/50 pl-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={formData.email} 
                    readOnly 
                    className="bg-muted/50 pl-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      className="pl-10"
                      value={otpData.otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setOtpData({...otpData, otp: value})
                      }}
                      required
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={loading || otpData.otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            )}

            {/* STEP 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={formData.email} readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      className="pl-10 pr-12"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat new password"
                      className="pl-10 pr-12"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={loading || 
                    passwordData.newPassword !== passwordData.confirmPassword || 
                    passwordData.newPassword.length < 8}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}

            {/* Bottom Link */}
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => router.push("/login")}
              >
                Remember your password? Login instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
