import { createClient } from '@supabase/supabase-js'

// Vite only injects VITE_* vars at build time.
// On Vercel/Netlify these must be set in the host dashboard OR they fall
// through to the defaults below. The anon key is a public client key
// (protected by Supabase Row Level Security) — it is safe to ship in the
// browser bundle, same as any other frontend app.
const DEFAULT_SUPABASE_URL = 'https://ycyvcucumfkhyjyfwfqt.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljeXZjdWN1bWZraHlqeWZ3ZnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NTgzNDcsImV4cCI6MjA5OTEzNDM0N30.M0NOXWvhI4pLscdSki_LydHg9omTI9E3XNQT7kYw1b4'

function cleanEnv(value) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '')
}

const supabaseUrl =
  cleanEnv(import.meta.env.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL
const supabaseAnonKey =
  cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
