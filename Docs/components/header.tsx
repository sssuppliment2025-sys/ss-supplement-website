"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, ChevronDown, Phone, MessageCircle, Gift, Coins, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchResults } from "@/components/search-results"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useAuth } from "@/context/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const categories = [
  "Whey Protein",
  "Creatine",
  "Mass Gainer",
  "Multivitamin",
  "Pre Workout",
  "Weight Loss",
  "Recovery",
  "Intra Workout",
  "Peanut Butter & Oats",
  "Ayurvedic Products",
  "Protein Bars & Snacks",
  "Accessories",
  "Minerals & Health",
  "Beauty",
  "Fish Oil",
  
]

const stores = ["Haldia", "Kolkata", "Raipur"]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [referralCoins, setReferralCoins] = useState(0)
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const apiBase = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    let active = true

    const loadCoins = async () => {
      if (!apiBase || !isAuthenticated) {
        if (active) setReferralCoins(0)
        return
      }

      const token = localStorage.getItem("access")
      if (!token) {
        if (active) setReferralCoins(0)
        return
      }

      try {
        const res = await fetch(`${apiBase}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch profile")

        const data = await res.json()
        if (active) {
          setReferralCoins(typeof data.points === "number" ? data.points : 0)
        }
      } catch {
        if (active) setReferralCoins(0)
      }
    }

    loadCoins()

    return () => {
      active = false
    }
  }, [apiBase, isAuthenticated])

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              +91 95478 99170
            </span>
            <span className="hidden md:block">Free Shipping on orders above ₹999</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/referral" className="flex items-center gap-1.5 hover:underline">
              <Gift className="h-3 w-3" />
              Refer & Earn
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary-foreground/15 px-2 py-0.5 text-xs sm:text-sm font-bold leading-none tabular-nums">
                <Coins className="h-3 w-3" />
                {referralCoins.toLocaleString()}
              </span>
            </Link>
            <span className="hidden sm:block">100% Authentic Products</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ss-supplements-logo.jpeg"
              alt="SS Supplement logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-cover"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground">SS Supplement</h1>
              <p className="text-xs text-muted-foreground">Your Fitness Partner</p>
            </div>
          </Link>

          <div className="flex-1 max-w-xl hidden md:block">
            <SearchResults />
          </div>

          {/* Right actions - tighter gap on mobile between icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-label="Open search"
              onClick={() => {
                setMobileSearchOpen((prev) => !prev)
                setMobileMenuOpen(false)
              }}
            >
              <i className="bi bi-search text-primary text-base" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user?.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/referral">Refer & Earn</Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}

            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {getWishlistCount()}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setMobileSearchOpen(false)
              }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile search from navbar */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-3">
            <SearchResults onClose={() => setMobileSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-t border-border hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-primary">
                    ALL PRODUCTS
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border w-56">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat} asChild>
                      <Link href={`/category/${encodeURIComponent(cat)}`}>{cat}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/offers">
                <Button variant="ghost" size="sm" className="text-primary font-semibold">
                  OFFERS
                </Button>
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-primary">
                    STORES
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  {stores.map((store) => (
                    <DropdownMenuItem key={store}>{store}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/our-story">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  OUR STORY
                </Button>
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-primary">
                    AUTHENTICITY
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  <DropdownMenuItem>Verify Product</DropdownMenuItem>
                  <DropdownMenuItem>Our Certifications</DropdownMenuItem>
                  <DropdownMenuItem>Lab Reports</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/chat-support">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary gap-1">
                  <MessageCircle className="h-4 w-4" />
                  CHAT SUPPORT
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/business-enquiry">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  BUSINESS ENQUIRY
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <SearchResults onClose={() => setMobileMenuOpen(false)} />
            </div>

            <ul className="space-y-2">
              <li>
                <Link href="/offers" className="block py-2 text-primary font-semibold">
                  OFFERS
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="block py-2 text-foreground flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-4 w-4" />
                  WISHLIST
                  {getWishlistCount() > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {getWishlistCount()}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/referral" className="block py-2 text-foreground flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  REFER & EARN
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary tabular-nums">
                    <Coins className="h-3 w-3" />
                    {referralCoins.toLocaleString()}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="block py-2 text-foreground">
                  OUR STORY
                </Link>
              </li>
              <li>
                <Link href="/chat-support" className="block py-2 text-foreground">
                  CHAT SUPPORT
                </Link>
              </li>
              <li>
                <Link href="/business-enquiry" className="block py-2 text-foreground">
                  BUSINESS ENQUIRY
                </Link>
              </li>
              <li className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/category/${encodeURIComponent(cat)}`}
                      className="text-sm py-1 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
