#!/usr/bin/env node
/**
 * Metaphone build-time content fetch
 *
 * Pulls public brand content from the Metaphone API and writes:
 *   public/metaphone/articles.json
 *   public/metaphone/manifest.json   (prerender paths when available)
 *   public/metaphone/llms-blog.txt   (optional text corpus)
 *
 * Env (set in Cloudflare Pages → Environment variables):
 *   METAPHONE_BRAND_SLUG   required (e.g. workahub, ganvil)
 *   VITE_METAPHONE_API_URL or METAPHONE_API_URL  default https://api.metaphone.app
 *   METAPHONE_FETCH_FAIL_SOFT=1  (default) warn and continue if API down
 *
 * Wire into package.json:
 *   "build": "node scripts/fetch-metaphone-content.mjs && …existing…"
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "metaphone");

const API = (
  process.env.VITE_METAPHONE_API_URL ||
  process.env.METAPHONE_API_URL ||
  "https://api.metaphone.app"
).replace(/\/$/, "");

function brandFromPackageJson() {
  try {
    const pkg = JSON.parse(
      readFileSync(join(ROOT, "package.json"), "utf8"),
    );
    return (pkg.metaphoneBrand || pkg.metaphone?.brand || "").toString();
  } catch {
    return "";
  }
}

const BRAND = (
  process.env.METAPHONE_BRAND_SLUG ||
  process.env.VITE_METAPHONE_BRAND_SLUG ||
  brandFromPackageJson() ||
  ""
)
  .trim()
  .toLowerCase();

const FAIL_SOFT = process.env.METAPHONE_FETCH_FAIL_SOFT !== "0";

async function getJson(path) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

async function getText(path) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "text/plain,*/*" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) return null;
  return res.text();
}

function writeJson(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function main() {
  if (!BRAND) {
    const msg =
      "[metaphone] METAPHONE_BRAND_SLUG not set — skipping content fetch";
    if (FAIL_SOFT) {
      console.warn(msg);
      // Still write empty stubs so importers don't break
      mkdirSync(OUT_DIR, { recursive: true });
      writeJson(join(OUT_DIR, "articles.json"), { items: [], total: 0, brand: null });
      writeJson(join(OUT_DIR, "manifest.json"), { pages: [], brand: null });
      return;
    }
    throw new Error(msg);
  }

  console.log(`[metaphone] brand=${BRAND} api=${API}`);

  try {
    const [articles, manifest, llmsBlog, llmsFull] = await Promise.all([
      getJson(`/v1/public/brands/${BRAND}/articles`).catch((e) => {
        console.warn(`[metaphone] articles: ${e.message}`);
        return null;
      }),
      getJson(`/v1/public/brands/${BRAND}/prerender/manifest`).catch((e) => {
        console.warn(`[metaphone] manifest: ${e.message}`);
        return null;
      }),
      getText(`/v1/public/brands/${BRAND}/llms-blog.txt`).catch(() => null),
      getText(`/v1/public/brands/${BRAND}/llms-full.txt`).catch(() => null),
    ]);

    mkdirSync(OUT_DIR, { recursive: true });

    const articlesOut = {
      brand: BRAND,
      fetched_at: new Date().toISOString(),
      api: API,
      items: articles?.items ?? articles?.data ?? [],
      total: articles?.total ?? (articles?.items?.length ?? 0),
    };
    writeJson(join(OUT_DIR, "articles.json"), articlesOut);
    console.log(`[metaphone] wrote articles.json (${articlesOut.total} items)`);

    const pages =
      manifest?.pages ??
      (articlesOut.items || []).map((a) =>
        a.slug ? `/blog/${a.slug.replace(/^\//, "")}` : null,
      ).filter(Boolean);

    writeJson(join(OUT_DIR, "manifest.json"), {
      brand: BRAND,
      fetched_at: new Date().toISOString(),
      pages,
    });
    console.log(`[metaphone] wrote manifest.json (${pages.length} paths)`);

    if (llmsBlog) {
      writeFileSync(join(OUT_DIR, "llms-blog.txt"), llmsBlog, "utf8");
      console.log(`[metaphone] wrote llms-blog.txt (${llmsBlog.length} bytes)`);
    }
    if (llmsFull) {
      writeFileSync(join(OUT_DIR, "llms-full.txt"), llmsFull, "utf8");
      console.log(`[metaphone] wrote llms-full.txt (${llmsFull.length} bytes)`);
    }

    // Convenience: copy llms into public root if missing (SEO agents)
    for (const name of ["llms-blog.txt", "llms-full.txt"]) {
      const src = join(OUT_DIR, name);
      const dest = join(ROOT, "public", name);
      if (existsSync(src) && !existsSync(dest)) {
        writeFileSync(dest, readFileSync(src, "utf8"));
        console.log(`[metaphone] mirrored public/${name}`);
      }
    }
  } catch (err) {
    if (FAIL_SOFT) {
      console.warn(`[metaphone] fetch failed (soft): ${err.message}`);
      mkdirSync(OUT_DIR, { recursive: true });
      writeJson(join(OUT_DIR, "articles.json"), {
        items: [],
        total: 0,
        brand: BRAND,
        error: String(err.message),
      });
      writeJson(join(OUT_DIR, "manifest.json"), { pages: [], brand: BRAND });
      return;
    }
    throw err;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
