import { A, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import DocsLayout from "../../components/DocsLayout";
import DocMarkdown from "../../components/DocMarkdown";
import { getDoc } from "../../content/docs";

export default function DocsArticle() {
  const params = useParams();
  const page = () => getDoc(params.slug || "");

  return (
    <DocsLayout>
      <Show
        when={page()}
        fallback={
          <div class="max-w-2xl">
            <h1 class="text-2xl font-bold text-white">Not found</h1>
            <p class="mt-2 text-zinc-400">
              No doc for <code class="text-indigo-300">{params.slug}</code>.
            </p>
            <A href="/docs" class="mt-4 inline-block text-indigo-300 hover:underline">
              ← Docs home
            </A>
          </div>
        }
      >
        {(p) => (
          <article class="max-w-3xl">
            <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-400">
              {p().group}
            </p>
            <h1 class="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
              {p().title}
            </h1>
            <p class="mt-3 text-lg text-zinc-400 leading-relaxed">
              {p().description}
            </p>

            <For each={p().sections}>
              {(sec) => (
                <section id={sec.id} class="mt-12 scroll-mt-28">
                  <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2">
                    {sec.title}
                  </h2>
                  <Show when={sec.blurb}>
                    <p class="mt-3 text-zinc-400">{sec.blurb}</p>
                  </Show>
                  <div class="mt-4">
                    <DocMarkdown source={sec.body} />
                  </div>
                </section>
              )}
            </For>
          </article>
        )}
      </Show>
    </DocsLayout>
  );
}
