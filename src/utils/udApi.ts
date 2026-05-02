import type { UDDefinition } from "../types"

const UD_API = "https://api.urbandictionary.com/v0/define"
const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary"

/** Strip Urban Dictionary's [word] hyperlink markup, leaving just the word. */
function cleanUDText(text: string): string {
  return text.replace(/\[([^\[\]]+)\]/g, '$1').trim()
}

export async function fetchDefinition(word: string): Promise<UDDefinition | null> {
  const ud = await fetchUDDefinition(word)
  if (ud) return ud
  return fetchWikiDefinition(word)
}

async function fetchUDDefinition(word: string): Promise<UDDefinition | null> {
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
      definition: cleanUDText(entry.definition ?? ""),
      example: cleanUDText(entry.example ?? ""),
      thumbsUp: entry.thumbs_up ?? 0,
      thumbsDown: entry.thumbs_down ?? 0,
      source: 'urban-dictionary' as const,
    }
  } catch {
    return null
  }
}

async function fetchWikiDefinition(word: string): Promise<UDDefinition | null> {
  try {
    const res = await fetch(`${WIKI_API}/${encodeURIComponent(word)}`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const extract = data?.extract
    if (!extract || data?.type === "disambiguation") return null
    return {
      word: data.title ?? word,
      definition: extract,
      example: "",
      thumbsUp: 0,
      thumbsDown: 0,
      source: 'wikipedia' as const,
    }
  } catch {
    return null
  }
}
