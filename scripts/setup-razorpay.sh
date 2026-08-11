#!/usr/bin/env bash
# One-shot helper to deploy Razorpay Edge Functions.
# Usage:
#   export RAZORPAY_KEY_ID=rzp_test_xxx
#   export RAZORPAY_KEY_SECRET=your_secret
#   # optional:
#   # export RAZORPAY_WEBHOOK_SECRET=whsec_xxx
#   ./scripts/setup-razorpay.sh

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-ycyvcucumfkhyjyfwfqt}"

if [[ -z "${RAZORPAY_KEY_ID:-}" || -z "${RAZORPAY_KEY_SECRET:-}" ]]; then
  echo "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET first."
  echo "Example:"
  echo "  export RAZORPAY_KEY_ID=rzp_test_xxx"
  echo "  export RAZORPAY_KEY_SECRET=your_secret"
  exit 1
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "Installing Supabase CLI via npx…"
fi

npx supabase login
npx supabase link --project-ref "$PROJECT_REF"

SECRET_ARGS=(
  "RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID"
  "RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET"
)
if [[ -n "${RAZORPAY_WEBHOOK_SECRET:-}" ]]; then
  SECRET_ARGS+=("RAZORPAY_WEBHOOK_SECRET=$RAZORPAY_WEBHOOK_SECRET")
fi

npx supabase secrets set "${SECRET_ARGS[@]}"

npx supabase functions deploy create-razorpay-order
npx supabase functions deploy verify-razorpay-payment
npx supabase functions deploy razorpay-webhook

echo
echo "Done."
echo "Next:"
echo "  1. Add VITE_RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID in Vercel → Settings → Environment Variables"
echo "  2. Redeploy Production"
echo "  3. (Optional) Razorpay webhook URL:"
echo "     https://$PROJECT_REF.supabase.co/functions/v1/razorpay-webhook"
echo "     Event: payment.captured"
