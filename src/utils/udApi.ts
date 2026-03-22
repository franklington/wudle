import type { UDDefinition } from "../types"

const UD_API = "https://api.urbandictionary.com/v0/define"

export async function fetchDefinition(word: string): Promise<UDDefinition | null> {
  try {
    const res = await fetch(`${UD_API}?term=${encodeURIComponent(word)}`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const entry = data?.list?.[0]
    if (!entry) return null
    return {
      word: entry.word ?? word,
      definition: entry.definition ?? "",
      example: entry.example ?? "",
      thumbsUp: entry.thumbs_up ?? 0,
      thumbsDown: entry.thumbs_down ?? 0,
    }
  } catch {
    return null
  }
}
