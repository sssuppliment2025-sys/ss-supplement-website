"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RefreshCw,
  ZoomIn,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RelatedProducts } from "@/components/related-products"
import { ImageMagnifier } from "@/components/image-magnifier"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProducts } from "@/context/product-context"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { getProductById, products, getProductVariants, findProductByVariant } = useProducts()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const product = getProductById(params.id as string)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState("")
  const [selectedWeight, setSelectedWeight] = useState("") // ✅ User's selection
  const [quantity, setQuantity] = useState(1)
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  // ✅ FIXED: Initialize with CURRENT product weight
  useEffect(() => {
    if (product) {
      // Flavors
      if (Array.isArray(product.flavors) && product.flavors.length > 0) {
        const firstFlavor = product.flavors[0]
        setSelectedFlavor(typeof firstFlavor === "string" ? firstFlavor : firstFlavor.name)
      } else if (typeof product.flavors === "string") {
        setSelectedFlavor(product.flavors)
      }
      
      // ✅ FIXED: Use product.weight (not weights[0])
      setSelectedWeight(product.weight || "")
    }
  }, [product])

  useEffect(() => {
    setSelectedImage(0)
  }, [product?.id])

  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setSelectedImage(carouselApi.selectedScrollSnap())
    }

    onSelect()
    carouselApi.on("select", onSelect)
    carouselApi.on("reInit", onSelect)

    return () => {
      carouselApi.off("select", onSelect)
      carouselApi.off("reInit", onSelect)
    }
  }, [carouselApi])

  useEffect(() => {
    if (!carouselApi) return
    if (carouselApi.selectedScrollSnap() !== selectedImage) {
      carouselApi.scrollTo(selectedImage)
    }
  }, [carouselApi, selectedImage])

  // Get all variants of this product
  const productVariants = product ? getProductVariants(product.name, product.brand) : []
  
  // Get unique flavors and weights from all variants
  const availableFlavors = [...new Set(productVariants.map((v) => v.flavor).filter(Boolean))]
  const availableWeights = [...new Set(productVariants.map((v) => v.weight).filter(Boolean))]

  // ✅ FIXED: Flavor change - Update state FIRST
  const handleFlavorChange = (flavor: string) => {
    if (!product) return
    setSelectedFlavor(flavor) // ✅ Update immediately
    
    // Find matching product
    const currentWeight = selectedWeight || product.weight || ""
    const matchingProduct = findProductByVariant(product.name, product.brand, flavor, currentWeight)
    
    if (matchingProduct && matchingProduct.id !== product.id) {
      router.push(`/product/${matchingProduct.id}`)
    }
  }

  // ✅ FIXED: Weight change - Update state FIRST
  const handleWeightChange = (weight: string) => {
    setSelectedWeight(weight) // ✅ CRITICAL: Update IMMEDIATELY
    
    if (!product) return
    
    // Find matching product
    const currentFlavor = selectedFlavor || (product.flavors?.[0]?.name || "")
    const matchingProduct = findProductByVariant(product.name, product.brand, currentFlavor, weight)
    
    if (matchingProduct && matchingProduct.id !== product.id) {
      router.push(`/product/${matchingProduct.id}`)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <Button onClick={() => router.push("/")}>Go to Homepage</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ✅ FIXED: Price considers BOTH flavor AND weight
  const getCurrentPrice = () => {
    let price = product.price // base fallback
    
    // 1. Flavor price
    if (Array.isArray(product.flavors)) {
      const flavor = product.flavors.find((f) => (typeof f === "string" ? f : f.name) === selectedFlavor)
      if (flavor && typeof flavor !== "string") {
        price = flavor.price
      }
    }
    
    return price
  }

  const currentPrice = getCurrentPrice()

  // Get all product images
  const baseImages = [product.image, product.image1, product.image2, product.image3].filter(
    (img): img is string => Boolean(img),
  )
  const dataImages = product.images?.filter((img): img is string => Boolean(img)) ?? []
  const productImages = [...new Set(dataImages.length > 0 ? dataImages : baseImages)]
  const galleryImages = productImages.length > 0 ? productImages : ["/placeholder.svg"]

  // ✅ FIXED: Uses selectedWeight (user's choice)
  const handleAddToCart = () => {
    addToCart(product, selectedFlavor, selectedWeight, quantity)
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedFlavor}, ${selectedWeight}) added!`,
    })
  }

  const handleBuyNow = () => {
    addToCart(product, selectedFlavor, selectedWeight, quantity)
    router.push("/cart")
  }

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `/product/${product.id}`
    const shareData = {
      title: `${product.name} | ${product.brand}`,
      text: `Check out this product: ${product.name}`,
      url: shareUrl,
    }

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(shareData)
        return
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard.",
        })
        return
      }

      toast({
        title: "Share unavailable",
        description: "Your browser does not support sharing on this device.",
      })
    } catch {
      toast({
        title: "Share canceled",
        description: "Sharing was canceled or failed.",
      })
    }
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8)
  const otherCategoryProducts = products
    .filter((p) => p.category !== product.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
  const bestSellingProducts = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <ChevronRight className="h-4 w-4" />
          <a href={`/category/${product.category}`} className="hover:text-primary">
            {product.category}
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="md:hidden">
              <div className="relative rounded-xl overflow-hidden border border-border bg-card">
                <Carousel setApi={setCarouselApi} opts={{ loop: galleryImages.length > 1 }}>
                  <CarouselContent className="ml-0">
                    {galleryImages.map((img, index) => (
                      <CarouselItem key={`${img}-${index}`} className="pl-0">
                        <div className="relative aspect-square">
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-contain p-6"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                {product.discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm px-2.5 py-1">
                    {product.discount}% OFF
                  </Badge>
                )}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/75 px-2 py-1 rounded-full">
                    {galleryImages.map((_, index) => (
                      <button
                        key={`dot-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          selectedImage === index ? "bg-primary w-4" : "bg-muted-foreground/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              className="relative aspect-square bg-card rounded-xl overflow-hidden border border-border cursor-zoom-in hidden md:block"
              onMouseEnter={() => setShowMagnifier(true)}
              onMouseLeave={() => setShowMagnifier(false)}
            >
              {showMagnifier ? (
                <ImageMagnifier
                  src={galleryImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  magnifierSize={180}
                  zoomLevel={2.5}
                  className="w-full h-full p-8"
                />
              ) : (
                <Image
                  src={galleryImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
              )}
              {product.discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-lg px-3 py-1">
                  {product.discount}% OFF
                </Badge>
              )}
              <div className="absolute bottom-4 right-4 bg-background/80 text-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                <ZoomIn className="h-3 w-3" />
                Hover to zoom
              </div>
            </div>
            <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-success/20 text-success px-2 py-1 rounded">
                  <span className="font-semibold">{product.rating}</span>
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-muted-foreground text-sm">{(product.reviews / 1000).toFixed(1)}k Reviews</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">₹{currentPrice}</span>
              <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
              <Badge variant="secondary" className="bg-success/20 text-success">
                {product.discount}% off
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>

            {/* ✅ FIXED: Flavor Selection - Uses selectedFlavor state */}
            {availableFlavors.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Choose Flavor 
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({availableFlavors.length} options)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableFlavors.map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => handleFlavorChange(flavor)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedFlavor === flavor
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ FIXED: Weight Selection - Uses selectedWeight state */}
            {availableWeights.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Choose Weight
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({availableWeights.length} options)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableWeights.map((weight) => {
                    const isSelected = selectedWeight === weight // ✅ Uses state!
                    const variantWithWeight = productVariants.find((v) => v.weight === weight)
                    const priceDiff = variantWithWeight ? variantWithWeight.price - currentPrice : 0
                    
                    return (
                      <button
                        key={weight}
                        onClick={() => handleWeightChange(weight)}
                        className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <span>{weight}</span>
                        {isSelected && <span className="ml-1 text-xs bg-primary/20 text-primary px-1 py-0.5 rounded">✓</span>}
                        {priceDiff !== 0 && !isSelected && (
                          <span className={`ml-1 text-xs ${priceDiff > 0 ? "text-orange-500" : "text-green-500"}`}>
                            {priceDiff > 0 ? `+₹${priceDiff}` : `-₹${Math.abs(priceDiff)}`}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" variant="outline" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            {/* Share & Wishlist */}
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">100% Authentic</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="bg-secondary">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="benefits">Key Benefits</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Info</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="benefits" className="mt-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <ul className="space-y-3">
                {product.keyBenefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="nutrition" className="mt-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-muted-foreground">{product.nutritionalInfo}</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            title="Similar Products"
            subtitle={`More from ${product.category}`}
          />
        )}
        {otherCategoryProducts.length > 0 && (
          <RelatedProducts
            products={otherCategoryProducts}
            title="You May Also Like"
            subtitle="Products from other categories"
          />
        )}
        {bestSellingProducts.length > 0 && (
          <RelatedProducts
            products={bestSellingProducts}
            title="Best Sellers"
            subtitle="Top rated products by customers"
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
