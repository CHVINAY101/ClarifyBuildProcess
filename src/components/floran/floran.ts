export type Collection = "mars" | "luminous"

export type BloomRecord = {
  id: string
  name: string
  memory: string
  index: number
  collection: Collection
  petals: number
  branches: number
  rotation: number
  scale: number
  symmetry?: "Radial" | "Bilateral"
}

export const herbariumKey = "floran-herbarium-v1"

export function identityProfile(
  name: string,
  day: string,
  month: string,
  year: string,
) {
  const normalized = name.trim().toLocaleLowerCase().normalize("NFKC")
  let nameSeed = 2166136261
  for (const character of normalized) {
    nameSeed = Math.imul(nameSeed ^ character.codePointAt(0)!, 16777619) >>> 0
  }
  const dateSeed = Number(year) + Number(month) * 31 + Number(day) * 7
  return {
    id: `${nameSeed.toString(36)}-${dateSeed.toString(36)}`,
    index: (nameSeed + dateSeed) % 12,
    branches: 2 + (nameSeed % 4),
    petals: 5 + (dateSeed % 8),
    rotation: (dateSeed % 15) - 7,
    scale: 0.9 + (dateSeed % 5) * 0.04,
    rhythm: 5 + (dateSeed % 5),
    symmetry: nameSeed % 2 === 0 ? "Radial" as const : "Bilateral" as const,
  }
}

export function readHerbarium(): BloomRecord[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(herbariumKey) ?? "[]",
    )
    if (!Array.isArray(stored)) return []
    return stored
      .filter(
        (item): item is BloomRecord =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          item.name.length <= 40 &&
          typeof item.memory === "string" &&
          item.memory.length <= 160 &&
          Number.isInteger(item.index) &&
          item.index >= 0 &&
          item.index < 12 &&
          (item.collection === "mars" || item.collection === "luminous") &&
          Number.isInteger(item.petals) &&
          item.petals >= 5 &&
          item.petals <= 12 &&
          Number.isInteger(item.branches) &&
          item.branches >= 2 &&
          item.branches <= 5 &&
          Number.isFinite(item.rotation) &&
          Math.abs(item.rotation) <= 7 &&
          Number.isFinite(item.scale) &&
          item.scale >= 0.9 &&
          item.scale <= 1.06,
      )
      .slice(0, 24)
  } catch {
    return []
  }
}
