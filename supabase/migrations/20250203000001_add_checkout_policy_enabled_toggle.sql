/*
  # Add Checkout Policy Enabled Toggle to Site Settings

  Allows admin to turn the checkout policy consent modal on or off without
  removing the message. When off, the modal is not shown at checkout.
*/

INSERT INTO site_settings (id, value, type, description)
VALUES
  ('checkout_policy_enabled', 'true', 'boolean', 'When on, the policy consent modal is shown at checkout when a message is set. When off, the modal is skipped.')
ON CONFLICT (id) DO NOTHING;
