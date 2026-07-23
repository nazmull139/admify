import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCheckCircle, FaGlobe, FaMapMarkerAlt, FaPaperPlane, FaSearch } from 'react-icons/fa';
import { studentService } from '../../../utils/services/studentService';
import { walletService } from '../../../utils/services/walletService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const BrowseAgencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [applyMsg, setApplyMsg] = useState('');

  const loadAgencies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentService.listAgencies();
      setAgencies(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load agencies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgencies();
  }, []);

  const handleApply = async (agencyId) => {
    setApplyingId(agencyId);
    setApplyMsg('');
    try {
      await walletService.applyToAgency(agencyId);
      setAgencies((prev) => prev.map((a) => (a._id === agencyId ? { ...a, alreadyApplied: true } : a)));
      setApplyMsg('Application submitted! An agent will be assigned to you soon.');
    } catch (err) {
      setApplyMsg(err.message || 'Could not apply to this agency. You may need an active subscription plan.');
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = agencies.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (a.firmName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingState label="Loading agencies..." />;
  if (error) return <ErrorState message={error} onRetry={loadAgencies} />;

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaBuilding className="text-indigo-600" /> Browse Agencies
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Apply to a verified agency to get an agent assigned to guide your application. This uses one of your subscription plan's agency application slots.
        </p>
      </div>

      {applyMsg && (
        <div className={`text-xs font-bold px-4 py-3 rounded-xl ${applyMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {applyMsg}
        </div>
      )}

      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
        <input
          type="text" placeholder="Search agencies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No verified agencies available yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((agency) => (
            <div key={agency._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm">{agency.firmName || agency.name}</h4>
                <p className="text-[11px] text-slate-400 font-semibold">{agency.name}</p>
              </div>

              {agency.address && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5"><FaMapMarkerAlt className="text-slate-300" /> {agency.address}</p>
              )}
              {agency.website && (
                <a href={agency.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-bold flex items-center gap-1.5 hover:underline">
                  <FaGlobe /> Visit Website
                </a>
              )}

              <button
                onClick={() => handleApply(agency._id)}
                disabled={agency.alreadyApplied || applyingId === agency._id}
                className={`mt-2 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  agency.alreadyApplied
                    ? 'bg-emerald-50 text-emerald-600 cursor-default'
                    : 'bg-slate-900 hover:bg-indigo-600 text-white disabled:opacity-50'
                }`}
              >
                {agency.alreadyApplied ? (<><FaCheckCircle /> Applied</>) : applyingId === agency._id ? 'Applying...' : (<><FaPaperPlane /> Apply to This Agency</>)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseAgencies;
