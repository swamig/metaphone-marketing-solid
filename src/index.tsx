import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { lazy, Suspense } from 'solid-js';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

render(
  () => (
    <Router>
      <Suspense fallback={<div class="min-h-screen bg-[#0A0A0F]" />}>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
      </Suspense>
    </Router>
  ),
  document.getElementById('root')!,
);
