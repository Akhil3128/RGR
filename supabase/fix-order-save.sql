-- ============================================================================
-- FIX: Orders table stays at 0 rows (run in Supabase SQL Editor)
-- ----------------------------------------------------------------------------
-- Your screenshot shows orders = 0 and order_items = 0.
-- This usually means the website could not INSERT orders (permissions).
-- Run this entire file, then place a fresh test order from the home page.
-- ============================================================================

-- 1. Ensure anon (website visitors) can insert orders
grant usage on schema public to anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert on public.order_items to anon, authenticated;

grant all on public.orders to authenticated;
grant all on public.order_items to authenticated;

-- 2. Ensure insert policies exist
drop policy if exists "orders insert by anyone" on public.orders;
create policy "orders insert by anyone"
  on public.orders for insert
  with check (true);

drop policy if exists "order_items insert by anyone" on public.order_items;
create policy "order_items insert by anyone"
  on public.order_items for insert
  with check (true);

-- 3. Quick test insert (proves database accepts orders)
insert into public.orders (
  customer_name, customer_phone, order_type, total_amount, status, payment_status
) values (
  'Test Customer', '9999999999', 'pickup', 140, 'New', 'Pending'
);

-- You should now see 1 row in the orders table.
-- Delete the test row after confirming:
-- delete from public.orders where customer_phone = '9999999999';
