"use server"

import { Resend } from "resend"

type SendResult = { ok: boolean; error?: string }

export async function sendInvite(formData: FormData): Promise<SendResult> {
  const when = String(formData.get("when") ?? "").trim()
  const wishes = String(formData.get("wishes") ?? "").trim()

  if (!when) {
    return { ok: false, error: "Пожалуйста, выбери дату и время." }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      error: "Почта пока не настроена (нет RESEND_API_KEY).",
    }
  }

  const resend = new Resend(apiKey)

  const prettyWhen = (() => {
    const d = new Date(when)
    if (Number.isNaN(d.getTime())) return when
    return d.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
  })()

  try {
    const { error } = await resend.emails.send({
      from: "Приглашение <onboarding@resend.dev>",
      to: ["crayzylame@gmail.com"],
      subject: "Она согласилась на посиделки! 🍻",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #ffe3ee; border-radius: 20px; color: #7a3b52;">
          <h1 style="font-size: 22px; margin: 0 0 16px;">Ураа, она сказала «Да»! 🥰</h1>
          <p style="margin: 0 0 8px;"><strong>Когда:</strong> ${prettyWhen}</p>
          <p style="margin: 0 0 8px;"><strong>Пожелания:</strong></p>
          <p style="margin: 0; white-space: pre-wrap; background: #fff5f9; padding: 12px 16px; border-radius: 12px;">${
            wishes ? escapeHtml(wishes) : "— (без пожеланий)"
          }</p>
        </div>
      `,
    })

    if (error) {
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Не удалось отправить письмо.",
    }
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
