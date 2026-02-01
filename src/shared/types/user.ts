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
  currentPassword: string;
  newPassword: string;
}

export interface SendPhoneOtpRequest {
  phoneNumber: string;
}

export interface VerifyPhoneOtpRequest {
  phoneNumber: string;
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
