import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function getEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

export function razorpayAuthHeader() {
  const keyId = getEnv('RAZORPAY_KEY_ID')
  const keySecret = getEnv('RAZORPAY_KEY_SECRET')
  return 'Basic ' + btoa(`${keyId}:${keySecret}`)
}

export function createServiceClient() {
  const url = getEnv('SUPABASE_URL')
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function hmacSha256Hex(secret: string, message: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
