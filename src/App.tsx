import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import loadingHeart from "@/assets/loading-heart.gif";

// Lazy-load route-level components for code splitting
const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage }))
);
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((m) => ({
    default: m.ProfileDetailPage,
  }))
);

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0d]">
      <div className="flex flex-col items-center gap-3">
        <img
          src={loadingHeart}
          alt=""
          aria-hidden="true"
          className="h-14 w-14 rounded-2xl object-cover shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
        />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/profile/:username" element={<ProfileDetailPage />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
