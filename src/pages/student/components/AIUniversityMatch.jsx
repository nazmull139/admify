import React, { useState } from 'react';
import { FaAward, FaCheckCircle, FaCoins, FaGraduationCap, FaSearchLocation } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { aiService } from '../../../utils/services/aiService';

const AIUniversityMatch = () => {
  const [profile, setProfile] = useState({ cgpa: '', ielts: '', budget: '', country: 'USA', subject: '' });
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMsg('');
    try {
      const res = await aiService.getUniversityMatch(profile);
      setResults(res.data?.universities || []);
      setInfoMsg(res.message || '');
      setShowResult(true);
    } catch (err) {
      setError(err.message || 'Could not fetch matches. This feature may need a Pro plan or more credits.');
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-8 animate-fade-in'>
      <div className='bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl'></div>
        <div className='relative z-10'>
          <div className='bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-indigo-500/20 mb-2'>
            <LuSparkles className='text-amber-400' /> Premium AI Feature
          </div>
          <h2 className='text-xl font-black tracking-tight'>Gemini AI University Matcher</h2>
          <p className='text-xs text-slate-400 mt-0.5'>Input your academic profile to get real-time match scores and recommendations.</p>
        </div>
        <div className='bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-bold shrink-0 relative z-10'>
          <FaCoins className='text-amber-400 text-sm' /> Included with your plan
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>

        <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 lg:col-span-1'>
          <h3 className='font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-50 pb-3 text-slate-500'>Academic Profile</h3>

          <form onSubmit={handleSearch} className='space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Your CGPA (Out of 4.0)</label>
              <input type="number" step="0.01" min="2.0" max="4.0" name="cgpa" required value={profile.cgpa} onChange={handleChange} placeholder="e.g. 3.75" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>IELTS / English Score</label>
              <input type="number" step="0.5" min="4.0" max="9.0" name="ielts" required value={profile.ielts} onChange={handleChange} placeholder="e.g. 7.0" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Max Yearly Budget ($)</label>
              <input type="number" name="budget" required value={profile.budget} onChange={handleChange} placeholder="e.g. 15000 (in USD)" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Preferred Subject</label>
              <input type="text" name="subject" value={profile.subject} onChange={handleChange} placeholder="e.g. Computer Science" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Target Country</label>
              <select name="country" value={profile.country} onChange={handleChange} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700 cursor-pointer'>
                <option value="USA">United States (USA)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 text-sm mt-2'>
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Analyzing with Gemini...</span>
                </>
              ) : (
                <>
                  <LuSparkles className='text-amber-400' />
                  <span>Find My Matches</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className='lg:col-span-2 space-y-4'>
          {error && (
            <div className='bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl p-6'>
              {error}
            </div>
          )}

          {!showResult && !loading && !error && (
            <div className='bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px]'>
              <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-2xl mb-4'><FaSearchLocation /></div>
              <h4 className='font-black text-slate-700 text-base'>No Active Search Yet</h4>
              <p className='text-xs max-w-xs mt-1 leading-relaxed'>Fill out your academic credentials on the left configuration panel and trigger the Gemini Engine.</p>
            </div>
          )}

          {loading && (
            <div className='bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm'>
              <div className='relative w-16 h-16 mb-4'>
                <div className='absolute inset-0 border-4 border-indigo-100 rounded-full'></div>
                <div className='absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
              </div>
              <h4 className='font-black text-slate-800 text-base animate-pulse'>Consulting Gemini Intelligence Model...</h4>
              <p className='text-xs text-slate-400 mt-1 max-w-xs'>Evaluating data parameters against live university admission models and funding metrics.</p>
            </div>
          )}

          {showResult && !loading && (
            <div className='space-y-4 animate-fade-in'>
              <h3 className='font-black text-slate-900 text-sm uppercase tracking-wider text-slate-500 pl-1'>Recommended Universities</h3>

              {results.length === 0 && (
                <div className='bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 font-semibold'>
                  {infoMsg || 'No matches found. Try adjusting your budget or requirements.'}
                </div>
              )}

              {results.map((uni, idx) => (
                <div key={idx} className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4 hover:border-indigo-200 transition-all group'>
                  <div className='space-y-3 flex-1'>
                    <div className='flex items-center gap-2.5'>
                      <div className='w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold'><FaGraduationCap /></div>
                      <div>
                        <h4 className='font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors'>{uni.name}</h4>
                        <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>{uni.country}</p>
                      </div>
                    </div>
                    <p className='text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/60 font-medium'>{uni.reason}</p>
                    {uni.tip && (
                      <p className='text-[11px] text-indigo-500 leading-relaxed font-semibold'>💡 {uni.tip}</p>
                    )}
                    <div className='flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit'><FaAward /> Scholarship: {uni.scholarship}</div>
                  </div>

                  <div className='shrink-0 bg-indigo-50/60 border border-indigo-100/40 p-4 rounded-2xl flex flex-col items-center justify-center w-full md:w-24 text-center'>
                    <span className='text-2xl font-black text-indigo-600 tracking-tight'>{uni.matchScore}</span>
                    <span className='text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-0.5 flex items-center gap-1'><FaCheckCircle className='text-emerald-500 text-[9px]' /> Match</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIUniversityMatch;
