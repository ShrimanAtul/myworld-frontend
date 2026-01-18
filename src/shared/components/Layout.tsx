import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/dashboard">
                <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  MyWorld.ai
                </h1>
              </Link>
              <div className="flex gap-1">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/tasks')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tasks
                </Link>
                <Link
                  to="/ai"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/ai')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  AI
                </Link>
                <Link
                  to="/subscriptions"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/subscriptions') || isActive('/pricing')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Subscriptions
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button onClick={handleLogout} variant="secondary" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
