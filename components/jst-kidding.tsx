"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ActorCard, { type Actor } from "./actor-card"
import useAudioEngine from "@/hooks/use-audio-engine"
import FullscreenZoom from "./fullscreen-zoom"

type Rect = { x: number; y: number; width: number; height: number }

export default function JstKidding() {
  const audio = useAudioEngine()

  const actors: Actor[] = useMemo(
    () => [
      { id: "mohanlal", name: "Mohanlal", accent: "#F97316", img: "/cartoon-mohanlal-pop-art.png", line: "എന്റെ സ്റ്റൈൽ, മനസിലായോ?" },
      { id: "mammootty", name: "Mammootty", accent: "#E11D48", img: "/cartoon-mammootty-pop-art.png", line: "കിടിലൻ ക്ലാസ്, അല്ലേ?" },
      { id: "parunth-vasu", name: "Parunth Vasu", accent: "#10B981", img: "/cartoon-parunth-vasu.png", line: "പറുന്ത് വാസു എത്തിയല്ലോ!" },
      { id: "jagathy", name: "Jagathy", accent: "#A855F7", img: "/cartoon-jagathy-pop-art.png", line: "കൂട്ടുകാരാ, കിടു പ്ലാൻ!" },
      { id: "sayip", name: "sayip", accent: "#F59E0B", img: "/cartoon-sayip-op.png", line: "അയ്യോ അമ്മേ!" },
      { id: "suraj", name: "Prithvi", accent: "#EF4444", img: "/cartoon-pop-art-suraj.png", line: "ചിരിച്ചു മരിച്ചു പോകാം!" },
      { id: "jayasurya", name: "George Sir", accent: "#14B8A6", img: "/cartoon-pop-art-jayasurya.png", line: "ഡബ്ള്‍ ആക്ഷൻ റെഡി!" },
      { id: "fahadh", name: "Madhav", accent: "#8B5CF6", img: "/cartoon-pop-art-face.png", line: "വൈബ് മനസ്സിലായോ?" },
    ],
    []
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const [pulseKey, setPulseKey] = useState(0)

  // Zoom overlay state
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomSrc, setZoomSrc] = useState<string>("/placeholder.svg")
  const [zoomAlt, setZoomAlt] = useState<string>("image")
  const [zoomOrigin, setZoomOrigin] = useState<Rect | null>(null)

  useEffect(() => {
    if (!activeId) return
    const t = setTimeout(() => setActiveId(null), 3400)
    return () => clearTimeout(t)
  }, [activeId])

  const handleActorClick = useCallback(
    (actor: Actor) => {
      // Fun SFX + dialog via TTS (or later provide actor.audio to play a file)
      audio.pop()
      audio.speak(actor.line)
      setActiveId(actor.id)
      setPulseKey((k) => k + 1)
    },
    [audio]
  )

  const handleZoom = useCallback((actor: Actor, rect: Rect) => {
    setZoomSrc(actor.img)
    setZoomAlt(`${actor.name} image`)
    setZoomOrigin(rect)
    setZoomOpen(true)
  }, [])

  const handleRandom = useCallback(() => {
    if (actors.length === 0) return
    audio.boing()
    let choice = actors[Math.floor(Math.random() * actors.length)]
    if (choice.id === activeId && actors.length > 1) {
      const others = actors.filter((a) => a.id !== activeId)
      choice = others[Math.floor(Math.random() * actors.length)]
    }
    handleActorClick(choice)
  }, [actors, activeId, audio, handleActorClick])

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <div className="relative z-10">
        <header className="px-6 sm:px-10 pt-8 pb-4">
          <div className="mx-auto max-w-6xl">
            <h1
              className={cn(
                "text-4xl sm:text-6xl font-extrabold tracking-tight",
                "text-transparent bg-clip-text",
                "bg-gradient-to-r from-fuchsia-500 via-amber-500 to-emerald-500",
                "drop-shadow-[4px_4px_0_#000]"
              )}
              aria-label="jst kidding"
            >
              {"jst kidding"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-700">
              {"Tap a face to hear a funny line. Click the image to zoom!"}
            </p>
          </div>
        </header>

        <section className="px-4 sm:px-10 pb-28">
          <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {actors.map((a) => (
              <ActorCard
                key={a.id + "-" + pulseKey}
                actor={a}
                active={activeId === a.id}
                onClick={handleActorClick}
                onZoom={handleZoom}
              />
            ))}
          </div>
        </section>

        <div className="fixed right-4 bottom-4 sm:right-8 sm:bottom-8 z-20">
          <Button
            size="lg"
            onClick={handleRandom}
            className={cn(
              "rounded-full px-5 h-12 text-base font-bold",
              "bg-pink-500 hover:bg-pink-600 text-white",
              "border-4 border-black shadow-[6px_6px_0_#FDE047]"
            )}
            aria-label="Random Actor"
            title="Random Actor"
          >
            {"😆 Random Actor!"}
          </Button>
        </div>

        <footer className="px-6 sm:px-10 pb-6 opacity-80">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs text-neutral-600">
              {"All lines are playful placeholders inspired by Malayalam movie vibes. For best experience, allow audio."}
            </p>
          </div>
        </footer>
      </div>

      <FullscreenZoom
        open={zoomOpen}
        src={zoomSrc}
        alt={zoomAlt}
        originRect={zoomOrigin}
        onClose={() => setZoomOpen(false)}
      />
    </main>
  )
}
