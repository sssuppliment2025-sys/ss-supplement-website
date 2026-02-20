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
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return

    const activeItem = node.querySelector<HTMLAnchorElement>('a[data-active="true"]')
    if (!activeItem) return

    activeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }, [pathname])

  return (
    <section
      className="relative overflow-hidden border-b border-border/60 bg-[#faf7f7] py-3 md:py-6"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35 blur-[1.2px]"
        style={{ backgroundImage: "url('/category-bg.png')" }}
      />
      <div className="relative z-10 container mx-auto max-w-[1600px] px-3 md:px-4">
        <div className="mb-3 text-center md:mb-5">
          <h2 className="text-xl font-extrabold tracking-tight text-orange-600 sm:text-2xl md:text-4xl">
            Explore Our Categories
          </h2>
        </div>
        <div className="relative">
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-0.5 pl-1 pr-3 scrollbar-hide snap-x snap-mandatory scroll-px-2 md:hidden">
            {categories.map((cat, index) => {
              const isActive = pathname === `/category/${encodeURIComponent(cat.name)}`
              const tilt = index % 2 === 0 ? "-rotate-[8deg]" : "rotate-[7deg]"

              return (
                <Link
                  key={cat.name}
                  href={`/category/${encodeURIComponent(cat.name)}`}
                  aria-label={`Browse ${cat.name}`}
                  data-active={isActive ? "true" : "false"}
                  className={`group flex w-[calc((100%-1rem)/3.5)] min-w-[calc((100%-1rem)/3.5)] shrink-0 snap-start flex-col items-center gap-1.5 text-center transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f7] ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 35}ms` }}
                >
                  <div
                    className={`relative h-[72px] w-[72px] overflow-hidden rounded-full border-[2px] border-orange-400 bg-[linear-gradient(155deg,#f97316,#ea580c_55%,#c2410c)] shadow-[0_8px_14px_-12px_rgba(234,88,12,0.6)] transition-all duration-300 ${
                      isActive ? "ring-2 ring-orange-300/50" : "group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_22px_-14px_rgba(234,88,12,0.68)]"
                    }`}
                  >
                    <div className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_20%_16%,#fb923c,#ea580c_65%,#9a3412)]" />
                    <div className="absolute inset-[4px] overflow-hidden rounded-full">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 767px) 72px, 62px"
                        loading="lazy"
                        className={`object-contain p-1 transition-transform duration-300 ${tilt} ${isActive ? "scale-105" : "group-hover:scale-105"}`}
                      />
                    </div>
                  </div>
                  <span
                    className={`max-w-[90px] text-sm font-bold leading-[1.1] tracking-tight ${
                      isActive ? "text-zinc-900" : "text-zinc-700 group-hover:text-zinc-900"
                    }`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cat.name}
                  </span>
                </Link>
              )
            })}
          </div>
          <div className="hidden items-start justify-between gap-1 md:flex">
            {categories.map((cat, index) => {
              const isActive = pathname === `/category/${encodeURIComponent(cat.name)}`
              const tilt = index % 2 === 0 ? "-rotate-[8deg]" : "rotate-[7deg]"

              return (
                <Link
                  key={cat.name}
                  href={`/category/${encodeURIComponent(cat.name)}`}
                  aria-label={`Browse ${cat.name}`}
                  className={`group flex min-w-0 flex-col items-center gap-1.5 text-center transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f7] ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 25}ms` }}
                >
                  <div
                    className={`relative h-[62px] w-[62px] overflow-hidden rounded-full border-[2px] border-orange-400 bg-[linear-gradient(155deg,#f97316,#ea580c_55%,#c2410c)] shadow-[0_8px_14px_-12px_rgba(234,88,12,0.6)] transition-all duration-300 ${
                      isActive ? "ring-2 ring-orange-300/50" : "group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_20px_-14px_rgba(234,88,12,0.68)]"
                    }`}
                  >
                    <div className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_20%_16%,#fb923c,#ea580c_65%,#9a3412)]" />
                    <div className="absolute inset-[4px] overflow-hidden rounded-full">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="62px"
                        loading="lazy"
                        className={`object-contain p-1 transition-transform duration-300 ${tilt} ${isActive ? "scale-105" : "group-hover:scale-105"}`}
                      />
                    </div>
                  </div>
                  <span
                    className={`max-w-[74px] text-[11px] font-bold leading-[1.15] tracking-tight ${
                      isActive ? "text-zinc-900" : "text-zinc-700 group-hover:text-zinc-900"
                    }`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cat.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
