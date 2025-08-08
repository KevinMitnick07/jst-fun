"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import SpeechBubble from "./speech-bubble"
import { useId, useRef } from "react"
import type { CSSProperties } from "react"

export type Actor = {
  id: string
  name: string
  img: string
  line: string
  accent: string // hex
  audio?: string | null // optional: future per-actor audio file
}

export default function ActorCard({
  actor = {
    id: "default",
    name: "Actor",
    img: "/cartoon-face.png",
    line: "ഹലോ!",
    accent: "#F97316",
  },
  active = false,
  onClick = () => {},
  onZoom = () => {},
}: {
  actor?: Actor
  active?: boolean
  onClick?: (actor: Actor) => void
  onZoom?: (actor: Actor, rect: { x: number; y: number; width: number; height: number }) => void
}) {
  const rid = useId()
  const imgWrapRef = useRef<HTMLDivElement>(null)

  const handleImageClick = () => {
    const r = imgWrapRef.current?.getBoundingClientRect()
    if (r) onZoom?.(actor, { x: r.x, y: r.y, width: r.width, height: r.height })
    // Ensure audio plays on image click
    onClick?.(actor)
  }

  const handleNameClick = () => {
    onClick?.(actor)
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl p-3 sm:p-4 select-none",
        "border-[4px] border-black bg-white",
        active ? "ring-4 ring-black" : ""
      )}
      style={{ "--accent": actor.accent } as CSSProperties}
    >
      <div
        className={cn(
          "w-full text-left rounded-xl overflow-hidden",
          "bg-gradient-to-br from-white via-white to-neutral-100",
          "border-[3px] border-black p-3 sm:p-4"
        )}
        aria-pressed={active}
        aria-describedby={`${rid}-name`}
      >
        <div className="relative">
          {/* Image */}
          <div
            ref={imgWrapRef}
            className={cn(
              "relative mx-auto w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-[3px] border-black",
              "bg-white cursor-zoom-in"
            )}
            onClick={handleImageClick}
            role="button"
            aria-label={`Open ${actor.name} image and play audio`}
          >
            <Image
              src={actor.img || "/placeholder.svg"}
              alt={`${actor.name} face`}
              width={160}
              height={160}
              className="eager w-full h-full object-cover"
              priority
            />
          </div>

          {/* Name tag */}
          <button
            id={`${rid}-name`}
            onClick={handleNameClick}
            className={cn(
              "mt-3 sm:mt-4 inline-block px-3 py-1 rounded-full font-extrabold text-sm sm:text-base",
              "border-[3px] border-black bg-yellow-300",
              "shadow-[3px_3px_0_#000]"
            )}
            aria-label={`Play ${actor.name} audio`}
          >
            {actor.name}
          </button>
        </div>
      </div>

      {/* Speech bubble on active */}
      <div className="relative">
        <SpeechBubble
          show={active}
          color={actor.accent}
          text={actor.line}
          className="absolute -left-1 bottom-2 sm:bottom-3 max-w-[90%] sm:max-w-[260px]"
        />
      </div>
    </div>
  )
}
