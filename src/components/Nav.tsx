import { A, useLocation } from "@solidjs/router";
import { Component, createSignal, For, Show } from "solid-js";

const APP_URL = "https://app.metaphone.app";

const links = [
  { href: "/#pipeline", label: "Pipeline" },
  { href: "/#features", label: "Product" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/api-public", label: "API" },
];

const Nav: Component = () => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const location = useLocation();
  const path = () => location.pathname;

  return (
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07070c]/90 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <A href="/" class="flex items-center gap-2.5 no-underline shrink-0">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-[11px] font-black text-white">
            M
          </span>
          <span class="text-lg font-black tracking-[-0.04em] text-white">
            Metaphone
          </span>
        </A>

        <nav class="hidden items-center gap-1 md:flex">
          <For each={links}>
            {(l) => {
              const active = () =>
                l.href.startsWith("/docs")
                  ? path().startsWith("/docs")
                  : false;
              return (
                <A
                  href={l.href}
                  class={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    active()
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {l.label}
                </A>
              );
            }}
          </For>
          <A
            href="/login"
            class="ml-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white"
          >
            Login
          </A>
          <a
            href={APP_URL}
            class="ml-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Open Console
          </a>
        </nav>

        <button
          class="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen())}
          aria-label="Toggle menu"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <Show
              when={!menuOpen()}
              fallback={
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              }
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </Show>
          </svg>
        </button>
      </div>

      <Show when={menuOpen()}>
        <div class="space-y-1 border-t border-white/5 px-4 py-3 md:hidden">
          <For each={links}>
            {(l) => (
              <A
                href={l.href}
                class="block rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </A>
            )}
          </For>
          <A href="/login" class="block rounded-lg px-3 py-2 text-zinc-300" onClick={() => setMenuOpen(false)}>
            Login
          </A>
          <a href={APP_URL} class="block rounded-lg px-3 py-2 font-semibold text-indigo-300">
            Open Console
          </a>
        </div>
      </Show>
    </header>
  );
};

export default Nav;
