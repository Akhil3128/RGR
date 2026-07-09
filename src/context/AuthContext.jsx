import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      checkAdmin(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      checkAdmin(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function checkAdmin(currentSession) {
    if (!currentSession?.user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', currentSession.user.id)
        .maybeSingle()
      setIsAdmin(Boolean(data) && !error)
    } catch {
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file first.' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) await checkAdmin(data.session)
    return { error }
  }

  async function signOut() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  const value = { session, isAdmin, loading, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
