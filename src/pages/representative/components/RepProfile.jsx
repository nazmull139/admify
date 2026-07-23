import React, { useEffect, useState } from 'react';
import { FaSave, FaUser } from 'react-icons/fa';
import { representativeService } from '../../../utils/services/representativeService';
import { useAuth } from '../../../context/AuthContext';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const RepProfile = ({ onSaved }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ jobTitle: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await representativeService.getProfile();
      setForm({ jobTitle: res.data?.jobTitle || '', phone: res.data?.phone || '' });
    } catch (err) {
      setError(err.message || 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await representativeService.updateProfile(form);
      setSaveMsg('Profile updated successfully!');
      onSaved?.();
    } catch (err) {
      setSaveMsg(err.message || 'Could not update profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  if (loading) return <LoadingState label="Loading your profile..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-lg bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 animate-fade-in">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
        <FaUser className="text-indigo-600" /> My Representative Profile
      </h3>

      {saveMsg && (
        <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${saveMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {saveMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Name (locked)</label>
          <input type="text" disabled value={user?.name || ''} className="w-full px-3 py-2 bg-slate-100 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email (locked)</label>
          <input type="email" disabled value={user?.email || ''} className="w-full px-3 py-2 bg-slate-100 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Job Title</label>
          <input
            type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            placeholder="Admissions Officer"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone</label>
          <input
            type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button type="submit" disabled={saving} className="w-full bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition-all">
          <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default RepProfile;
