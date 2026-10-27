"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Download,
  MoveUpRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ShareBloom from "./ShareBloom"
const MotionImage = motion.create(Image)
import Atmosphere from "./Atmosphere"
import {
  herbariumKey,
  identityProfile,
  readHerbarium,
  type BloomRecord,
} from "./floran"

export const flowers = [
  {
    month: "January",
    name: "Astra",
    word: "Kindness",
    color: "#a4beca",
    meaning: "Soft edges. Strong roots.",
    story:
      "Like Astra, you can be gentle without being fragile. Kindness takes root in the smallest moments — a word offered, a hand extended, a little warmth left behind.",
  },
  {
    month: "February",
    name: "Veyra",
    word: "Hope",
    color: "#c9867d",
    meaning: "Sparks in silence.",
    story:
      "Like Veyra, you carry a spark through the quiet. Hope is not always a great blaze; sometimes it is the small light that stays when everything else grows dim.",
  },
  {
    month: "March",
    name: "Solan",
    word: "Freedom",
    color: "#9c8bb4",
    meaning: "Stretches towards different skies.",
    story:
      "Like Solan, you reach toward a sky not yet known. Your story belongs to you, and every new direction is a chance to grow into your own possibility.",
  },
  {
    month: "April",
    name: "Nyssa",
    word: "Belonging",
    color: "#afa0bf",
    meaning: "What you carry becomes home.",
    story:
      "Like Nyssa, you carry a little home wherever you go. Belonging is not only a place — it is the people, memories and meaning you gather along the way.",
  },
  {
    month: "May",
    name: "Kairo",
    word: "Resilience",
    color: "#ba7869",
    meaning: "Even in silence, you are heard.",
    story:
      "Like Kairo, your voice matters even in silence. Resilience is the patient art of beginning again, of finding a way to bloom after the world has asked you to bend.",
  },
  {
    month: "June",
    name: "Thal",
    word: "Endurance",
    color: "#7e9eb9",
    meaning: "Some stories refuse to die.",
    story:
      "Like Thal, some part of your story keeps reaching for the light. Endurance is not the absence of difficulty, but the quiet choice to keep growing through it.",
  },
  {
    month: "July",
    name: "Zyra",
    word: "Curiosity",
    color: "#7c7eaf",
    meaning: "The unknown is still a kind of home.",
    story:
      "Like Zyra, you find possibility in the unfamiliar. Curiosity turns a question into a doorway, and reminds you that the unknown can become a kind of home.",
  },
  {
    month: "August",
    name: "Vela",
    word: "Courage",
    color: "#75a69e",
    meaning: "Beauty can be a form of resistance.",
    story:
      "Like Vela, your beauty is an act of becoming. Courage is not always loud; sometimes it is the brave, everyday decision to remain entirely yourself.",
  },
  {
    month: "September",
    name: "Orin",
    word: "Empathy",
    color: "#b89c59",
    meaning: "Not all monsters are born from fear.",
    story:
      "Like Orin, you look beyond what is first seen. Empathy makes room for another story, and finds the humanity waiting beneath fear and difference.",
  },
  {
    month: "October",
    name: "Seris",
    word: "Memory",
    color: "#c08d9b",
    meaning: "Every place leaves a trace.",
    story:
      "Like Seris, you hold the traces of every place you have been. Memory is a living garden — roots in yesterday, leaves unfolding into tomorrow.",
  },
  {
    month: "November",
    name: "Ilith",
    word: "Connection",
    color: "#bb8055",
    meaning: "Different worlds. Same sky.",
    story:
      "Like Ilith, you know that distance need not mean separation. Connection is the thread between different worlds, a reminder that we are all beneath the same sky.",
  },
  {
    month: "December",
    name: "Kael",
    word: "You",
    color: "#92a78d",
    meaning: "You are more than what you lost.",
    story:
      "Like Kael, you are not defined by what is missing. Your story is still unfolding, and there is more to you than any single moment could ever contain.",
  },
]
export const luminousNames = [
  "frost",
  "rift",
  "volt",
  "nebula",
  "cinder",
  "tide",
  "zephyr",
  "umbra",
  "solar",
  "crux",
  "ember",
  "aurora",
]
const ease = [0.22, 1, 0.36, 1] as const
type Stage = "intro" | "arrival" | "name" | "dob" | "memory" | "transition" | "wheel" | "bloom" | "result" | "herbarium"

function SeedPattern({
  petals,
  branches,
  symmetry = "Radial",
  className = "",
}: {
  petals: number
  branches: number
  symmetry?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth=".6"
      aria-hidden="true"
    >
      <circle cx="120" cy="120" r="98" strokeDasharray="1 7" opacity=".4" />
      {Array.from({ length: petals }, (_, index) => (
        <ellipse
          key={index}
          cx="120"
          cy="83"
          rx="20"
          ry="49"
          transform={`rotate(${
            symmetry === "Bilateral"
              ? -90 + (index * 180) / (petals - 1)
              : (index * 360) / petals
          } 120 120)`}
          opacity=".45"
        />
      ))}
      {Array.from({ length: branches }, (_, index) => (
        <path
          key={index}
          d="M120 217 Q90 177 120 120"
          transform={`rotate(${
            symmetry === "Bilateral"
              ? -70 + (index * 140) / (branches - 1)
              : (index * 360) / branches
          } 120 120)`}
          opacity=".3"
        />
      ))}
      <circle cx="120" cy="120" r="6" fill="currentColor" opacity=".4" />
    </svg>
  )
}

export function Flower({
  index,
  className = "",
  bloom = false,
  collection = "mars",
  shared = false,
}: {
  index: number
  className?: string
  bloom?: boolean
  collection?: "mars" | "luminous"
  shared?: boolean
}) {
  const reduced = useReducedMotion()
  const asset =
    collection === "mars"
      ? flowers[index].name.toLowerCase()
      : luminousNames[index]
  return (
    <MotionImage
      width={800}
      height={800}
      unoptimized
      layoutId={shared ? `specimen-${collection}-${index}` : undefined}
      src={`/floran/${collection}/${asset}.webp`}
      alt={`${
        collection === "mars" ? flowers[index].name : luminousNames[index]
      } flower`}
      className={`object-contain ${className}`}
      initial={bloom && !reduced ? { scale: 0.7, opacity: 0.2 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: reduced ? 0.1 : 1.8, ease }}
    />
  )
}

export default function Experience({ joining = false }: { joining?: boolean }) {
  const [collection, setCollection] = useState<"mars" | "luminous">("mars")
  const [stage, setStage] = useState<Stage>(joining ? "name" : "intro")
  const [name, setName] = useState("")
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [selected, setSelected] = useState(1)
  const [error, setError] = useState("")
  const [rotation, setRotation] = useState(0)
  const [memory, setMemory] = useState("")
  const [growth, setGrowth] = useState(0)
  const [records, setRecords] = useState<BloomRecord[]>([])
  const [storageMessage, setStorageMessage] = useState("")
  const [returnStage, setReturnStage] = useState<Stage>("intro")
  const dragging = useRef<number | null>(null)
  const prefersReduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const reduced = mounted && prefersReduced
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setRecords(readHerbarium()) }, [])
  const flower = flowers[selected]
  const profile = identityProfile(name, day, month, year)
  const saved = records.some(
    (record) => record.id === `${profile.id}-${collection}-${selected}`,
  )
  const date = `${day.padStart(2, "0")} · ${month.padStart(2, "0")} · ${year}`
  const duration = reduced ? 0.12 : 1.4
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [stage])
  useEffect(() => {
    if (stage !== "transition" && stage !== "bloom") return
    const timer = setTimeout(
      () => setStage(stage === "transition" ? "wheel" : "result"),
      reduced ? 500 : stage === "transition" ? 6500 : 4000,
    )
    return () => clearTimeout(timer)
  }, [stage, reduced])
  useEffect(() => {
    if (stage !== "transition") return
    setGrowth(reduced ? 4 : 0)
    if (reduced) return
    const timers = [900, 1800, 2800, 3900].map((delay, index) =>
      setTimeout(() => setGrowth(index + 1), delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [stage, reduced])
  function saveBloom() {
    const record: BloomRecord = {
      id: `${profile.id}-${collection}-${selected}`,
      name,
      memory: memory.trim(),
      index: selected,
      collection,
      petals: profile.petals,
      branches: profile.branches,
      rotation: profile.rotation,
      scale: profile.scale,
      symmetry: profile.symmetry,
    }
    const next = [
      record,
      ...records.filter((item) => item.id !== record.id),
    ].slice(0, 24)
    try {
      localStorage.setItem(herbariumKey, JSON.stringify(next))
      setRecords(next)
      setStorageMessage("Your bloom is planted in this browser’s herbarium.")
    } catch {
      setStorageMessage(
        "This browser cannot save your bloom. You can still download it.",
      )
    }
  }
  function removeBloom(id: string) {
    const next = records.filter((record) => record.id !== id)
    try {
      localStorage.setItem(herbariumKey, JSON.stringify(next))
      setRecords(next)
    } catch {
      setStorageMessage("This browser could not update the herbarium.")
    }
  }
  function submitDate(event: React.FormEvent) {
    event.preventDefault()
    const entered = new Date(Number(year), Number(month) - 1, Number(day))
    if (
      entered.getFullYear() !== Number(year) ||
      entered.getMonth() !== Number(month) - 1 ||
      entered.getDate() !== Number(day) ||
      entered > new Date() ||
      Number(year) < 1900
    ) {
      setError("Please enter a valid birth date, from 1900 to today.")
      return
    }
    setError("")
    setSelected(profile.index)
    setStage("memory")
  }
  function keepWord() {
    const content = `FLORAN · THE MARTIAN HERBARIUM\nScience in Action · English Department\n\nFor ${name}\n${date}\n\n${flower.word.toUpperCase()}\n${flower.meaning}\n\n${flower.story}\n\nCarried from Earth: ${memory.trim() || "A little piece of home"}\n\nSymbolic seed pattern: ${profile.petals} petals · ${profile.branches} branches · ${profile.symmetry} symmetry\n\nYour flower: ${
      collection === "mars" ? flower.name : luminousNames[selected]
    } · ${flower.month}\nEnglish Department`
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `${flower.word}-${name.replace(/[^a-z0-9]/gi, "-")}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
  const label =
    "text-[10px] sm:text-[11px] font-medium tracking-[.2em] uppercase"
  const button = `${label} group inline-flex min-h-12 w-fit items-center gap-6 py-3 text-primary transition-colors hover:text-foreground focus-visible:outline-1 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-default`
  return (
    <div className="relative isolate grid h-svh w-full grid-rows-[76px_minmax(0,1fr)_68px] overflow-hidden sm:grid-rows-[88px_minmax(0,1fr)_76px] bg-background font-sans text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[url('/floran/space-grain.svg')] bg-repeat opacity-[.025]"
        />
        <motion.div
          animate={
            reduced
              ? {}
              : { opacity: [0.045, 0.08, 0.045], scale: [1, 1.06, 1] }
          }
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[32%] h-[60svh] w-[75vw] rounded-full bg-[#865335] opacity-[.06] blur-[120px]"
        />
        <motion.div
          initial={false}
          animate={{ opacity: stage === "intro" ? 1 : 0 }}
          transition={{ duration: reduced ? 0.1 : 2.4, ease }}
          className="floran-opening-atmosphere absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-[url('/floran/space-grain.svg')] bg-repeat opacity-[.075]"
          />
        </motion.div>
        <Atmosphere
          centered={stage === "transition" || stage === "bloom"}
          phase={
            stage === "intro"
              ? "opening"
              : stage === "arrival"
                ? "arrival"
                : stage === "name"
                  ? "seed"
                  : stage === "dob" || stage === "memory"
                    ? "root"
                    : stage === "wheel"
                      ? "orbital"
                      : stage === "herbarium"
                        ? "archive"
                        : "bloom"
          }
        />
      </div>
      <motion.header
        initial={false}
        animate={{ opacity: stage === "intro" ? 0 : 1 }}
        transition={{ duration: reduced ? 0.1 : 2, ease }}
        className={`relative z-30 flex items-start justify-between gap-5 px-[6vw] pt-[clamp(18px,3.5svh,36px)] text-[8px] uppercase leading-5 tracking-[.2em] text-muted-foreground sm:text-[9px] ${
          stage === "intro" ? "invisible" : ""
        }`}
      >
        <p>
          Science in Action
          <br />
          <span className="text-muted-foreground/70">English Department</span>
        </p>
        <p className="text-right">
          MARS / 18.65°N 226.2°E
          <br />
          <span className="text-muted-foreground/70">
            FLORAN — MARTIAN BLOOM
          </span>
        </p>
      </motion.header>
      {stage !== "intro" && (
        <div className="absolute left-[6vw] top-[76px] z-30 flex items-center gap-4 sm:top-[88px]">
          <button
            aria-label="Go back"
            className={`min-h-11 pr-3 text-[9px] uppercase tracking-[.2em] text-muted-foreground transition-colors hover:text-primary ${
              stage === "arrival" ? "opacity-60 hover:opacity-100" : ""
            }`}
            onClick={() =>
              setStage(
                stage === "herbarium"
                  ? returnStage
                  : stage === "arrival"
                    ? "intro"
                    : stage === "name"
                      ? "arrival"
                      : stage === "dob"
                        ? "name"
                        : stage === "memory"
                          ? "dob"
                          : stage === "result" || stage === "bloom"
                            ? "wheel"
                            : "memory",
              )
            }
          >
            Back
          </button>
          {name && (
            <span
              className={`${label} max-w-[55vw] truncate text-muted-foreground`}
            >
              For {name}
            </span>
          )}
        </div>
      )}
      <main
        className="relative grid min-h-0 grid-cols-1 px-[6vw] pb-[clamp(12px,2.5svh,28px)] pt-[44px]"
        aria-live="polite"
      >
        <AnimatePresence mode="sync">
          <motion.section
            key={stage}
            initial={{
              opacity: 0,
              y: reduced ? 0 : 8,
              scale: reduced ? 1 : 0.995,
            }}
            animate={{ opacity: 1, y: 0, scale: 1, pointerEvents: "auto" }}
            exit={{
              opacity: 0,
              y: reduced ? 0 : -8,
              scale: reduced ? 1 : 0.985,
              pointerEvents: "none",
            }}
            transition={{ duration, ease }}
            data-scene={stage}
            className={`relative isolate col-start-1 row-start-1 h-full min-h-0 w-full text-left [&>form]:flex [&>form]:h-full [&>form]:flex-col [&>form>button]:mt-auto ${stage === "result" ? "overflow-y-auto pb-4" : ""}`}
          >
            {stage === "intro" && (
              <div className="relative top-[8svh] flex h-full flex-col items-center justify-center text-center">
                <motion.h1
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.1 : 1.8, ease }}
                  className="font-sans text-[min(16vw,34svh)] font-bold leading-[.9] tracking-[-.065em]"
                >
                  FLORAN
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.7, duration }}
                  className="mt-[clamp(28px,5svh,52px)] text-[9px] uppercase tracking-[.38em] text-muted-foreground sm:text-[11px]"
                >
                  A LANGUAGE GROWN.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 1.4, duration }}
                  onClick={() => setStage("arrival")}
                  className="group mt-[clamp(48px,12svh,120px)] inline-flex min-h-12 w-fit flex-col items-center gap-4 px-4 py-2 text-[10px] uppercase tracking-[.2em] text-primary transition-colors duration-700 hover:text-foreground focus-visible:outline-1 focus-visible:outline-primary"
                >
                  BEGIN{" "}
                  <span
                    className="h-10 w-px bg-primary/25 transition-all duration-700 group-hover:h-12 group-hover:bg-primary"
                    aria-hidden="true"
                  />
                </motion.button>
              </div>
            )}
            {stage === "arrival" && (
              <div className="grid h-full min-h-0 max-w-3xl grid-rows-[minmax(0,1fr)_auto_minmax(24px,.4fr)_auto] pb-[clamp(12px,4svh,40px)] lg:w-[45vw]">
                <div className="row-start-2">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: reduced ? 0 : 0.3,
                      duration: reduced ? 0.1 : 1.5,
                      ease,
                    }}
                    className={`${label} mb-[clamp(16px,3svh,28px)] text-muted-foreground`}
                  >
                    01 — A traveller between worlds
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: reduced ? 0 : 0.7,
                      duration: reduced ? 0.1 : 1.8,
                      ease,
                    }}
                    className="font-sans text-[clamp(1.85rem,5.6svh,4rem)] font-medium leading-[1.08] tracking-[-.025em]"
                  >
                    YOU HAVE ARRIVED
                    <br />
                    <em className="not-italic text-accent">ON MARS.</em>
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: reduced ? 0 : 1.35,
                      duration: reduced ? 0.1 : 1.8,
                      ease,
                    }}
                  >
                    <p className="mt-[clamp(16px,3svh,28px)] font-sans text-lg not-italic text-primary sm:text-xl">
                      Earth is now a memory.
                    </p>
                    <p className="mt-[clamp(12px,2.5svh,24px)] max-w-sm text-sm leading-7 text-muted-foreground">
                      But every traveller carries something with them.
                      <br />A little piece of the life they left behind.
                    </p>
                  </motion.div>
                  <p className="hidden">
                    Language is not merely something we read.
                    <br />
                    It is something we create, interpret and experience.
                  </p>
                </div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: reduced ? 0 : 2.1,
                    duration: reduced ? 0.1 : 1.8,
                    ease,
                  }}
                  className={`${button} row-start-4`}
                  onClick={() => setStage("name")}
                >
                  Carry your story forward <ArrowRight size={16} />
                </motion.button>
              </div>
            )}
            {stage === "name" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  if (name.trim()) {
                    setName(name.trim())
                    setStage("dob")
                  }
                }}
                className="flex h-full max-w-3xl flex-col"
              >
                <p
                  className={`${label} mb-[clamp(16px,3svh,28px)] text-muted-foreground`}
                >
                  02 — A personal beginning
                </p>
                <h1 className="font-sans text-[clamp(1.85rem,5.6svh,4rem)] font-medium leading-[1.08] tracking-[-.025em]">
                  What should
                  <br />
                  <em className="not-italic text-accent">we call you?</em>
                </h1>
                <p className="mx-auto mt-6 max-w-xs text-sm leading-7 text-muted-foreground">
                  Your name becomes the first seed. It chooses a flower form and
                  the branching of your symbolic pattern.
                </p>
                <div className="mb-6 mt-[clamp(20px,4svh,40px)] max-w-md text-left">
                  <label
                    htmlFor="name"
                    className={`${label} text-muted-foreground`}
                  >
                    Your name
                  </label>
                  <input
                    id="name"
                    autoFocus
                    required
                    maxLength={40}
                    autoComplete="given-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    className="mt-3 w-full border-b border-border bg-transparent py-3 font-sans text-2xl outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                  />
                </div>
                <button className={button}>
                  Continue <ArrowRight size={16} />
                </button>
              </form>
            )}
            {stage === "dob" && (
              <form
                onSubmit={submitDate}
                className="flex h-full max-w-3xl flex-col"
              >
                <p
                  className={`${label} mb-[clamp(16px,3svh,28px)] text-muted-foreground`}
                >
                  03 — Your moment in time
                </p>
                <h1 className="font-sans text-[clamp(1.85rem,5.6svh,4rem)] font-medium leading-[1.08] tracking-[-.025em]">
                  When did
                  <br />
                  <em className="not-italic text-accent">your story begin?</em>
                </h1>
                <p className="mt-[clamp(12px,2.5svh,24px)] text-sm leading-6 text-muted-foreground">
                  A date becomes a pattern.
                  <br />A pattern becomes a Martian bloom.
                </p>
                <div className="mb-6 mt-[clamp(20px,4svh,40px)] grid max-w-md grid-cols-[.8fr_1.5fr_1fr] gap-5 text-left">
                  <div>
                    <label
                      className={`${label} text-muted-foreground`}
                      htmlFor="day"
                    >
                      Day
                    </label>
                    <input
                      id="day"
                      required
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="DD"
                      value={day}
                      onChange={(event) =>
                        setDay(event.target.value.replace(/\D/g, ""))
                      }
                      className="mt-3 w-full border-b border-border bg-transparent py-3 font-sans text-2xl outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className={`${label} text-muted-foreground`}
                      htmlFor="month"
                    >
                      Month
                    </label>
                    <select
                      id="month"
                      required
                      value={month}
                      onChange={(event) => setMonth(event.target.value)}
                      className="mt-3 h-[61px] w-full border-b border-border bg-background font-sans text-2xl outline-none focus:border-primary"
                    >
                      <option value="" disabled>
                        Month
                      </option>
                      {flowers.map((item, index) => (
                        <option key={item.month} value={index + 1}>
                          {item.month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`${label} text-muted-foreground`}
                      htmlFor="year"
                    >
                      Year
                    </label>
                    <input
                      id="year"
                      required
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="YYYY"
                      value={year}
                      onChange={(event) =>
                        setYear(event.target.value.replace(/\D/g, ""))
                      }
                      className="mt-3 w-full border-b border-border bg-transparent py-3 font-sans text-2xl outline-none focus:border-primary"
                    />
                  </div>
                </div>
                {error && (
                  <p role="alert" className="mb-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <button className={button}>
                  Continue <ArrowRight size={16} />
                </button>
                <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
                  Your birth date stays in this session. Only save a bloom if
                  you choose.
                </p>
              </form>
            )}
            {stage === "memory" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  setStorageMessage("")
                  setStage("transition")
                }}
                className="flex h-full max-w-3xl flex-col"
              >
                <p
                  className={`${label} mb-[clamp(16px,3svh,28px)] text-muted-foreground`}
                >
                  04 — A little piece of Earth
                </p>
                <h1 className="font-sans text-[clamp(1.85rem,5.6svh,4rem)] font-medium leading-[1.08] tracking-[-.025em]">
                  What will
                  <br />
                  <em className="not-italic text-accent">you carry?</em>
                </h1>
                <p className="mt-[clamp(12px,2.5svh,24px)] max-w-sm text-sm leading-6 text-muted-foreground">
                  A person. A place. A feeling. Something from home that you
                  want your flower to remember.
                </p>
                <div className="my-[clamp(16px,3svh,28px)] max-w-md text-left">
                  <label
                    htmlFor="memory"
                    className={`${label} text-muted-foreground`}
                  >
                    My memory of home
                  </label>
                  <textarea
                    id="memory"
                    value={memory}
                    maxLength={160}
                    rows={2}
                    onChange={(event) => setMemory(event.target.value)}
                    placeholder="The smell of rain in my mother's garden…"
                    className="mt-4 w-full resize-none border-b border-border bg-transparent py-3 font-sans text-2xl leading-8 outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                  />
                  <p className="mt-2 text-right text-[10px] text-muted-foreground">
                    {memory.length} / 160 · optional
                  </p>
                </div>
                <button className={button} type="submit">
                  Grow my bloom <ArrowRight size={16} />
                </button>
                <p className="mt-5 text-[10px] text-muted-foreground">
                  Your flower can hold a memory, or simply a possibility.
                </p>
              </form>
            )}
            {stage === "transition" && (
              <div className="flex h-full min-h-0 flex-col justify-center">
                <div className="relative mx-auto flex h-[min(76vw,48svh)] w-[min(76vw,48svh)] shrink-0 items-center justify-center">
                  <SeedPattern
                    petals={profile.petals}
                    branches={profile.branches}
                    symmetry={profile.symmetry}
                    className="absolute inset-0 h-full w-full text-accent/10"
                  />
                  <motion.div
                    initial={false}
                    animate={{
                      clipPath:
                        growth === 0
                          ? "inset(100% 0 0 0)"
                          : growth === 1
                            ? "inset(75% 0 0 0)"
                            : growth === 2
                              ? "inset(50% 0 0 0)"
                              : growth === 3
                                ? "inset(25% 0 0 0)"
                                : "inset(0% 0 0 0)",
                      opacity: growth === 0 ? 0 : 1,
                    }}
                    transition={{ duration: reduced ? 0.1 : 1.4, ease }}
                    className="h-full w-full"
                  >
                    <Flower
                      collection={collection}
                      index={profile.index}
                      shared
                      className="h-full w-full"
                    />
                  </motion.div>
                  <motion.span
                    animate={{
                      opacity: growth === 0 ? 1 : 0,
                      scale: growth === 0 ? 1 : 0.3,
                    }}
                    className="absolute bottom-8 h-3 w-2 rounded-full bg-primary"
                  />
                </div>
                <p className="mt-[clamp(16px,3svh,28px)] max-w-lg font-sans text-[clamp(1.2rem,3svh,1.75rem)]">
                  {growth === 0
                    ? "A memory becomes a seed."
                    : growth === 1
                      ? "Roots remember. A stem reaches."
                      : growth === 2
                        ? "Branches begin to shape a sentence."
                        : growth === 3
                          ? "Petals begin to find their language."
                          : "Your identity, in bloom."}
                </p>
                <p className={`${label} mt-3 text-muted-foreground`}>
                  {
                    ["SEED", "STEM", "BRANCHES", "PETALS", "MARTIAN BLOOM"][
                      growth
                    ]
                  }{" "}
                  · {name}
                </p>
              </div>
            )}
            {stage === "wheel" && (
              <div className="flex h-full min-h-0 flex-col">
                <p className={`${label} mb-2 text-muted-foreground`}>
                  05 — A language beyond words
                </p>
                <div className="mb-2 flex justify-center gap-7 text-[10px] uppercase tracking-[.14em]">
                  <button
                    type="button"
                    aria-pressed={collection === "mars"}
                    onClick={() => setCollection("mars")}
                    className={`min-h-11 border-b px-1 ${
                      collection === "mars"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground"
                    }`}
                  >
                    Flowers of Mars
                  </button>
                  <button
                    type="button"
                    aria-pressed={collection === "luminous"}
                    onClick={() => setCollection("luminous")}
                    className={`min-h-11 border-b px-1 ${
                      collection === "luminous"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground"
                    }`}
                  >
                    Luminous florets
                  </button>
                </div>
                <div className="relative flex max-h-[70%] min-h-0 flex-1 items-center justify-center [container-type:size]">
                  <div
                    className="relative aspect-square w-[min(88vw,100cqh,64svh)] max-w-full shrink-0"
                    onPointerDown={(event) => {
                      dragging.current = event.clientX
                    }}
                    onPointerUp={() => {
                      dragging.current = null
                    }}
                    onPointerLeave={() => {
                      dragging.current = null
                    }}
                    onPointerMove={(event) => {
                      if (dragging.current !== null) {
                        setRotation(
                          (previous) =>
                            previous +
                            (event.clientX - dragging.current!) * 0.35,
                        )
                        dragging.current = event.clientX
                      }
                    }}
                  >
                    <div className="absolute inset-[12%] rounded-full border border-accent/20" />
                    <div className="absolute inset-[25%] rounded-full border border-dashed border-accent/15" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="max-w-[48%] font-sans text-[clamp(1.2rem,3svh,2rem)] leading-[1.15]">
                        A word
                        <br />
                        <em className="not-italic text-accent">is waiting.</em>
                      </p>
                      <p className="mt-3 max-w-[45%] text-[9px] leading-4 text-muted-foreground">
                        Find the symbol of your story.
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: rotation + (reduced ? 0 : 360) }}
                      transition={{
                        duration: reduced ? 0 : 45,
                        ease: "linear",
                        repeat: reduced ? 0 : Infinity,
                      }}
                      className="absolute inset-0 touch-pan-y"
                    >
                      {flowers.map((item, index) => {
                        const angle = (index * Math.PI) / 6 - Math.PI / 2
                        return (
                          <div
                            key={item.month}
                            className="absolute h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${50 + Math.cos(angle) * 40}%`,
                              top: `${50 + Math.sin(angle) * 40}%`,
                            }}
                          >
                            <motion.button
                              animate={{
                                rotate: -(rotation + (reduced ? 0 : 360)),
                              }}
                              transition={{
                                duration: reduced ? 0 : 45,
                                ease: "linear",
                                repeat: reduced ? 0 : Infinity,
                              }}
                              aria-label={`Select ${item.month}, ${item.name} flower`}
                              onClick={() => {
                                setSelected(index)
                                setStage("bloom")
                              }}
                              className="group flex h-full w-full flex-col items-center focus-visible:outline-2 focus-visible:outline-primary"
                            >
                              <Flower
                                collection={collection}
                                index={index}
                                shared
                                className="h-[82%] w-[82%] object-contain transition-transform duration-700 group-hover:scale-110"
                              />
                              <span className="text-[8px] tracking-[.12em] text-muted-foreground">
                                {collection === "mars"
                                  ? item.name.toUpperCase()
                                  : luminousNames[index].toUpperCase()}
                              </span>
                            </motion.button>
                          </div>
                        )
                      })}
                    </motion.div>
                  </div>
                </div>
                <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                  Twelve symbols. A language beyond the words you know.
                </p>
                <button
                  className="mt-2 inline-flex min-h-11 w-fit items-center gap-3 border-b border-accent/40 text-xs text-primary"
                  onClick={() => {
                    setSelected(profile.index)
                    setStage("bloom")
                  }}
                >
                  Reveal my Martian bloom <MoveUpRight size={14} />
                </button>
                <p className="mt-1 text-[8px] tracking-wider text-muted-foreground">
                  DRAG TO EXPLORE · TAP TO DISCOVER
                </p>
              </div>
            )}
            {stage === "bloom" && (
              <div className="flex h-full flex-col items-start justify-center">
                <p className={`${label} text-muted-foreground`}>
                  Your flower is unfolding
                </p>
                <motion.div
                  animate={
                    reduced
                      ? {}
                      : { rotate: profile.rotation, scale: profile.scale }
                  }
                  transition={{ duration: 2, ease }}
                  className="floran-specimen-glow relative isolate my-5"
                >
                  <SeedPattern
                    petals={profile.petals}
                    branches={profile.branches}
                    symmetry={profile.symmetry}
                    className="absolute inset-0 h-full w-full text-accent/10"
                  />
                  <Flower
                    collection={collection}
                    index={selected}
                    shared
                    bloom
                    className="h-[min(38svh,320px)] w-[min(38svh,320px)]"
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 1.8, duration: 1 }}
                  className="max-w-xl font-sans text-[clamp(1.5rem,4svh,2.75rem)] text-primary"
                >
                  {name}, your word is…
                </motion.p>
              </div>
            )}
            {stage === "result" && (
              <div className="flex min-h-full max-w-6xl flex-col [&>*]:shrink-0">
                <p
                  className={`${label} mb-[clamp(12px,2.5svh,24px)] text-muted-foreground`}
                >
                  The Martian Herbarium · A record of your becoming
                </p>
                <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(120px,.65fr)] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,.55fr)] sm:gap-12">
                  <div className="min-w-0">
                    <p className={`${label} mb-3 text-muted-foreground`}>
                      {name}, your word is
                    </p>
                    <h1 className="break-words font-sans text-[clamp(1.65rem,5.4svh,4.5rem)] font-medium leading-[1.05]">
                      {flower.word}
                      <span className="text-accent">.</span>
                    </h1>
                    <p className="mt-[clamp(10px,2svh,20px)] text-[clamp(.8rem,1.9svh,1.1rem)] leading-6 text-primary">
                      {flower.meaning}
                    </p>
                    <p className="mt-3 text-[9px] uppercase leading-5 tracking-[.15em] text-muted-foreground">
                      {date}
                      <span className="mx-2">/</span>
                      {collection === "mars"
                        ? flower.name
                        : luminousNames[selected]}
                    </p>
                  </div>
                  <motion.div
                    animate={
                      reduced
                        ? {}
                        : {
                            rotate: profile.rotation,
                            scale: [
                              profile.scale,
                              profile.scale + 0.015,
                              profile.scale,
                            ],
                          }
                    }
                    transition={{
                      duration: profile.rhythm,
                      repeat: reduced ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                    className="floran-specimen-glow relative isolate justify-self-center h-[min(26svh,190px)] w-full sm:h-[min(50svh,440px)]"
                  >
                    <SeedPattern
                      petals={profile.petals}
                      branches={profile.branches}
                      symmetry={profile.symmetry}
                      className="absolute inset-0 h-full w-full text-accent/10"
                    />
                    <Flower
                      collection={collection}
                      index={selected}
                      shared
                      bloom
                      className="h-full w-full"
                    />
                  </motion.div>
                </div>
                <div className="mt-[clamp(16px,3svh,28px)] max-w-lg">
                  <p className={`${label} text-muted-foreground`}>
                    Carried from Earth
                  </p>
                  <p className="mt-2 max-h-[11svh] overflow-y-auto break-words text-[clamp(.8rem,1.9svh,1.1rem)] leading-6 text-primary">
                    “{memory.trim() || "A little piece of home."}”
                  </p>
                </div>
                <ShareBloom key={`${profile.id}-${collection}`} name={name} day={day} month={month} year={year} collection={collection} />
                <details className="mt-3 max-h-[min(18svh,160px)] max-w-lg overflow-y-auto text-xs text-muted-foreground">
                  <summary className="min-h-11 cursor-pointer py-3">
                    How your identity became a bloom
                  </summary>
                  <p className="leading-6">
                    Your name and date together choose your flower. Your name
                    sets the branching and symmetry of its symbolic seed
                    pattern; your date sets its petal count, scale, orientation
                    and breathing rhythm. These are artistic associations, not
                    scientific predictions.
                  </p>
                  <p className="mt-3 leading-6">{flower.story}</p>
                  <div className="mt-3 flex flex-wrap gap-5 pb-3">
                    <span>{profile.petals} seed petals</span>
                    <span>{profile.branches} branches</span>
                    <span>{profile.symmetry}</span>
                  </div>
                </details>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-0 pt-3 sm:gap-x-8">
                  <button
                    className={button}
                    onClick={saveBloom}
                    disabled={saved}
                  >
                    {saved ? "Planted in herbarium" : "Plant in my herbarium"}
                    <Sparkles size={13} />
                  </button>
                  <button className={button} onClick={keepWord}>
                    Download my bloom
                    <Download size={13} />
                  </button>
                  <button
                    className={button}
                    onClick={() => {
                      setStage("name")
                      setRotation(0)
                      setMemory("")
                      setStorageMessage("")
                    }}
                  >
                    Grow another
                    <ArrowRight size={13} />
                  </button>
                </div>
                <p
                  role="status"
                  className="mt-1 max-w-lg text-[9px] leading-4 text-muted-foreground"
                >
                  {storageMessage ||
                    "Saving is optional and local to this browser. Your birth date is never saved."}
                </p>
              </div>
            )}
            {stage === "herbarium" && (
              <div className="flex h-full min-h-0 flex-col">
                <p className={`${label} mb-6 text-muted-foreground`}>
                  FLORAN · A living collection
                </p>
                <h1 className="font-sans text-[clamp(1.8rem,5svh,3.5rem)] leading-[1.1]">
                  The Martian
                  <br />
                  <em className="not-italic text-accent">Herbarium.</em>
                </h1>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  Stories of identity, blooming on Mars.
                </p>
                {records.length === 0 ? (
                  <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
                    <Flower
                      collection="mars"
                      index={11}
                      className="mb-4 h-[min(22svh,160px)] w-28 opacity-70"
                    />
                    <p className="mb-4 font-sans text-lg">
                      Every herbarium begins with one seed.
                    </p>
                    <p className="mb-4 max-w-sm text-xs leading-6 text-muted-foreground">
                      Grow a personal bloom and choose to plant it here. Your
                      collection stays on this device.
                    </p>
                    <button
                      className={button}
                      onClick={() => setStage("arrival")}
                    >
                      Create my first bloom <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 flex min-h-0 flex-1 snap-x snap-mandatory gap-10 overflow-x-auto overflow-y-hidden pb-2">
                    {records.map((record) => (
                      <article
                        key={record.id}
                        className="flex min-h-0 w-[min(280px,78vw)] shrink-0 snap-start flex-col justify-start overflow-y-auto"
                      >
                        <div className="relative h-[min(11svh,100px)] w-32 shrink-0">
                          <SeedPattern
                            petals={record.petals}
                            branches={record.branches}
                            symmetry={record.symmetry}
                            className="absolute inset-0 h-full w-full text-accent/10"
                          />
                          <Flower
                            index={record.index}
                            collection={record.collection}
                            className="relative h-full w-full"
                          />
                        </div>
                        <p
                          className={`${label} mt-1 truncate text-muted-foreground`}
                        >
                          For {record.name}
                        </p>
                        <h2 className="mt-2 font-sans text-2xl">
                          {flowers[record.index].word}
                        </h2>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {record.collection === "mars"
                            ? flowers[record.index].name
                            : luminousNames[record.index]}
                        </p>
                        <p className="mt-2 max-h-[4svh] overflow-y-auto break-words text-xs leading-5 text-primary">
                          “{record.memory || "A little piece of home."}”
                        </p>
                        <details className="mt-2 min-h-0 max-h-24 overflow-y-auto text-xs leading-6 text-muted-foreground">
                          <summary className="cursor-pointer py-2">
                            Read its story
                          </summary>
                          <p>{flowers[record.index].story}</p>
                        </details>
                        <button
                          aria-label={`Remove ${record.name}'s bloom`}
                          onClick={() => removeBloom(record.id)}
                          className="mt-1 min-h-11 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          Remove bloom
                        </button>
                      </article>
                    ))}
                  </div>
                )}
                {records.length > 0 && (
                  <button
                    className={`${button} mt-2 shrink-0`}
                    onClick={() => {
                      setMemory("")
                      setStorageMessage("")
                      setStage("name")
                    }}
                  >
                    Grow another bloom <ArrowRight size={16} />
                  </button>
                )}
                <p
                  role="status"
                  className="mt-2 shrink-0 text-[9px] leading-4 text-muted-foreground"
                >
                  {storageMessage ||
                    "Saved in this browser only. No birth dates, accounts or cloud storage."}
                </p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
      <footer className="relative z-30 flex items-end justify-between gap-4 px-[6vw] pb-[clamp(16px,3svh,28px)] text-[8px] uppercase leading-5 tracking-[.18em] text-muted-foreground sm:text-[9px]">
        {stage === "intro" ? (
          <p className="text-[8px] tracking-[.12em] text-muted-foreground/70 sm:text-[9px]">
            MARS / 18.65°N 226.2°E
          </p>
        ) : (
          <p>
            FLORAN / IDENTITY STUDY
            <br />
            <span className="text-muted-foreground/60">
              Earth is now a memory.
            </span>
          </p>
        )}
        <div className="flex items-center gap-3 sm:gap-7">
          {stage === "intro" && <Link href="/display" className="min-h-11 content-center hover:text-primary">Join the installation</Link>}
          {stage !== "intro" && (
            <button
              onClick={() => {
                setReturnStage(stage)
                setStorageMessage("")
                setStage("herbarium")
              }}
              className="min-h-11 text-[8px] uppercase tracking-[.1em] text-muted-foreground transition-colors hover:text-primary"
            >
              My herbarium {records.length > 0 && `(${records.length})`}
            </button>
          )}
          <p className="text-right">
            {stage === "intro" ? (
              "01"
            ) : stage === "herbarium" ? (
              "ARCHIVE"
            ) : (
              <>
                {stage === "arrival"
                    ? "02"
                    : stage === "name"
                      ? "03"
                      : stage === "dob"
                        ? "04"
                        : stage === "memory"
                          ? "05"
                          : stage === "result"
                            ? "07"
                            : "06"}{" "}
                / 07
              </>
            )}
            {stage !== "intro" && (
              <>
                <br />
                <span className="text-muted-foreground/60">
                  TRANSMISSION ACTIVE
                </span>
              </>
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}
