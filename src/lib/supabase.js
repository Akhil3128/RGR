import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// True when both env variables are filled in (.env file).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// When Supabase is not configured yet, `supabase` is null and the app
// falls back to sample products so the site still works out of the box.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
