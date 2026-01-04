import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AuthGuard from './components/AuthGuard';

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage.tsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.tsx'));
const FishermanLogin = lazy(() => import('./pages/FishermanLogin.tsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));
const FishermanDashboard = lazy(() => import('./pages/FishermanDashboard.tsx'));

// Loading Fallback
const Loading = () => (
  <div className="min-h-screen bg-background-dark flex items-center justify-center text-primary">
    Loading...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/fisherman" element={<FishermanLogin />} />

            {/* Protected Routes */}
            <Route element={<AuthGuard role="admin" />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>

            <Route path="/dashboard" element={<FishermanDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
