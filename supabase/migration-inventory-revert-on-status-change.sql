-- ============================================================================
-- FIX: Restore inventory when order status changes away from Delivered/Completed
-- Run in Supabase → SQL Editor
-- ============================================================================
-- Before: inventory only restored when status = Cancelled.
-- Now:    inventory restores for ANY status change away from Delivered/Completed
--         if stock was already deducted (e.g. mistaken change back to New).
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
  was_delivered boolean;
begin
  if not public.is_admin() then
    return jsonb_build_object('success', false, 'message', 'Not authorized');
  end if;

  select * into ord from public.orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('success', false, 'message', 'Order not found');
  end if;

  was_delivered := ord.status in ('Delivered', 'Completed');

  should_deduct := p_new_status in ('Delivered', 'Completed')
    and not coalesce(ord.inventory_updated, false);

  should_revert := coalesce(ord.inventory_updated, false)
    and p_new_status not in ('Delivered', 'Completed');

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
        end if;
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
      'inventory_reverted', false,
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
      'message', 'Inventory restored — stock returned',
      'inventory_deducted', false,
      'inventory_reverted', true,
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
    'inventory_reverted', false,
    'warnings', '[]'::jsonb
  );
end;
$$;

grant execute on function public.admin_update_order_status(uuid, text) to authenticated;
