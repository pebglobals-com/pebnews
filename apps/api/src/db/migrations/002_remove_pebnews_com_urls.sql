-- Migration 002: Remove pebnews.com image URL references from seeded data
-- The Editorial demo article's featured_image_url still pointed to the old domain.

UPDATE articles
SET featured_image_url = 'https://pub-d791492f7b1d413491ca62d7ac29e1d3.r2.dev/amaseikumor-festival.jpg'
WHERE featured_image_url = 'https://pebnews.com/storage/PEBNEWSFB_IMG_1776195349084.jpg';

-- Verify
SELECT id, title, featured_image_url FROM articles WHERE featured_image_url LIKE '%pebnews.com%';
