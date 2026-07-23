import React, { useState } from 'react';
import { FaCheck, FaCopy, FaFileAlt, FaGraduationCap, FaUserTie } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { aiService } from '../../../utils/services/aiService';

const AILORGenerator = () => {
  const [formData, setFormData] = useState({
    recommenderName: '',
    recommenderTitle: '',
    specialSkillFocused: '',
    studentName: '',
    subject: '',
  });

  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await aiService.generateLOR(formData);
      setAiResponse(res.lor || '');
    } catch (err) {
      setError(err.message || 'Could not generate your LOR. This feature may require a Pro plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='space-y-8 animate-fade-in'>
      <div className='bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl'></div>
        <div>
          <div className='bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 border border-indigo-500/20 mb-2'>
            <LuSparkles className='text-amber-400' /> Gemini Intelligence Engine
          </div>
          <h2 className='text-xl font-black tracking-tight'>AI LOR Generator</h2>
          <p className='text-xs text-slate-400 mt-0.5'>Generate a professional Letter of Recommendation tailored to your program and recommender.</p>
        </div>
        <div className='bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-bold shrink-0'>
          Included with your plan
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>

        <form onSubmit={handleGenerate} className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-5'>
          <h3 className='font-black text-slate-900 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 text-slate-500'>LOR Configurations</h3>

          {error && (
            <div className='bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl px-4 py-3'>
              {error}
            </div>
          )}

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5'><FaGraduationCap className='text-indigo-500 text-[11px]' /> Student Name</label>
            <input type="text" name="studentName" required value={formData.studentName} onChange={handleChange} placeholder="Your full name" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Target Subject / Program</label>
            <input type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="e.g. MSc in Data Science" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5'><FaUserTie className='text-indigo-500 text-[11px]' /> Recommender Name</label>
              <input type="text" name="recommenderName" required value={formData.recommenderName} onChange={handleChange} placeholder="Dr. Jane Smith" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Recommender Title</label>
              <input type="text" name="recommenderTitle" required value={formData.recommenderTitle} onChange={handleChange} placeholder="Professor of CS" className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800' />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Special Skill / Focus Area</label>
            <textarea name="specialSkillFocused" rows="3" placeholder="e.g. Exceptional analytical problem-solving skills demonstrated in..." value={formData.specialSkillFocused} onChange={handleChange} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 resize-none' />
          </div>

          <button type="submit" disabled={loading} className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 text-sm mt-2'>
            {loading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Drafting with Gemini AI...</span>
              </>
            ) : (
              <>
                <FaUserTie className='text-amber-400' />
                <span>Generate My LOR</span>
              </>
            )}
          </button>
        </form>

        <div className='lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[490px]'>
          <div className='px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0'>
            <span className='text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2'><FaFileAlt className='text-slate-500' /> Output Document Panel</span>
            {aiResponse && (
              <button onClick={handleCopy} className='flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors px-3 py-1.5 rounded-lg'>
                {copied ? <><FaCheck className='text-emerald-500' /> Copied!</> : <><FaCopy /> Copy Document</>}
              </button>
            )}
          </div>

          <div className='p-6 flex-1 flex flex-col justify-center'>
            {loading && (
              <div className='text-center space-y-3 py-12'>
                <div className='w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto'></div>
                <p className='text-sm font-bold text-slate-700 animate-pulse'>Gemini AI is drafting your letter...</p>
                <p className='text-xs text-slate-400 max-w-xs mx-auto'>Aligning tone and structure with recommendation letter standards.</p>
              </div>
            )}

            {!aiResponse && !loading && (
              <div className='text-center py-12 text-slate-300 space-y-2'>
                <FaFileAlt className='text-5xl mx-auto opacity-30' />
                <h4 className='font-bold text-slate-600 text-sm'>LOR Content Stream Empty</h4>
                <p className='text-xs text-slate-400 max-w-xs mx-auto font-medium'>Fill in the recommender details on the left to generate your letter.</p>
              </div>
            )}

            {aiResponse && !loading && (
              <textarea readOnly value={aiResponse} className='w-full h-full min-h-[380px] bg-slate-50 text-slate-800 p-5 rounded-xl border border-slate-200/60 font-mono text-xs leading-relaxed focus:outline-none resize-none' />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AILORGenerator;
