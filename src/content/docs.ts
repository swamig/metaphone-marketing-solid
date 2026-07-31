/**
 * Metaphone marketing docs — single source for /docs routes.
 * Keep copy concrete: real API host, real pipeline, real brand example (ganvil / TLCPD).
 */

export type DocSection = {
  id: string;
  title: string;
  blurb: string;
  body: string; // markdown-ish plain text rendered lightly
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  group: "start" | "tutorials" | "api" | "reference";
  order: number;
  sections: DocSection[];
};

export const API_BASE = "https://api.metaphone.app";
export const APP_URL = "https://app.metaphone.app";
export const SITE_URL = "https://metaphone.app";

export const DOC_GROUPS: { id: DocPage["group"]; label: string }[] = [
  { id: "start", label: "Start here" },
  { id: "tutorials", label: "Tutorials" },
  { id: "api", label: "Public API" },
  { id: "reference", label: "Reference" },
];

export const docs: DocPage[] = [
  {
    slug: "overview",
    title: "What Metaphone is",
    description:
      "Metaphone is the brand content plane: topics, assets, sites — plus a public API and SSR artifact cache for marketing builds.",
    group: "start",
    order: 1,
    sections: [
      {
        id: "in-one-line",
        title: "In one line",
        blurb: "",
        body: `Metaphone is a **content operations backend** for brands: publish topics (blog/articles), assets, and site pages, then expose them over a **public HTTP API** so Solid/Vite marketing sites can **sync content at build time**, **prerender HTML**, and **cache SSR + llms.txt artifacts** keyed by content hash.

It is not a page builder for the browser SPA alone — the high-leverage path is:

\`Console (app.metaphone.app) → published brand content → api.metaphone.app → your site's build pipeline → Cloudflare/static host\``,
      },
      {
        id: "who-uses",
        title: "Who uses what",
        blurb: "",
        body: `| Layer | Role |
| --- | --- |
| **Console** \`app.metaphone.app\` | Editors create brands, topics, assets, campaigns |
| **API** \`api.metaphone.app\` | Public read for published content; authenticated write; SSR cache |
| **Marketing site** (e.g. TLCPD) | \`build-content\` + Solid SSR + postbuild sitemaps/llms |
| **Edge** | Serves prerendered HTML + compressed assets |

Example production brand: **\`ganvil\`** powers [throughputlinesofcodeperday.com](https://throughputlinesofcodeperday.com) blog + machine-readable \`/llms-full.txt\`.`,
      },
      {
        id: "mental-model",
        title: "Mental model",
        blurb: "",
        body: `1. **Org** — Buttrbase JWT \`org_id\` (your company account)
2. **Sites** — many per org (\`UNIQUE (org_id, slug)\`): CMS pages, categories, email-to-post, rebuild webhooks
3. **Brand** — public content scope for SSG (\`slug\`, e.g. \`ganvil\`) — usually matches a site slug
4. **Topics** — published posts (blog) under a brand
5. **Public articles API** — list/read for SSG (ETag / 304)
6. **SSR pages table** — optional hash-keyed HTML/text cache (\`/blog/foo\`, \`/llms-full.txt\`)
7. **Site build** — fetch content at build time; optionally skip re-render when \`content_hash\` matches

**Differentiate properties by site** in the console (email token, pages, rebuild URL).  
**Public marketing reads** use brand slug: \`/v1/public/brands/{slug}/…\` (align site slug ↔ brand slug).`,
      },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture: CMS → build → SSR → LLMs",
    description:
      "How Metaphone content becomes prerendered marketing pages and combined llms.txt corpora.",
    group: "start",
    order: 2,
    sections: [
      {
        id: "pipeline",
        title: "End-to-end pipeline",
        blurb: "",
        body: `\`\`\`
Email / console publish
      │
      ▼
Metaphone site (org-scoped)
  pages + topics (brand linked via category)
      │
      ├─► rebuild webhook → CF Worker (rebuild-broker)
      │         → Pages deploy hook → CF build
      │
      ▼
CF Pages build (env: METAPHONE_BRAND_SLUG, VITE_METAPHONE_API_URL)
  node scripts/fetch-metaphone-content.mjs
    → public/metaphone/articles.json + manifest.json
  (+ optional build-content / prerender / SSR hash cache)
      ▼
Static host (Cloudflare Pages)
\`\`\`

**Two integration levels**

| Level | What runs | Solid UI reads Metaphone? |
| --- | --- | --- |
| **A — Build fetch (default on portfolio sites)** | \`fetch-metaphone-content.mjs\` + brand env | Only if you **import** \`public/metaphone/*\` or fetch the public API |
| **B — Full SSG + SSR cache** | build-content + prerender + PUT/GET \`…/ssr/…\` | Yes — hash-skip when content unchanged |

Level A is installed broadly so rebuilds always pull live API data. Level B is the full TLCPD-style stack (see tutorials below).`,
      },
      {
        id: "two-halves",
        title: "Two halves of llms-full.txt",
        blurb: "",
        body: `**PART 1 — SITE** comes from the marketing repo (\`src/content/*\`: pricing, FAQ, benchmarks, docs).

**PART 2 — BLOG** comes from Metaphone topics (API list + full article bodies synced by build-content).

The combined file is stored on Metaphone as path \`/llms-full.txt\` so rebuilds **hash-skip** when neither half changed.

SSR HTML for humans is separate: crawlers get \`dist/blog/.../index.html\`; agents get clean text at \`/llms-full.txt\` (not scraped HTML).`,
      },
      {
        id: "cache-layers",
        title: "Cache layers (what speeds builds up)",
        blurb: "",
        body: `| Cache | Key | Skip when |
| --- | --- | --- |
| **Articles list** | HTTP ETag | \`If-None-Match\` → 304 + local bundle intact |
| **Blog SSR HTML** | \`content_hash\` of template + article JSON | Metaphone GET returns same hash + html |
| **Marketing SSR** | \`content_hash\` of template + path | same |
| **llms / sitemaps** | hash of site fingerprint + blog fingerprint | same |

Force full content pull: \`METAPHONE_FORCE_CONTENT=1\`.`,
      },
    ],
  },
  {
    slug: "tutorial-sites-org",
    title: "Tutorial: Sites under your org",
    description:
      "Create multiple sites per org — email tokens, categories, rebuild webhooks, Cloudflare project mapping.",
    group: "tutorials",
    order: 1,
    sections: [
      {
        id: "why-sites",
        title: "Why sites (not only brands)",
        blurb: "",
        body: `A **brand** is the public content namespace SSG reads (\`/v1/public/brands/{slug}\`).

A **site** is the CMS + publish surface for one property under your **org**:

- Inbound email: \`{publish_token}@epp.metaphone.app\`
- Pages, content categories (blog/docs), templates
- Rebuild webhook (Cloudflare deploy hook via shared Worker)
- \`cf_pages_project\` — which Pages project rebuilds on publish

You can have **many sites per org** (\`UNIQUE (org_id, slug)\`). Console → **Sites** lists only your org.`,
      },
      {
        id: "create",
        title: "Create a site",
        blurb: "",
        body: `**Console:** ${APP_URL} → Sites → New site

**API:**

\`\`\`bash
curl -sS -X POST ${API_BASE}/v1/sites \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "slug": "workahub",
    "name": "Workahub marketing",
    "publish_token": "workahub",
    "public_base_url": "https://joinworkahub.com",
    "cf_pages_project": "workahub-marketing",
    "rebuild_webhook_url": "https://metaphone-rebuild-broker.saumyagarg.workers.dev",
    "rebuild_webhook_token": "$REBUILD_TOKEN"
  }'
\`\`\`

Default **blog** category is seeded and linked to a brand with the same slug when present.`,
      },
      {
        id: "list",
        title: "List sites in the org",
        blurb: "",
        body: `\`\`\`bash
curl -sS ${API_BASE}/v1/sites \\
  -H "Authorization: Bearer $TOKEN" | jq '.items[] | {slug, publish_token, cf_pages_project, public_base_url}'
\`\`\`

Each row is one property you can open for pages, categories, email senders, and rebuild settings.`,
      },
      {
        id: "site-vs-brand",
        title: "Site slug vs brand slug",
        blurb: "",
        body: `| Concern | Key |
| --- | --- |
| Console CMS / email / rebuild | **site** id + \`publish_token\` |
| Public SSG articles / SSR cache | **brand** slug |

Convention: use the **same slug** for both (e.g. site \`workahub\` + brand \`workahub\`).  
CF env: \`METAPHONE_BRAND_SLUG=workahub\`.`,
      },
    ],
  },
  {
    slug: "tutorial-email-to-post",
    title: "Tutorial: Email-to-post",
    description:
      "Publish a CMS page + public article by emailing {token}@epp.metaphone.app.",
    group: "tutorials",
    order: 2,
    sections: [
      {
        id: "flow",
        title: "How it works",
        blurb: "",
        body: `\`\`\`
You → ganvil@epp.metaphone.app
  → Buttrbase (Resend inbound)
  → Metaphone POST /webhooks/email/inbound
  → page + topic upsert (default category = blog)
  → dirty paths + rebuild webhook
  → CF Pages rebuild for that site
\`\`\`

| Address | Routes to |
| --- | --- |
| \`{site_publish_token}@epp.metaphone.app\` | Default category (blog) |
| \`{category_token}@epp…\` | That category |
| \`{site_token}+{category_slug}@epp…\` | Category by slug |

Subject → title · body → content. Sender must be on **Email Senders** unless “Receive from anyone” is on.`,
      },
      {
        id: "setup",
        title: "Setup checklist",
        blurb: "",
        body: `1. Buttrbase Email Setup for domain \`epp.metaphone.app\` (once per org)
2. Site **publish token** (e.g. \`ganvil\`)
3. Authorise your From address (Sites → Email senders)
4. Site **rebuild webhook** (shared Worker URL + token)
5. Send a test email; confirm CF deployment + \`/blog/…\`

\`\`\`bash
# after publish, inspect dirty paths
curl -sS ${API_BASE}/prerender/sites/$SITE_ID/dirty | jq .dirty_paths
\`\`\``,
      },
      {
        id: "example",
        title: "Example",
        blurb: "",
        body: `\`\`\`text
To: workahub@epp.metaphone.app
Subject: Why timesheets fail remote teams
Body: <p>…</p>
\`\`\`

Creates a published page + blog topic for brand \`workahub\`, then triggers the rebuild broker for that site.`,
      },
    ],
  },
  {
    slug: "tutorial-rebuild-webhook",
    title: "Tutorial: Rebuild webhook → Cloudflare",
    description:
      "On publish, Metaphone POSTs to a Worker that fires the right Pages deploy hook.",
    group: "tutorials",
    order: 3,
    sections: [
      {
        id: "architecture",
        title: "Multi-site broker",
        blurb: "",
        body: `Production Worker: **\`https://metaphone-rebuild-broker.saumyagarg.workers.dev\`**

\`\`\`
Metaphone site.rebuild_webhook_url
  Authorization: Bearer {rebuild_webhook_token}
      │
      ▼
Worker (CF edge)
  validates CF_REBUILD_TOKEN
  routes by site_slug → DEPLOY_HOOKS map (hook UUID)
      │
      ▼
POST Pages deploy hook
  → CF builds that project
\`\`\`

Secrets on the Worker:

| Secret | Purpose |
| --- | --- |
| \`CF_REBUILD_TOKEN\` | Shared with every site’s \`rebuild_webhook_token\` |
| \`DEPLOY_HOOKS\` | Compact JSON: \`{ "workahub": "<hook-uuid>", "ganvil": "…", … }\` |

Source: \`ganvil-marketing/workers/rebuild-broker\` (deployed to Cloudflare Workers — not local).`,
      },
      {
        id: "site-settings",
        title: "Site settings",
        blurb: "",
        body: `Console → Sites → {site} → **Website rebuild webhook**

| Field | Production value |
| --- | --- |
| Rebuild webhook URL | \`https://metaphone-rebuild-broker.saumyagarg.workers.dev\` |
| Rebuild token | same as Worker \`CF_REBUILD_TOKEN\` |
| Public base URL | e.g. \`https://joinworkahub.com\` |
| CF Pages project | e.g. \`workahub-marketing\` |

Payload includes \`site_slug\`, \`dirty_paths\`, \`rebuild: "incremental"\`. Deploy hooks usually do a **full** Pages build (fine for marketing sites).`,
      },
      {
        id: "smoke",
        title: "Smoke test",
        blurb: "",
        body: `\`\`\`bash
# List brands the Worker can rebuild
curl -sS https://metaphone-rebuild-broker.saumyagarg.workers.dev | jq .site_slugs

# Fire as Metaphone would
curl -sS -X POST https://metaphone-rebuild-broker.saumyagarg.workers.dev \\
  -H "Authorization: Bearer $REBUILD_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"event":"page.published","site_slug":"workahub"}'
# expect ok:true — then CF Pages → workahub-marketing → Deployments
\`\`\`

Bootstrap / refresh hooks + Metaphone site rows:

\`\`\`bash
node scripts/bootstrap-multi-site-rebuild.mjs --apply-db
# then wrangler secret put DEPLOY_HOOKS  (compact UUID map)
\`\`\`

See also: platform doc \`docs/rebuild-webhook-cloudflare.md\`.`,
      },
    ],
  },
  {
    slug: "tutorial-cf-build",
    title: "Tutorial: Cloudflare Pages build integration",
    description:
      "Install fetch-metaphone-content.mjs and brand env on every Pages product.",
    group: "tutorials",
    order: 4,
    sections: [
      {
        id: "what-we-install",
        title: "What gets installed",
        blurb: "",
        body: `On each marketing / product Pages project:

1. **Env (production + preview)**
   - \`VITE_METAPHONE_API_URL\` / \`METAPHONE_API_URL\` = \`${API_BASE}\`
   - \`METAPHONE_BRAND_SLUG\` / \`VITE_METAPHONE_BRAND_SLUG\` = brand slug
   - \`METAPHONE_FETCH_FAIL_SOFT=1\` (API blip won’t fail the build)
2. **Repo**
   - \`scripts/fetch-metaphone-content.mjs\`
   - \`package.json\` build starts with that script
   - \`metaphoneBrand\` field + \`metaphone:fetch\` script
   - \`.env.metaphone.example\`

Install tooling (platform repo):

\`\`\`bash
# all products
node scripts/metaphone-build/install-into-repos.mjs
# only missing / second pass
node scripts/metaphone-build/install-into-repos.mjs --gaps
# CF env only
node scripts/metaphone-build/install-into-repos.mjs --cf-env-only
\`\`\``,
      },
      {
        id: "fetch-script",
        title: "What fetch-metaphone-content writes",
        blurb: "",
        body: `At build time (on Cloudflare’s builders):

\`\`\`text
public/metaphone/articles.json    # brand articles from public API
public/metaphone/manifest.json    # prerender path list
public/metaphone/llms-blog.txt    # when API provides it
public/metaphone/llms-full.txt
\`\`\`

\`public/metaphone/\` is gitignored — always regenerated.

**Important:** writing these files does **not** automatically change your Solid UI. Wire imports or blog routes to read them (or call the public API). Full hash SSR cache is a separate step (SSR tutorial).`,
      },
      {
        id: "cf-env",
        title: "Pages dashboard",
        blurb: "",
        body: `Workers & Pages → project → Settings → Environment variables:

| Name | Example |
| --- | --- |
| \`METAPHONE_BRAND_SLUG\` | \`huggingplace\` |
| \`VITE_METAPHONE_API_URL\` | \`${API_BASE}\` |

Build command should include the fetch script (install tool prepends it automatically).`,
      },
    ],
  },
  {
    slug: "tutorial-connect-site",
    title: "Tutorial: Connect a Solid marketing site",
    description:
      "Wire a Vite + Solid site to brand content, SSR cache, and llms artifacts.",
    group: "tutorials",
    order: 5,
    sections: [
      {
        id: "prereq",
        title: "Prerequisites",
        blurb: "",
        body: `- A Metaphone brand with **published** topics (Console → brand → publish)
- Node 20+
- Env:

\`\`\`bash
export VITE_METAPHONE_API_URL=https://api.metaphone.app
export VITE_METAPHONE_BRAND_SLUG=your-brand   # e.g. ganvil
export SSR_UPLOAD_TOKEN=...                  # same secret as Metaphone SSR_UPLOAD_TOKEN
export CANONICAL_BASE=https://your-domain.com
\`\`\``,
      },
      {
        id: "scripts",
        title: "Recommended package scripts",
        blurb: "",
        body: `\`\`\`json
{
  "scripts": {
    "build:content": "node scripts/build-content.mjs",
    "build:ssr": "vite build --ssr src/entry-server.tsx --outDir dist-ssr",
    "build:prerender": "node scripts/prerender.mjs",
    "build:seo": "node scripts/postbuild.mjs",
    "build": "npm run build:content && vite build && npm run build:ssr && npm run build:prerender && npm run build:seo"
  }
}
\`\`\`

Order matters: **client build first**, then SSR bundle, then prerender into \`dist/\` (so Vite does not wipe prerendered HTML).`,
      },
      {
        id: "minimal-flow",
        title: "Minimal integration checklist",
        blurb: "",
        body: `1. **Sync** — \`build-content\` → \`public/content/\`
2. **SSR entry** — \`renderMarketingPage\`, \`renderBlogIndex\`, \`renderBlogPost\`
3. **Prerender** — write routes + PUT Metaphone SSR
4. **Postbuild** — sitemaps, robots, \`llms*.txt\` (+ gzip/brotli)
5. **Redirects** — explicit pretty URLs so SPA \`/*\` does not shadow HTML/txt
6. **Client** — clear \`#root[data-ssr]\` before SPA mount (avoid double tree)`,
      },
    ],
  },
  {
    slug: "tutorial-blog",
    title: "Tutorial: Blog from Metaphone topics",
    description: "Publish topics in the console; marketing site pulls them as a blog.",
    group: "tutorials",
    order: 6,
    sections: [
      {
        id: "topic-shape",
        title: "Topic / article shape",
        blurb: "",
        body: `Published topics appear on:

\`GET ${API_BASE}/v1/public/brands/{slug}/articles\`

Each item typically includes:

\`\`\`json
{
  "id": 1,
  "slug": "welcome-to-throughput-lines-of-code-per-day",
  "title": "Welcome…",
  "hook": "One-line claim…",
  "metaphor": "Optional metaphor…",
  "script": "HOOK: …\\n\\nBODY: …\\n\\nCTA: …",
  "hasVideo": false,
  "url": "/blog/welcome-to-…"
}
\`\`\`

Presentation labels (\`HOOK:\` / \`BODY:\` / \`CTA:\`) drive **layout slots** on the marketing site — they should not render as visible chrome.`,
      },
      {
        id: "sync",
        title: "Sync into the repo",
        blurb: "",
        body: `\`build-content.mjs\` writes:

- \`public/content/index.json\` — compact listing
- \`public/content/articles/{slug}.json\` — full body for SSR + llms
- \`public/content/.sync-meta.json\` — ETags for the next build

On unchanged content:

\`\`\`text
[build-content] articles 304 (etag=W/"…") — reusing N local articles (skip rewrite)
\`\`\``,
      },
      {
        id: "ssr-routes",
        title: "SSR routes",
        blurb: "",
        body: `Prerender at least:

- \`/blog\` — index from content listing
- \`/blog/:slug\` — article view + related posts

Hash payload so a template redesign (\`SSR_TEMPLATE_REV\`) invalidates Metaphone cache even when article JSON is identical.`,
      },
    ],
  },
  {
    slug: "tutorial-ssr-cache",
    title: "Tutorial: SSR HTML cache",
    description: "Store prerendered HTML in Metaphone; skip Solid render when content_hash matches.",
    group: "tutorials",
    order: 7,
    sections: [
      {
        id: "why",
        title: "Why cache HTML in Metaphone",
        blurb: "",
        body: `Marketing builds are often **content-driven**. If only one blog post changed, you should not re-render every route.

Metaphone \`ssr_pages\` stores:

- \`path\` — e.g. \`/blog/foo\`, \`/pricing\`, \`/llms-full.txt\`
- \`content_hash\` — sha256 of template revision + source payload
- \`html\` — full document or text body
- optional \`title\`, \`meta_description\``,
      },
      {
        id: "api",
        title: "SSR API",
        blurb: "",
        body: `\`\`\`http
GET  /v1/public/brands/{slug}/ssr/{*path}
PUT  /v1/public/brands/{slug}/ssr/{*path}
     Header: X-SSR-Token: $SSR_UPLOAD_TOKEN
     # or Authorization: Bearer $SSR_UPLOAD_TOKEN
GET  /v1/public/brands/{slug}/ssr
\`\`\`

**Note:** Axum's \`{*path}\` cannot be empty. Site home is stored as API path \`/index\` (client maps \`/\` ↔ \`/index\`).

\`\`\`bash
# List cached paths
curl -sS ${API_BASE}/v1/public/brands/ganvil/ssr | jq '.items[].path'

# Read one page (JSON envelope)
curl -sS ${API_BASE}/v1/public/brands/ganvil/ssr/blog \\
  -H 'Accept: application/json' | jq '{path, content_hash, title, n: (.html|length)}'
\`\`\``,
      },
      {
        id: "put",
        title: "Upload example",
        blurb: "",
        body: `\`\`\`bash
curl -sS -X PUT \\
  "${API_BASE}/v1/public/brands/ganvil/ssr/llms-full.txt" \\
  -H "Content-Type: application/json" \\
  -H "X-SSR-Token: $SSR_UPLOAD_TOKEN" \\
  -d '{
    "content_hash": "'$(sha256sum llms-full.txt | cut -d" " -f1)'",
    "html": '"$(jq -Rs . < llms-full.txt)"',
    "title": "llms-full",
    "meta_description": "Combined site + blog corpus"
  }'
\`\`\``,
      },
    ],
  },
  {
    slug: "tutorial-llms",
    title: "Tutorial: llms.txt combined corpus",
    description:
      "Ship llms.txt, llms-full (site + Metaphone blog), and compressed mirrors.",
    group: "tutorials",
    order: 8,
    sections: [
      {
        id: "schemes",
        title: "Recommended schemes",
        blurb: "",
        body: `| Path | Contents |
| --- | --- |
| \`/llms.txt\` | Index (product + links) |
| \`/llms-full.txt\` | **Site + Metaphone blog combined** |
| \`/llms-site.txt\` | Marketing half only |
| \`/llms-blog.txt\` | Metaphone posts only |
| \`/llms-docs.txt\` | Docs tutorials |
| \`*.txt.gz\` / \`*.txt.br\` | Precompressed for agents |

Index example (live TLCPD):

[https://throughputlinesofcodeperday.com/llms.txt](https://throughputlinesofcodeperday.com/llms.txt)

Full combined:

[https://throughputlinesofcodeperday.com/llms-full.txt](https://throughputlinesofcodeperday.com/llms-full.txt)`,
      },
      {
        id: "combine",
        title: "How combination works",
        blurb: "",
        body: `postbuild builds:

1. **Site fingerprint** from shared JSON modules (pricing, FAQ, benchmarks, docs)
2. **Blog fingerprint** from Metaphone-synced article bodies
3. **Full hash** = hash(site) + hash(blog) → either half invalidates cache

\`llms-full\` is **not** scraped SSR HTML (no \`data-hk\` noise). SSR serves browsers; llms serves agents. They share sources where content is modularized.`,
      },
    ],
  },
  {
    slug: "tutorial-etag",
    title: "Tutorial: ETag content sync",
    description: "Conditional GET on articles list to skip rewriting public/content.",
    group: "tutorials",
    order: 9,
    sections: [
      {
        id: "headers",
        title: "Server behavior",
        blurb: "",
        body: `Public list endpoints return a weak ETag over the JSON body:

\`\`\`http
GET /v1/public/brands/ganvil/articles?limit=1000
ETag: W/"680b6f0b…"
Cache-Control: public, max-age=60
\`\`\`

Client sends:

\`\`\`http
If-None-Match: W/"680b6f0b…"
→ 304 Not Modified (empty body)
\`\`\`

Same for \`/video-manifest\`.`,
      },
      {
        id: "client",
        title: "Client (build-content)",
        blurb: "",
        body: `1. Load \`.sync-meta.json\` (previous etags + slug list)
2. Conditional fetch articles + video-manifest
3. If **304** and local article files exist for every slug → **skip wipe/write**
4. Else full pull, optional page enrichment, write bundle, save new meta

Force:

\`\`\`bash
METAPHONE_FORCE_CONTENT=1 node scripts/build-content.mjs
\`\`\``,
      },
      {
        id: "try",
        title: "Try it",
        blurb: "",
        body: `\`\`\`bash
ETAG=$(curl -sSI '${API_BASE}/v1/public/brands/ganvil/articles?limit=1000' \\
  | tr -d '\\r' | awk -F': ' 'tolower($1)=="etag"{print $2}')
echo "$ETAG"
curl -sSI -H "If-None-Match: $ETAG" \\
  '${API_BASE}/v1/public/brands/ganvil/articles?limit=1000' | head -5
# expect: HTTP/2 304
\`\`\``,
      },
    ],
  },
  {
    slug: "api-public",
    title: "Public content API",
    description: "Unauthenticated read APIs for published brand content.",
    group: "api",
    order: 1,
    sections: [
      {
        id: "base",
        title: "Base URL",
        blurb: "",
        body: `\`${API_BASE}\`

All paths below are relative to that host. CORS allows browser reads; SSG scripts should still run at build time.`,
      },
      {
        id: "brand",
        title: "GET /v1/public/brands/{slug}",
        blurb: "",
        body: `\`\`\`bash
curl -sS ${API_BASE}/v1/public/brands/ganvil | jq .
# { "slug": "ganvil", "name": "Throughput Lines of Code Per Day" }
\`\`\``,
      },
      {
        id: "articles",
        title: "GET /v1/public/brands/{slug}/articles",
        blurb: "",
        body: `Query: \`limit\` (default 500, max 1000), \`offset\`.

\`\`\`bash
curl -sS '${API_BASE}/v1/public/brands/ganvil/articles?limit=1000' \\
  -D - -o /tmp/articles.json | rg -i 'etag|http/'
jq '{total, first: .items[0].slug}' /tmp/articles.json
\`\`\`

**Conditional:** send \`If-None-Match\` with previous ETag → **304**.`,
      },
      {
        id: "page",
        title: "GET /v1/public/brands/{slug}/pages/{page_slug}",
        blurb: "",
        body: `Resolves a **topic** (article) first, else CMS page.

\`\`\`bash
curl -sS ${API_BASE}/v1/public/brands/ganvil/pages/welcome-to-throughput-lines-of-code-per-day \\
  | jq '{type, slug, title, has_video, keys: (.content|keys)}'
\`\`\``,
      },
      {
        id: "video",
        title: "GET /v1/public/brands/{slug}/video-manifest",
        blurb: "",
        body: `Map of topic slug → orientation URLs for cinematic/social clips. Supports ETag / 304 like articles.`,
      },
      {
        id: "prerender-manifest",
        title: "GET /v1/public/brands/{slug}/prerender/manifest",
        blurb: "",
        body: `Lists page paths candidates for prerender (topics + published CMS pages).`,
      },
    ],
  },
  {
    slug: "api-ssr",
    title: "SSR & sitemap API",
    description: "Hash-keyed HTML/text cache and generated sitemaps.",
    group: "api",
    order: 2,
    sections: [
      {
        id: "ssr-crud",
        title: "SSR pages",
        blurb: "",
        body: `| Method | Path | Auth |
| --- | --- | --- |
| GET | \`/v1/public/brands/{slug}/ssr\` | public (list meta, no html) |
| GET | \`/v1/public/brands/{slug}/ssr/{*path}\` | public JSON |
| PUT | \`/v1/public/brands/{slug}/ssr/{*path}\` | \`X-SSR-Token\` or Bearer |

PUT body:

\`\`\`json
{
  "content_hash": "hex-sha256…",
  "html": "<!doctype html>… or plain text …",
  "title": "optional",
  "meta_description": "optional",
  "source_updated_at": "2026-07-29T00:00:00Z"
}
\`\`\``,
      },
      {
        id: "sitemaps",
        title: "Sitemaps & robots",
        blurb: "",
        body: `\`\`\`http
GET /v1/public/brands/{slug}/sitemap.xml
GET /v1/public/brands/{slug}/sitemap-blog.xml
GET /v1/public/brands/{slug}/robots.txt
\`\`\`

Prefer **stored** bodies from SSG when present; otherwise generate blog sitemap from published topics.`,
      },
      {
        id: "openapi",
        title: "OpenAPI",
        blurb: "",
        body: `Machine-readable OpenAPI document:

\`\`\`bash
curl -sS ${API_BASE}/openapi.json | jq '.info'
\`\`\`

Use this for generated clients; public marketing docs here stay human-oriented.`,
      },
    ],
  },
  {
    slug: "example-tlcpd",
    title: "Example: TLCPD / brand ganvil",
    description: "Production reference: Throughput Lines of Code Per Day on Metaphone.",
    group: "reference",
    order: 1,
    sections: [
      {
        id: "live",
        title: "Live surfaces",
        blurb: "",
        body: `| Surface | URL |
| --- | --- |
| Marketing site | https://throughputlinesofcodeperday.com |
| Blog | https://throughputlinesofcodeperday.com/blog |
| llms index | https://throughputlinesofcodeperday.com/llms.txt |
| Combined corpus | https://throughputlinesofcodeperday.com/llms-full.txt |
| Brand API | ${API_BASE}/v1/public/brands/ganvil |
| SSR list | ${API_BASE}/v1/public/brands/ganvil/ssr |`,
      },
      {
        id: "what-to-copy",
        title: "What to copy into your site",
        blurb: "",
        body: `From the ganvil-cloud/web (or equivalent) pipeline:

1. \`scripts/build-content.mjs\` — ETag sync
2. \`src/entry-server.tsx\` — Solid SSR renderers
3. \`scripts/prerender.mjs\` — hash + Metaphone GET/PUT
4. \`scripts/postbuild.mjs\` — sitemaps + combined llms
5. \`public/_redirects\` — protect txt/html from SPA fallback

That stack is the reference implementation for “Metaphone-backed marketing SSG.”`,
      },
    ],
  },
  {
    slug: "env-reference",
    title: "Environment variables",
    description: "Tokens and URLs used by API, console, and site builds.",
    group: "reference",
    order: 2,
    sections: [
      {
        id: "site-build",
        title: "Marketing site build",
        blurb: "",
        body: `| Variable | Purpose |
| --- | --- |
| \`VITE_METAPHONE_API_URL\` / \`METAPHONE_API_URL\` | API host (default ${API_BASE}) |
| \`VITE_METAPHONE_BRAND_SLUG\` / \`METAPHONE_BRAND_SLUG\` | Brand slug for public API + fetch script |
| \`METAPHONE_FETCH_FAIL_SOFT\` | \`1\` (default) = don’t fail CF build if API down |
| \`SSR_UPLOAD_TOKEN\` / \`METAPHONE_SSR_TOKEN\` | PUT to SSR cache |
| \`CANONICAL_BASE\` | Absolute URLs in sitemaps/llms |
| \`SSR_TEMPLATE_REV\` | Bump to invalidate all SSR HTML |
| \`METAPHONE_FORCE_CONTENT\` | \`1\` = ignore article ETags |
| \`METAPHONE_STRICT\` | \`1\` = fail build if zero articles |`,
      },
      {
        id: "backend",
        title: "Metaphone backend (Fly)",
        blurb: "",
        body: `| Variable | Purpose |
| --- | --- |
| \`DATABASE_URL\` | Postgres |
| \`SSR_UPLOAD_TOKEN\` | Shared with site builds |
| \`BUTTRBASE_*\` | Auth federation for console |
| \`WEBHOOK_SECRET\` | Buttrbase → inbound email HMAC |
| \`PRERENDER_WEBHOOK_URL\` | Legacy **global** rebuild fallback (prefer per-site webhook) |`,
      },
      {
        id: "rebuild-worker",
        title: "Rebuild Worker secrets",
        blurb: "",
        body: `| Secret | Purpose |
| --- | --- |
| \`CF_REBUILD_TOKEN\` | Must match each site’s \`rebuild_webhook_token\` |
| \`DEPLOY_HOOKS\` | JSON map site_slug → Cloudflare deploy-hook UUID |

Worker URL used as site \`rebuild_webhook_url\` across the portfolio.`,
      },
    ],
  },
  {
    slug: "portfolio-status",
    title: "Portfolio: multi-site + CF status",
    description:
      "What is live for the S7 org — sites, rebuild broker, and build fetch vs full SSR cache.",
    group: "reference",
    order: 3,
    sections: [
      {
        id: "live",
        title: "What is live",
        blurb: "",
        body: `| Capability | Status |
| --- | --- |
| Multi-site under one org | **Yes** — Sites console + \`GET /v1/sites\` |
| Email-to-post | **Yes** — \`{token}@epp.metaphone.app\` |
| Rebuild broker (CF Worker) | **Yes** — multi-brand deploy hooks |
| CF Pages brand env + fetch script | **Yes** on portfolio products |
| Solid UI always reads Metaphone cache | **Partial** — wire imports / full SSG per product |
| Humchat / humforce domains | Zones only — no Pages project yet |

Example emails: \`ganvil@…\`, \`workahub@…\`, \`huggingplace@…\`, \`buttrbase@…\`.`,
      },
      {
        id: "not-humchat",
        title: "Humchat note",
        blurb: "",
        body: `\`humchat.app\`, \`humforce.app\`, and \`humtransfer.*\` are active Cloudflare **zones** without DNS records or Pages projects. When a marketing site ships, create a Pages project, add a Metaphone site + brand slug, set rebuild webhook, and run the CF build install — same path as Workahub / HuggingPlace.`,
      },
    ],
  },
];

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}

export function docsByGroup() {
  return DOC_GROUPS.map((g) => ({
    ...g,
    pages: docs.filter((d) => d.group === g.id).sort((a, b) => a.order - b.order),
  }));
}
