"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import confetti from "canvas-confetti"
import { sendInvite } from "@/app/actions/send-invite"

type Stage = "ask" | "form" | "done"

const NO_PHRASES = [
  "Ой, всё, не убежишь! 😼",
  "Ну пожа-а-алуйста 🥺",
  "Кнопка стесняется 💨",
  "А если с пивком? 🍺",
  "Мяу, ну согласись 🐾",
]

export function InvitationCard() {
  const [stage, setStage] = useState<Stage>("ask")
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [title, setTitle] = useState("Пойдём выпьем и посидим вместе? 🥺")
  const [subtitle, setSubtitle] = useState("Обещаю уютный вечер, вкусное пиво и много котиков 🍻")
  const [noMoved, setNoMoved] = useState(false)
  const [noPos, setNoPos] = useState<{ top: number; left: number } | null>(null)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const noBtnRef = useRef<HTMLButtonElement>(null)

  const dodge = useCallback(() => {
    const btn = noBtnRef.current
    const w = btn?.offsetWidth ?? 120
    const h = btn?.offsetHeight ?? 50
    
    // Set a safe zone of 48px from the screen boundaries
    const padding = 48
    const minX = padding
    const minY = padding
    const maxX = Math.max(minX, window.innerWidth - w - padding)
    const maxY = Math.max(minY, window.innerHeight - h - padding)
    
    setNoPos({
      left: minX + Math.random() * (maxX - minX),
      top: minY + Math.random() * (maxY - minY),
    })
    setNoMoved(true)
    setPhraseIndex((p) => (p + 1) % NO_PHRASES.length)
    setSubtitle(NO_PHRASES[phraseIndex])
  }, [phraseIndex])

  const celebrate = useCallback(() => {
    const colors = ["#ffafcc", "#ffc8dd", "#ff85a1", "#f7aef8", "#fda4af"]
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors })
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors })
      confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors })
    }, 250)
  }, [])

  const onYes = useCallback(() => {
    celebrate()
    setTitle("Ураа! Я так и знал 🥰")
    setSubtitle("Осталось выбрать детали нашего вечера ✨")
    setStage("form")
  }, [celebrate])

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setErrorMsg(null)
      setSending(true)
      const formData = new FormData(e.currentTarget)
      const result = await sendInvite(formData)
      setSending(false)
      if (result.ok) {
        celebrate()
        setTitle("Приглашение отправлено! 💌")
        setSubtitle("Я уже получил твоё сообщение. До скорой встречи! 🍻🐾")
        setStage("done")
      } else {
        setErrorMsg(result.error ?? "Что-то пошло не так, попробуй ещё раз.")
      }
    },
    [celebrate],
  )

  return (
    <div className="animate-[soft-pop_0.6s_ease-out] w-full max-w-md rounded-[2rem] border border-border bg-card/90 p-8 text-center shadow-2xl backdrop-blur-md">
      <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-accent/40 shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cats/cat-beer-2.png"
          alt="Милый котик с бокалом пива"
          className="h-24 w-24 rounded-full object-cover"
          style={{ animation: "gentle-bob 3.5s ease-in-out infinite" }}
        />
      </div>

      <h1 className="text-pretty font-display text-2xl font-bold leading-relaxed text-foreground">{title}</h1>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{subtitle}</p>

      {stage === "ask" && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onYes}
            className="rounded-full bg-secondary px-8 py-3 font-display text-lg font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
          >
            Да! 💖
          </button>
          {!noMoved && (
            <button
              ref={noBtnRef}
              type="button"
              onMouseEnter={dodge}
              onClick={dodge}
              className="rounded-full bg-primary px-8 py-3 font-display text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              Нет
            </button>
          )}
        </div>
      )}

      {noMoved && mounted && stage === "ask" && createPortal(
        <button
          ref={noBtnRef}
          type="button"
          onMouseEnter={dodge}
          onClick={dodge}
          className="rounded-full bg-primary px-8 py-3 font-display text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
          style={
            noPos
              ? { position: "fixed", top: noPos.top, left: noPos.left, zIndex: 100 }
              : undefined
          }
        >
          Нет
        </button>,
        document.body
      )}

      {stage === "form" && (
        <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="mb-1 block font-display text-sm font-bold text-foreground">
              Когда тебе удобно? 🗓️
            </label>
            <input
              type="datetime-local"
              name="when"
              required
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block font-display text-sm font-bold text-foreground">
              Что будем пить и есть? 🍕🍺
            </label>
            <textarea
              name="wishes"
              rows={3}
              placeholder="Хочу пиццу, сидр и уютную болтовню..."
              className="w-full resize-none rounded-2xl border-2 border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
          </div>
          {errorMsg && (
            <p className="rounded-2xl bg-primary/15 px-4 py-2 text-center text-sm font-medium text-primary">
              {errorMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-accent px-8 py-3 font-display text-lg font-bold text-accent-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sending ? "Отправляю..." : "Отправить! 💌"}
          </button>
        </form>
      )}

      {stage === "done" && (
        <div className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cats/cat-beer-1.png"
            alt="Довольный котик с пивом"
            className="mx-auto h-28 w-28 object-contain drop-shadow-sm"
            style={{ animation: "gentle-bob 3.5s ease-in-out infinite" }}
          />
        </div>
      )}
    </div>
  )
}
