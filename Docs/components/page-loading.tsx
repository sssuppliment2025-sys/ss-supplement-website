"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const startLoading = useCallback(() => {
    setLoading(true)
    setProgress(0)
  }, [])

  const stopLoading = useCallback(() => {
    setProgress(100)
    setTimeout(() => {
      setLoading(false)
      setProgress(0)
    }, 200)
  }, [])

  useEffect(() => {
    // Progress animation
    let interval: NodeJS.Timeout

    if (loading && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 10 + 5
          return Math.min(prev + increment, 90)
        })
      }, 200)
    }

    return () => clearInterval(interval)
  }, [loading, progress])

  useEffect(() => {
    // When route changes, stop loading
    stopLoading()
  }, [pathname, searchParams, stopLoading])

  useEffect(() => {
    // Intercept link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")

      if (
        anchor &&
        anchor.href &&
        !anchor.target &&
        !anchor.download &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.href.includes("#") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const url = new URL(anchor.href)
        if (url.pathname !== pathname) {
          startLoading()
        }
      }
    }

    // Intercept form submissions
    const handleSubmit = () => {
      startLoading()
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("submit", handleSubmit)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("submit", handleSubmit)
    }
  }, [pathname, startLoading])

  if (!loading) return null

  return (
    <>
      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-9999 h-1 bg-primary/20">
        <div
          className="h-full bg-primary transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Overlay with spinner */}
      <div className="fixed inset-0 z-9998 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="page-loader">
            <div className="page-loader-spinner"></div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    </>
  )
}
