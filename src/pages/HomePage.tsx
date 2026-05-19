import { Component, For } from 'solid-js';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const APP_URL = 'https://app.metaphone.app';

const features = [
  {
    title: 'Brands',
    desc: 'Manage brand entities across your entire org. Logos, voice, guidelines — one source of truth.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
    ),
  },
  {
    title: 'Campaigns',
    desc: 'Organize content by campaign. Track deliverables, timelines, and cross-channel performance.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
  },
  {
    title: 'Assets',
    desc: 'Media files linked to brands. Upload, tag, version, and distribute creative across channels.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),
  },
  {
    title: 'Postings',
    desc: 'Approval workflows and publishing pipelines. Draft, review, approve, and ship — without the spreadsheet.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    ),
  },
  {
    title: 'Factory Runs',
    desc: 'AI-powered content generation pipelines. Define templates, feed data, produce at scale.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
  },
  {
    title: 'Sites & Pages',
    desc: 'Full CMS with a block-based editor. Build landing pages, microsites, and documentation.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
    ),
  },
  {
    title: 'Blog',
    desc: 'Publish posts per site with SEO built in. Markdown-native, fast, and beautifully rendered.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    ),
  },
  {
    title: 'Social',
    desc: 'Link social accounts and schedule cross-platform posts. One calendar, every channel.',
    icon: () => (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
    ),
  },
];

const steps = [
  { num: '01', title: 'Define your brand', desc: 'Set up brand identity, voice guidelines, and creative assets in one place.' },
  { num: '02', title: 'Plan campaigns', desc: 'Create campaigns with deliverables, assign content to channels, and set timelines.' },
  { num: '03', title: 'Generate & publish', desc: 'Use factory runs to produce content at scale, then push to sites, blogs, and social — all from one dashboard.' },
];

const HomePage: Component = () => {
  return (
    <div class="min-h-screen flex flex-col items-center">
      <Nav />

      <main class="w-full flex flex-col items-center">
        {/* Hero */}
        <section class="w-full max-w-5xl text-center px-6 pt-40 pb-32 space-y-8">
          <div class="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 font-medium tracking-wide mb-4">
            CMS + SOCIAL + CAMPAIGNS + AI CONTENT
          </div>
          <h2 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.95]">
            Content operations,{' '}
            <span class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
              unified.
            </span>
          </h2>
          <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Manage brands, plan campaigns, generate content, publish sites, and schedule social posts — from a single platform built for teams that ship.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href={APP_URL}
              class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-opacity inline-block"
            >
              Open Console
            </a>
            <a
              href="#features"
              class="border border-white/15 px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/5 transition-colors inline-block"
            >
              See Features
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" class="w-full max-w-7xl px-6 py-32">
          <div class="text-center mb-20">
            <h3 class="text-4xl md:text-5xl font-black tracking-tight">
              Everything you need to{' '}
              <span class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">ship content</span>
            </h3>
            <p class="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              Eight modules, one workflow. No more switching between five tools to get a post live.
            </p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <For each={features}>
              {(f) => (
                <div class="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06] hover:border-[#6366F1]/30 transition-colors group">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1]/20 to-[#3B82F6]/20 flex items-center justify-center text-[#6366F1] mb-4 group-hover:from-[#6366F1]/30 group-hover:to-[#3B82F6]/30 transition-colors">
                    {f.icon()}
                  </div>
                  <h4 class="text-lg font-bold mb-2">{f.title}</h4>
                  <p class="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" class="w-full max-w-5xl px-6 py-32">
          <div class="text-center mb-20">
            <h3 class="text-4xl md:text-5xl font-black tracking-tight">
              From idea to published in{' '}
              <span class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">three steps</span>
            </h3>
          </div>
          <div class="space-y-8">
            <For each={steps}>
              {(s) => (
                <div class="flex gap-8 items-start">
                  <div class="text-5xl font-black text-white/[0.06] shrink-0 w-20">{s.num}</div>
                  <div class="border-l border-white/10 pl-8 py-2">
                    <h4 class="text-2xl font-bold mb-2">{s.title}</h4>
                    <p class="text-gray-400 text-lg">{s.desc}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* Platform / Tech */}
        <section id="platform" class="w-full max-w-7xl px-6 py-32">
          <div class="bg-gradient-to-br from-[#6366F1]/10 to-[#3B82F6]/5 rounded-3xl border border-white/[0.06] p-12 md:p-20 text-center">
            <h3 class="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Built for speed and scale
            </h3>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
              Rust backend delivering sub-millisecond API responses. Federated authentication through Buttrbase. Real-time content sync across every channel.
            </p>
            <div class="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div>
                <div class="text-3xl font-black bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2">&lt;1ms</div>
                <div class="text-sm text-gray-500">API response time</div>
              </div>
              <div>
                <div class="text-3xl font-black bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2">8</div>
                <div class="text-sm text-gray-500">Integrated modules</div>
              </div>
              <div>
                <div class="text-3xl font-black bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2">1</div>
                <div class="text-sm text-gray-500">Unified dashboard</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section class="w-full max-w-4xl px-6 py-32 text-center">
          <h3 class="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Start building with{' '}
            <span class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">Metaphone</span>
          </h3>
          <p class="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Stop juggling tools. Manage your entire content operation from one place.
          </p>
          <a
            href={APP_URL}
            class="bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white px-12 py-5 rounded-xl text-xl font-bold hover:opacity-90 transition-opacity inline-block"
          >
            Open Console
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
