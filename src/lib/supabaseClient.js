import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The site must keep working (with sample products) even before Supabase
// has been set up, so we only create a real client when both values exist.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Ranganayaki Godavari Ruchulu] Supabase is not configured yet.\n' +
      'Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
      'Until then, the site will show sample products and orders will not be saved to the database.'
  )
}
