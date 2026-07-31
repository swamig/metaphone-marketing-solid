import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";
import "./index.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DocsIndex = lazy(() => import("./pages/docs/DocsIndex"));
const DocsArticle = lazy(() => import("./pages/docs/DocsArticle"));

function Fallback() {
  return <div class="min-h-screen bg-[#07070c]" />;
}

render(
  () => (
    <Router>
      <Suspense fallback={<Fallback />}>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/docs" component={DocsIndex} />
        <Route path="/docs/" component={DocsIndex} />
        <Route path="/docs/:slug" component={DocsArticle} />
      </Suspense>
    </Router>
  ),
  document.getElementById("root")!,
);
