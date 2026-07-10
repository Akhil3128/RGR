-- ============================================================================
-- MIGRATION: UPI payment + payment_method column
-- Run in Supabase → SQL Editor
-- ============================================================================

-- 1. Add payment_method column
alter table public.orders
  add column if not exists payment_method text not null default 'Pay Later';

-- 2. Expand payment_status options
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check
  check (payment_status in (
    'Pending', 'Pending Verification', 'Paid', 'Partial', 'Failed'
  ));

-- 3. Update place_order to accept payment fields
drop function if exists public.place_order(uuid, text, text, text, text, text, numeric, jsonb);

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

-- Done! Set VITE_UPI_ID in your .env and test UPI orders.
