-- Ranganayaki Godavari Ruchulu Supabase schema
-- Run this file in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text not null,
  price numeric(10, 2),
  net_rate numeric(10, 2) not null default 0,
  available boolean not null default true,
  image_url text,
  display_order integer not null default 99,
  low_stock_threshold numeric(10, 2) not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  fulfillment_type text not null check (fulfillment_type in ('Pickup', 'Delivery')),
  address text,
  notes text,
  total_amount numeric(10, 2) not null default 0,
  status text not null default 'New' check (status in ('New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Partial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text not null,
  quantity numeric(10, 2) not null default 1,
  selling_price numeric(10, 2) not null default 0,
  net_rate numeric(10, 2) not null default 0,
  line_total numeric(10, 2) generated always as (quantity * selling_price) stored,
  cost_total numeric(10, 2) generated always as (quantity * net_rate) stored,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  opening_stock numeric(10, 2) not null default 0,
  stock_received numeric(10, 2) not null default 0,
  sales numeric(10, 2) not null default 0,
  closing_stock numeric(10, 2) generated always as (opening_stock + stock_received - sales) stored,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists inventory_set_updated_at on public.inventory;
create trigger inventory_set_updated_at
before update on public.inventory
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Anyone can read available products" on public.products;
create policy "Anyone can read available products"
on public.products for select
using (available = true or exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders for insert
with check (true);

drop policy if exists "Admins can read and update orders" on public.orders;
create policy "Admins can read and update orders"
on public.orders for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items"
on public.order_items for insert
with check (true);

drop policy if exists "Admins can read order items" on public.order_items;
create policy "Admins can read order items"
on public.order_items for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can manage inventory" on public.inventory;
create policy "Admins can manage inventory"
on public.inventory for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Users can read own admin profile" on public.admin_users;
create policy "Users can read own admin profile"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

insert into public.products (name, size, price, net_rate, available, display_order) values
  ('Kova', '200 gm', 140, 0, true, 1),
  ('Kova', '250 gm', 175, 0, true, 2),
  ('Kova', '500 gm', 350, 0, true, 3),
  ('Kova', '1 Kg', 700, 0, true, 4),
  ('Sunnundalu', '200 gm', 140, 0, true, 5),
  ('Sunnundalu', '250 gm', 175, 0, true, 6),
  ('Sunnundalu', '500 gm', 350, 0, true, 7),
  ('Sunnundalu', '1 Kg', 700, 0, true, 8),
  ('Plain Putharekulu', '5 Pieces', null, 0, true, 9),
  ('Dryfruit Putharekulu', '5 Pieces', 200, 0, true, 10),
  ('Jantikalu Hot', '200 gm', 100, 0, true, 11),
  ('Boondhi Hot', '200 gm', 100, 0, true, 12),
  ('Paneer', '250 gm', 145, 0, true, 13),
  ('Paneer', '500 gm', 290, 0, true, 14),
  ('Paneer', '1 Kg', 580, 0, true, 15),
  ('Cow Ghee', '1/2 Kg', 390, 0, true, 16),
  ('Cow Ghee', '1 Kg', 780, 0, true, 17),
  ('Buffalo Ghee', '1/2 Kg', 390, 0, true, 18),
  ('Buffalo Ghee', '1 Kg', 780, 0, true, 19)
on conflict do nothing;

insert into public.inventory (product_id)
select id from public.products
on conflict (product_id) do nothing;

-- After creating an admin user in Supabase Auth, register that user:
-- insert into public.admin_users (user_id, email)
-- values ('AUTH_USER_UUID_HERE', 'admin@example.com');
