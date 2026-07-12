INSERT INTO sections (id, name, slug, color_hex) VALUES
  ('sec_politics', 'Politics', 'politics', '#dc2626'),
  ('sec_metro', 'Metro', 'metro', '#2563eb'),
  ('sec_sports', 'Sports', 'sports', '#16a34a'),
  ('sec_editorial', 'Editorial', 'editorial', '#9333ea'),
  ('sec_business', 'Business', 'business', '#d97706')
ON CONFLICT (id) DO NOTHING;
