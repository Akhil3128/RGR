import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { checkIsAdmin } from '../services/admin'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function resolveAdmin(nextSession) {
    if (!isSupabaseConfigured || !nextSession?.user) {
      setIsAdmin(false)
      return false
    }
    const { isAdmin: admin } = await checkIsAdmin()
    setIsAdmin(admin)
    return admin
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let mounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      // Wait for admin check before ending loading — avoids false
      // "Admin access not set up" flash on refresh.
      await resolveAdmin(data.session)
      if (mounted) setLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      await resolveAdmin(newSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured yet.' } }
    }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      await resolveAdmin(result.data.session)
    }
    return result
  }

  async function signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  const value = {
    session,
    user: session?.user ?? null,
    isAdmin,
    loading,
    signIn,
    signOut,
    refreshAdminStatus: () => resolveAdmin(session),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
