import React, { useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../utils/services/authService';
import { ROLE_HOME } from '../../context/AuthContext';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  const userId = location.state?.userId;
  const [otp, setOtp] = useState(location.state?.devOtp || '');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-600 font-semibold mb-4">No pending registration found.</p>
          <a href="/register" className="text-indigo-600 font-bold hover:underline">Go back to Register</a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await verifyOTP(userId, otp);
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);
    try {
      const res = await authService.resendOTP(userId);
      setInfo(res.otp ? `OTP resent! (Dev mode code: ${res.otp})` : 'OTP resent! Check your email.');
    } catch (err) {
      setError(err.message || 'Could not resend OTP.');
    } finally {
      setResending(false);
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
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verify Your Email</h3>
          <p className="text-sm text-gray-500">Enter the 6-digit code we sent to your email address.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold rounded-xl px-4 py-3 text-center flex items-center justify-center gap-1.5">
            <LuSparkles /> {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">One-Time Code</label>
            <input
              type="text" inputMode="numeric" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required placeholder="123456"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-center text-lg tracking-[0.5em] font-black focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit" disabled={submitting || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-100"
          >
            {submitting ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <button
          onClick={handleResend} disabled={resending}
          className="text-sm text-indigo-600 font-bold hover:underline mt-6 text-center disabled:opacity-50"
        >
          {resending ? 'Resending...' : "Didn't get a code? Resend"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
