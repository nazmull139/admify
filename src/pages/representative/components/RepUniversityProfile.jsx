import React, { useEffect, useState } from 'react';
import { FaAward, FaSave, FaUniversity } from 'react-icons/fa';
import { representativeService } from '../../../utils/services/representativeService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const RepUniversityProfile = () => {
  const [form, setForm] = useState({
    description: '', website: '', tuitionMin: '', tuitionMax: '',
    livingCostMin: '', livingCostMax: '', ieltsMin: '', toeflMin: '', gpaMin: '',
    programs: '', intakes: [], scholarshipAvailable: false, scholarshipAmount: '', acceptanceRate: '',
  });
  const [universityName, setUniversityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await representativeService.getMyUniversity();
      const u = res.data;
      setUniversityName(u.name);
      setForm({
        description: u.description || '',
        website: u.website || '',
        tuitionMin: u.tuitionMin ?? '',
        tuitionMax: u.tuitionMax ?? '',
        livingCostMin: u.livingCostMin ?? '',
        livingCostMax: u.livingCostMax ?? '',
        ieltsMin: u.ieltsMin ?? '',
        toeflMin: u.toeflMin ?? '',
        gpaMin: u.gpaMin ?? '',
        programs: (u.programs || []).join(', '),
        intakes: u.intakes || [],
        scholarshipAvailable: !!u.scholarshipAvailable,
        scholarshipAmount: u.scholarshipAmount ?? '',
        acceptanceRate: u.acceptanceRate || '',
      });
    } catch (err) {
      setError(err.message || 'Could not load your university profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleIntake = (season) => {
    setForm((prev) => ({
      ...prev,
      intakes: prev.intakes.includes(season) ? prev.intakes.filter((i) => i !== season) : [...prev.intakes, season],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await representativeService.updateUniversityProfile({
        ...form,
        tuitionMin: Number(form.tuitionMin), tuitionMax: Number(form.tuitionMax),
        livingCostMin: Number(form.livingCostMin) || 0, livingCostMax: Number(form.livingCostMax) || 0,
        ieltsMin: Number(form.ieltsMin), toeflMin: form.toeflMin ? Number(form.toeflMin) : undefined,
        gpaMin: Number(form.gpaMin), scholarshipAmount: Number(form.scholarshipAmount) || 0,
        programs: form.programs.split(',').map((p) => p.trim()).filter(Boolean),
      });
      setSaveMsg('University profile updated successfully!');
    } catch (err) {
      setSaveMsg(err.message || 'Could not update university profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  if (loading) return <LoadingState label="Loading university profile..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaUniversity className="text-indigo-600" /> {universityName}
        </h3>
        <p className="text-xs text-slate-400 font-medium">Update the public listing students see on the Universities page.</p>
      </div>

      {saveMsg && (
        <div className={`text-xs font-bold px-4 py-3 rounded-xl ${saveMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {saveMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
          <textarea
            rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Website</label>
          <input
            type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tuition Min ($)</label>
            <input type="number" required value={form.tuitionMin} onChange={(e) => setForm({ ...form, tuitionMin: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tuition Max ($)</label>
            <input type="number" required value={form.tuitionMax} onChange={(e) => setForm({ ...form, tuitionMax: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Living Min ($)</label>
            <input type="number" value={form.livingCostMin} onChange={(e) => setForm({ ...form, livingCostMin: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Living Max ($)</label>
            <input type="number" value={form.livingCostMax} onChange={(e) => setForm({ ...form, livingCostMax: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Min GPA</label>
            <input type="number" step="0.01" required value={form.gpaMin} onChange={(e) => setForm({ ...form, gpaMin: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Min IELTS</label>
            <input type="number" step="0.5" required value={form.ieltsMin} onChange={(e) => setForm({ ...form, ieltsMin: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Min TOEFL</label>
            <input type="number" value={form.toeflMin} onChange={(e) => setForm({ ...form, toeflMin: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Acceptance Rate</label>
            <input type="text" placeholder="e.g. 35%" value={form.acceptanceRate} onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Programs (comma-separated)</label>
          <input
            type="text" value={form.programs} onChange={(e) => setForm({ ...form, programs: e.target.value })}
            placeholder="Computer Science, MBA, Data Science"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Intakes</label>
          <div className="flex gap-2 flex-wrap">
            {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
              <button
                key={season} type="button" onClick={() => toggleIntake(season)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${form.intakes.includes(season) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <input
            type="checkbox" id="scholarship" checked={form.scholarshipAvailable}
            onChange={(e) => setForm({ ...form, scholarshipAvailable: e.target.checked })}
            className="accent-indigo-600 w-4 h-4"
          />
          <label htmlFor="scholarship" className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><FaAward className="text-amber-500" /> Scholarship Available</label>
          {form.scholarshipAvailable && (
            <input
              type="number" placeholder="Amount ($)" value={form.scholarshipAmount}
              onChange={(e) => setForm({ ...form, scholarshipAmount: e.target.value })}
              className="ml-auto w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>

        <button type="submit" disabled={saving} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all">
          <FaSave /> {saving ? 'Saving...' : 'Save University Profile'}
        </button>
      </form>
    </div>
  );
};

export default RepUniversityProfile;
