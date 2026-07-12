function extractDomain(url: string): string {
  try { return new URL(url).hostname } catch { return '' }
}

function extractThumbnail(xml: string): string | null {
  const mediaMatch = /<media:thumbnail[^>]*url="([^"]+)"/i.exec(xml)
  if (mediaMatch) return mediaMatch[1]
  const enclosureMatch = /<enclosure[^>]*url="([^"]+)"[^>]*type="image/i.exec(xml)
  if (enclosureMatch) return enclosureMatch[1]
  const contentMatch = /<media:content[^>]*url="([^"]+)"[^>]*medium="image/i.exec(xml)
  if (contentMatch) return contentMatch[1]
  return null
}

function extractItemsFromXml(xml: string, sourceName: string, feedUrl: string): any[] {
  const items: any[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1]
    const titleMatch = /<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title[^>]*>([\s\S]*?)<\/title>/i.exec(content)
    const linkMatch = /<link[^>]*>([\s\S]*?)<\/link>/i.exec(content)
    const dateMatch = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>|<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i.exec(content)

    const headline = titleMatch?.[1] || titleMatch?.[2] || ''
    const link = linkMatch?.[1] || ''
    const pubDate = dateMatch?.[1] || dateMatch?.[2] || null
    const thumbnail = extractThumbnail(content)
    const domain = extractDomain(link)

    if (headline && link) {
      items.push({
        headline: headline.trim(),
        link: link.trim(),
        source_name: sourceName,
        source_domain: domain,
        thumbnail_url: thumbnail,
        pub_date: pubDate,
      })
    }
  }
  return items
}

export async function fetchAllFeeds(db: D1Database): Promise<number> {
  const sources = await db
    .prepare('SELECT id, name, feed_url FROM rss_sources WHERE active = 1')
    .all<{ id: string; name: string; feed_url: string }>()

  let totalNew = 0

  for (const source of sources.results) {
    try {
      const response = await fetch(source.feed_url, {
        headers: { 'User-Agent': 'Pebnews-RSS/1.0' },
      })

      if (!response.ok) continue

      const xml = await response.text()
      const items = extractItemsFromXml(xml, source.name, source.feed_url)

      for (const item of items) {
        const existing = await db
          .prepare('SELECT id FROM breaking_news_cache WHERE link = ?')
          .bind(item.link)
          .first()

        if (existing) continue

        const id = crypto.randomUUID()
        await db
          .prepare('INSERT INTO breaking_news_cache (id, source_name, headline, link, pub_date, source_domain, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(id, item.source_name, item.headline, item.link, item.pub_date, item.source_domain, item.thumbnail_url ?? null)
          .run()
        totalNew++
      }
    } catch {
      continue
    }
  }

  return totalNew
}
