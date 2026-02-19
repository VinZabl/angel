-- Allow orders import when member_id references a non-existent member (e.g. from another DB).
-- Fix: ERROR 23503 insert or update on table "orders" violates foreign key constraint "orders_member_id_fkey"
-- Invalid member_id is set to NULL so the import succeeds and the order is unlinked from members.

CREATE OR REPLACE FUNCTION orders_null_invalid_member_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.member_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM members WHERE id = NEW.member_id) THEN
    NEW.member_id := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_null_invalid_member_id ON orders;
CREATE TRIGGER trg_orders_null_invalid_member_id
  BEFORE INSERT OR UPDATE OF member_id ON orders
  FOR EACH ROW
  EXECUTE FUNCTION orders_null_invalid_member_id();
