'use client'

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, Mail, Phone, User, Lock, Eye, EyeOff, CheckCircle, 
  Loader2, Shield, MapPin, Save, Edit3, Home, PhoneCall,
  Package, Star, LogOut, ChevronRight, Sparkles, Trophy, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

const INDIAN_STATES = [
  "WEST BENGAL"
]

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "security">("profile")

  // Password states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Address states
  const [editingAddress, setEditingAddress] = useState(false)
  const [deliveryPhone, setDeliveryPhone] = useState("")
  const [flatHouse, setFlatHouse] = useState("")
  const [address2, setAddress2] = useState("")
  const [address3, setAddress3] = useState("")
  const [areaStreet, setAreaStreet] = useState("")
  const [townCity, setTownCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [landmark, setLandmark] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const token = localStorage.getItem("access")
    if (!token) {
      router.push("/login")
      return
    }

    fetch(`${API_URL}/api/profileForAccount/`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data)
        if (data.address_fields) {
          setDeliveryPhone(data.address_fields.delivery_phone || data.phone || "")
          setFlatHouse(data.address_fields.flat_house || "")
          setAddress2(data.address_fields.address2 || "")
          setAddress3(data.address_fields.address3 || "")
          setAreaStreet(data.address_fields.area_street || "")
          setTownCity(data.address_fields.town_city || "")
          setState(data.address_fields.state || "")
          setPincode(data.address_fields.pincode || "")
          setLandmark(data.address_fields.landmark || "")
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Profile error:", err)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
        setLoading(false)
      })
  }, [isAuthenticated, router, toast])

  const getFormattedAddress = useCallback(() => {
    const fields = [
      flatHouse.trim(),
      address2.trim(),
      address3.trim(),
      areaStreet.trim(),
      townCity.trim(),
      state.trim(),
      pincode.trim(),
      landmark.trim() ? `Landmark: ${landmark.trim()}` : ""
    ].filter(Boolean).join(", ")
    return fields || ""
  }, [flatHouse, address2, address3, areaStreet, townCity, state, pincode, landmark])

  const handleSaveProfile = async () => {
    if (!pincode || pincode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter valid 6-digit PIN code",
        variant: "destructive",
      })
      return
    }

    if (!deliveryPhone || deliveryPhone.length !== 10) {
      toast({
        title: "Error",
        description: "Please enter valid 10-digit phone",
        variant: "destructive",
      })
      return
    }

    setSavingProfile(true)
    try {
      const token = localStorage.getItem("access")
      const formattedAddress = getFormattedAddress()
      
      const response = await fetch(`${API_URL}/api/profileForAccount/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: formattedAddress,
          address_fields: {
            delivery_phone: deliveryPhone.trim(),
            flat_house: flatHouse.trim(),
            address2: address2.trim(),
            address3: address3.trim(),
            area_street: areaStreet.trim(),
            town_city: townCity.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            landmark: landmark.trim()
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUserData((prev: any) => ({ 
          ...prev, 
          address: formattedAddress,
          address_fields: {
            delivery_phone: deliveryPhone.trim(),
            flat_house: flatHouse.trim(),
            address2: address2.trim(),
            address3: address3.trim(),
            area_street: areaStreet.trim(),
            town_city: townCity.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            landmark: landmark.trim()
          }
        }))
        setEditingAddress(false)
        toast({
          title: "Success!",
          description: "Address saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const resetAddressForm = useCallback(() => {
    if (userData?.address_fields) {
      setDeliveryPhone(userData.address_fields.delivery_phone || userData.phone || "")
      setFlatHouse(userData.address_fields.flat_house || "")
      setAddress2(userData.address_fields.address2 || "")
      setAddress3(userData.address_fields.address3 || "")
      setAreaStreet(userData.address_fields.area_street || "")
      setTownCity(userData.address_fields.town_city || "")
      setState(userData.address_fields.state || "")
      setPincode(userData.address_fields.pincode || "")
      setLandmark(userData.address_fields.landmark || "")
    }
    setEditingAddress(false)
  }, [userData])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setChangingPassword(true)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      setChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      setChangingPassword(false)
      return
    }

    try {
      const token = localStorage.getItem("access")
      const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }

      const response = await fetch(`${API_URL}/api/auth/change-password/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Password changed! Please login with new password.",
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordError("")
      } else {
        setPasswordError(data.error || "Failed to change password")
      }
    } catch (error) {
      setPasswordError("Network error. Please try again.")
    } finally {
      setChangingPassword(false)
    }
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "SS"
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
          <p className="text-muted-foreground mb-6">Something went wrong. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* BACK NAV */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* HERO PROFILE BANNER */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-accent mb-8">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm border-3 border-white/40 flex items-center justify-center shadow-xl">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {getInitials(userData.name)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {userData.name || "SS Member"}
                </h1>
                <p className="text-white/70 text-sm mb-4">{userData.email || ""}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {userData.points > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm">
                      <Trophy className="h-3.5 w-3.5 text-yellow-300" />
                      <span className="font-semibold">{userData.points}</span>
                      <span className="text-white/70">Points</span>
                    </div>
                  )}
                  <Link 
                    href="/orders" 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/25 transition-colors"
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span>My Orders</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/25 transition-colors"
                  >
                    <Star className="h-3.5 w-3.5" />
                    <span>Wishlist</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-white/80 hover:text-white hover:bg-white/15 hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-1 mb-6 bg-muted/50 p-1 rounded-xl overflow-x-auto">
          {([
            { id: "profile" as const, label: "Profile", icon: User },
            { id: "address" as const, label: "Address", icon: MapPin },
            { id: "security" as const, label: "Security", icon: Shield },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="space-y-6">
          {/* ===================== PROFILE TAB ===================== */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in-0 duration-300">
              {/* Personal Info Card */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                      <CardDescription>Your account details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Name */}
                    <div className="group p-4 rounded-xl bg-linear-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</span>
                      </div>
                      <p className="font-semibold text-base truncate">{userData.name || "N/A"}</p>
                    </div>

                    {/* Email */}
                    <div className="group p-4 rounded-xl bg-linear-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span>
                      </div>
                      <p className="font-semibold text-base truncate">{userData.email || "N/A"}</p>
                    </div>

                    {/* Phone */}
                    <div className="group p-4 rounded-xl bg-linear-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</span>
                      </div>
                      <p className="font-semibold text-base truncate">{userData.phone || "N/A"}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    Contact information cannot be changed. Reach out to support for help.
                  </p>
                </CardContent>
              </Card>

              {/* Reward Points Card */}
              {userData.points > 0 && (
                <Card className="border-0 shadow-md overflow-hidden">
                  <div className="relative bg-linear-to-r from-amber-500/10 via-orange-500/10 to-red-500/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-amber-400/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="p-6 flex items-center gap-4 relative">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Sparkles className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Reward Points</p>
                        <p className="text-3xl font-bold text-foreground">{userData.points}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Redeem on your next order</p>
                        <Link href="/cart" className="text-primary text-sm font-semibold hover:underline">
                          Shop Now &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Links Card */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { href: "/orders", icon: Package, label: "My Orders", color: "text-blue-500", bg: "bg-blue-500/10" },
                      { href: "/wishlist", icon: Star, label: "Wishlist", color: "text-pink-500", bg: "bg-pink-500/10" },
                      { href: "/referral", icon: Sparkles, label: "Referrals", color: "text-purple-500", bg: "bg-purple-500/10" },
                      { href: "/chat-support", icon: PhoneCall, label: "Support", color: "text-green-500", bg: "bg-green-500/10" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <span className="text-sm font-medium text-center">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===================== ADDRESS TAB ===================== */}
          {activeTab === "address" && (
            <div className="animate-in fade-in-0 duration-300">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Delivery Address</CardTitle>
                        <CardDescription>Where we deliver your supplements</CardDescription>
                      </div>
                    </div>
                    {!editingAddress && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                        onClick={() => setEditingAddress(true)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        {getFormattedAddress() ? "Edit" : "Add"}
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  {editingAddress ? (
                    <div className="space-y-5">
                      {/* Delivery Phone */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2 text-primary">
                          <Phone className="h-4 w-4" />
                          Delivery Phone <span className="text-xs font-normal text-muted-foreground">(Required)</span>
                        </Label>
                        <Input
                          type="tel"
                          value={deliveryPhone}
                          onChange={(e) => setDeliveryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          maxLength={10}
                          placeholder="9876543210"
                          className="text-lg h-12 bg-background"
                          autoComplete="tel"
                        />
                        <p className="text-xs text-muted-foreground">Delivery partner will call on this number</p>
                      </div>

                      {/* Address Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Flat / House / Apartment *</Label>
                          <Input
                            value={flatHouse}
                            onChange={(e) => setFlatHouse(e.target.value)}
                            placeholder="Flat no, House no, Apartment"
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Street / Area *</Label>
                          <Input
                            value={areaStreet}
                            onChange={(e) => setAreaStreet(e.target.value)}
                            placeholder="Street name, Area"
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Town / City *</Label>
                          <Input
                            value={townCity}
                            onChange={(e) => setTownCity(e.target.value)}
                            placeholder="Town or City"
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">State *</Label>
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {INDIAN_STATES.map((stateName) => (
                                <SelectItem key={stateName} value={stateName}>
                                  {stateName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* PIN Code */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2 text-primary">
                          <MapPin className="h-4 w-4" />
                          PIN Code <span className="text-xs font-normal text-muted-foreground">(Required)</span>
                        </Label>
                        <Input
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          placeholder="6-digit PIN code"
                          className="text-lg h-12 font-mono tracking-widest bg-background"
                        />
                      </div>

                      {/* Optional Fields */}
                      <details className="group rounded-xl border border-border/50">
                        <summary className="cursor-pointer p-4 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
                          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                          Additional Details (Optional)
                        </summary>
                        <div className="px-4 pb-4 space-y-3">
                          <Input
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            placeholder="Near XYZ Park (optional)"
                            className="h-11"
                          />
                          <Input
                            value={address3}
                            onChange={(e) => setAddress3(e.target.value)}
                            placeholder="Additional address line"
                            className="h-11"
                          />
                          <Input
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="Landmark"
                            className="h-11"
                          />
                        </div>
                      </details>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          className="h-12 text-base flex-1 gap-2 shadow-lg shadow-primary/20"
                          onClick={handleSaveProfile}
                          disabled={savingProfile || pincode.length !== 6 || deliveryPhone.length !== 10}
                        >
                          {savingProfile ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              Save Address
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="h-12 text-base sm:w-auto"
                          onClick={resetAddressForm}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Address Display */
                    <div>
                      {getFormattedAddress() ? (
                        <div className="p-5 rounded-xl bg-linear-to-br from-muted/60 to-muted/30 border border-border/50">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Home className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="text-sm font-semibold text-foreground">Delivery Address</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {getFormattedAddress()}
                              </p>
                              {deliveryPhone && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                                  <Phone className="h-3.5 w-3.5" />
                                  {deliveryPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                          <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mb-4">
                            <MapPin className="h-10 w-10 text-muted-foreground/50" />
                          </div>
                          <h3 className="text-lg font-semibold mb-1">No address saved</h3>
                          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                            Add your delivery address to get your supplements delivered fast
                          </p>
                          <Button 
                            onClick={() => setEditingAddress(true)}
                            className="gap-2 shadow-lg shadow-primary/20"
                          >
                            <MapPin className="h-4 w-4" />
                            Add Delivery Address
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===================== SECURITY TAB ===================== */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in-0 duration-300">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Change Password</CardTitle>
                      <CardDescription>Keep your account secure</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="h-11 pr-11"
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-11 pr-11"
                          placeholder="Enter new password (min 6 chars)"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {newPassword.length > 0 && (
                        <div className="flex gap-1 mt-1.5">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                newPassword.length >= level * 3
                                  ? newPassword.length >= 12
                                    ? "bg-green-500"
                                    : newPassword.length >= 8
                                    ? "bg-amber-500"
                                    : "bg-red-400"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`h-11 pr-11 ${
                            confirmPassword && newPassword !== confirmPassword
                              ? "border-destructive focus-visible:ring-destructive"
                              : confirmPassword && newPassword === confirmPassword
                              ? "border-green-500 focus-visible:ring-green-500"
                              : ""
                          }`}
                          placeholder="Re-enter new password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                      )}
                      {confirmPassword && newPassword === confirmPassword && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Passwords match
                        </p>
                      )}
                    </div>

                    {passwordError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-start gap-2">
                        <X className="h-4 w-4 mt-0.5 shrink-0" />
                        {passwordError}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base gap-2 shadow-lg shadow-primary/20" 
                      disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border border-destructive/20 shadow-md">
                <CardContent className="py-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-destructive">Sign Out</h3>
                      <p className="text-sm text-muted-foreground">Log out of your account on this device</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/5 gap-2 w-full sm:w-auto"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Mobile Logout (visible on small screens) */}
        <div className="sm:hidden mt-8 pb-4">
          <Button 
            variant="outline"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 gap-2 h-12"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
