-- Update site name and description to new branding
UPDATE site_settings
SET value = 'hatredtopup'
WHERE id = 'site_name';

-- Clear site description per new requirements
UPDATE site_settings
SET value = ''
WHERE id = 'site_description';
