import React, { useState } from 'react';
import { Layout, Button, Input } from '@shared/components';
import { useAuthStore } from '@shared/hooks/useAuth';
import {
  useChangePassword,
  useSendPhoneOtp,
  useVerifyPhoneOtp,
  useVerifyEmailOtp,
  useSessions,
  useLogoutSession,
  useLogoutAllSessions,
} from '@shared/hooks/useUser';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [phoneMessage, setPhoneMessage] = useState('');

  const [emailOtp, setEmailOtp] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const changePassword = useChangePassword();
  const sendPhoneOtp = useSendPhoneOtp();
  const verifyPhoneOtp = useVerifyPhoneOtp();
  const verifyEmailOtp = useVerifyEmailOtp();
  const logoutSession = useLogoutSession();
  const logoutAllSessions = useLogoutAllSessions();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword.mutateAsync({ oldPassword, newPassword });
      setPasswordSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneMessage('');
    
    try {
      await sendPhoneOtp.mutateAsync({ phone });
      setPhoneStep('verify');
      setPhoneMessage('OTP sent to your phone');
    } catch (err: any) {
      setPhoneMessage(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneMessage('');
    
    try {
      await verifyPhoneOtp.mutateAsync({ phone, otp: phoneOtp });
      setPhoneMessage('Phone verified successfully');
      setPhone('');
      setPhoneOtp('');
      setPhoneStep('input');
    } catch (err: any) {
      setPhoneMessage(err.message || 'Failed to verify OTP');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage('');
    
    try {
      await verifyEmailOtp.mutateAsync({ email: user?.email || '', otp: emailOtp });
      setEmailMessage('Email verified successfully');
      setEmailOtp('');
    } catch (err: any) {
      setEmailMessage(err.message || 'Failed to verify email');
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    if (window.confirm('Logout this session?')) {
      try {
        await logoutSession.mutateAsync(sessionId);
      } catch (err) {
        console.error('Failed to logout session:', err);
      }
    }
  };

  const handleLogoutAllSessions = async () => {
    if (window.confirm('Logout all sessions? You will be logged out.')) {
      try {
        await logoutAllSessions.mutateAsync();
      } catch (err) {
        console.error('Failed to logout all sessions:', err);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile & Settings</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Role:</span>
                <span className="text-gray-900">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email Verified:</span>
                <span className={user?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                  {user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Phone Verified:</span>
                <span className={user?.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                  {user?.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
              <Button type="submit" isLoading={changePassword.isPending}>
                Change Password
              </Button>
            </form>
          </div>

          {/* Email Verification */}
          {!user?.emailVerified && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Verify Email</h2>
              <p className="text-sm text-gray-600 mb-4">
                Check your email for the verification code
              </p>
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <Input
                  label="Verification Code"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  required
                  placeholder="Enter 6-digit code"
                />
                {emailMessage && (
                  <div className={emailMessage.includes('success') ? 'text-green-600' : 'text-red-600'}>
                    {emailMessage}
                  </div>
                )}
                <Button type="submit" isLoading={verifyEmailOtp.isPending}>
                  Verify Email
                </Button>
              </form>
            </div>
          )}

          {/* Phone Verification */}
          {!user?.phoneVerified && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Verify Phone</h2>
              {phoneStep === 'input' ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+1234567890"
                  />
                  {phoneMessage && (
                    <div className={phoneMessage.includes('success') || phoneMessage.includes('sent') ? 'text-green-600' : 'text-red-600'}>
                      {phoneMessage}
                    </div>
                  )}
                  <Button type="submit" isLoading={sendPhoneOtp.isPending}>
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <Input
                    label="Verification Code"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                  />
                  {phoneMessage && (
                    <div className={phoneMessage.includes('success') ? 'text-green-600' : 'text-red-600'}>
                      {phoneMessage}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" isLoading={verifyPhoneOtp.isPending}>
                      Verify
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setPhoneStep('input')}>
                      Change Number
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Active Sessions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Sessions</h2>
              {sessions.length > 0 && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleLogoutAllSessions}
                  isLoading={logoutAllSessions.isPending}
                >
                  Logout All
                </Button>
              )}
            </div>
            {sessionsLoading ? (
              <div className="text-sm text-gray-600">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-sm text-gray-600">No active sessions</div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="border rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{session.deviceInfo}</div>
                      <div className="text-gray-600">IP: {session.ipAddress}</div>
                      <div className="text-gray-500">
                        Last active: {new Date(session.lastAccessedAt).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleLogoutSession(session.sessionId)}
                      isLoading={logoutSession.isPending}
                    >
                      Logout
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
