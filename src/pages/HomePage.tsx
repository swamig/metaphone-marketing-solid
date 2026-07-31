import { A } from "@solidjs/router";
import { Component, For } from "solid-js";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const APP_URL = "https://app.metaphone.app";
const API = "https://api.metaphone.app";

const pillars = [
  {
    title: "Brand CMS",
    desc: "Topics, assets, sites, campaigns — publish once under a brand slug.",
    tag: "Console",
  },
  {
    title: "Public content API",
    desc: "ETag-aware articles list, page payloads, video manifest for SSG pulls.",
    tag: "Build",
  },
  {
    title: "SSR artifact cache",
    desc: "Store prerendered HTML & llms.txt by content_hash. Rebuild only what changed.",
    tag: "Deploy",
  },
];

const steps = [
  {
    n: "01",
    t: "Publish in Console",
    d: "Editors mark topics published. Brand slug becomes the public namespace.",
  },
  {
    n: "02",
    t: "Sync at build time",
    d: "build-content hits the public API with If-None-Match. 304 → reuse local bundle.",
  },
  {
    n: "03",
    t: "Prerender + cache",
    d: "Solid renderToString for marketing + blog. PUT HTML to Metaphone SSR when hash misses.",
  },
  {
    n: "04",
    t: "Combine for agents",
    d: "postbuild merges site content + Metaphone blog into llms-full.txt, sitemaps, robots.",
  },
];

const endpoints = [
  {
    method: "GET",
    path: "/v1/public/brands/{slug}/articles",
    note: "List posts · ETag / 304",
  },
  {
    method: "GET",
    path: "/v1/public/brands/{slug}/pages/{page}",
    note: "Full topic or CMS page",
  },
  {
    method: "GET",
    path: "/v1/public/brands/{slug}/ssr/{*path}",
    note: "Cached HTML or text artifact",
  },
  {
    method: "PUT",
    path: "/v1/public/brands/{slug}/ssr/{*path}",
    note: "Upload · X-SSR-Token",
  },
];

const HomePage: Component = () => {
  return (
    <div class="min-h-screen flex flex-col bg-[#07070c] text-zinc-100">
      <Nav />

      <main class="flex-1">
        {/* Hero */}
        <section class="relative overflow-hidden border-b border-white/5">
          <div
            class="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(800px 400px at 70% -10%, rgba(99,102,241,.25), transparent 60%), radial-gradient(600px 300px at 10% 80%, rgba(59,130,246,.12), transparent 50%)",
            }}
          />
          <div class="relative mx-auto max-w-6xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-indigo-300">
              CMS · Public API · SSR cache · LLM corpora
            </div>
            <h1 class="mt-6 max-w-4xl text-4xl font-black tracking-[-0.04em] leading-[1.05] text-white md:text-6xl lg:text-7xl">
              Content that{" "}
              <span class="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                ships with your build
              </span>
              .
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Metaphone is the brand content plane for marketing sites: publish
              topics in the console, pull them with an ETag-aware public API,
              prerender Solid HTML, and cache SSR +{" "}
              <code class="text-indigo-300">llms-full.txt</code> so rebuilds only
              pay for what changed.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a
                href={APP_URL}
                class="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                Open Console
              </a>
              <A
                href="/docs"
                class="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white hover:bg-white/[0.06]"
              >
                Read the docs
              </A>
              <A
                href="/docs/api-public"
                class="rounded-xl border border-transparent px-6 py-3 text-sm font-semibold text-zinc-400 hover:text-white"
              >
                API reference →
              </A>
            </div>

            {/* Live example strip */}
            <div class="mt-14 grid gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-[12px] text-zinc-400 md:grid-cols-3">
              <div>
                <div class="text-[10px] uppercase tracking-wider text-zinc-600">
                  Brand
                </div>
                <div class="mt-1 text-indigo-300">ganvil</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-wider text-zinc-600">
                  Public read
                </div>
                <a
                  href={`${API}/v1/public/brands/ganvil/articles?limit=3`}
                  class="mt-1 block truncate text-indigo-300 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  …/brands/ganvil/articles
                </a>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-wider text-zinc-600">
                  Combined corpus
                </div>
                <a
                  href="https://throughputlinesofcodeperday.com/llms-full.txt"
                  class="mt-1 block truncate text-indigo-300 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  tlcpd /llms-full.txt
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section id="features" class="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <h2 class="text-3xl font-black tracking-tight text-white md:text-4xl">
            Three surfaces, one brand
          </h2>
          <p class="mt-3 max-w-xl text-zinc-400">
            Editors work in the console. Builds speak HTTP. Edge serves static
            HTML and machine-readable text.
          </p>
          <div class="mt-12 grid gap-4 md:grid-cols-3">
            <For each={pillars}>
              {(p) => (
                <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-indigo-400">
                    {p.tag}
                  </span>
                  <h3 class="mt-3 text-lg font-bold text-white">{p.title}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* Pipeline */}
        <section id="pipeline" class="border-y border-white/5 bg-white/[0.015]">
          <div class="mx-auto max-w-6xl px-4 py-24 md:px-6">
            <h2 class="text-3xl font-black tracking-tight text-white md:text-4xl">
              The marketing build pipeline
            </h2>
            <p class="mt-3 max-w-2xl text-zinc-400">
              What production sites actually run — not a fictional CMS plugin.
            </p>
            <div class="mt-12 space-y-4">
              <For each={steps}>
                {(s) => (
                  <div class="flex gap-4 items-start rounded-2xl border border-white/10 bg-[#0c0c14] p-5 md:gap-6 md:p-6">
                    <div
                      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/15 font-mono text-sm font-bold tabular-nums tracking-tight text-indigo-200 md:h-12 md:w-12 md:text-base"
                      aria-hidden="true"
                    >
                      {s.n}
                    </div>
                    <div class="min-w-0 pt-0.5">
                      <h3 class="text-lg font-bold text-white">{s.t}</h3>
                      <p class="mt-1 text-sm leading-relaxed text-zinc-400">{s.d}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
            <div class="mt-8">
              <A
                href="/docs/architecture"
                class="text-sm font-semibold text-indigo-300 hover:underline"
              >
                Full architecture diagram in docs →
              </A>
            </div>
          </div>
        </section>

        {/* API teaser */}
        <section class="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 class="text-3xl font-black tracking-tight text-white md:text-4xl">
                Public API, built for SSG
              </h2>
              <p class="mt-3 max-w-xl text-zinc-400">
                Conditional GETs, SSR path cache, sitemaps. Auth only for
                uploads and console.
              </p>
            </div>
            <A
              href="/docs/api-public"
              class="shrink-0 text-sm font-semibold text-indigo-300 hover:underline"
            >
              Full API docs →
            </A>
          </div>
          <div class="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <For each={endpoints}>
              {(e, i) => (
                <div
                  class={`flex flex-col gap-1 border-b border-white/5 px-4 py-3 font-mono text-[12px] last:border-0 sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${
                    i() % 2 === 0 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <span class="w-12 shrink-0 font-bold text-indigo-400">
                    {e.method}
                  </span>
                  <code class="flex-1 text-zinc-200 break-all">{e.path}</code>
                  <span class="text-zinc-500">{e.note}</span>
                </div>
              )}
            </For>
          </div>
          <pre class="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0c0c14] p-5 text-[12px] leading-6 text-indigo-100">
{`# Unchanged content → empty body
ETAG=$(curl -sSI ${API}/v1/public/brands/ganvil/articles?limit=1000 \\
  | awk -F': ' 'tolower($1)=="etag"{print $2}' | tr -d '\\r')
curl -sSI -H "If-None-Match: $ETAG" \\
  ${API}/v1/public/brands/ganvil/articles?limit=1000 | head -3
# HTTP/2 304`}
          </pre>
        </section>

        {/* CTA */}
        <section class="border-t border-white/5">
          <div class="mx-auto max-w-4xl px-4 py-24 text-center md:px-6">
            <h2 class="text-3xl font-black tracking-tight text-white md:text-5xl">
              Start with docs, ship with the pipeline
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-zinc-400">
              Tutorials cover connecting a Solid site, blog SSR, hash caches,
              combined llms.txt, and the public API with live ganvil examples.
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-3">
              <A
                href="/docs/overview"
                class="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-8 py-3.5 text-sm font-bold text-white hover:opacity-90"
              >
                What Metaphone is
              </A>
              <A
                href="/docs/tutorial-connect-site"
                class="rounded-xl border border-white/15 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/5"
              >
                Connect a site
              </A>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
