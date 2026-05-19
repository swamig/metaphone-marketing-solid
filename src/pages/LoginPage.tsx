import { Component, onMount } from 'solid-js';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const APP_URL = 'https://app.metaphone.app';

const LoginPage: Component = () => {
  onMount(() => {
    window.location.href = APP_URL;
  });

  return (
    <div class="min-h-screen flex flex-col items-center">
      <Nav />
      <main class="flex-1 flex items-center justify-center px-6">
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#3B82F6]/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-[#6366F1] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-2">Redirecting to console...</h2>
          <p class="text-gray-500 text-sm mb-6">You'll be taken to the Metaphone dashboard to sign in.</p>
          <a
            href={APP_URL}
            class="text-[#6366F1] hover:text-[#3B82F6] font-semibold text-sm transition-colors"
          >
            Click here if you're not redirected
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
