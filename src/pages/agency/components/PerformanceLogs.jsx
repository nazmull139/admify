import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaChartBar, FaCheckCircle, FaSignal, FaTimesCircle } from 'react-icons/fa';
import { agencyService } from '../../../utils/services/agencyService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const PerformanceLogs = () => {
  const [teamMetrics, setTeamMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPerformance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agencyService.getPerformance();
      setTeamMetrics(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load performance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformance();
  }, []);

  if (loading) return <LoadingState label="Loading performance logs..." />;
  if (error) return <ErrorState message={error} onRetry={loadPerformance} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaChartBar className="text-indigo-600" /> Performance Logs & Analytics
        </h3>
        <p className="text-xs text-slate-400 font-medium">Evaluate conversion ratios and file processing efficiency for your network officers.</p>
      </div>

      {teamMetrics.length === 0 && (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No performance data yet — recruit agents and assign applications to see metrics here.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {teamMetrics.map((agent, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">

            <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-50 rounded-full flex items-end justify-start p-4 group-hover:bg-indigo-50 transition-colors">
              <span className="text-[10px] font-black text-indigo-600 font-mono">{agent.efficiency}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-950 text-white rounded-xl flex items-center justify-center text-xs font-bold">
                {agent.agentName?.split(' ')[0]?.[0] || '?'}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">{agent.agentName}</h4>
              </div>
            </div>

            <hr className="border-slate-50" />

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50/60 p-2 rounded-xl border border-slate-50">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Processed</span>
                <span className="text-xs font-black text-slate-800 font-mono">{agent.processed}</span>
              </div>
              <div className="bg-emerald-50/30 p-2 rounded-xl border border-emerald-50/50">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide block flex items-center justify-center gap-0.5"><FaCheckCircle className="text-[8px]" /> Appr.</span>
                <span className="text-xs font-black text-emerald-600 font-mono">{agent.approved}</span>
              </div>
              <div className="bg-rose-50/30 p-2 rounded-xl border border-rose-50/50">
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wide block flex items-center justify-center gap-0.5"><FaTimesCircle className="text-[8px]" /> Rej.</span>
                <span className="text-xs font-black text-rose-600 font-mono">{agent.rejected}</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1 text-[11px] font-bold">
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                <FaSignal /> {agent.processed > 0 ? 'Active' : 'No Data Yet'}
              </span>
            </div>

          </div>
        ))}
      </div>

      {teamMetrics.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Network Processing Load Distribution</h4>
          </div>

          <div className="space-y-3 pt-2">
            {teamMetrics.map((agent, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                  <span>{agent.agentName}</span>
                  <span className="font-mono">{agent.approved} / {agent.processed} Files Completed</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-900 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${agent.processed > 0 ? (agent.approved / agent.processed) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PerformanceLogs;
