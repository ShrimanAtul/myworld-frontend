import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';
import DashboardPage from '../modules/task/pages/DashboardPage';
import MyWorkspacePage from '../modules/task/pages/MyWorkspacePage';
import ProfilePage from '../modules/user/pages/ProfilePage';
import PricingPage from '../modules/subscription/pages/PricingPage';
import SubscriptionsPage from '../modules/subscription/pages/SubscriptionsPage';
import AiAnalysisPage from '../modules/ai/pages/AiAnalysisPage';
import { useAuthStore } from '../shared/hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken } = useAuthStore();
  
  console.log('[ProtectedRoute] Checking auth:', { hasUser: !!user, hasToken: !!accessToken });
  
  if (!user || !accessToken) {
    console.log('[ProtectedRoute] No user or token, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('[ProtectedRoute] User authenticated, rendering protected content');
  return <>{children}</>;
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <MyWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AiAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
