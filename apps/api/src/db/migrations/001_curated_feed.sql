ALTER TABLE breaking_news_cache ADD COLUMN source_domain TEXT;
ALTER TABLE breaking_news_cache ADD COLUMN thumbnail_url TEXT;
ALTER TABLE breaking_news_cache ADD COLUMN featured INTEGER DEFAULT 0;
ALTER TABLE breaking_news_cache ADD COLUMN featured_at TEXT;
ALTER TABLE breaking_news_cache ADD COLUMN featured_by TEXT REFERENCES users(id);

ALTER TABLE articles ADD COLUMN is_breaking INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN origin_source_name TEXT;
ALTER TABLE articles ADD COLUMN origin_source_link TEXT;
