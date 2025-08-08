"use client"

import { useEffect, useMemo, useState } from "react"

type Floaty = {
  id: string
  emoji: string
  left: string
  size: number
  delay: number
  duration: number
  opacity: number
}

export default function BackgroundFun() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const items = useMemo<Floaty[]>(() => {
    const emojis = ["🍌", "🥥", "🌴", "⭐", "💥"]
    const arr: Floaty[] = []
    for (let i = 0; i < 14; i++) {
      arr.push({
        id: `f-${i}`,
        emoji: emojis[i % emojis.length],
        left: `${Math.random() * 100}%`,
        size: 22 + Math.round(Math.random() * 22),
        delay: Math.random() * 4,
        duration: 10 + Math.random() * 10,
        opacity: 0.2 + Math.random() * 0.35,
      })
    }
    return arr
  }, [])

  if (!mounted) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <div
          key={it.id}
          className="absolute will-change-transform"
          style={{
            left: it.left,
            animation: `floatDown ${it.duration}s linear ${it.delay}s infinite`,
            opacity: it.opacity,
            fontSize: `${it.size}px`,
            filter: "saturate(1.2)",
          }}
          aria-hidden="true"
        >
          {it.emoji}
        </div>
      ))}

      <style jsx global>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-10%) translateX(0);
          }
          50% {
            transform: translateY(50vh) translateX(8px);
          }
          100% {
            transform: translateY(110%) translateX(-8px);
          }
        }
      `}</style>
    </div>
  )
}
