-- ============================================================================
-- MIGRATION: Inventory deducts only on Delivered / Completed
-- Run this in Supabase → SQL Editor (safe for existing projects)
-- ============================================================================

-- 1. New columns on orders
alter table public.orders
  add column if not exists inventory_updated boolean not null default false;

alter table public.orders
  add column if not exists delivered_at timestamptz;

-- 2. Allow "Completed" status
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('New','Confirmed','Preparing','Ready','Delivered','Completed','Cancelled'));

-- 3. place_order: save order only (remove inventory deduction on checkout)
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
  end loop;

  return p_order_id;
end;
$$;

grant execute on function public.place_order(
  uuid, text, text, text, text, text, numeric, jsonb
) to anon, authenticated;

-- 4. Remove old cancel trigger (handled by admin_update_order_status now)
drop trigger if exists trg_orders_revert_inventory on public.orders;
drop trigger if exists trg_order_items_inventory_sale on public.order_items;

-- 5. Admin status update with one-time inventory deduction
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

-- Done! Mark an order as Delivered in Admin → Orders to test inventory.
