"use server"

import { getPayload } from "payload"
import { headers } from "next/headers"
import config from "@payload-config"
import { identityProfile } from "./floran"

export async function shareBloom(input: {
  name: string; day: string; month: string; year: string
  collection: "mars" | "luminous"; consent: boolean; requestKey: string
}) {
  if (!input || typeof input.name !== "string" ||
      !input.name.trim() || input.name.trim().length > 40 ||
      /[\u0000-\u001f]/.test(input.name) ||
      !["mars", "luminous"].includes(input.collection) ||
      input.consent !== true ||
      typeof input.requestKey !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(input.requestKey)) {
    return { ok: false, message: "Please confirm sharing and enter a valid name." }
  }
  if (![input.day, input.month, input.year].every(value => typeof value === "string" && /^\d{1,4}$/.test(value))) {
    return { ok: false, message: "Please enter a valid birth date." }
  }
  const day = Number(input.day), month = Number(input.month), year = Number(input.year)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (year < 1900 || date > new Date() || date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return { ok: false, message: "Please enter a real birth date, not a future date." }
  }
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    const existing = await payload.find({
      collection: "blooms", overrideAccess: false, user, depth: 0,
      where: { requestKey: { equals: input.requestKey } }, limit: 1,
      context: { floranRegistrationLookup: true },
      select: { name: true },
    })
    if (existing.docs.length) return { ok: true, message: "Your bloom is already part of the live installation." }
    const registration = {
      name: input.name.trim(),
      flowerIndex: identityProfile(input.name, input.day, input.month, input.year).index,
      collection: input.collection,
      requestKey: input.requestKey,
    }
    await payload.create({
      collection: "blooms", overrideAccess: false, user,
      data: registration,
      context: { floranRegistration: registration },
    })
    return { ok: true, message: "Transmission received. Your bloom is now part of the live installation." }
  } catch (error) {
    console.error("FLORAN registration failed", error instanceof Error ? error.message : "Unknown backend error")
    return { ok: false, message: "The transmission could not be confirmed. Please try again." }
  }
}

export async function readLiveBlooms() {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    const result = await payload.find({
      collection: "blooms", overrideAccess: false, user, limit: 36,
      depth: 0, sort: "-createdAt",
      select: { name: true, flowerIndex: true, collection: true, createdAt: true },
    })
    return {
      ok: true as const, total: result.totalDocs,
      blooms: result.docs.map(doc => ({
        id: doc.id, name: doc.name, index: doc.flowerIndex,
        collection: doc.collection, createdAt: doc.createdAt,
      })),
    }
  } catch {
    return { ok: false as const, total: 0, blooms: [] }
  }
}
