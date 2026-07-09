-- ============================================================================
-- Ranganayaki Godavari Ruchulu — Supabase database schema
-- ============================================================================
-- How to use:
--   1. Open your Supabase project -> SQL Editor -> New Query.
--   2. Paste this whole file and click "Run".
--   3. Then follow the "ADMIN USER SETUP" instructions at the bottom of this
--      file (and in the README) to create your first admin login.
--
-- This script is safe to re-run: it uses "create table if not exists" and
-- "drop policy if exists" so you can run it again if you tweak something.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'Sweets',
  name text not null,
  size text not null,
  price numeric(10, 2),                 -- selling price shown to customers. NULL = "price on request"
  net_rate numeric(10, 2) not null default 0, -- cost price, used for profit calculations (admin only)
  is_available boolean not null default true,
  low_stock_threshold numeric(10, 2) not null default 5,
  sort_order integer not null default 0,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Menu items sold by Ranganayaki Godavari Ruchulu.';
comment on column public.products.price is 'Selling price shown to customers. NULL means "price on request" (used for Plain Putharekulu until admin sets a price).';
comment on column public.products.net_rate is 'Cost / net rate per unit. Never exposed to the public website, only used in the admin dashboard for profit calculations.';

-- ----------------------------------------------------------------------------
-- 2. ORDERS
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  fulfillment_type text not null check (fulfillment_type in ('pickup', 'delivery')),
  address text,
  notes text,
  status text not null default 'New'
    check (status in ('New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
  payment_status text not null default 'Pending'
    check (payment_status in ('Pending', 'Paid', 'Partial')),
  total_amount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.orders is 'Pre-orders placed from the customer website.';

-- ----------------------------------------------------------------------------
-- 3. ORDER ITEMS
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,   -- snapshot, in case the product is renamed/deleted later
  size text not null,           -- snapshot
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null default 0, -- snapshot of selling price at order time
  line_total numeric(10, 2) generated always as (quantity * unit_price) stored
);

comment on table public.order_items is 'Line items for each order. Sales Amount = quantity x unit_price (line_total).';

-- ----------------------------------------------------------------------------
-- 4. INVENTORY
-- ----------------------------------------------------------------------------
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  date date not null default current_date,
  opening_stock numeric(10, 2) not null default 0,
  stock_received numeric(10, 2) not null default 0,
  sales numeric(10, 2) not null default 0,
  closing_stock numeric(10, 2) generated always as (opening_stock + stock_received - sales) stored,
  updated_at timestamptz not null default now(),
  unique (product_id, date)
);

comment on table public.inventory is 'Daily stock ledger per product. Closing Stock = Opening Stock + Stock Received - Sales.';

-- A convenience view that returns only the latest inventory row per product,
-- used by the admin dashboard for the "Low Stock Items" card.
create or replace view public.latest_inventory as
select distinct on (product_id)
  product_id, date, opening_stock, stock_received, sales, closing_stock, updated_at
from public.inventory
order by product_id, date desc;

-- ----------------------------------------------------------------------------
-- 5. ADMIN USERS
-- ----------------------------------------------------------------------------
-- Supabase Auth already stores login credentials in auth.users. This table
-- simply marks which of those authenticated users are allowed to use the
-- admin panel (so a random signed-up user can't access it).
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Whitelist of auth.users allowed to access the admin panel.';

-- ----------------------------------------------------------------------------
-- Helpful indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);
create index if not exists idx_inventory_product_id on public.inventory (product_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Rules used below:
--  - Anyone (including logged-out visitors) can browse products and place
--    an order (insert into orders/order_items) — this powers the public site.
--  - Only users listed in admin_users can view/manage orders, edit products,
--    or manage inventory — this powers the admin panel.

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory enable row level security;
alter table public.admin_users enable row level security;

-- A small helper used by every "admin only" policy below.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ---- products ----
drop policy if exists "Public can view products" on public.products;
create policy "Public can view products"
  on public.products for select
  using (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---- orders ----
drop policy if exists "Anyone can place an order" on public.orders;
create policy "Anyone can place an order"
  on public.orders for insert
  with check (true);

drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete
  using (public.is_admin());

-- ---- order_items ----
drop policy if exists "Anyone can add order items" on public.order_items;
create policy "Anyone can add order items"
  on public.order_items for insert
  with check (true);

drop policy if exists "Admins can view order items" on public.order_items;
create policy "Admins can view order items"
  on public.order_items for select
  using (public.is_admin());

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
  on public.order_items for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete order items" on public.order_items;
create policy "Admins can delete order items"
  on public.order_items for delete
  using (public.is_admin());

-- ---- inventory ----
drop policy if exists "Admins can manage inventory" on public.inventory;
create policy "Admins can manage inventory"
  on public.inventory for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---- admin_users ----
drop policy if exists "Admins can view admin list" on public.admin_users;
create policy "Admins can view admin list"
  on public.admin_users for select
  using (public.is_admin() or user_id = auth.uid());

-- Only existing admins can add/remove other admins. If this is the very
-- first admin, add the row manually from the SQL editor (see instructions
-- below) — that always works because it runs with superuser rights.
drop policy if exists "Admins can manage admin list" on public.admin_users;
create policy "Admins can manage admin list"
  on public.admin_users for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- SEED DATA — the current product menu
-- ============================================================================
insert into public.products (category, name, size, price, net_rate, sort_order)
values
  ('Sweets', 'Kova', '200 gm', 140, 0, 1),
  ('Sweets', 'Kova', '250 gm', 175, 0, 2),
  ('Sweets', 'Kova', '500 gm', 350, 0, 3),
  ('Sweets', 'Kova', '1 Kg', 700, 0, 4),
  ('Sweets', 'Sunnundalu', '200 gm', 140, 0, 5),
  ('Sweets', 'Sunnundalu', '250 gm', 175, 0, 6),
  ('Sweets', 'Sunnundalu', '500 gm', 350, 0, 7),
  ('Sweets', 'Sunnundalu', '1 Kg', 700, 0, 8),
  ('Sweets', 'Plain Putharekulu', '5 Pieces', null, 0, 9),
  ('Sweets', 'Dryfruit Putharekulu', '5 Pieces', 200, 0, 10),
  ('Snacks', 'Jantikalu Hot', '200 gm', 100, 0, 11),
  ('Snacks', 'Boondhi Hot', '200 gm', 100, 0, 12),
  ('Dairy & Ghee', 'Paneer', '250 gm', 145, 0, 13),
  ('Dairy & Ghee', 'Paneer', '500 gm', 290, 0, 14),
  ('Dairy & Ghee', 'Paneer', '1 Kg', 580, 0, 15),
  ('Dairy & Ghee', 'Cow Ghee', '1/2 Kg', 390, 0, 16),
  ('Dairy & Ghee', 'Cow Ghee', '1 Kg', 780, 0, 17),
  ('Dairy & Ghee', 'Buffalo Ghee', '1/2 Kg', 390, 0, 18),
  ('Dairy & Ghee', 'Buffalo Ghee', '1 Kg', 780, 0, 19)
on conflict do nothing;

-- ============================================================================
-- ADMIN USER SETUP (do this after running the script above)
-- ============================================================================
-- 1. In the Supabase Dashboard, go to Authentication -> Users -> Add User,
--    and create a user with your admin email + password.
-- 2. Copy that user's UID (shown in the Users table).
-- 3. Run the query below in the SQL Editor, replacing the UID and name:
--
--   insert into public.admin_users (user_id, full_name)
--   values ('PASTE-USER-UID-HERE', 'Admin Name');
--
-- 4. You can now log in at /admin/login on the website with that email
--    and password.
-- ============================================================================
