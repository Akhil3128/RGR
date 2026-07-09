-- ============================================================================
-- FIX: Duplicate products on customer website
-- Run in Supabase → SQL Editor
-- ============================================================================
-- Cause: schema.sql was run more than once. Each run inserted 19 products again
-- because there was no unique rule on name + size.
-- ============================================================================

-- 1. Remove inventory rows linked to duplicate products
WITH keepers AS (
  SELECT DISTINCT ON (name, coalesce(size, ''))
    id
  FROM public.products
  ORDER BY name, coalesce(size, ''), created_at ASC
)
DELETE FROM public.inventory
WHERE product_id IN (
  SELECT id FROM public.products WHERE id NOT IN (SELECT id FROM keepers)
);

-- 2. Delete duplicate products (keep the oldest row per name + size)
WITH keepers AS (
  SELECT DISTINCT ON (name, coalesce(size, ''))
    id
  FROM public.products
  ORDER BY name, coalesce(size, ''), created_at ASC
)
DELETE FROM public.products
WHERE id NOT IN (SELECT id FROM keepers);

-- 3. Prevent duplicates in future
CREATE UNIQUE INDEX IF NOT EXISTS products_name_size_unique
  ON public.products (name, coalesce(size, ''));

-- 4. Ensure every product has an inventory row
INSERT INTO public.inventory (product_id)
SELECT id FROM public.products
ON CONFLICT (product_id) DO NOTHING;

-- Done! Refresh the customer website — you should see 19 products only.
