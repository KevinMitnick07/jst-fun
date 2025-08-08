"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"

type Rect = { x: number; y: number; width: number; height: number }

export default function FullscreenZoom({
  open = false,
  src = "/placeholder.svg",
  alt = "image",
  originRect = null,
  onClose = () => {},
}: {
  open?: boolean
  src?: string
  alt?: string
  originRect?: Rect | null
  onClose?: () => void
}) {
  // Wrapper has NO hooks. It conditionally renders the inner component,
  // preventing hook-order mismatches across renders.
  if (!open || !originRect) return null
  return (
    <FullscreenZoomInner open src={src} alt={alt} originRect={originRect} onClose={onClose} />
  )
}

function FullscreenZoomInner({
  open,
  src,
  alt,
  originRect,
  onClose,
}: {
  open: boolean
  src: string
  alt: string
  originRect: Rect
  onClose: () => void
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [imgAspect, setImgAspect] = useState(1)

  // Prevent body scroll while open
  useEffect(() => {
    const { style } = document.body
    const prev = style.overflow
    style.overflow = "hidden"
    return () => {
      style.overflow = prev
    }
  }, [])

  // Get image aspect ratio
  useEffect(() => {
    const i = new window.Image()
    i.onload = () => {
      const aspect =
        i.naturalWidth > 0 && i.naturalHeight > 0
          ? i.naturalWidth / i.naturalHeight
          : 1
      setImgAspect(aspect)
    }
    i.crossOrigin = "anonymous"
    i.src = src
  }, [src])

  // Animate from originRect to centered
  useEffect(() => {
    const node = boxRef.current
    if (!node) return

    // Start at origin
    Object.assign(node.style, {
      position: "fixed",
      left: `${originRect.x}px`,
      top: `${originRect.y}px`,
      width: `${originRect.width}px`,
      height: `${originRect.height}px`,
      transform: "translate3d(0,0,0)",
      transition: "none",
    } as CSSStyleDeclaration)

    const raf = requestAnimationFrame(() => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxW = Math.min(vw * 0.94, 1100)
      const maxH = Math.min(vh * 0.9, 900)
      const targetW = Math.min(maxW, maxH * imgAspect)
      const targetH = targetW / imgAspect
      const left = (vw - targetW) / 2
      const top = (vh - targetH) / 2

      Object.assign(node.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${targetW}px`,
        height: `${targetH}px`,
        transition:
          "left 280ms cubic-bezier(0.2,0.8,0.2,1), top 280ms cubic-bezier(0.2,0.8,0.2,1), width 280ms cubic-bezier(0.2,0.8,0.2,1), height 280ms cubic-bezier(0.2,0.8,0.2,1)",
      } as CSSStyleDeclaration)
      setMounted(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [originRect, imgAspect])

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center",
        "bg-black/70 transition-opacity duration-200",
        mounted ? "opacity-100" : "opacity-0"
      )}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full border-2 border-white/80 text-white/90 p-1.5 bg-black/30 hover:bg-black/50"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        ref={boxRef}
        className="rounded-xl overflow-hidden border-4 border-black shadow-[10px_10px_0_#000] bg-white"
        aria-label={alt}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  )
}
