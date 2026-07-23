import React, { useState } from 'react';
import { FaArrowRight, FaEnvelope, FaLock } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { useNavigate } from 'react-router';
import { useAuth, ROLE_HOME } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(formData.email, formData.password);
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6'>
      <div className='bg-white w-full max-w-5xl md:rounded-3xl shadow-xl md:border border-gray-100 grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-screen md:min-h-[600px]'>

        <div className='bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white p-12 hidden md:flex flex-col justify-between relative overflow-hidden'>
          <div className='absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl'></div>
          <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl'></div>

          <div className='flex items-center gap-2 font-black text-xl tracking-wider relative z-10'>
            <span className='bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-md'>AI</span>
            <span> Study</span>
          </div>

          <div className='space-y-4 relative z-10'>
            <div className='bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-1.5 border border-white/10'>
              <LuSparkles className="text-amber-400" /> Welcome Back
            </div>
            <h2 className='text-3xl lg:text-4xl font-black leading-tight'>
              Manage Your Applications <br />Smartly.
            </h2>
            <p className='text-indigo-100/70 text-sm'>
              Log in to access your customized AI insights, dashboard trackers, and real-time wallet credits.
            </p>
          </div>

          <p className='text-xs text-indigo-200/50 relative z-10'>© 2026 Study AI . All rights reserved.</p>
        </div>

        <div className='p-8 sm:p-12 md:p-10 lg:p-16 flex flex-col justify-center bg-white'>
          <div className='space-y-2 mb-8'>
            <h3 className='text-2xl font-black text-gray-900 tracking-tight'>Welcome Back</h3>
            <p className='text-sm text-gray-500'>Please enter your details to sign in to your account.</p>
          </div>

          {error && (
            <div className='mb-5 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Email Address</label>
              <div className='relative'>
                <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="name@example.com"
                  className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <div className='flex justify-between items-center'>
                <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Password</label>
                <a href="/forgot-password" className='text-xs text-indigo-600 font-bold hover:underline'>Forgot Password?</a>
              </div>
              <div className='relative'>
                <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required
                  placeholder="••••••••"
                  className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-100 hover:shadow-xl mt-2 transform hover:-translate-y-0.5'>
              {submitting ? 'Signing In...' : <>Sign In <FaArrowRight className='text-xs' /></>}
            </button>
          </form>

          <p className='text-sm text-gray-500 text-center mt-6'>
            Don't have an account? <a href="/register" className='text-indigo-600 font-bold hover:underline'>Sign Up</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
