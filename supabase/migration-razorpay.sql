-- ============================================================================
-- MIGRATION: Razorpay online payments
-- Run in Supabase → SQL Editor AFTER deploying Edge Functions
-- ============================================================================

alter table public.orders
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_signature text;

create index if not exists idx_orders_razorpay_order
  on public.orders (razorpay_order_id);

-- Optional helper: mark an order paid after verified Razorpay payment.
-- Edge Functions use the service role (bypasses RLS); this RPC is a
-- convenience if you prefer calling SQL from the function.
create or replace function public.mark_order_paid_razorpay(
  p_order_id uuid,
  p_razorpay_order_id text,
  p_razorpay_payment_id text,
  p_razorpay_signature text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
  set
    payment_method = 'Razorpay',
    payment_status = 'Paid',
    razorpay_order_id = coalesce(p_razorpay_order_id, razorpay_order_id),
    razorpay_payment_id = coalesce(p_razorpay_payment_id, razorpay_payment_id),
    razorpay_signature = coalesce(p_razorpay_signature, razorpay_signature),
    updated_at = now()
  where id = p_order_id;

  return found;
end;
$$;

-- Only service role / admins should call this in practice.
revoke all on function public.mark_order_paid_razorpay(uuid, text, text, text) from public;
grant execute on function public.mark_order_paid_razorpay(uuid, text, text, text)
  to service_role;
