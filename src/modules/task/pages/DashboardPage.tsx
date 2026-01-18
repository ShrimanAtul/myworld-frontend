import React from 'react';
import { useAuthStore } from '@shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components';

const DashboardPage: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MyWorld.ai</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user?.email}</span>
              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard!</h2>
          <p className="text-gray-600">You are successfully logged in.</p>
          <div className="mt-6 space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
            <p><strong>Phone Verified:</strong> {user?.phoneVerified ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
