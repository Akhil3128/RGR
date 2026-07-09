-- ============================================================
-- Ranganayaki Godavari Ruchulu — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  net_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Sweets',
  available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_option TEXT NOT NULL DEFAULT 'Pickup',
  address TEXT,
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'New',
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  line_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INVENTORY TABLE
-- Closing Stock = Opening Stock + Stock Received - Sales
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  opening_stock INTEGER NOT NULL DEFAULT 0,
  stock_received INTEGER NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  closing_stock INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Public can read available products (customer website)
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (available = true);

-- Authenticated admins can do everything on products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anyone can insert orders (customer placing order)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Admins can view and update all orders
CREATE POLICY "Admins can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anyone can insert order items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Admins can view order items
CREATE POLICY "Admins can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage inventory
CREATE POLICY "Admins can manage inventory"
  ON inventory FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- SEED DATA — Default Products
-- ============================================================
INSERT INTO products (name, size, price, net_rate, category, available) VALUES
  ('Kova', '200 gm', 140, 100, 'Sweets', true),
  ('Kova', '250 gm', 175, 125, 'Sweets', true),
  ('Kova', '500 gm', 350, 250, 'Sweets', true),
  ('Kova', '1 Kg', 700, 500, 'Sweets', true),
  ('Sunnundalu', '200 gm', 140, 100, 'Sweets', true),
  ('Sunnundalu', '250 gm', 175, 125, 'Sweets', true),
  ('Sunnundalu', '500 gm', 350, 250, 'Sweets', true),
  ('Sunnundalu', '1 Kg', 700, 500, 'Sweets', true),
  ('Plain Putharekulu', '5 Pieces', 150, 100, 'Sweets', true),
  ('Dryfruit Putharekulu', '5 Pieces', 200, 140, 'Sweets', true),
  ('Jantikalu Hot', '200 gm', 100, 70, 'Snacks', true),
  ('Boondhi Hot', '200 gm', 100, 70, 'Snacks', true),
  ('Paneer', '250 gm', 145, 100, 'Dairy', true),
  ('Paneer', '500 gm', 290, 200, 'Dairy', true),
  ('Paneer', '1 Kg', 580, 400, 'Dairy', true),
  ('Cow Ghee', '1/2 Kg', 390, 300, 'Ghee', true),
  ('Cow Ghee', '1 Kg', 780, 600, 'Ghee', true),
  ('Buffalo Ghee', '1/2 Kg', 390, 300, 'Ghee', true),
  ('Buffalo Ghee', '1 Kg', 780, 600, 'Ghee', true)
ON CONFLICT DO NOTHING;

-- Create inventory records for all products
INSERT INTO inventory (product_id, opening_stock, stock_received, sales, closing_stock)
SELECT id, 0, 0, 0, 0 FROM products
ON CONFLICT (product_id) DO NOTHING;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
