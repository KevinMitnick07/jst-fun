"use client"

import { useEffect, useRef } from "react"

export default function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null)

  const ensureCtx = () => {
    if (typeof window === "undefined") return null
    if (!ctxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
      ctxRef.current = new Ctx()
    }
    return ctxRef.current
  }

  // iOS resume on first touch
  useEffect(() => {
    const resume = () => {
      const ctx = ensureCtx()
      if (ctx && ctx.state === "suspended") ctx.resume()
    }
    document.addEventListener("touchstart", resume, { passive: true })
    document.addEventListener("click", resume)
    return () => {
      document.removeEventListener("touchstart", resume)
      document.removeEventListener("click", resume)
    }
  }, [])

  const pop = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "square"
    o.frequency.setValueAtTime(1200, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.15)
  }

  const boing = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "sine"
    o.frequency.setValueAtTime(600, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.38)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.48)
  }

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = "ml-IN"
        u.rate = 1
        u.pitch = 1
        u.volume = 1
        window.speechSynthesis.speak(u)
        return
      } catch {
        // fall through to beep sequence
      }
    }
    // Fallback beep sequence if TTS not available
    const ctx = ensureCtx()
    if (!ctx) return
    const seq = [600, 550, 580, 540]
    seq.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "triangle"
      o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08)
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.08)
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + i * 0.08 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.1)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + i * 0.08)
      o.stop(ctx.currentTime + i * 0.08 + 0.12)
    })
  }

  return { ensureCtx, pop, boing, speak }
}
