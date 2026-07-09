-- ============================================================================
-- FIX: Admin cannot see orders (run in Supabase SQL Editor)
-- ----------------------------------------------------------------------------
-- Cause: You can log in with Supabase Auth, but orders are only visible to
-- users listed in the admin_users table.
--
-- STEP 1 — Find your user UUID:
--   Supabase → Authentication → Users → click your email → copy "User UID"
--
-- STEP 2 — Run the INSERT below (replace UUID and email).
-- ============================================================================

-- Grant RPC so the app can verify admin status in the browser
grant execute on function public.is_admin() to authenticated, anon;

-- Make sure admin can SELECT orders (if you ran an older schema.sql)
drop policy if exists "orders manage by admin" on public.orders;
drop policy if exists "orders select by admin" on public.orders;
create policy "orders select by admin"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "orders update by admin" on public.orders;
create policy "orders update by admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_items manage by admin" on public.order_items;
drop policy if exists "order_items select by admin" on public.order_items;
create policy "order_items select by admin"
  on public.order_items for select
  using (public.is_admin());

-- ⬇️ REPLACE these two values with YOUR user UUID and email ⬇️
insert into public.admin_users (id, email)
values ('PASTE-YOUR-USER-UUID-HERE', 'akhilrekhapalli410@gmail.com')
on conflict (id) do update set email = excluded.email;

-- Verify: should return 1 row with your email
select * from public.admin_users;
