import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Supabase client is null when env vars are not configured (→ local word list used)
export const supabase = url && key ? createClient(url, key) : null
