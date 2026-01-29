/*
  # Add Checkout Policy / Consent Message to Site Settings

  Adds configurable consent message shown on Top Up (checkout) page.
  Admin can set the message in Site Settings. When set, a modal appears
  before checkout; user must Accept to proceed or Reject to go back to cart.
*/

INSERT INTO site_settings (id, value, type, description)
VALUES
  ('checkout_policy_message', '', 'text', 'Consent / policy message shown on Top Up page before checkout. Leave blank to skip the policy modal.')
ON CONFLICT (id) DO NOTHING;
