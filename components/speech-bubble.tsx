"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export default function SpeechBubble({
  show = false,
  text = "ഹലോ!",
  color = "#F97316",
  className = "",
}: {
  show?: boolean
  text?: string
  color?: string
  className?: string
}) {
  const liveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show && liveRef.current) {
      liveRef.current.textContent = text
    }
  }, [show, text])

  return (
    <>
      <div
        className={cn(
          "origin-bottom-left transition-transform",
          show ? "scale-100" : "scale-0",
          "drop-shadow-[4px_4px_0_#000]"
        )}
        aria-hidden={!show}
      >
        <div
          className={cn(
            "relative rounded-2xl p-3 sm:p-4",
            "border-[3px] border-black bg-white",
            className
          )}
          style={{
            boxShadow: `6px 6px 0 ${color}`,
          }}
        >
          <p className="font-bold text-sm sm:text-base text-black">{text}</p>
          {/* Tail */}
          <div
            className="absolute left-3 -bottom-3 w-6 h-6 rotate-45 border-[3px] border-black bg-white"
            style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
          />
        </div>
      </div>

      {/* ARIA live region for screen readers */}
      <div ref={liveRef} className="sr-only" aria-live="polite" />
    </>
  )
}
