-- ============================================================================
-- FIX: Inventory does not change after placing an order
-- Run this in Supabase → SQL Editor
-- ============================================================================
-- This adds automatic inventory updates:
--   • When a customer orders → Sales increases → Closing stock goes down
--   • When admin cancels an order → Sales decreases → stock is restored
-- ============================================================================

create or replace function public.apply_inventory_sale()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.product_id is not null then
    update public.inventory
    set sales = sales + new.quantity
    where product_id = new.product_id;

    if not found then
      insert into public.inventory (product_id, sales)
      values (new.product_id, new.quantity);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_order_items_inventory_sale on public.order_items;
create trigger trg_order_items_inventory_sale
  after insert on public.order_items
  for each row
  execute function public.apply_inventory_sale();

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

-- Done! Place a new test order from the website, then check Admin → Inventory.
