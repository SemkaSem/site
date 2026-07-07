"use client"

import { useMemo } from "react"
import { Heart, Sparkle, Star } from "lucide-react"

const CAT_IMAGES = [
  "/cats/cat-beer-1.png",
  "/cats/cat-beer-2.png",
  "/cats/cat-beer-3.png",
  "/cats/cat-pizza.png",
  "/cats/cat-heart.png",
]

type CatSticker = {
  id: number
  src: string
  left: number
  top: number
  size: number
  rotate: number
  bob: number
  bobDelay: number
  opacity: number
}

type Decor = {
  id: number
  kind: "heart" | "star" | "sparkle" | "dot"
  left: number
  top: number
  size: number
  rotate: number
  duration: number
  delay: number
  opacity: number
}

// Deterministic pseudo-random so server/client markup matches.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const round = (n: number) => Number(n.toFixed(2))

export function FloatingCats() {
  // Cats scattered across the whole screen on a loose grid so they never clump.
  const cats = useMemo<CatSticker[]>(() => {
    const cols = 4
    const rows = 4
    const items: CatSticker[] = []
    for (let i = 0; i < cols * rows; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const left = (col + 0.5) * (100 / cols) + (seeded(i, 1) - 0.5) * 16
      const top = (row + 0.5) * (100 / rows) + (seeded(i, 2) - 0.5) * 16
      items.push({
        id: i,
        src: CAT_IMAGES[i % CAT_IMAGES.length],
        left: round(left),
        top: round(top),
        size: round(52 + seeded(i, 3) * 44),
        rotate: round((seeded(i, 4) - 0.5) * 30),
        bob: round(4 + seeded(i, 5) * 4),
        bobDelay: round(seeded(i, 6) * -6),
        opacity: round(0.9 + seeded(i, 7) * 0.1),
      })
    }
    return items
  }, [])

  // Hearts, stars, sparkles and confetti dots spread evenly everywhere.
  const decor = useMemo<Decor[]>(() => {
    const kinds: Decor["kind"][] = ["heart", "star", "sparkle", "dot"]
    return Array.from({ length: 46 }, (_, i) => ({
      id: i,
      kind: kinds[i % kinds.length],
      left: round(seeded(i, 8) * 100),
      top: round(seeded(i, 9) * 100),
      size: round(10 + seeded(i, 10) * 16),
      rotate: round((seeded(i, 11) - 0.5) * 60),
      duration: round(2.5 + seeded(i, 12) * 3.5),
      delay: round(seeded(i, 13) * -6),
      opacity: round(0.35 + seeded(i, 14) * 0.4),
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* twinkling hearts / stars / sparkles / confetti */}
      {decor.map((d) => {
        const style: React.CSSProperties = {
          left: `${d.left}%`,
          top: `${d.top}%`,
          opacity: d.opacity,
          transform: `rotate(${d.rotate}deg)`,
          animation: `twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
        }
        if (d.kind === "dot") {
          return (
            <span
              key={`d-${d.id}`}
              className="absolute rounded-full bg-secondary"
              style={{ ...style, width: `${d.size * 0.5}px`, height: `${d.size * 0.5}px` }}
            />
          )
        }
        const Icon = d.kind === "heart" ? Heart : d.kind === "star" ? Star : Sparkle
        const color =
          d.kind === "heart" ? "text-primary" : d.kind === "star" ? "text-accent" : "text-secondary"
        return (
          <Icon
            key={`d-${d.id}`}
            className={`absolute ${color}`}
            style={{ ...style, width: `${d.size}px`, height: `${d.size}px` }}
            fill="currentColor"
            strokeWidth={1.5}
          />
        )
      })}

      {/* cats with beer, gently bobbing in place */}
      {cats.map((c) => (
        <div
          key={`cat-${c.id}`}
          className="absolute"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            opacity: c.opacity,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              animation: `gentle-bob ${c.bob}s ease-in-out ${c.bobDelay}s infinite`,
              rotate: `${c.rotate}deg`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-contain drop-shadow-sm"
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
