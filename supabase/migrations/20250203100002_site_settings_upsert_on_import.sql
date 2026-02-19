-- Make site_settings CSV import upsert: if id already exists, update the row instead of failing.
-- Fix: ERROR 23505 duplicate key value violates unique constraint 'site_settings_pkey'

CREATE OR REPLACE FUNCTION site_settings_upsert_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM site_settings WHERE id = NEW.id) THEN
    UPDATE site_settings
    SET value = NEW.value, type = NEW.type, description = NEW.description, updated_at = now()
    WHERE id = NEW.id;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_site_settings_upsert_on_insert ON site_settings;
CREATE TRIGGER trg_site_settings_upsert_on_insert
  BEFORE INSERT ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION site_settings_upsert_on_insert();
