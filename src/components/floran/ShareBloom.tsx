"use client"

import { useRef, useState, useTransition } from "react"
import { shareBloom } from "./actions"

export default function ShareBloom(props: {
  name: string; day: string; month: string; year: string; collection: "mars" | "luminous"
}) {
  const [consent, setConsent] = useState(false)
  const [shared, setShared] = useState(false)
  const [message, setMessage] = useState("")
  const [pending, startTransition] = useTransition()
  const requestKey = useRef("")
  return (
    <div className="mt-4 max-w-lg border-t border-border pt-3 text-xs text-muted-foreground">
      {!shared && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 leading-5">
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="size-4 accent-accent" />
          Share my name and flower on the public live display.
        </label>
      )}
      <p className="text-[10px] leading-5">Optional. Your birth date and Earth memory are never saved to the shared installation. Your name and flower remain public until removed by the installation team.</p>
      <button
        disabled={!consent || pending || shared}
        className="mt-1 min-h-11 border-b border-accent/40 text-primary disabled:cursor-default disabled:opacity-40"
        onClick={() => startTransition(async () => {
          requestKey.current ||= crypto.randomUUID()
          try {
            const result = await shareBloom({ ...props, consent, requestKey: requestKey.current })
            setMessage(result.message)
            setShared(result.ok)
          } catch {
            setMessage("Connection interrupted. Please try again.")
          }
        })}
      >
        {shared ? "Bloom transmitted" : pending ? "Transmitting…" : "Send my bloom to Mars"}
      </button>
      <p role="status" className="leading-5">{message}</p>
    </div>
  )
}
