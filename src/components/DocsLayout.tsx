import { A, useParams } from "@solidjs/router";
import { For, type JSX, type ParentProps } from "solid-js";
import Nav from "./Nav";
import Footer from "./Footer";
import { docsByGroup, getDoc } from "../content/docs";

export default function DocsLayout(props: ParentProps): JSX.Element {
  const params = useParams();
  const groups = () => docsByGroup();
  const active = () => params.slug || "overview";

  return (
    <div class="min-h-screen flex flex-col bg-[#07070c] text-zinc-100">
      <Nav />
      <div class="mx-auto w-full max-w-7xl flex-1 px-4 pt-24 pb-16 md:px-6 lg:flex lg:gap-10">
        <aside class="mb-10 lg:mb-0 lg:w-64 lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
          <p class="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-400/80">
            Documentation
          </p>
          <nav class="space-y-6 text-sm">
            <For each={groups()}>
              {(g) => (
                <div>
                  <div class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {g.label}
                  </div>
                  <ul class="space-y-0.5 border-l border-white/10">
                    <For each={g.pages}>
                      {(p) => {
                        const isActive = () => active() === p.slug;
                        return (
                          <li>
                            <A
                              href={`/docs/${p.slug}`}
                              class={`block border-l-2 py-1.5 pl-3 -ml-px transition-colors ${
                                isActive()
                                  ? "border-indigo-400 text-white"
                                  : "border-transparent text-zinc-400 hover:text-zinc-200"
                              }`}
                            >
                              {p.title}
                            </A>
                          </li>
                        );
                      }}
                    </For>
                  </ul>
                </div>
              )}
            </For>
          </nav>
          <div class="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-zinc-400">
            <div class="font-semibold text-zinc-200 mb-1">API host</div>
            <code class="text-indigo-300 break-all">api.metaphone.app</code>
            <div class="mt-3 font-semibold text-zinc-200 mb-1">OpenAPI</div>
            <a
              href="https://api.metaphone.app/openapi.json"
              class="text-indigo-300 hover:underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              /openapi.json
            </a>
          </div>
        </aside>
        <main class="min-w-0 flex-1">
          {props.children}
          {/* Bottom prev/next */}
          <DocPager slug={active()} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function DocPager(props: { slug: string }) {
  const flat = () =>
    docsByGroup().flatMap((g) => g.pages.map((p) => p));
  const idx = () => flat().findIndex((p) => p.slug === props.slug);
  const prev = () => (idx() > 0 ? flat()[idx() - 1] : null);
  const next = () => {
    const i = idx();
    return i >= 0 && i < flat().length - 1 ? flat()[i + 1] : null;
  };
  const cur = () => getDoc(props.slug);

  return (
    <div class="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
      {prev() ? (
        <A
          href={`/docs/${prev()!.slug}`}
          class="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm hover:border-indigo-500/40"
        >
          <div class="text-[10px] uppercase tracking-wider text-zinc-500">Previous</div>
          <div class="font-semibold text-zinc-200 group-hover:text-white">
            {prev()!.title}
          </div>
        </A>
      ) : (
        <span />
      )}
      {next() ? (
        <A
          href={`/docs/${next()!.slug}`}
          class="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-right hover:border-indigo-500/40"
        >
          <div class="text-[10px] uppercase tracking-wider text-zinc-500">Next</div>
          <div class="font-semibold text-zinc-200 group-hover:text-white">
            {next()!.title}
          </div>
        </A>
      ) : cur() ? null : null}
    </div>
  );
}
