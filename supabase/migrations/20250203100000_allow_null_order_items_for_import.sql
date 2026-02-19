-- Allow null order_items for CSV import; default and coalesce to [] so app always gets an array.
-- Fix: ERROR 23502 null value in column "order_items" of relation "orders" violates not-null constraint

ALTER TABLE orders
  ALTER COLUMN order_items DROP NOT NULL,
  ALTER COLUMN order_items SET DEFAULT '[]'::jsonb;

UPDATE orders
SET order_items = '[]'::jsonb
WHERE order_items IS NULL;

-- Ensure any future insert/update with null stores [] instead
CREATE OR REPLACE FUNCTION orders_coalesce_order_items()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.order_items := COALESCE(NEW.order_items, '[]'::jsonb);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_coalesce_order_items ON orders;
CREATE TRIGGER trg_orders_coalesce_order_items
  BEFORE INSERT OR UPDATE OF order_items ON orders
  FOR EACH ROW
  EXECUTE FUNCTION orders_coalesce_order_items();
