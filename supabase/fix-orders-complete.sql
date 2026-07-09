-- ============================================================================
-- FIX: Orders not saving / not showing after placing order
-- Run this entire file in Supabase → SQL Editor
-- ============================================================================
-- Uses one atomic function so order + items + inventory all succeed together,
-- or nothing is saved (no broken half-orders).
-- ============================================================================

-- 1. Permissions (safe to re-run)
grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert on public.order_items to anon, authenticated;
grant all on public.orders to authenticated;
grant all on public.order_items to authenticated;
grant all on public.inventory to authenticated;

drop policy if exists "orders insert by anyone" on public.orders;
create policy "orders insert by anyone"
  on public.orders for insert with check (true);

drop policy if exists "order_items insert by anyone" on public.order_items;
create policy "order_items insert by anyone"
  on public.order_items for insert with check (true);

-- 2. Remove old trigger (can block order_items insert if it errors)
drop trigger if exists trg_order_items_inventory_sale on public.order_items;

-- 3. Atomic place-order function (order + items + inventory in one go)
create or replace function public.place_order(
  p_order_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_order_type text,
  p_address text,
  p_notes text,
  p_total_amount numeric,
  p_items jsonb
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
    total_amount, status, payment_status
  ) values (
    p_order_id,
    p_customer_name,
    p_customer_phone,
    p_order_type,
    nullif(trim(coalesce(p_address, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''),
    p_total_amount,
    'New',
    'Pending'
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

    -- Update inventory sales (closing stock auto-calculates)
    if pid is not null then
      update public.inventory
      set sales = sales + qty
      where product_id = pid;

      if not found then
        insert into public.inventory (product_id, sales)
        values (pid, qty);
      end if;
    end if;
  end loop;

  return p_order_id;
end;
$$;

grant execute on function public.place_order(
  uuid, text, text, text, text, text, numeric, jsonb
) to anon, authenticated;

-- 4. Restore stock when order is cancelled
create or replace function public.revert_inventory_on_cancel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status and new.status = 'Cancelled' then
    update public.inventory i
    set sales = greatest(0, i.sales - oi.quantity)
    from public.order_items oi
    where oi.order_id = new.id
      and oi.product_id is not null
      and i.product_id = oi.product_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_orders_revert_inventory on public.orders;
create trigger trg_orders_revert_inventory
  after update of status on public.orders
  for each row
  execute function public.revert_inventory_on_cancel();

-- Done! Place a test order from the home page, then Admin → Orders → Refresh.
