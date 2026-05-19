import { Component, createSignal, Show } from 'solid-js';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { sendPin, verifyPin } from '../lib/auth';

const APP_URL = 'https://app.metaphone.app';

type Step = 'email' | 'sending' | 'code' | 'verifying' | 'success';

const LoginPage: Component = () => {
  const [step, setStep] = createSignal<Step>('email');
  const [email, setEmail] = createSignal('');
  const [code, setCode] = createSignal('');
  const [error, setError] = createSignal('');

  const handleSendPin = async () => {
    setError('');
    setStep('sending');
    try {
      const result = await sendPin(email());
      if (result.dev_token) setCode(result.dev_token);
      setStep('code');
    } catch (e: any) {
      setError(e.message || 'Failed to send sign-in code');
      setStep('email');
    }
  };

  const handleVerify = async () => {
    setError('');
    setStep('verifying');
    try {
      const token = await verifyPin(code());
      setStep('success');
      window.location.href = `${APP_URL}?auth_token=${encodeURIComponent(token)}`;
    } catch (e: any) {
      setError(e.message || 'Invalid or expired code');
      setStep('code');
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center">
      <Nav />

      <main class="flex-1 flex items-center justify-center px-6 pt-24">
        <div class="w-full max-w-md">
          <div class="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-black tracking-[-0.03em] bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2">
                METAPHONE
              </h1>
              <p class="text-gray-500 text-sm">Sign in to your console</p>
            </div>

            <Show when={error()}>
              <div class="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">
                {error()}
              </div>
            </Show>

            {/* Step 1: Email */}
            <Show when={step() === 'email' || step() === 'sending'}>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email address</label>
                  <input
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === 'Enter' && email() && handleSendPin()}
                    placeholder="you@company.com"
                    autofocus
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
                  />
                </div>
                <button
                  onClick={handleSendPin}
                  disabled={!email() || step() === 'sending'}
                  class="w-full bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white font-semibold py-3.5 rounded-xl transition-all hover:opacity-90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step() === 'sending' ? 'Sending...' : 'Send sign-in code'}
                </button>
              </div>
            </Show>

            {/* Step 2: Verify code */}
            <Show when={step() === 'code' || step() === 'verifying'}>
              <div class="space-y-4">
                <p class="text-sm text-gray-400 mb-2">
                  A sign-in code was sent to <strong class="text-white">{email()}</strong>. Paste it below.
                </p>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sign-in code</label>
                  <input
                    type="text"
                    value={code()}
                    onInput={(e) => setCode(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === 'Enter' && code() && handleVerify()}
                    placeholder="Paste the code from your email"
                    autofocus
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/30 transition-all font-mono"
                  />
                </div>
                <div class="flex gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={!code() || step() === 'verifying'}
                    class="flex-1 bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white font-semibold py-3.5 rounded-xl transition-all hover:opacity-90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step() === 'verifying' ? 'Verifying...' : 'Sign in'}
                  </button>
                  <button
                    onClick={() => { setStep('email'); setCode(''); setError(''); }}
                    class="px-4 py-3.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    Back
                  </button>
                </div>
              </div>
            </Show>

            {/* Step 3: Success / redirecting */}
            <Show when={step() === 'success'}>
              <div class="text-center py-4">
                <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#3B82F6]/20 flex items-center justify-center">
                  <svg class="w-6 h-6 text-[#6366F1] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p class="text-white font-semibold mb-1">Signed in successfully</p>
                <p class="text-gray-500 text-sm">Redirecting to console...</p>
              </div>
            </Show>
          </div>

          <p class="text-center text-xs text-gray-600 mt-6">
            Authentication powered by <a href="https://buttrbase.com" class="text-gray-500 hover:text-white transition-colors">Buttrbase</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
