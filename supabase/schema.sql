-- Ranganayaki Godavari Ruchulu - Supabase SQL Schema
-- Run this entire file in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Helpful helper function for role checks
create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text not null,
  selling_price numeric(10,2) not null check (selling_price >= 0),
  net_rate numeric(10,2) not null default 0 check (net_rate >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  fulfillment_type text not null check (fulfillment_type in ('Delivery', 'Pickup')),
  address text,
  notes text,
  total_amount numeric(10,2) not null default 0,
  order_status text not null default 'New'
    check (order_status in ('New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
  payment_status text not null default 'Pending'
    check (payment_status in ('Pending', 'Paid', 'Partial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_size text not null,
  quantity integer not null check (quantity > 0),
  selling_price numeric(10,2) not null check (selling_price >= 0),
  net_rate numeric(10,2) not null default 0 check (net_rate >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  opening_stock integer not null default 0 check (opening_stock >= 0),
  stock_received integer not null default 0 check (stock_received >= 0),
  sales integer not null default 0 check (sales >= 0),
  closing_stock integer generated always as (opening_stock + stock_received - sales) stored,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_name on public.products(name);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_inventory_product_id on public.inventory(product_id);

-- Optional trigger helper for updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

-- Row level security
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory enable row level security;
alter table public.admin_users enable row level security;

-- Public can view available products
drop policy if exists "public read products" on public.products;
create policy "public read products"
on public.products
for select
to anon, authenticated
using (true);

-- Only admins can insert/update/delete products
drop policy if exists "admin manage products" on public.products;
create policy "admin manage products"
on public.products
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Public can place orders
drop policy if exists "public create orders" on public.orders;
create policy "public create orders"
on public.orders
for insert
to anon, authenticated
with check (true);

-- Admin can view + update orders
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders"
on public.orders
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders"
on public.orders
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Public can add order items for created orders
drop policy if exists "public create order items" on public.order_items;
create policy "public create order items"
on public.order_items
for insert
to anon, authenticated
with check (true);

-- Admin can read order items
drop policy if exists "admin read order items" on public.order_items;
create policy "admin read order items"
on public.order_items
for select
to authenticated
using (public.is_admin_user());

-- Admin inventory management
drop policy if exists "admin manage inventory" on public.inventory;
create policy "admin manage inventory"
on public.inventory
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Admin users table only visible to admins
drop policy if exists "admin read admin users" on public.admin_users;
create policy "admin read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin manage admin users" on public.admin_users;
create policy "admin manage admin users"
on public.admin_users
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Seed products (safe to run repeatedly)
insert into public.products (name, size, selling_price, net_rate, is_available)
values
  ('Kova', '200 gm', 140, 110, true),
  ('Kova', '250 gm', 175, 138, true),
  ('Kova', '500 gm', 350, 275, true),
  ('Kova', '1 Kg', 700, 550, true),
  ('Sunnundalu', '200 gm', 140, 110, true),
  ('Sunnundalu', '250 gm', 175, 138, true),
  ('Sunnundalu', '500 gm', 350, 275, true),
  ('Sunnundalu', '1 Kg', 700, 550, true),
  -- Plain Putharekulu price is editable by admin
  ('Plain Putharekulu', '5 Pieces', 150, 120, true),
  ('Dryfruit Putharekulu', '5 Pieces', 200, 160, true),
  ('Jantikalu Hot', '200 gm', 100, 75, true),
  ('Boondhi Hot', '200 gm', 100, 75, true),
  ('Paneer', '250 gm', 145, 120, true),
  ('Paneer', '500 gm', 290, 240, true),
  ('Paneer', '1 Kg', 580, 480, true),
  ('Cow Ghee', '1/2 Kg', 390, 335, true),
  ('Cow Ghee', '1 Kg', 780, 670, true),
  ('Buffalo Ghee', '1/2 Kg', 390, 335, true),
  ('Buffalo Ghee', '1 Kg', 780, 670, true)
on conflict do nothing;
