import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaEdit, FaPlus, FaSearch, FaShieldAlt, FaTimes, FaTrash, FaUniversity } from 'react-icons/fa';
import { universityService } from '../../../utils/services/universityService';
import { adminService } from '../../../utils/services/adminService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const emptyForm = {
  name: '', country: '', city: '', description: '', website: '',
  tuitionMin: '', tuitionMax: '', livingCostMin: '', livingCostMax: '',
  gpaMin: '', ieltsMin: '', toeflMin: '', acceptanceRate: '',
  programs: '', intakes: [], studyLevel: [], scholarshipAvailable: false, scholarshipAmount: '',
  worldRanking: '',
};

const AdminUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadUniversities = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await universityService.getAll({ limit: 100 });
      setUniversities(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load universities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSaveError('');
    setShowModal(true);
  };

  const openEditModal = (uni) => {
    setEditingId(uni._id);
    setForm({
      name: uni.name, country: uni.country, city: uni.city || '', description: uni.description || '', website: uni.website || '',
      tuitionMin: uni.tuitionMin ?? '', tuitionMax: uni.tuitionMax ?? '',
      livingCostMin: uni.livingCostMin ?? '', livingCostMax: uni.livingCostMax ?? '',
      gpaMin: uni.gpaMin ?? '', ieltsMin: uni.ieltsMin ?? '', toeflMin: uni.toeflMin ?? '', acceptanceRate: uni.acceptanceRate || '',
      programs: (uni.programs || []).join(', '), intakes: uni.intakes || [], studyLevel: uni.studyLevel || [],
      scholarshipAvailable: !!uni.scholarshipAvailable, scholarshipAmount: uni.scholarshipAmount ?? '',
      worldRanking: uni.worldRanking ?? '',
    });
    setSaveError('');
    setShowModal(true);
  };

  const toggleListItem = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...form,
        tuitionMin: Number(form.tuitionMin), tuitionMax: Number(form.tuitionMax),
        livingCostMin: Number(form.livingCostMin) || 0, livingCostMax: Number(form.livingCostMax) || 0,
        gpaMin: Number(form.gpaMin), ieltsMin: Number(form.ieltsMin),
        toeflMin: form.toeflMin ? Number(form.toeflMin) : undefined,
        scholarshipAmount: Number(form.scholarshipAmount) || 0,
        worldRanking: form.worldRanking ? Number(form.worldRanking) : undefined,
        programs: form.programs.split(',').map((p) => p.trim()).filter(Boolean),
      };
      if (editingId) await adminService.updateUniversity(editingId, payload);
      else await adminService.createUniversity(payload);
      setShowModal(false);
      await loadUniversities();
    } catch (err) {
      setSaveError(err.message || 'Could not save university.');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (id) => {
    setActingId(id);
    try {
      await adminService.verifyUniversity(id);
      setUniversities((prev) => prev.map((u) => (u._id === id ? { ...u, isVerified: true } : u)));
    } catch (err) {
      alert(err.message || 'Could not verify university.');
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this university from public listings?')) return;
    setActingId(id);
    try {
      await adminService.deleteUniversity(id);
      setUniversities((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message || 'Could not remove university.');
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading universities..." />;
  if (error) return <ErrorState message={error} onRetry={loadUniversities} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-base font-black text-rose-600 tracking-tight flex items-center gap-2">
            <FaUniversity /> University Management
          </h3>
          <p className="text-xs text-slate-400 font-medium">Add, edit, verify, or remove universities from the public listing.</p>
        </div>
        <button onClick={openCreateModal} className="bg-slate-900 hover:bg-indigo-600 text-white font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all">
          <FaPlus /> Add University
        </button>
      </div>

      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
        <input
          type="text" placeholder="Search universities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">University</th>
                <th className="p-4">Tuition Range</th>
                <th className="p-4 text-center">Verified</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-slate-400 font-semibold">No universities found.</td></tr>
              )}
              {filtered.map((uni) => (
                <tr key={uni._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="text-slate-900 font-black block">{uni.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{uni.city ? `${uni.city}, ` : ''}{uni.country}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-600">${uni.tuitionMin?.toLocaleString()}–${uni.tuitionMax?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {uni.isVerified ? (
                      <span className="text-emerald-600 inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-50 px-2 py-1 rounded-full"><FaCheckCircle /> Verified</span>
                    ) : (
                      <button onClick={() => handleVerify(uni._id)} disabled={actingId === uni._id} className="text-[10px] font-black uppercase bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-2.5 py-1 rounded-full inline-flex items-center gap-1 transition-all disabled:opacity-50">
                        <FaShieldAlt /> Verify
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(uni)} className="p-2 rounded-lg bg-slate-50 hover:bg-slate-200 text-slate-500 transition-all"><FaEdit className="text-xs" /></button>
                      <button onClick={() => handleDelete(uni._id)} disabled={actingId === uni._id} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white transition-all disabled:opacity-50"><FaTrash className="text-xs" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl space-y-5 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">{editingId ? 'Edit University' : 'Add University'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
            </div>

            {saveError && <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl px-4 py-3">{saveError}</div>}

            <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required placeholder="University Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="text" required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="url" placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>

              <textarea rows="2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 resize-none" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input type="number" required placeholder="Tuition Min $" value={form.tuitionMin} onChange={(e) => setForm({ ...form, tuitionMin: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="number" required placeholder="Tuition Max $" value={form.tuitionMax} onChange={(e) => setForm({ ...form, tuitionMax: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="number" placeholder="Living Min $" value={form.livingCostMin} onChange={(e) => setForm({ ...form, livingCostMin: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="number" placeholder="Living Max $" value={form.livingCostMax} onChange={(e) => setForm({ ...form, livingCostMax: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="number" step="0.01" required placeholder="Min GPA" value={form.gpaMin} onChange={(e) => setForm({ ...form, gpaMin: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="number" step="0.5" required placeholder="Min IELTS" value={form.ieltsMin} onChange={(e) => setForm({ ...form, ieltsMin: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="number" placeholder="Min TOEFL" value={form.toeflMin} onChange={(e) => setForm({ ...form, toeflMin: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                <input type="text" placeholder="Acceptance Rate" value={form.acceptanceRate} onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500" />
              </div>

              <input type="text" placeholder="Programs (comma-separated)" value={form.programs} onChange={(e) => setForm({ ...form, programs: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              <input type="number" placeholder="World Ranking (optional)" value={form.worldRanking} onChange={(e) => setForm({ ...form, worldRanking: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Study Levels</label>
                <div className="flex gap-2 flex-wrap">
                  {['Bachelor', 'Masters', 'PhD'].map((lvl) => (
                    <button key={lvl} type="button" onClick={() => toggleListItem('studyLevel', lvl)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${form.studyLevel.includes(lvl) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>{lvl}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Intakes</label>
                <div className="flex gap-2 flex-wrap">
                  {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
                    <button key={season} type="button" onClick={() => toggleListItem('intakes', season)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${form.intakes.includes(season) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>{season}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <input type="checkbox" id="uni-scholarship" checked={form.scholarshipAvailable} onChange={(e) => setForm({ ...form, scholarshipAvailable: e.target.checked })} className="accent-indigo-600 w-4 h-4" />
                <label htmlFor="uni-scholarship" className="text-xs font-bold text-slate-700">Scholarship Available</label>
                {form.scholarshipAvailable && (
                  <input type="number" placeholder="Amount $" value={form.scholarshipAmount} onChange={(e) => setForm({ ...form, scholarshipAmount: e.target.value })} className="ml-auto w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500" />
                )}
              </div>

              <button type="submit" disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all">
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create University'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUniversities;
