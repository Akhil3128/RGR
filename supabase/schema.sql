-- ============================================================
--  Ranganayaki Godavari Ruchulu — Supabase Database Schema
-- ============================================================
--  How to use:
--  1. Open your Supabase project -> SQL Editor
--  2. Paste this entire file and click "Run"
--  3. It creates all tables, security rules, and the starting menu
--
--  Note on admin users: we do NOT need a separate admin_users
--  table. Supabase Auth manages admins — create the admin account
--  in the dashboard under Authentication -> Users -> Add user.
--  Any signed-in (authenticated) user is treated as an admin,
--  and only you create those accounts.
-- ============================================================


-- ─────────────────────────────────────────────
-- 1. PRODUCTS — everything on the menu
-- ─────────────────────────────────────────────
create table products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  size         text not null,               -- e.g. '250 gm', '1 Kg', '5 Pieces'
  category     text not null default 'Sweets',
  price        numeric(10, 2) not null,     -- selling price shown to customers
  net_rate     numeric(10, 2) not null default 0,  -- cost price (admin only)
  is_available boolean not null default true,
  sort_order   integer not null default 0,  -- controls display order on the menu
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 2. ORDERS — one row per customer order
-- ─────────────────────────────────────────────
create table orders (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  phone          text not null,
  delivery_type  text not null default 'delivery'
                 check (delivery_type in ('delivery', 'pickup')),
  address        text not null default '',
  notes          text not null default '',
  total_amount   numeric(10, 2) not null default 0,
  status         text not null default 'new'
                 check (status in ('new', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_status text not null default 'pending'
                 check (payment_status in ('pending', 'paid', 'partial')),
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 3. ORDER ITEMS — the products inside each order
-- ─────────────────────────────────────────────
-- Name, size and price are copied into this table so old orders
-- stay correct even if a product is renamed or its price changes.
create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders (id) on delete cascade,
  product_id   uuid references products (id) on delete set null,
  product_name text not null,
  size         text not null,
  price        numeric(10, 2) not null,     -- selling price at order time
  quantity     integer not null check (quantity > 0),
  line_total   numeric(10, 2) not null      -- price × quantity
);

-- ─────────────────────────────────────────────
-- 4. INVENTORY — one row per product
-- ─────────────────────────────────────────────
-- closing_stock is calculated automatically by the database:
-- Closing Stock = Opening Stock + Stock Received - Sales
create table inventory (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null unique references products (id) on delete cascade,
  opening_stock  integer not null default 0,
  stock_received integer not null default 0,
  sales          integer not null default 0,
  closing_stock  integer generated always as
                 (opening_stock + stock_received - sales) stored,
  updated_at     timestamptz not null default now()
);


-- ============================================================
--  ROW LEVEL SECURITY (RLS)
--  Customers (not logged in) can: view products, place orders.
--  Admins (logged in via Supabase Auth) can: manage everything.
-- ============================================================
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table inventory   enable row level security;

-- PRODUCTS: everyone can view, only admins can change
create policy "Anyone can view products"
  on products for select
  using (true);

create policy "Admins can manage products"
  on products for all
  to authenticated
  using (true)
  with check (true);

-- ORDERS: anyone can place an order, only admins can view/manage
create policy "Anyone can place an order"
  on orders for insert
  with check (true);

create policy "Admins can manage orders"
  on orders for all
  to authenticated
  using (true)
  with check (true);

-- ORDER ITEMS: anyone can add items while placing an order,
-- only admins can view/manage them afterwards
create policy "Anyone can add order items"
  on order_items for insert
  with check (true);

create policy "Admins can manage order items"
  on order_items for all
  to authenticated
  using (true)
  with check (true);

-- INVENTORY: admins only
create policy "Admins can manage inventory"
  on inventory for all
  to authenticated
  using (true)
  with check (true);


-- ============================================================
--  SEED DATA — the starting menu
--  (Plain Putharekulu price is a placeholder ₹150 —
--   edit it any time from the admin panel.)
-- ============================================================
insert into products (name, size, category, price, net_rate, sort_order) values
  ('Kova',                 '200 gm',   'Sweets', 140, 0, 1),
  ('Kova',                 '250 gm',   'Sweets', 175, 0, 2),
  ('Kova',                 '500 gm',   'Sweets', 350, 0, 3),
  ('Kova',                 '1 Kg',     'Sweets', 700, 0, 4),
  ('Sunnundalu',           '200 gm',   'Sweets', 140, 0, 5),
  ('Sunnundalu',           '250 gm',   'Sweets', 175, 0, 6),
  ('Sunnundalu',           '500 gm',   'Sweets', 350, 0, 7),
  ('Sunnundalu',           '1 Kg',     'Sweets', 700, 0, 8),
  ('Plain Putharekulu',    '5 Pieces', 'Sweets', 150, 0, 9),
  ('Dryfruit Putharekulu', '5 Pieces', 'Sweets', 200, 0, 10),
  ('Jantikalu Hot',        '200 gm',   'Snacks', 100, 0, 11),
  ('Boondhi Hot',          '200 gm',   'Snacks', 100, 0, 12),
  ('Paneer',               '250 gm',   'Dairy',  145, 0, 13),
  ('Paneer',               '500 gm',   'Dairy',  290, 0, 14),
  ('Paneer',               '1 Kg',     'Dairy',  580, 0, 15),
  ('Cow Ghee',             '1/2 Kg',   'Ghee',   390, 0, 16),
  ('Cow Ghee',             '1 Kg',     'Ghee',   780, 0, 17),
  ('Buffalo Ghee',         '1/2 Kg',   'Ghee',   390, 0, 18),
  ('Buffalo Ghee',         '1 Kg',     'Ghee',   780, 0, 19);

-- Create an empty inventory row for every product
insert into inventory (product_id)
select id from products;
