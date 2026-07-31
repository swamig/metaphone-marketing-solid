import { A } from "@solidjs/router";
import { Component } from "solid-js";

const Footer: Component = () => {
  return (
    <footer class="mt-auto border-t border-white/[0.06] bg-[#07070c]">
      <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:justify-between md:px-6">
        <div>
          <div class="text-sm font-bold text-white">Metaphone</div>
          <p class="mt-2 max-w-sm text-sm text-zinc-500">
            Brand content plane for marketing SSG: topics, public API, SSR cache,
            and combined LLM corpora.
          </p>
        </div>
        <div class="flex flex-wrap gap-x-10 gap-y-6 text-sm">
          <div class="space-y-2">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Product
            </div>
            <a href="https://app.metaphone.app" class="block text-zinc-400 hover:text-white">
              Console
            </a>
            <A href="/docs" class="block text-zinc-400 hover:text-white">
              Documentation
            </A>
            <A href="/docs/api-public" class="block text-zinc-400 hover:text-white">
              Public API
            </A>
          </div>
          <div class="space-y-2">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              API
            </div>
            <a
              href="https://api.metaphone.app/openapi.json"
              class="block text-zinc-400 hover:text-white"
            >
              OpenAPI
            </a>
            <a
              href="https://api.metaphone.app/v1/public/brands/ganvil/articles?limit=3"
              class="block text-zinc-400 hover:text-white"
            >
              Example: ganvil articles
            </a>
          </div>
          <div class="space-y-2">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Reference site
            </div>
            <a
              href="https://throughputlinesofcodeperday.com/llms-full.txt"
              class="block text-zinc-400 hover:text-white"
            >
              TLCPD llms-full.txt
            </a>
            <a
              href="https://throughputlinesofcodeperday.com/blog"
              class="block text-zinc-400 hover:text-white"
            >
              TLCPD blog
            </a>
          </div>
        </div>
      </div>
      <div class="border-t border-white/[0.04] py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Metaphone · S7 Works
      </div>
    </footer>
  );
};

export default Footer;
