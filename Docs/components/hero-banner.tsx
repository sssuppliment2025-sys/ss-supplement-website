"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Mega Protein Sale",
    subtitle: "Up to 40% OFF on Whey Proteins",
    cta: "Shop Now",
    link: "/category/Whey Protein",
    image: "poster/1.png?height=500&width=1200",
    gradient: "from-primary/80 to-transparent",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Premium Creatine Collection",
    cta: "Explore",
    link: "/category/Creatine",
    image: "poster/5.png?height=500&width=1200",
    gradient: "from-accent/80 to-transparent",
  },
  {
    id: 3,
    title: "Bulk Up Season",
    subtitle: "Mass Gainers Starting ₹999",
    cta: "Get Started",
    link: "/category/Mass Gainer",
    image: "poster/2.png?height=500&width=1200",
    gradient: "from-primary/80 to-transparent",
  },
  {
    id: 4,
    title: "All Products",
    subtitle: "New Collections Added",
    link: "/category/Peanut Butter & Oats",
    cta: "Explore Now",
    image: "poster/4.png?height=500&width=1200",
    gradient: "from-primary/80 to-transparent",
  },
  {
    id: 5,
    title: "Best Sellers",
    subtitle: "Pre-Workout Collection",
    cta: "Grab It Now",
    link: "/category/Pre Workout",
    image: "poster/3.png?height=500&width=1200",
    gradient: "from-primary/80 to-transparent",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={banner.image || "/placeholder.svg"}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl text-white mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">{banner.subtitle}</p>
                <Link href={banner.link}>
                  <Button
                    size="lg"
                    className="group relative overflow-hidden border border-white/80 bg-gradient-to-r from-amber-100 via-white to-orange-100 text-zinc-900 shadow-[0_6px_18px_rgba(0,0,0,0.28)] font-semibold transition-all duration-500 hover:-translate-y-0.5 hover:from-orange-100 hover:via-amber-100 hover:to-white hover:shadow-[0_12px_26px_rgba(0,0,0,0.34)]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative z-10">{banner.cta}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
