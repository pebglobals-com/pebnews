CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('reader','editor','admin')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color_hex TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  section_id TEXT NOT NULL REFERENCES sections(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  featured_image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft','scheduled','published')),
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS article_views (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  viewer_hash TEXT NOT NULL,
  viewed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rss_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS breaking_news_cache (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  link TEXT NOT NULL,
  pub_date TEXT,
  fetched_at TEXT DEFAULT (datetime('now'))
);
