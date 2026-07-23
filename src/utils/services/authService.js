import { get, post, put } from '../api';

export const authService = {
  register: (payload) => post('/auth/register', payload), // { name, email, password, role, universityId?, jobTitle?, phone? }
  verifyOTP: (payload) => post('/auth/verify-otp', payload), // { userId, otp }
  resendOTP: (userId) => post('/auth/resend-otp', { userId }),
  login: (payload) => post('/auth/login', payload), // { email, password }
  forgotPassword: (email) => post('/auth/forgot-password', { email }),
  resetPassword: (payload) => post('/auth/reset-password', payload), // { userId, otp, newPassword }
  getMe: () => get('/auth/me'),
  changePassword: (payload) => put('/auth/change-password', payload), // { currentPassword, newPassword }
};
