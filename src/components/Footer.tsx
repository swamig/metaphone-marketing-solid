import { Component } from 'solid-js';

const Footer: Component = () => {
  return (
    <footer class="w-full max-w-7xl mx-auto border-t border-white/[0.06] py-12 px-6 mt-16 flex flex-col md:flex-row justify-between items-center text-gray-600 gap-8">
      <p class="text-sm">&copy; 2026 Metaphone. Content operations, unified.</p>
      <div class="flex gap-8 text-sm">
        <a href="#" class="hover:text-white transition-colors">Privacy</a>
        <a href="#" class="hover:text-white transition-colors">Terms</a>
        <a href="https://github.com/S7-Works" class="hover:text-white transition-colors">GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;
