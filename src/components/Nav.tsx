import { A } from '@solidjs/router';
import { Component, createSignal, Show } from 'solid-js';

const APP_URL = 'https://app.metaphone.app';

const Nav: Component = () => {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
        <A href="/" class="text-2xl font-black tracking-[-0.06em] bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
          METAPHONE
        </A>

        <nav class="hidden md:flex items-center gap-8 text-sm">
          <a href="/#features" class="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="/#workflow" class="text-gray-400 hover:text-white transition-colors">Workflow</a>
          <a href="/#platform" class="text-gray-400 hover:text-white transition-colors">Platform</a>
          <A href="/login" class="text-gray-400 hover:text-white transition-colors">Login</A>
          <a
            href={APP_URL}
            class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Open Console
          </a>
        </nav>

        <button
          class="md:hidden text-gray-400 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen())}
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <Show when={!menuOpen()} fallback={<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />}>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </Show>
          </svg>
        </button>
      </div>

      <Show when={menuOpen()}>
        <div class="md:hidden bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3">
          <a href="/#features" class="block py-2 text-gray-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="/#workflow" class="block py-2 text-gray-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Workflow</a>
          <a href="/#platform" class="block py-2 text-gray-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Platform</a>
          <A href="/login" class="block py-2 text-gray-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Login</A>
          <a href={APP_URL} class="block py-2 text-[#6366F1] font-semibold" onClick={() => setMenuOpen(false)}>Open Console</a>
        </div>
      </Show>
    </header>
  );
};

export default Nav;
