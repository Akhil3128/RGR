# Razorpay Edge Functions

Secure server-side helpers for online checkout.

| Function | Purpose |
| --- | --- |
| `create-razorpay-order` | Creates a Razorpay order for a saved Supabase order |
| `verify-razorpay-payment` | Verifies checkout signature and marks order Paid |
| `razorpay-webhook` | Backup: marks Paid on `payment.captured` |

## Secrets

```bash
supabase secrets set \
  RAZORPAY_KEY_ID=rzp_test_xxx \
  RAZORPAY_KEY_SECRET=your_secret \
  RAZORPAY_WEBHOOK_SECRET=optional_webhook_secret
```

## Deploy

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook
```

Also run `supabase/migration-razorpay.sql` in the SQL Editor.
