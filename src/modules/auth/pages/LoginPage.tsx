import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '@shared/components';
import { useAuthStore } from '@shared/hooks/useAuth';
import { authApi } from '@shared/api/authApi';
import { UserRole } from '@shared/types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated (only on initial mount)
  useEffect(() => {
    if (user) {
      console.log('[LoginPage] User already authenticated, redirecting...');
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[LoginPage] Starting login for:', email);
      const response = await authApi.login({ email, password });
      console.log('[LoginPage] Login response received:', response);
      
      // Map the flat response to a User object
      const userObj = {
        id: response.userId.toString(),
        email: response.email,
        role: response.role as UserRole,
        emailVerified: response.emailVerified,
        phoneVerified: response.phoneVerified,
      };
      
      console.log('[LoginPage] Mapped user object:', userObj);
      console.log('[LoginPage] Calling setAuth...');
      
      setAuth(userObj, response.accessToken);
      
      console.log('[LoginPage] setAuth completed, navigating to dashboard...');
      navigate('/dashboard');
      console.log('[LoginPage] Navigate called');
    } catch (err: any) {
      console.error('[LoginPage] Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">MyWorld.ai</h2>
          <p className="mt-2 text-gray-600">Accomplish daily in your world with AI</p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
