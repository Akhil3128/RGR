-- ============================================================
-- Ranganayaki Godavari Ruchulu — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  net_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT DEFAULT '',
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (payment_status IN ('Pending', 'Paid', 'Partial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_size TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  net_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inventory table (one row per product)
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  opening_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock_received NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sales NUMERIC(10, 2) NOT NULL DEFAULT 0,
  -- Closing stock is computed: opening_stock + stock_received - sales
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: track admin profiles linked to auth.users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS inventory_updated_at ON inventory;
CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read; only authenticated admins can write
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Orders: anyone can create (customer checkout); authenticated can read/update
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- Order items: anyone can insert; authenticated can read/update/delete
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can read order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (true);

-- Inventory: authenticated only
CREATE POLICY "Authenticated can read inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (true);

-- Admin users: authenticated can read own row
CREATE POLICY "Admins can read own profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================
-- Seed products (run after creating tables)
-- ============================================================

INSERT INTO products (name, size, price, net_rate, sort_order, is_available) VALUES
  ('Kova', '200 gm', 140, 100, 1, true),
  ('Kova', '250 gm', 175, 125, 2, true),
  ('Kova', '500 gm', 350, 250, 3, true),
  ('Kova', '1 Kg', 700, 500, 4, true),
  ('Sunnundalu', '200 gm', 140, 100, 5, true),
  ('Sunnundalu', '250 gm', 175, 125, 6, true),
  ('Sunnundalu', '500 gm', 350, 250, 7, true),
  ('Sunnundalu', '1 Kg', 700, 500, 8, true),
  ('Plain Putharekulu', '5 Pieces', 0, 0, 9, true),
  ('Dryfruit Putharekulu', '5 Pieces', 200, 140, 10, true),
  ('Jantikalu Hot', '200 gm', 100, 70, 11, true),
  ('Boondhi Hot', '200 gm', 100, 70, 12, true),
  ('Paneer', '250 gm', 145, 110, 13, true),
  ('Paneer', '500 gm', 290, 220, 14, true),
  ('Paneer', '1 Kg', 580, 440, 15, true),
  ('Cow Ghee', '1/2 Kg', 390, 320, 16, true),
  ('Cow Ghee', '1 Kg', 780, 640, 17, true),
  ('Buffalo Ghee', '1/2 Kg', 390, 320, 18, true),
  ('Buffalo Ghee', '1 Kg', 780, 640, 19, true);

-- Create inventory rows for each product
INSERT INTO inventory (product_id, opening_stock, stock_received, sales)
SELECT id, 0, 0, 0 FROM products
ON CONFLICT (product_id) DO NOTHING;

-- ============================================================
-- Admin setup instructions:
-- 1. Go to Authentication → Users → Add user
-- 2. Create a user with email + password (e.g. admin@ranganayaki.com)
-- 3. Optionally insert into admin_users:
--    INSERT INTO admin_users (id, email, full_name)
--    VALUES ('<auth-user-uuid>', 'admin@ranganayaki.com', 'Admin');
-- 4. Log in at /admin with that email and password
-- ============================================================
