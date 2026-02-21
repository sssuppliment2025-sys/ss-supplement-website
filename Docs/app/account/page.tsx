'use client'

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, Mail, Phone, User, Lock, Eye, EyeOff, CheckCircle, 
  Loader2, Shield, MapPin, Save, Edit3, Home, PhoneCall
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

  // Password states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Address states - MOBILE OPTIMIZED
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

  // ✅ MOBILE-OPTIMIZED: Load profile
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
        console.log("✅ Profile loaded:", data)
        setUserData(data)
        
        // Populate ALL address fields
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
        console.error("❌ Profile error:", err)
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

  // ✅ MOBILE-OPTIMIZED: Save with validation
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
        setUserData(prev => ({ 
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
          description: "Address saved successfully ✅",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-destructive text-lg mb-4">Failed to load profile</p>
          <Button onClick={() => router.reload()} className="w-full sm:w-auto">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* ✅ MOBILE BACK BUTTON */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 block sm:inline"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">My Account</h1>
        <p className="text-muted-foreground mb-8">Manage your profile and delivery settings</p>

        {/* ✅ MOBILE STACKED LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* PROFILE & ADDRESS - FULL WIDTH ON MOBILE */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Profile & Delivery Address
              </CardTitle>
              <CardDescription>
                Update your complete delivery details
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* READ-ONLY PROFILE INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg truncate">{userData.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">Name (cannot be changed)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 bg-card rounded-lg">
                  <div className="space-y-1 text-sm">
                    <Label className="flex items-center gap-1 text-xs font-medium">
                      <Mail className="h-3 w-3" />
                      Email (cannot be changed)
                    </Label>
                    <p className="font-mono truncate">{userData.email || "N/A"}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <Label className="flex items-center gap-1 text-xs font-medium">
                      <Phone className="h-3 w-3" />
                      Phone (cannot be changed)
                    </Label>
                    <p className="font-mono truncate">{userData.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* ✅ MOBILE-OPTIMIZED ADDRESS FORM */}
              <div>
                <Label className="text-base font-semibold flex items-center gap-2 mb-4 block">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </Label>
                
                {editingAddress ? (
                  /* ✅ MOBILE FORM - FULL WIDTH, LARGER INPUTS */
                  <div className="space-y-4">
                    {/* DELIVERY PHONE - MOST IMPORTANT */}
                    <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
                      <Label className="text-sm font-semibold flex items-center gap-2 text-primary">
                        📦 Delivery Phone * (Required)
                      </Label>
                      <Input
                        type="tel"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        placeholder="9876543210"
                        className="text-lg h-14 py-3"
                        autoComplete="tel"
                      />
                      <p className="text-xs text-muted-foreground">Phone for delivery partner</p>
                    </div>

                    {/* FLAT/HOUSE */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Flat/House/Apartment *</Label>
                      <Input
                        value={flatHouse}
                        onChange={(e) => setFlatHouse(e.target.value)}
                        placeholder="Flat no.. House no.. Appatment no.."
                        className="h-12 text-base"
                      />
                    </div>

                    {/* EXTRA LINES - COLLAPSED ON MOBILE */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Street/Area *</Label>
                      <Input
                        value={areaStreet}
                        onChange={(e) => setAreaStreet(e.target.value)}
                        placeholder="Enter Street.....  Enter Area..."
                        className="h-12 text-base"
                      />
                    </div>

                    {/* TOWN/CITY */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Town/City *</Label>
                      <Input
                        value={townCity}
                        onChange={(e) => setTownCity(e.target.value)}
                        placeholder="Enter Town/City..."
                        className="h-12 text-base"
                      />
                    </div>

                    {/* STATE - FULL WIDTH SELECT */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">State *</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="h-12">
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

                    {/* PINCODE - HIGHLIGHTED */}
                    <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
                      <Label className="text-sm font-semibold flex items-center gap-2 text-primary">
                        📮 PIN Code * (Required)
                      </Label>
                      <Input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        placeholder="Enter PinCode...."
                        className="text-lg h-14 py-3 font-mono tracking-wider"
                      />
                    </div>

                    {/* OPTIONAL FIELDS - COLLAPSIBLE */}
                    <details className="space-y-2 p-3 border rounded-lg">
                      <summary className="cursor-pointer font-medium text-sm flex items-center gap-2 pb-2">
                        Additional Details (Optional)
                      </summary>
                      <div className="space-y-3 pt-2">
                        <Input
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                          placeholder="Near XYZ Park (optional)"
                          className="h-11"
                        />
                        <Input
                          value={address3}
                          onChange={(e) => setAddress3(e.target.value)}
                          placeholder="Address3"
                          className="h-11"
                        />
                        <Input
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Landmark..."
                          className="h-11"
                        />
                      </div>
                    </details>

                    {/* ✅ FIXED WIDTH BUTTONS - MOBILE SAFE */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        className="h-14 text-base flex-1"
                        onClick={handleSaveProfile}
                        disabled={savingProfile || pincode.length !== 6 || deliveryPhone.length !== 10}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Address
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="h-14 text-base flex-1 sm:flex-none sm:w-auto"
                        onClick={resetAddressForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* ✅ DISPLAY MODE - FULL RESPONSIVE */
                  <div className="relative group p-6 bg-gradient-to-r from-muted/50 to-muted rounded-2xl min-h-[160px] border-2 border-dashed border-muted hover:border-primary transition-all">
                    {getFormattedAddress() ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm leading-relaxed max-h-20 overflow-y-auto">
                              {getFormattedAddress()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {userData.points || 0} points earned
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-1">No address saved</p>
                        <p className="text-sm text-muted-foreground">Add your delivery address to start ordering</p>
                      </div>
                    )}
                    
                    {/* ✅ MOBILE EDIT BUTTON */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute -top-3 left-4 sm:left-1/2 sm:-translate-x-1/2 bg-card hover:bg-muted shadow-lg group-hover:opacity-100 opacity-90 transition-all px-4 py-1.5 h-auto text-sm"
                      onClick={() => setEditingAddress(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {getFormattedAddress() ? "Edit" : "Add Address"}
                    </Button>
                  </div>
                )}
              </div>

              {/* POINTS DISPLAY */}
              {userData.points && userData.points > 0 && (
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800">{userData.points} Points</p>
                        <p className="text-sm text-emerald-700">Redeem for discounts</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PASSWORD FORM - FULL WIDTH MOBILE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Secure your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Current Password
                  </Label>
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-12 pr-12 text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-9 h-8 w-8 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">New Password</Label>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 pr-12 text-base"
                    minLength={6}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-[13.5rem] h-8 w-8 p-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Confirm Password</Label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pr-12 text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-[18rem] h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {passwordError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
                    {passwordError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    type="submit" 
                    className="h-14 text-base flex-1" 
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="destructive" className="h-14 text-base flex-1 sm:flex-none sm:w-auto" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
