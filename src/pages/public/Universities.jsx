import React, { useEffect, useState } from 'react';
import { FaAward, FaFilter, FaGlobeAmericas, FaGraduationCap, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router';
import { universityService } from '../../utils/services/universityService';
import { LoadingState, ErrorState } from '../../components/StatusState';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({ country: '', program: '', studyLevel: '', scholarship: '' });

  const loadCountries = async () => {
    try {
      const res = await universityService.getCountries();
      setCountries(res.data || []);
    } catch {
      // non-critical — dropdown just stays empty if this fails
    }
  };

  const loadUniversities = async (targetPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await universityService.getAll({ ...filters, page: targetPage, limit: 12 });
      setUniversities(res.data || []);
      setTotal(res.total);
      setPages(res.pages);
      setPage(res.page);
    } catch (err) {
      setError(err.message || 'Could not load universities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadUniversities(1), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Explore Global Universities</h1>
          <p className="text-indigo-100/80 max-w-xl mx-auto text-sm sm:text-base">
            Browse verified institutions worldwide and filter by country, program, and study level to find your perfect match.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col md:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <FaGlobeAmericas className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative flex-1 min-w-[180px]">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search program (e.g. Data Science)"
              value={filters.program}
              onChange={(e) => setFilters({ ...filters, program: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="relative flex-1 min-w-[150px]">
            <FaGraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <select
              value={filters.studyLevel}
              onChange={(e) => setFilters({ ...filters, studyLevel: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">Any Study Level</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.scholarship === 'true'}
              onChange={(e) => setFilters({ ...filters, scholarship: e.target.checked ? 'true' : '' })}
              className="accent-indigo-600"
            />
            <FaAward className="text-amber-500" /> Scholarships
          </label>
        </div>

        <div className="py-8">
          {loading && <LoadingState label="Loading universities..." />}
          {!loading && error && <ErrorState message={error} onRetry={() => loadUniversities(page)} />}

          {!loading && !error && (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{total} Universities Found</p>

              {universities.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                  No universities match your filters. Try broadening your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {universities.map((uni) => (
                    <Link
                      key={uni._id}
                      to={`/universities/${uni._id}`}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-slate-900 text-base leading-snug">{uni.name}</h3>
                        {uni.worldRanking && (
                          <span className="shrink-0 bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-md">#{uni.worldRanking}</span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-slate-300" /> {uni.city ? `${uni.city}, ` : ''}{uni.country}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {(uni.programs || []).slice(0, 3).map((p, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-50 border border-slate-100 text-slate-600 px-2 py-1 rounded-md">{p}</span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-1">
                        <span className="text-xs font-black text-slate-800">${uni.tuitionMin?.toLocaleString()}–${uni.tuitionMax?.toLocaleString()}/yr</span>
                        {uni.scholarshipAvailable && (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1"><FaAward /> Scholarship</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => loadUniversities(p)}
                      className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${p === page ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Universities;
