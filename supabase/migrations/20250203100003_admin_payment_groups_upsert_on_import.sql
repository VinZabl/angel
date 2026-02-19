-- Make admin_payment_groups CSV import upsert by admin_name: update existing row instead of failing.
-- Fix: ERROR 23505 duplicate key value violates unique constraint "admin_payment_groups_admin_name_key"

CREATE OR REPLACE FUNCTION admin_payment_groups_upsert_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_payment_groups WHERE admin_name = NEW.admin_name) THEN
    UPDATE admin_payment_groups
    SET is_active = NEW.is_active, updated_at = now()
    WHERE admin_name = NEW.admin_name;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_payment_groups_upsert_on_insert ON admin_payment_groups;
CREATE TRIGGER trg_admin_payment_groups_upsert_on_insert
  BEFORE INSERT ON admin_payment_groups
  FOR EACH ROW
  EXECUTE FUNCTION admin_payment_groups_upsert_on_insert();
