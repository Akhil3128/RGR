-- ============================================================================
-- Ranganayaki Godavari Ruchulu — Supabase database schema
-- ----------------------------------------------------------------------------
-- HOW TO USE:
--   1. Open your Supabase project -> SQL Editor -> New query
--   2. Paste this entire file and click "Run"
--   3. Create an admin user (Authentication -> Users -> Add user)
--   4. Add that user's UUID to the admin_users table (see bottom of file)
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- admin_users : which auth users are allowed to manage the shop
-- ----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- Security-definer helper so RLS policies can check "is this an admin?"
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null default 'Sweets',
  size         text,
  price        numeric(10, 2) not null default 0,   -- selling price
  net_rate     numeric(10, 2) not null default 0,   -- cost price to the shop
  is_available boolean not null default true,
  image_url    text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  customer_phone text not null,
  order_type     text not null default 'delivery'
                   check (order_type in ('delivery', 'pickup')),
  address        text,
  notes          text,
  total_amount   numeric(10, 2) not null default 0,
  status         text not null default 'New'
                   check (status in ('New','Confirmed','Preparing','Ready','Delivered','Cancelled')),
  payment_status text not null default 'Pending'
                   check (payment_status in ('Pending','Paid','Partial')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- order_items  (denormalised so history survives product edits/deletes)
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  product_name text not null,
  size         text,
  unit_price   numeric(10, 2) not null default 0,
  quantity     integer not null default 1,
  line_total   numeric(10, 2) not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items (order_id);

-- ----------------------------------------------------------------------------
-- inventory  (closing_stock is auto-calculated)
-- ----------------------------------------------------------------------------
create table if not exists public.inventory (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid not null unique references public.products (id) on delete cascade,
  opening_stock       numeric(10, 2) not null default 0,
  stock_received      numeric(10, 2) not null default 0,
  sales               numeric(10, 2) not null default 0,
  -- Closing Stock = Opening Stock + Stock Received - Sales
  closing_stock       numeric(10, 2) generated always as
                        (opening_stock + stock_received - sales) stored,
  low_stock_threshold numeric(10, 2) not null default 5,
  updated_at          timestamptz not null default now()
);

drop trigger if exists trg_inventory_updated on public.inventory;
create trigger trg_inventory_updated
  before update on public.inventory
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security (RLS)
-- ----------------------------------------------------------------------------
-- products      : anyone can READ the menu; only admins can change it
-- orders/items  : anyone can PLACE an order (insert); only admins can read/manage
-- inventory     : admins only
-- admin_users   : admins only
-- ============================================================================

alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory   enable row level security;
alter table public.admin_users enable row level security;

-- ----- products -----
drop policy if exists "products read for all" on public.products;
create policy "products read for all"
  on public.products for select
  using (true);

drop policy if exists "products manage by admin" on public.products;
create policy "products manage by admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----- orders -----
drop policy if exists "orders insert by anyone" on public.orders;
create policy "orders insert by anyone"
  on public.orders for insert
  with check (true);

drop policy if exists "orders manage by admin" on public.orders;
create policy "orders manage by admin"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----- order_items -----
drop policy if exists "order_items insert by anyone" on public.order_items;
create policy "order_items insert by anyone"
  on public.order_items for insert
  with check (true);

drop policy if exists "order_items manage by admin" on public.order_items;
create policy "order_items manage by admin"
  on public.order_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----- inventory -----
drop policy if exists "inventory manage by admin" on public.inventory;
create policy "inventory manage by admin"
  on public.inventory for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----- admin_users -----
drop policy if exists "admin_users read by admin" on public.admin_users;
create policy "admin_users read by admin"
  on public.admin_users for select
  using (public.is_admin());

-- ============================================================================
-- Seed products (matches src/data/sampleProducts.js)
-- ============================================================================
insert into public.products (name, category, size, price, net_rate, is_available, sort_order) values
  ('Kova',                 'Sweets', '200 gm',   140, 95,  true, 1),
  ('Kova',                 'Sweets', '250 gm',   175, 118, true, 2),
  ('Kova',                 'Sweets', '500 gm',   350, 235, true, 3),
  ('Kova',                 'Sweets', '1 Kg',     700, 470, true, 4),
  ('Sunnundalu',           'Sweets', '200 gm',   140, 95,  true, 5),
  ('Sunnundalu',           'Sweets', '250 gm',   175, 118, true, 6),
  ('Sunnundalu',           'Sweets', '500 gm',   350, 235, true, 7),
  ('Sunnundalu',           'Sweets', '1 Kg',     700, 470, true, 8),
  ('Plain Putharekulu',    'Sweets', '5 Pieces', 150, 100, true, 9),   -- price editable from admin
  ('Dryfruit Putharekulu', 'Sweets', '5 Pieces', 200, 135, true, 10),
  ('Jantikalu Hot',        'Snacks', '200 gm',   100, 65,  true, 11),
  ('Boondhi Hot',          'Snacks', '200 gm',   100, 65,  true, 12),
  ('Paneer',               'Dairy',  '250 gm',   145, 100, true, 13),
  ('Paneer',               'Dairy',  '500 gm',   290, 200, true, 14),
  ('Paneer',               'Dairy',  '1 Kg',     580, 400, true, 15),
  ('Cow Ghee',             'Dairy',  '1/2 Kg',   390, 300, true, 16),
  ('Cow Ghee',             'Dairy',  '1 Kg',     780, 600, true, 17),
  ('Buffalo Ghee',         'Dairy',  '1/2 Kg',   390, 300, true, 18),
  ('Buffalo Ghee',         'Dairy',  '1 Kg',     780, 600, true, 19)
on conflict do nothing;

-- Create an empty inventory row for every product (safe to re-run).
insert into public.inventory (product_id)
select id from public.products
on conflict (product_id) do nothing;

-- ============================================================================
-- FINAL STEP — make yourself an admin
-- ----------------------------------------------------------------------------
-- 1. Go to Authentication -> Users -> "Add user" and create your admin email
--    + password (keep "Auto Confirm User" ON so you can log in immediately).
-- 2. Copy that user's UUID, then run (replacing the values):
--
--    insert into public.admin_users (id, email)
--    values ('PASTE-USER-UUID-HERE', 'admin@example.com');
--
-- Now you can log in at /admin/login and manage everything.
-- ============================================================================
