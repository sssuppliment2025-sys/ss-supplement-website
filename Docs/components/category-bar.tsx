"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  { name: "Whey Protein", image: "/image/Whey_protien/MB_performance/mb_kesar_1kg.png" },
  { name: "Creatine", image: "/image/Creatine/Wellcore/Wellcore_kiwi_122gm.jpg" },
  { name: "Mass Gainer", image: "/image/Mass_Gainner/MuscleTech/Muscletech_mass_vanilla_3kg.jpg" },
  { name: "Multivitamin", image: "/multivitamin-tablets-bottle.jpg" },
  { name: "Pre Workout", image: "/pre-workout-supplement-jar.jpg" },
  { name: "Weight Loss", image: "/gym-energy-booster.jpg" },
  { name: "Recovery", image: "/image/Recovery/gnc_l_glutamine_250gm.jpg" },
  { name: "Intra Workout", image: "/image/Intra_Workout/Mb_bcaa_pro_Watermelon_250g.jpg" },
  { name: "Peanut Butter & Oats", image: "/image/Peanut_butter_oats/my_fitness_peanut_butter_smooth_choc_227g.jpg" },
  { name: "Ayurvedic Products", image: "/image/Ayurvedic/kapiva_20g.jpg" },
  { name: "Protein Bars & Snacks", image: "/image/Protien_bar_and_Snacks/MB/Choco_Almond_10g.jpg" },
  { name: "Accessories", image: "/image/Accessories/mb_gymbag.jpg" },
  { name: "Beauty", image: "/health-vitamins.jpg" },
  { name: "Fish Oil", image: "/image/Fishoil/ON/on_fishoil_60N.jpg" },
  { name: "Minerals & Health", image: "/image/Minerals_Health/gnc_calcium_plus_60n.jpg" },
]

export function CategoryBar() {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = node
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }

    updateScrollState()
    node.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      node.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  return (
    <section className="py-4 bg-secondary/30 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="relative">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-secondary/30 to-transparent z-10" />
          )}
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory scroll-px-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${encodeURIComponent(cat.name)}`}
                className={`flex shrink-0 flex-col items-center gap-1.5 min-w-[102px] group snap-start ${
                  pathname === `/category/${encodeURIComponent(cat.name)}`
                    ? "text-foreground"
                    : ""
                }`}
              >
                <div
                  className={`relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-card to-secondary/40 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5 ${
                    pathname === `/category/${encodeURIComponent(cat.name)}`
                      ? "border-2 border-primary/70"
                      : "border border-border/70 group-hover:border-primary/60"
                  }`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span
                  className={`text-[11px] text-center transition-colors whitespace-nowrap leading-tight ${
                    pathname === `/category/${encodeURIComponent(cat.name)}`
                      ? "text-foreground font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
