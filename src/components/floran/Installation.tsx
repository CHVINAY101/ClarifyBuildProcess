"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import QRCode from "qrcode"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Atmosphere from "./Atmosphere"
import { Flower, flowers } from "./Experience"
import { readLiveBlooms } from "./actions"

type LiveBloom = Extract<Awaited<ReturnType<typeof readLiveBlooms>>, { ok: true }>["blooms"][number]

export default function Installation({ live = false }: { live?: boolean }) {
  const [joinURL, setJoinURL] = useState("")
  const [qr, setQR] = useState("")
  const [blooms, setBlooms] = useState<LiveBloom[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState("Establishing transmission")
  const [active, setActive] = useState(0)
  const latest = useRef<string | number | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    let mounted = true
    const url = new URL("/join", window.location.href).href
    setJoinURL(url)
    QRCode.toDataURL(url, { margin: 4, width: 640, errorCorrectionLevel: "M" })
      .then(data => { if (mounted) setQR(data) })
      .catch(() => { if (mounted) setStatus("Use the registration link below") })
    return () => { mounted = false }
  }, [])
  useEffect(() => {
    if (!live) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    async function poll() {
      try {
        const result = await readLiveBlooms()
        if (cancelled) return
        if (result.ok) {
          setBlooms(result.blooms)
          setTotal(result.total)
          setStatus("Transmission active")
          const newest = result.blooms[0]?.id
          if (newest && newest !== latest.current) {
            setActive(0)
            latest.current = newest
          }
        } else setStatus("Connection interrupted · retrying")
      } catch {
        if (!cancelled) setStatus("Connection interrupted · retrying")
      }
      if (!cancelled) timer = setTimeout(poll, 3000)
    }
    void poll()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [live])
  useEffect(() => {
    if (!live || blooms.length < 2) return
    const timer = setInterval(() => setActive(value => (value + 1) % blooms.length), 10000)
    return () => clearInterval(timer)
  }, [live, blooms.length])
  const bloom = blooms[active % Math.max(blooms.length, 1)]
  const flower = bloom ? flowers[bloom.index] : null
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      <Atmosphere phase={live && bloom ? "bloom" : "arrival"} />
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-[6vw] py-8 text-[9px] uppercase tracking-[.2em] text-muted-foreground">
        <Link href="/">Floran / A language grown.</Link>
        <span>{live ? status : "Science in Action / English Department"}</span>
      </header>
      <main className="relative z-10 grid flex-1 items-center gap-10 px-[6vw] py-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <section className="min-w-0">
          {live && bloom && flower ? (
            <AnimatePresence mode="wait">
              <motion.div key={bloom.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 1 }}>
                <p className="text-[9px] uppercase tracking-[.2em] text-muted-foreground">Martian Herbarium / A new arrival</p>
                <div className="grid items-center gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <h1 className="mt-6 break-words text-4xl font-medium tracking-tight sm:text-5xl lg:text-[clamp(1.75rem,3vw,3.5rem)]">{bloom.name}</h1>
                    <p className="mt-4 text-2xl text-accent">{flower.word}.</p>
                    <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">{flower.meaning}</p>
                  </div>
                  <Flower index={bloom.index} collection={bloom.collection} bloom className="floran-specimen-glow h-[40svh] w-full sm:h-[55svh]" />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <p className="mb-10 text-[9px] uppercase tracking-[.25em] text-muted-foreground">{live ? "Martian Herbarium / Awaiting arrival" : "An invitation from Mars"}</p>
              <h1 className="text-[clamp(4rem,14vw,13rem)] font-medium leading-none tracking-[-.075em]">FLORAN</h1>
              <p className="mt-8 text-sm uppercase tracking-[.35em] text-primary">A LANGUAGE GROWN.</p>
              <p className="mt-8 max-w-sm text-sm leading-7 text-muted-foreground">{live ? "The garden is quiet. Scan to bring the first bloom to Mars." : "A name. A memory of Earth. Something that has never bloomed before."}</p>
            </>
          )}
        </section>
        <aside className="mx-auto w-full max-w-xs lg:mr-0">
          <p className="mb-5 text-[9px] uppercase tracking-[.2em] text-muted-foreground">Begin on your phone</p>
          <Link href="/join" aria-label="Open phone registration" className="block aspect-square bg-white p-3">
            {qr ? <Image src={qr} alt="QR code to join the FLORAN installation" width={640} height={640} className="h-full w-full" /> : <span className="flex h-full items-center justify-center text-xs text-background">Preparing your invitation…</span>}
          </Link>
          <p className="mt-5 text-sm text-primary">Scan. Remember. Become.</p>
          <Link href="/join" className="mt-3 block break-all text-[10px] leading-6 text-muted-foreground underline underline-offset-4">{joinURL || "Open registration"}</Link>
          <p className="mt-4 text-[10px] leading-6 text-muted-foreground">Your journey stays yours. Sharing your name and bloom with this screen is optional.</p>
        </aside>
      </main>
      {live && blooms.length > 0 && (
        <div className="relative z-10 flex gap-6 overflow-x-auto border-t border-border px-[6vw] py-5">
          {blooms.map((item, index) => (
            <button key={item.id} onClick={() => setActive(index)} aria-pressed={bloom?.id === item.id} className="flex min-h-11 shrink-0 items-center gap-3 text-left text-xs text-muted-foreground aria-pressed:text-primary">
              <Flower index={item.index} collection={item.collection} className="size-12" />
              <span className="max-w-32 truncate">{item.name}<span className="mt-1 block text-[9px] text-accent">{flowers[item.index].word}</span></span>
            </button>
          ))}
        </div>
      )}
      <footer className="relative z-10 flex justify-between gap-6 px-[6vw] py-6 text-[9px] uppercase tracking-[.15em] text-muted-foreground">
        <span>{live ? `${total.toString().padStart(3, "0")} blooms received` : "Mars / 18.65°N 226.2°E"}</span>
        <Link href={live ? "/display" : "/live"} className="hover:text-primary">{live ? "QR entrance" : "Open live display"} ↗</Link>
      </footer>
    </div>
  )
}
