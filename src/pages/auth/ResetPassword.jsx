import React, { useState } from 'react';
import { FaCheckCircle, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { authService } from '../../utils/services/authService';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [otp, setOtp] = useState(location.state?.devOtp || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-600 font-semibold mb-4">No password reset in progress.</p>
          <a href="/forgot-password" className="text-indigo-600 font-bold hover:underline">Start over</a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.resetPassword({ userId, otp, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Could not reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6">
      <div className="bg-white w-full max-w-md md:rounded-3xl shadow-xl md:border border-gray-100 p-8 sm:p-12 min-h-screen md:min-h-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 font-black text-xl tracking-wider text-indigo-600 mb-8 justify-center">
          <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg">AI</span>
          <span>Study</span>
        </div>

        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl mx-auto">
            <FaShieldAlt />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Reset Your Password</h3>
          <p className="text-sm text-gray-500">Enter the code we sent you and choose a new password.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold rounded-xl px-4 py-3 text-center flex items-center justify-center gap-1.5">
            <FaCheckCircle /> Password reset! Redirecting to login...
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Reset Code</label>
              <input
                type="text" inputMode="numeric" maxLength={6} required value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-center text-lg tracking-[0.5em] font-black focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-100"
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
