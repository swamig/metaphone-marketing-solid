import { A } from "@solidjs/router";
import { For } from "solid-js";
import DocsLayout from "../../components/DocsLayout";
import { docsByGroup } from "../../content/docs";

export default function DocsIndex() {
  return (
    <DocsLayout>
      <div class="max-w-3xl">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-400">
          Docs
        </p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
          Ship marketing sites on Metaphone
        </h1>
        <p class="mt-4 text-lg text-zinc-400 leading-relaxed">
          Production path for the portfolio: multi-site orgs, email-to-post,
          Cloudflare rebuild webhooks, build-time content fetch, optional SSR
          hash cache and{" "}
          <code class="text-indigo-300">llms-full.txt</code>. Start with{" "}
          <A href="/docs/tutorial-sites-org" class="text-indigo-300 hover:underline">
            Sites under your org
          </A>{" "}
          and{" "}
          <A href="/docs/tutorial-rebuild-webhook" class="text-indigo-300 hover:underline">
            Rebuild → Cloudflare
          </A>
          .
        </p>

        <div class="mt-10 space-y-10">
          <For each={docsByGroup()}>
            {(g) => (
              <section>
                <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  {g.label}
                </h2>
                <ul class="mt-3 grid gap-3 sm:grid-cols-2">
                  <For each={g.pages}>
                    {(p) => (
                      <li>
                        <A
                          href={`/docs/${p.slug}`}
                          class="block h-full rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-indigo-500/40 hover:bg-white/[0.04]"
                        >
                          <div class="font-semibold text-white">{p.title}</div>
                          <p class="mt-1 text-sm text-zinc-500 leading-snug">
                            {p.description}
                          </p>
                        </A>
                      </li>
                    )}
                  </For>
                </ul>
              </section>
            )}
          </For>
        </div>
      </div>
    </DocsLayout>
  );
}
