import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaAward, FaBook, FaCalendarAlt, FaCheckCircle, FaGlobe, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router';
import { universityService } from '../../utils/services/universityService';
import { useAuth } from '../../context/AuthContext';
import { LoadingState, ErrorState } from '../../components/StatusState';

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await universityService.getById(id);
      setUni(res.data);
    } catch (err) {
      setError(err.message || 'Could not load this university.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCheckMatch = () => {
    if (isAuthenticated && user?.role === 'Student') {
      navigate('/studentdashboard?tab=AI Recommendation');
    } else {
      navigate('/register');
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-12"><LoadingState label="Loading university details..." /></div>;
  if (error) return <div className="max-w-4xl mx-auto px-6 py-12"><ErrorState message={error} onRetry={load} /></div>;
  if (!uni) return null;

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/universities" className="inline-flex items-center gap-2 text-indigo-100 text-xs font-bold mb-4 hover:text-white transition-colors">
            <FaArrowLeft /> Back to Universities
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{uni.name}</h1>
          <p className="text-indigo-100/80 flex items-center gap-2 mt-2 text-sm font-semibold">
            <FaMapMarkerAlt /> {uni.city ? `${uni.city}, ` : ''}{uni.country}
            {uni.worldRanking && <span className="bg-white/10 px-2 py-0.5 rounded-md ml-2 text-xs">World Rank #{uni.worldRanking}</span>}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6">
          {uni.description && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">About</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{uni.description}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2"><FaBook className="text-indigo-500" /> Programs Offered</h3>
            <div className="flex flex-wrap gap-2">
              {(uni.programs || []).map((p, i) => (
                <span key={i} className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">{p}</span>
              ))}
              {(!uni.programs || uni.programs.length === 0) && <p className="text-xs text-slate-400">No programs listed.</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Admission Requirements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Min GPA</p>
                <p className="text-sm font-black text-slate-800">{uni.gpaMin}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Min IELTS</p>
                <p className="text-sm font-black text-slate-800">{uni.ieltsMin}</p>
              </div>
              {uni.toeflMin && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Min TOEFL</p>
                  <p className="text-sm font-black text-slate-800">{uni.toeflMin}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Acceptance Rate</p>
                <p className="text-sm font-black text-slate-800">{uni.acceptanceRate || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><FaCalendarAlt /> Intakes</p>
                <p className="text-sm font-black text-slate-800">{(uni.intakes || []).join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Study Levels</p>
                <p className="text-sm font-black text-slate-800">{(uni.studyLevel || []).join(', ') || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-wider">
              <FaMoneyBillWave /> Estimated Costs
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Tuition / Year</p>
              <p className="text-lg font-black text-slate-900">${uni.tuitionMin?.toLocaleString()} – ${uni.tuitionMax?.toLocaleString()}</p>
            </div>
            {(uni.livingCostMin > 0 || uni.livingCostMax > 0) && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Living Costs / Year</p>
                <p className="text-sm font-black text-slate-700">${uni.livingCostMin?.toLocaleString()} – ${uni.livingCostMax?.toLocaleString()}</p>
              </div>
            )}
            {uni.scholarshipAvailable && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
                <FaAward className="text-emerald-600" />
                <div>
                  <p className="text-[10px] font-black text-emerald-700 uppercase">Scholarship Available</p>
                  {uni.scholarshipAmount > 0 && <p className="text-xs font-bold text-emerald-600">Up to ${uni.scholarshipAmount.toLocaleString()}</p>}
                </div>
              </div>
            )}
            {uni.isVerified && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <FaCheckCircle className="text-emerald-500" /> Verified Institution
              </div>
            )}
            {uni.website && (
              <a href={uni.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline">
                <FaGlobe /> Visit Official Website
              </a>
            )}
          </div>

          <button
            onClick={handleCheckMatch}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md shadow-indigo-100 transition-all"
          >
            Check My Admission Odds
          </button>
        </div>

      </div>
    </div>
  );
};

export default UniversityDetail;
