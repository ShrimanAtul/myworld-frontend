export interface UserProfile {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface SendPhoneOtpRequest {
  phone: string;
}

export interface VerifyPhoneOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

export interface Session {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  lastAccessedAt: string;
  createdAt: string;
}
