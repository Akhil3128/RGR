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

-- Let the app call is_admin() from the browser to verify admin access.
grant execute on function public.is_admin() to authenticated, anon;

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

-- Prevent duplicate products if seed SQL is run more than once
create unique index if not exists products_name_size_unique
  on public.products (name, coalesce(size, ''));

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
                   check (status in ('New','Confirmed','Preparing','Ready','Delivered','Completed','Cancelled')),
  payment_status text not null default 'Pending'
                   check (payment_status in ('Pending','Pending Verification','Paid','Partial','Failed')),
  payment_method text not null default 'Pay Later',
  inventory_updated boolean not null default false,
  delivered_at   timestamptz,
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

drop policy if exists "orders select by admin" on public.orders;
create policy "orders select by admin"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "orders update by admin" on public.orders;
create policy "orders update by admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders delete by admin" on public.orders;
create policy "orders delete by admin"
  on public.orders for delete
  using (public.is_admin());

-- ----- order_items -----
drop policy if exists "order_items insert by anyone" on public.order_items;
create policy "order_items insert by anyone"
  on public.order_items for insert
  with check (true);

drop policy if exists "order_items select by admin" on public.order_items;
create policy "order_items select by admin"
  on public.order_items for select
  using (public.is_admin());

drop policy if exists "order_items update by admin" on public.order_items;
create policy "order_items update by admin"
  on public.order_items for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_items delete by admin" on public.order_items;
create policy "order_items delete by admin"
  on public.order_items for delete
  using (public.is_admin());

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
-- Table permissions (required for website visitors to place orders)
-- ============================================================================
grant usage on schema public to anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert on public.order_items to anon, authenticated;

grant all on public.products to authenticated;
grant all on public.orders to authenticated;
grant all on public.order_items to authenticated;
grant all on public.inventory to authenticated;
grant all on public.admin_users to authenticated;

-- ============================================================================
-- place_order: save customer order (NO inventory change here)
-- Inventory is deducted later when admin marks Delivered / Completed.
-- ============================================================================
create or replace function public.place_order(
  p_order_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_order_type text,
  p_address text,
  p_notes text,
  p_total_amount numeric,
  p_items jsonb,
  p_payment_method text default 'Pay Later',
  p_payment_status text default 'Pending'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  pid uuid;
  qty integer;
begin
  if p_order_id is null then
    p_order_id := gen_random_uuid();
  end if;

  insert into public.orders (
    id, customer_name, customer_phone, order_type, address, notes,
    total_amount, status, payment_method, payment_status
  ) values (
    p_order_id,
    p_customer_name,
    p_customer_phone,
    p_order_type,
    nullif(trim(coalesce(p_address, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''),
    p_total_amount,
    'New',
    coalesce(nullif(trim(p_payment_method), ''), 'Pay Later'),
    coalesce(nullif(trim(p_payment_status), ''), 'Pending')
  );

  for item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    pid := case
      when item->>'product_id' is null or item->>'product_id' = '' then null
      else (item->>'product_id')::uuid
    end;
    qty := greatest(coalesce((item->>'quantity')::integer, 1), 1);

    insert into public.order_items (
      order_id, product_id, product_name, size, unit_price, quantity, line_total
    ) values (
      p_order_id,
      pid,
      coalesce(item->>'product_name', 'Item'),
      nullif(item->>'size', ''),
      coalesce((item->>'unit_price')::numeric, 0),
      qty,
      coalesce((item->>'line_total')::numeric, 0)
    );
  end loop;

  return p_order_id;
end;
$$;

grant execute on function public.place_order(
  uuid, text, text, text, text, text, numeric, jsonb, text, text
) to anon, authenticated;

-- ============================================================================
-- admin_update_order_status: update status + deduct inventory on delivery
-- ----------------------------------------------------------------------------
-- Deducts inventory ONCE when status becomes Delivered or Completed.
-- Restores inventory if a deducted order is Cancelled.
-- ============================================================================
create or replace function public.admin_update_order_status(
  p_order_id uuid,
  p_new_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  ord record;
  item record;
  inv record;
  closing numeric;
  warnings text[] := '{}';
  should_deduct boolean;
  should_revert boolean;
begin
  if not public.is_admin() then
    return jsonb_build_object('success', false, 'message', 'Not authorized');
  end if;

  select * into ord from public.orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('success', false, 'message', 'Order not found');
  end if;

  should_deduct := p_new_status in ('Delivered', 'Completed')
    and not coalesce(ord.inventory_updated, false);

  should_revert := p_new_status = 'Cancelled'
    and coalesce(ord.inventory_updated, false);

  if should_deduct then
    for item in select * from public.order_items where order_id = p_order_id
    loop
      if item.product_id is not null then
        select * into inv from public.inventory where product_id = item.product_id;
        if found then
          closing := inv.opening_stock + inv.stock_received - inv.sales;
          if closing < item.quantity then
            warnings := array_append(
              warnings,
              format('%s (%s): only %s in stock, deducting %s',
                item.product_name, coalesce(item.size, ''), closing, item.quantity)
            );
          end if;
          update public.inventory
          set sales = sales + item.quantity
          where product_id = item.product_id;
        else
          insert into public.inventory (product_id, sales)
          values (item.product_id, item.quantity);
          warnings := array_append(
            warnings,
            format('%s: inventory row created, sales set to %s', item.product_name, item.quantity)
          );
        end if;
      else
        warnings := array_append(
          warnings,
          format('%s: no product link — inventory not updated', item.product_name)
        );
      end if;
    end loop;

    update public.orders
    set status = p_new_status,
        inventory_updated = true,
        delivered_at = coalesce(delivered_at, now())
    where id = p_order_id;

    return jsonb_build_object(
      'success', true,
      'message', 'Inventory updated successfully',
      'inventory_deducted', true,
      'warnings', to_jsonb(warnings)
    );
  end if;

  if should_revert then
    for item in select * from public.order_items where order_id = p_order_id
    loop
      if item.product_id is not null then
        update public.inventory
        set sales = greatest(0, sales - item.quantity)
        where product_id = item.product_id;
      end if;
    end loop;

    update public.orders
    set status = p_new_status,
        inventory_updated = false,
        delivered_at = null
    where id = p_order_id;

    return jsonb_build_object(
      'success', true,
      'message', 'Order cancelled — inventory restored',
      'inventory_deducted', false,
      'warnings', '[]'::jsonb
    );
  end if;

  -- Normal status change (no inventory change).
  update public.orders
  set status = p_new_status,
      delivered_at = case
        when p_new_status in ('Delivered', 'Completed') then coalesce(delivered_at, now())
        else delivered_at
      end
  where id = p_order_id;

  return jsonb_build_object(
    'success', true,
    'message', 'Order status updated',
    'inventory_deducted', false,
    'warnings', '[]'::jsonb
  );
end;
$$;

grant execute on function public.admin_update_order_status(uuid, text) to authenticated;

-- ============================================================================
-- Seed products (matches src/data/sampleProducts.js)
-- ============================================================================
insert into public.products (name, category, size, price, net_rate, is_available, sort_order)
select v.name, v.category, v.size, v.price, v.net_rate, v.is_available, v.sort_order
from (values
  ('Kova',                 'Sweets', '200 gm',   140::numeric, 95::numeric,  true, 1),
  ('Kova',                 'Sweets', '250 gm',   175::numeric, 118::numeric, true, 2),
  ('Kova',                 'Sweets', '500 gm',   350::numeric, 235::numeric, true, 3),
  ('Kova',                 'Sweets', '1 Kg',     700::numeric, 470::numeric, true, 4),
  ('Sunnundalu',           'Sweets', '200 gm',   140::numeric, 95::numeric,  true, 5),
  ('Sunnundalu',           'Sweets', '250 gm',   175::numeric, 118::numeric, true, 6),
  ('Sunnundalu',           'Sweets', '500 gm',   350::numeric, 235::numeric, true, 7),
  ('Sunnundalu',           'Sweets', '1 Kg',     700::numeric, 470::numeric, true, 8),
  ('Plain Putharekulu',    'Sweets', '5 Pieces', 150::numeric, 100::numeric, true, 9),
  ('Dryfruit Putharekulu', 'Sweets', '5 Pieces', 200::numeric, 135::numeric, true, 10),
  ('Jantikalu Hot',        'Snacks', '200 gm',   100::numeric, 65::numeric,  true, 11),
  ('Boondhi Hot',          'Snacks', '200 gm',   100::numeric, 65::numeric,  true, 12),
  ('Paneer',               'Dairy',  '250 gm',   145::numeric, 100::numeric, true, 13),
  ('Paneer',               'Dairy',  '500 gm',   290::numeric, 200::numeric, true, 14),
  ('Paneer',               'Dairy',  '1 Kg',     580::numeric, 400::numeric, true, 15),
  ('Cow Ghee',             'Dairy',  '1/2 Kg',   390::numeric, 300::numeric, true, 16),
  ('Cow Ghee',             'Dairy',  '1 Kg',     780::numeric, 600::numeric, true, 17),
  ('Buffalo Ghee',         'Dairy',  '1/2 Kg',   390::numeric, 300::numeric, true, 18),
  ('Buffalo Ghee',         'Dairy',  '1 Kg',     780::numeric, 600::numeric, true, 19)
) as v(name, category, size, price, net_rate, is_available, sort_order)
where not exists (
  select 1 from public.products p
  where p.name = v.name and coalesce(p.size, '') = coalesce(v.size, '')
);

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
