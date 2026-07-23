import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaInfoCircle, FaServer } from 'react-icons/fa';
import { adminService } from '../../../utils/services/adminService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const GeminiApiEngine = () => {
  const [usage, setUsage] = useState(null); // { total, byFeature, transactions }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsage = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getAIUsage();
      setUsage(res.data);
    } catch (err) {
      setError(err.message || 'Could not load AI usage stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsage();
  }, []);

  if (loading) return <LoadingState label="Loading Gemini usage stats..." />;
  if (error) return <ErrorState message={error} onRetry={loadUsage} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
        <h3 className="text-base font-black text-rose-600 tracking-tight flex items-center gap-2">
          <FaServer /> Gemini API Engine Usage
        </h3>
        <p className="text-xs text-slate-400 font-medium">Live usage stats pulled from AI-feature credit transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gateway Status</span>
            <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500 text-xs" /> Connected
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total AI Feature Calls</span>
          <h4 className="text-base font-black text-indigo-600 font-mono mt-1">{usage?.total ?? 0} Calls</h4>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Model</span>
          <p className="text-sm font-black text-slate-800">gemini-2.5-flash</p>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3">Usage by Feature</h4>

        {(!usage?.byFeature || Object.keys(usage.byFeature).length === 0) ? (
          <p className="text-xs text-slate-400 font-semibold py-4 text-center">No AI feature usage recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(usage.byFeature).map(([feature, count]) => (
              <div key={feature} className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>{feature || 'Unlabeled'}</span>
                <span className="font-mono bg-slate-50 px-2 py-0.5 rounded-md text-slate-800">{count} calls</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl text-[10px] font-semibold text-indigo-700 leading-normal flex items-start gap-2">
          <FaInfoCircle className="mt-0.5 shrink-0 text-xs" />
          <span>Model routing and hyperparameters (temperature, rate limits) are currently hardcoded in the backend AI controller and are not yet exposed as an editable config endpoint.</span>
        </div>
      </div>

    </div>
  );
};

export default GeminiApiEngine;
