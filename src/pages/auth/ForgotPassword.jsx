import React, { useState } from 'react';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { authService } from '../../utils/services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await authService.forgotPassword(email);
      navigate('/reset-password', { state: { email, userId: res.userId, devOtp: res.otp } });
    } catch (err) {
      setError(err.message || 'Could not send reset code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6'>
      <div className='bg-white w-full max-w-md md:rounded-3xl shadow-xl md:border border-gray-100 p-8 sm:p-12 min-h-screen md:min-h-0 flex flex-col justify-center'>
        <div className='flex items-center gap-2 font-black text-xl tracking-wider text-indigo-600 mb-8 justify-center'>
          <span className='bg-indigo-600 text-white px-2.5 py-1 rounded-lg'>AI</span>
          <span>Study</span>
        </div>

        <div className='text-center space-y-2 mb-8'>
          <div className='w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl mx-auto'>
            <FaKey />
          </div>
          <h3 className='text-2xl font-black text-gray-900 tracking-tight'>Forgot Password?</h3>
          <p className='text-sm text-gray-500'>Enter your email and we'll send you a reset code.</p>
        </div>

        {error && (
          <div className='mb-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Email Address</label>
            <div className='relative'>
              <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
              />
            </div>
          </div>

          <button
            type="submit" disabled={submitting}
            className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-100'
          >
            {submitting ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        <p className='text-sm text-gray-500 text-center mt-6'>
          Remembered your password? <a href="/login" className='text-indigo-600 font-bold hover:underline'>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
