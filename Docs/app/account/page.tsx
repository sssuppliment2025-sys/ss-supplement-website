'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, Mail, Phone, User, Lock, Eye, EyeOff, CheckCircle, 
  Loader2, Shield, MapPin, Save, Edit3, Home
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

// ✅ API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

const INDIAN_STATES = [
  "ANDAMAN & NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR",
  "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "DELHI", "GOA",
  "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU & KASHMIR", "JHARKHAND", "KARNATAKA",
  "KERALA", "LADAKH", "LAKSHADWEEP", "MADHYA PRadesh", "MAHARASHTRA", "MANIPUR",
  "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN",
  "SIKKIM", "TAMIL NADU", "TELANGANA", "TRIPURA", "UTTAR PRadesh", "UTTARAKHAND", "WEST BENGAL"
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

  // ✅ Address editing states - LOADED FROM API + DELIVERY PHONE
  const [editingAddress, setEditingAddress] = useState(false)
  const [deliveryPhone, setDeliveryPhone] = useState("")      // ✅ NEW: Delivery Phone
  const [flatHouse, setFlatHouse] = useState("")
  const [areaStreet, setAreaStreet] = useState("")
  const [townCity, setTownCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [landmark, setLandmark] = useState("")
  const [address2, setAddress2] = useState("")               // ✅ NEW: Address Line 2
  const [address3, setAddress3] = useState("")               // ✅ NEW: Address Line 3

  // ✅ FIXED: Load profile + populate ALL address fields
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
        
        // ✅ POPULATE ALL ADDRESS FIELDS FROM API (BACKWARDS COMPATIBLE)
        if (data.address_fields) {
          setDeliveryPhone(data.address_fields.delivery_phone || data.phone || "")
          setFlatHouse(data.address_fields.flat_house || "")
          setAreaStreet(data.address_fields.area_street || "")
          setTownCity(data.address_fields.town_city || "")
          setState(data.address_fields.state || "")
          setPincode(data.address_fields.pincode || "")
          setLandmark(data.address_fields.landmark || "")
          setAddress2(data.address_fields.address2 || "")
          setAddress3(data.address_fields.address3 || "")
        } else if (data.address) {
          // Fallback for old data format
          const parts = data.address.split(", ")
          parts.forEach(part => {
            if (part.match(/\d{6}/)) setPincode(part.match(/\d{6}/)?.[0] || "")
            if (part.match(/\d{10}/)) setDeliveryPhone(part.match(/\d{10}/)?.[0] || "")
            if (INDIAN_STATES.includes(part.trim())) setState(part.trim())
          })
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

  // Format complete address for display
  const getFormattedAddress = () => {
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
  }

  // ✅ SAVE ALL ADDRESS FIELDS + DELIVERY PHONE TO BACKEND
  const handleSaveProfile = async () => {
    if (!pincode || pincode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit PIN code",
        variant: "destructive",
      })
      return
    }

    if (!deliveryPhone || deliveryPhone.length !== 10) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit delivery phone number",
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
            delivery_phone: deliveryPhone.trim(),  // ✅ NEW
            flat_house: flatHouse.trim(),
            address2: address2.trim(),            // ✅ NEW
            address3: address3.trim(),            // ✅ NEW
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

  // Reset form to loaded values
  const resetAddressForm = () => {
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
  }

  // Password change (unchanged)
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
          description: "Password changed successfully! Please login with new password.",
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load profile</p>
          <Button onClick={() => router.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and account settings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile & Address Form - ORIGINAL DESIGN */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your complete delivery address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* READ-ONLY Name */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{userData.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Name cannot be changed</p>
                </div>
              </div>

              {/* Complete Address Form - ORIGINAL LAYOUT + NEW FIELDS */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2 mb-4 block">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </Label>
                
                {editingAddress ? (
                  <div className="space-y-4">
                    {/* ✅ NEW: Delivery Phone */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium flex items-center gap-2">
                        📦 Delivery Phone Number <span className="text-muted-foreground text-xs">(For delivery partner)</span>
                      </Label>
                      <Input
                        type="tel"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        placeholder="9876543210"
                      />
                    </div>

                    {/* Flat, House no., Building, Company, Apartment */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Flat, House no., Building, Company, Apartment</Label>
                      <Input
                        value={flatHouse}
                        onChange={(e) => setFlatHouse(e.target.value)}
                        placeholder="Flat 101, Sunshine Apartments"
                      />
                    </div>

                    {/* ✅ NEW: Address Line 2 */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Address Line 2 (Optional)</Label>
                      <Input
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Near XYZ Park"
                      />
                    </div>

                    {/* ✅ NEW: Address Line 3 */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Address Line 3 (Optional)</Label>
                      <Input
                        value={address3}
                        onChange={(e) => setAddress3(e.target.value)}
                        placeholder="Behind ABC Mall"
                      />
                    </div>

                    {/* Area, Street, Sector, Village */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Area, Street, Sector, Village</Label>
                      <Input
                        value={areaStreet}
                        onChange={(e) => setAreaStreet(e.target.value)}
                        placeholder="Arjuni, Sector 5"
                      />
                    </div>

                    {/* Town/City */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Town/City</Label>
                      <Input
                        value={townCity}
                        onChange={(e) => setTownCity(e.target.value)}
                        placeholder="Kharagpur"
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">State</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((stateName) => (
                            <SelectItem key={stateName} value={stateName}>
                              {stateName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pincode */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Pincode *</Label>
                      <Input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        placeholder="721126"
                      />
                    </div>

                    {/* Landmark (Optional) */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Landmark (Optional)</Label>
                      <Input
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Nandigram"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={savingProfile || pincode.length !== 6 || deliveryPhone.length !== 10}
                        className="flex-1"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Address
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetAddressForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="p-4 bg-muted/50 rounded-lg min-h-[140px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted">
                      {getFormattedAddress() ? (
                        <div className="text-left max-w-full">
                          <p className="font-mono text-sm whitespace-pre-wrap">{getFormattedAddress()}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Home className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <span className="text-sm">No address saved</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-3 left-3 text-xs h-auto px-3 py-1 bg-background hover:bg-muted group-hover:opacity-100 opacity-0 transition-all"
                      onClick={() => setEditingAddress(true)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      {getFormattedAddress() ? "Edit Address" : "Add Address"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Read-only Email & Phone - ORIGINAL DESIGN */}
              <div className="grid grid-cols-1 gap-4 pt-6 border-t">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                    {userData.email || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                    {userData.phone || "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Form - UNCHANGED */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Enter your current password and new password to update
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>  
                </div>

                {passwordError && (
                  <p className="text-sm text-destructive p-3 bg-destructive/10 rounded-md border border-destructive/30">
                    {passwordError}
                  </p>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={logout}>
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
