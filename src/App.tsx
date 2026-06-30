import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
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
