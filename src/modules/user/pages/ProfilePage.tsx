import React, { useState } from 'react';
import { Layout, Button, Input } from '@shared/components';
import { useAuthStore } from '@shared/hooks/useAuth';
import {
  useChangePassword,
  useSendPhoneOtp,
  useResendPhoneOtp,
  useVerifyPhoneOtp,
  useVerifyEmailOtp,
  useResendEmailOtp,
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

  const [globalSuccessMessage, setGlobalSuccessMessage] = useState('');

  const changePassword = useChangePassword();
  const sendPhoneOtp = useSendPhoneOtp();
  const resendPhoneOtp = useResendPhoneOtp();
  const verifyPhoneOtp = useVerifyPhoneOtp();
  const verifyEmailOtp = useVerifyEmailOtp();
  const resendEmailOtp = useResendEmailOtp();
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
      await changePassword.mutateAsync({ currentPassword: oldPassword, newPassword });
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
      await sendPhoneOtp.mutateAsync({ phoneNumber: phone });
      setPhoneStep('verify');
      setPhoneMessage('OTP sent to your phone');
    } catch (err: any) {
      setPhoneMessage(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneMessage('');
    setGlobalSuccessMessage('');
    
    try {
      await verifyPhoneOtp.mutateAsync({ phoneNumber: phone, otp: phoneOtp });
      setGlobalSuccessMessage('Phone verified successfully! Your account information has been updated.');
      setPhone('');
      setPhoneOtp('');
      setPhoneStep('input');
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setPhoneMessage(err.message || 'Failed to verify OTP');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage('');
    setGlobalSuccessMessage('');
    
    try {
      await verifyEmailOtp.mutateAsync({ email: user?.email || '', otp: emailOtp });
      setGlobalSuccessMessage('Email verified successfully! Your account information has been updated.');
      setEmailOtp('');
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setEmailMessage(err.message || 'Failed to verify email');
    }
  };

  const handleResendEmailOtp = async () => {
    setEmailMessage('');
    
    try {
      await resendEmailOtp.mutateAsync(user?.email || '');
      setEmailMessage('OTP resent to your email');
    } catch (err: any) {
      setEmailMessage(err.message || 'Failed to resend OTP');
    }
  };

  const handleResendPhoneOtp = async () => {
    setPhoneMessage('');
    
    try {
      await resendPhoneOtp.mutateAsync({ phoneNumber: phone });
      setPhoneMessage('OTP resent to your phone');
    } catch (err: any) {
      setPhoneMessage(err.message || 'Failed to resend OTP');
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

        {/* Global Success Message */}
        {globalSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-green-800">{globalSuccessMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  onClick={() => setGlobalSuccessMessage('')}
                  className="inline-flex text-green-400 hover:text-green-500 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

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
                  <div className={emailMessage.includes('success') || emailMessage.includes('resent') ? 'text-green-600' : 'text-red-600'}>
                    {emailMessage}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="submit" isLoading={verifyEmailOtp.isPending}>
                    Verify Email
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleResendEmailOtp}
                    isLoading={resendEmailOtp.isPending}
                  >
                    Resend OTP
                  </Button>
                </div>
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
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Check your phone for the verification code sent to <strong>{phone}</strong>
                  </p>
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                    <Input
                      label="Verification Code"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      required
                      placeholder="Enter 6-digit code"
                    />
                    {phoneMessage && (
                      <div className={phoneMessage.includes('success') || phoneMessage.includes('resent') ? 'text-green-600' : 'text-red-600'}>
                        {phoneMessage}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button type="submit" isLoading={verifyPhoneOtp.isPending}>
                        Verify Phone
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleResendPhoneOtp}
                        isLoading={resendPhoneOtp.isPending}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </form>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneStep('input');
                        setPhoneOtp('');
                        setPhoneMessage('');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Use a different phone number
                    </button>
                  </div>
                </div>
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
