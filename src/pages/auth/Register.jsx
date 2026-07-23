import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaBriefcase, FaEnvelope, FaLock, FaPhone, FaUniversity, FaUser, FaUsers } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { universityService } from '../../utils/services/universityService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    universityId: '',
    jobTitle: '',
    phone: '',
  });
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.role === 'Representative' && universities.length === 0) {
      universityService.getAll({ limit: 200 }).then((res) => setUniversities(res.data || [])).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await register(formData); // { userId, message, otp? (dev mode only) }
      navigate('/verify-otp', { state: { userId: res.userId, devOtp: res.otp } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6'>
      <div className='bg-white w-full max-w-5xl md:rounded-3xl shadow-xl md:border border-gray-100 grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-screen md:min-h-[650px]'>

        <div className='bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white p-12 hidden md:flex flex-col justify-between relative overflow-hidden'>
          <div className='absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl'></div>
          <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl'></div>

          <div className='flex items-center gap-2 font-black text-xl tracking-wider relative z-10'>
            <span className='bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-md'>AI</span>
            <span> Study</span>
          </div>

          <div className='space-y-4 relative z-10'>
            <div className='bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-1.5 border border-white/10'>
              <LuSparkles className="text-amber-400" /> Powered by Study  AI
            </div>
            <h2 className='text-3xl lg:text-4xl font-black leading-tight'>
              Start Your Global <br />Journey With Us.
            </h2>
            <p className='text-indigo-100/70 text-sm leading-relaxed'>
              Access AI-powered university recommendations, automated SOP tools, and premium agent consultancy in one secure platform.
            </p>
          </div>

          <p className='text-xs text-indigo-200/50 relative z-10'>© 2026 Study AI. All rights reserved.</p>
        </div>

        <div className='p-8 sm:p-12 md:p-10 lg:p-16 flex flex-col justify-center bg-white'>
          <div className='space-y-2 mb-8'>
            <h3 className='text-2xl font-black text-gray-900 tracking-tight'>Create an Account</h3>
            <p className='text-sm text-gray-500'>Join thousands of students and global experts today.</p>
          </div>

          {error && (
            <div className='mb-5 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Full Name</label>
              <div className='relative'>
                <FaUser className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  placeholder="John Doe"
                  className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                />
              </div>
            </div>

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
              <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Password</label>
              <div className='relative'>
                <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required
                  minLength={6}
                  placeholder="••••••••"
                  className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Join As A</label>
              <div className='relative'>
                <FaUsers className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                <select
                  name="role" value={formData.role} onChange={handleChange}
                  className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer text-gray-700'
                >
                  <option value="Student">Student (Looking for Admission)</option>
                  <option value="Agent">Agent (Independent Consultant)</option>
                  <option value="Agency">Agency (Educational Firm)</option>
                  <option value="Representative">Representative (University Staff)</option>
                </select>
              </div>
            </div>

            {formData.role === 'Representative' && (
              <div className='space-y-4 bg-slate-50 border border-slate-100 rounded-xl p-4 animate-fade-in'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Your University</label>
                  <div className='relative'>
                    <FaUniversity className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                    <select
                      name="universityId" value={formData.universityId} onChange={handleChange} required
                      className='w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer text-gray-700'
                    >
                      <option value="">Select your university...</option>
                      {universities.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.country})</option>)}
                    </select>
                  </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Job Title</label>
                    <div className='relative'>
                      <FaBriefcase className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                      <input
                        type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange}
                        placeholder="Admissions Officer"
                        className='w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all'
                      />
                    </div>
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Phone</label>
                    <div className='relative'>
                      <FaPhone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                      <input
                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="+1 555 000 0000"
                        className='w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all'
                      />
                    </div>
                  </div>
                </div>
                <p className='text-[11px] text-slate-400 font-medium'>Your account will need admin verification before you can manage applications.</p>
              </div>
            )}

            <button type="submit" disabled={submitting} className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-100 hover:shadow-xl mt-2 transform hover:-translate-y-0.5'>
              {submitting ? 'Creating Account...' : <>Create Account <FaArrowRight className='text-xs' /></>}
            </button>
          </form>

          <p className='text-sm text-gray-500 text-center mt-6'>
            Already have an account? <a href="/login" className='text-indigo-600 font-bold hover:underline'>Sign In</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
