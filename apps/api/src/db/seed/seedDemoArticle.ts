/**
 * Seed Demo Article
 * ==================
 * Populates a single real article from pebnews.com (owned by the client)
 * into the new Pebnews platform for demo/showcase purposes.
 *
 * THIS IS CLIENT-OWNED CONTENT, NOT SCRAPED FROM THIRD-PARTY SOURCES.
 * Unlike Section 8 (RSS-Curated Breaking News), this article carries
 * NO external-source attribution because it is the client's own published
 * work being migrated into their own system.
 *
 * Usage:
 *   Option A – Direct execution (recommended):
 *     npx tsx apps/api/src/db/seed/seedDemoArticle.ts
 *
 *   Option B – Generate SQL only (pipe yourself):
 *     npx tsx apps/api/src/db/seed/seedDemoArticle.ts --sql-only
 *
 * Prerequisites:
 *   1. An editor user must exist in the remote D1 database.
 *      (The script will use the first editor it finds, or you can
 *      hardcode an author_id below.)
 *   2. The featured image should be uploaded to R2. This script will
 *      attempt the upload automatically unless --skip-upload is passed.
 *   3. Run from the repo root or from apps/api/.
 *
 * The script:
 *   1. Downloads the original image from pebnews.com
 *   2. Uploads it to the R2 bucket 'pebnews-images'
 *   3. Enables public dev URL on the bucket if not already enabled
 *   4. INSERTs the article row into the remote D1 database
 *   5. Verifies the article is reachable via the public API
 */

import { execSync } from 'child_process'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'

// ---------------------------------------------------------------------------
// ARTICLE DATA — sourced from pebnews.com (client-owned content)
//   Original URL: https://pebnews.com/2026/07/10/fubara-presents-n1854tn-2026-budget-to-amaewhule-led-assembly-after-reconciliation
//   Author: Joy Joseph (JJ) — pebnews.com staff
//   Section: News → mapped to Politics in our section taxonomy
// ---------------------------------------------------------------------------
const ARTICLE = {
  title: 'Fubara Presents \u20A61.854tn 2026 Budget to Amaewhule-Led Assembly After Reconciliation',
  sectionSlug: 'politics',       // maps to section id "sec_politics"
  excerpt: 'Rivers State Governor Siminalayi Fubara on Thursday presented a proposed \u20A61.854 trillion 2026 Appropriation Bill to the Rivers State House of Assembly, marking his first appearance before the Martin Amaewhule-led legislature since the political crisis that fractured the Assembly in 2023.',
  body: `<p>Rivers State Governor Siminalayi Fubara on Thursday presented a proposed \u20A61.854 trillion 2026 Appropriation Bill to the Rivers State House of Assembly, marking his first appearance before the Martin Amaewhule-led legislature since the political crisis that fractured the Assembly in 2023.</p>

<p>The presentation, widely seen as a significant milestone in the state\u2019s political reconciliation, followed the recent resolution of the prolonged rift between the governor and lawmakers after nearly three years of parallel legislative sittings and rival budget presentations.</p>

<p>Proceedings began with Speaker Martin Amaewhule taking his seat in full ceremonial regalia ahead of the governor\u2019s arrival. A motion to receive Governor Fubara was moved by Majority Leader Major Jack and seconded by Minority Leader Sylvanus Nwankwo before the governor entered the chamber to present the budget.</p>

<p>Tagged the \u201CBudget of Resilience for Growth and Development,\u201D the proposed spending plan is designed to drive economic expansion, strengthen infrastructure, improve education and healthcare, and deepen social investments across the state.</p>

<p>Governor Fubara projected total revenue of \u20A61.854 trillion for the 2026 fiscal year, representing a 24.49 per cent increase over the adjusted 2025 budget. He attributed the anticipated growth to higher allocations from the Federation Account Allocation Committee (FAAC), increased derivation revenue and improved internally generated revenue.</p>

<p>Of the proposed budget, \u20A6413.1 billion is allocated for recurrent expenditure, while \u20A61.405 trillion is earmarked for capital projects.</p>

<p>Key capital allocations include \u20A6533.3 billion for works and projects, \u20A6315 billion for education, \u20A6105.4 billion for healthcare, \u20A641.4 billion for the Rivers State House of Assembly, \u20A630 billion for the judiciary and \u20A619.3 billion for agriculture.</p>

<p>The governor also announced plans to increase overhead allocations to Ministries, Departments and Agencies (MDAs) by at least 50 per cent, while clearing outstanding gratuities and death benefits owed to retired civil servants.</p>

<p>He said his administration had maintained fiscal discipline through prudent management of public resources and remained committed to accountability, transparency and responsible spending.</p>

<p>\u201CWe will ensure every kobo is spent wisely to create jobs for our people. The collective interests of our people are most important to us as a government,\u201D Fubara said.</p>

<p>He urged lawmakers to give the proposal speedy consideration, describing it as a people-focused blueprint aimed at accelerating development, attracting investment, creating employment and improving residents\u2019 quality of life.</p>

<p>\u201CLet us join hands to make sure Rivers State continues to stand out in good governance,\u201D the governor added before formally handing the budget estimates to the Speaker.</p>

<p>Responding, Speaker Amaewhule assured the governor that the Assembly would give the proposal thorough legislative consideration.</p>

<p>\u201CLet me assure you on behalf of the members that we will give due consideration to your budget proposals,\u201D he said.</p>

<p>He stressed that the legislature remained committed to the state\u2019s development.</p>

<p>\u201COur state has to grow, and all hands have to be on deck for the growth of Rivers State. We are willing to do all that is needed as an Assembly so our people can smile again.\u201D</p>

<p>The Appropriation Bill subsequently passed its first reading.</p>

<p>In a symbolic display of renewed executive-legislative cooperation, Governor Fubara exchanged warm pleasantries with lawmakers after the presentation before being escorted out of the chamber by Speaker Amaewhule and members of the House for a group photograph.</p>

<p>The House later adjourned plenary until July 20.</p>

<p>The budget presentation is widely regarded as a defining moment in Rivers State\u2019s evolving political landscape, reinforcing the recent reconciliation between the executive and legislature and signalling a new phase of cooperation after years of political division.</p>`,
  featuredImageUrl: 'https://pub-d791492f7b1d413491ca62d7ac29e1d3.r2.dev/fubara-budget-2026.jpg',
  originalImageUrl: 'https://pebnews.com/storage/PEBNEWSIMG_0876.jpeg',
  publishedAt: '2026-07-10T13:19:00.000Z',
  authorName: 'Joy Joseph (JJ)',
}

// Override-able via env
const WORK_DIR = process.cwd()
const IS_SQL_ONLY = process.argv.includes('--sql-only')
const SKIP_UPLOAD = process.argv.includes('--skip-upload')

function generateId(): string {
  // Use a deterministic slug and id so re-runs don't create duplicates
  const slugBase = ARTICLE.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)
  const slug = `${slugBase}-1720627140000`
  const id = 'demo_' + slugBase.slice(0, 60)
  return id
}

function generateSlug(): string {
  const slugBase = ARTICLE.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)
  return `${slugBase}-1720627140000`
}

function generateSQL(authorId: string): string {
  const id = generateId()
  const slug = generateSlug()
  const bodyEscaped = ARTICLE.body.replace(/'/g, "''")

  return [
    `-- ============================================================`,
    `-- Seed Demo Article`,
    `-- Client-owned content from pebnews.com — NOT third-party scraped`,
    `-- Original: https://pebnews.com/2026/07/10/fubara-presents-n1854tn-2026-budget-to-amaewhule-led-assembly-after-reconciliation`,
    `-- ============================================================`,
    ``,
    `INSERT OR IGNORE INTO articles (`,
    `  id, title, slug, section_id, author_id, excerpt, body,`,
    `  featured_image_url, status, published_at, is_breaking,`,
    `  origin_source_name, origin_source_link`,
    `) VALUES (`,
    `  '${id}',`,
    `  '${ARTICLE.title.replace(/'/g, "''")}',`,
    `  '${slug}',`,
    `  'sec_politics',`,
    `  '${authorId}',`,
    `  '${ARTICLE.excerpt.replace(/'/g, "''")}',`,
    `  '${bodyEscaped}',`,
    `  '${ARTICLE.featuredImageUrl}',`,
    `  'published',`,
    `  '${ARTICLE.publishedAt}',`,
    `  0,`,
    `  NULL,`,
    `  NULL`,
    `);`,
    ``,
    `SELECT 'OK' AS seeded, id, title, slug FROM articles WHERE id = '${id}';`,
  ].join('\n')
}

async function run() {
  const scriptName = 'apps/api/src/db/seed/seedDemoArticle.ts'

  console.log('=== Pebnews Demo Article Seeder ===')
  console.log('')
  console.log(`Title: ${ARTICLE.title}`)
  console.log(`Author: ${ARTICLE.authorName}`)
  console.log(`Section: Politics`)
  console.log(`Original: https://pebnews.com/2026/07/10/fubara-presents-n1854tn-2026-budget-to-amaewhule-led-assembly-after-reconciliation`)
  console.log('')
  console.log('NOTE: This is client-owned content being migrated into their own')
  console.log('platform for demo purposes. It is NOT third-party scraped content.')
  console.log('')

  // -- Step 0: Find or use existing editor -------
  let authorId = process.env.SEED_AUTHOR_ID || ''
  if (!authorId) {
    console.log('Step 0: Looking up existing editor user...')
    try {
      const result = execSync(
        'npx wrangler d1 execute pebnews-db --command "SELECT id FROM users WHERE role = \'editor\' LIMIT 1" --remote --json',
        { cwd: join(WORK_DIR, 'apps/api'), timeout: 30000 }
      ).toString()
      const parsed = JSON.parse(result)
      const rows = parsed?.[0]?.results
      if (rows && rows.length > 0) {
        authorId = rows[0].id
        console.log(`  Found editor: ${authorId}`)
      }
    } catch {
      console.log('  Could not auto-detect editor. Pass SEED_AUTHOR_ID env var.')
      console.log('  Or create one via the admin signup page first.')
      process.exit(1)
    }
  }

  if (!authorId) {
    console.error('ERROR: No editor user found. Sign up at /editor/signup first,')
    console.error('       then re-run with: SEED_AUTHOR_ID=<id> npx tsx ...')
    process.exit(1)
  }

  // -- Step 1: Upload image to R2 (unless skipped) -------
  const r2Key = 'fubara-budget-2026.jpg'
  if (!SKIP_UPLOAD && !IS_SQL_ONLY) {
    console.log('')
    console.log('Step 1: Uploading featured image to R2...')
    const tmpFile = join(WORK_DIR, 'node_modules/.cache/seed_img.jpg')
    try {
      // Download
      execSync(
        `curl.exe -s -o "${tmpFile}" "${ARTICLE.originalImageUrl}"`,
        { timeout: 15000 }
      )
      console.log('  Downloaded original image from pebnews.com')

      // Upload
      execSync(
        `npx wrangler r2 object put pebnews-images/${r2Key} --file "${tmpFile}" --remote`,
        { cwd: join(WORK_DIR, 'apps/api'), timeout: 60000 }
      )
      console.log(`  Uploaded to R2: pebnews-images/${r2Key}`)

      // Cleanup
      if (existsSync(tmpFile)) unlinkSync(tmpFile)
    } catch (err) {
      console.log('  Image upload failed (may already exist). Continuing...')
    }
  } else {
    console.log('')
    console.log('Step 1: Skipping R2 image upload.')
  }

  // -- Step 2: Enable dev URL for bucket (idempotent) -------
  if (!IS_SQL_ONLY) {
    console.log('')
    console.log('Step 2: Ensuring R2 bucket has public dev URL...')
    try {
      execSync(
        `npx wrangler r2 bucket dev-url enable pebnews-images`,
        { cwd: join(WORK_DIR, 'apps/api'), timeout: 15000 }
      )
      console.log('  Public dev URL enabled.')
    } catch {
      console.log('  Dev URL may already be enabled. Continuing...')
    }
  }

  // -- Step 3: Build and execute SQL -------
  const sql = generateSQL(authorId)

  if (IS_SQL_ONLY) {
    console.log('')
    console.log('--- SQL (pipe to wrangler d1 execute) ---')
    console.log('')
    console.log(sql)
    return
  }

  console.log('')
  console.log('Step 3: Executing INSERT via wrangler d1 execute...')

  const sqlFile = join(WORK_DIR, 'node_modules/.cache/seed_demo.sql')
  writeFileSync(sqlFile, sql, 'utf-8')

  try {
    const output = execSync(
      `npx wrangler d1 execute pebnews-db --file="${sqlFile}" --remote`,
      { cwd: join(WORK_DIR, 'apps/api'), timeout: 30000 }
    ).toString()
    console.log(output)
  } catch (err: any) {
    console.error('SQL execution failed:', err.message)
    console.log('You can retry with the --sql-only flag and pipe manually:')
    console.log(`  npx tsx ${scriptName} --sql-only | npx wrangler d1 execute pebnews-db --remote`)
    process.exit(1)
  } finally {
    if (existsSync(sqlFile)) unlinkSync(sqlFile)
  }

  // -- Step 4: Verify via public API -------
  console.log('')
  console.log('Step 4: Verifying article via public API...')
  const slug = generateSlug()
  try {
    const verifyOutput = execSync(
      `curl.exe -s "https://pebnews-api.pebglobals.workers.dev/api/articles/${slug}"`,
      { timeout: 10000 }
    ).toString()
    const data = JSON.parse(verifyOutput)
    if (data.article) {
      console.log(`  PASS: Article "${data.article.title}" is live at:`)
      console.log(`  GET https://pebnews-api.pebglobals.workers.dev/api/articles/${slug}`)
      console.log(`  Published: ${data.article.published_at}`)
      console.log(`  Views: ${data.article.view_count ?? 0}`)
    } else {
      console.log('  FAIL: Article not found via API. Check wrangler output above.')
    }
  } catch {
    console.log('  Could not verify via API (worker may still be deploying).')
    console.log(`  Check manually: https://pebnews-api.pebglobals.workers.dev/api/articles/${slug}`)
  }

  console.log('')
  console.log('=== Done ===')
  console.log('The article should now appear on the homepage and in the Politics section.')
  console.log('Full URL on web:')
  console.log('  https://pebnews-web.pages.dev/')
  console.log('  https://pebnews-web.pages.dev/section/politics')
  console.log('')
  console.log('If Pages is still deploying from the last git push, wait ~2 min and reload.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
