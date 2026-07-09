import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { checkIsAdmin } from '../services/admin'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function refreshAdminStatus() {
    if (!isSupabaseConfigured || !session?.user) {
      setIsAdmin(false)
      return
    }
    const { isAdmin: admin } = await checkIsAdmin()
    setIsAdmin(admin)
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Re-check admin status whenever the logged-in user changes.
  useEffect(() => {
    if (loading) return
    refreshAdminStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, loading])

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured yet.' } }
    }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      const { isAdmin: admin } = await checkIsAdmin()
      setIsAdmin(admin)
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
    refreshAdminStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
