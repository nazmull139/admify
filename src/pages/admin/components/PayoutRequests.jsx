import React, { useEffect, useState } from 'react';
import { FaCheck, FaHandHoldingUsd, FaTimes } from 'react-icons/fa';
import { adminService } from '../../../utils/services/adminService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const PayoutRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getPendingPayouts();
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load payout requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this payout? This deducts the credits from the agent\'s wallet now.')) return;
    setActingId(id);
    try {
      await adminService.approvePayout(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || 'Could not approve this payout.');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    setActingId(id);
    try {
      await adminService.rejectPayout(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || 'Could not reject this payout.');
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading payout requests..." />;
  if (error) return <ErrorState message={error} onRetry={loadRequests} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-base font-black text-rose-600 tracking-tight flex items-center gap-2">
            <FaHandHoldingUsd /> Agent Payout Requests
          </h3>
          <p className="text-xs text-slate-400 font-medium">Review and process pending payout requests from agents. Approving deducts their wallet balance.</p>
        </div>
        {requests.length > 0 && (
          <span className="bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {requests.length} Pending
          </span>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No pending payout requests right now.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Agent</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Requested</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="text-slate-900 font-black">{req.senderId?.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{req.senderId?.email}</p>
                    </td>
                    <td className="p-4 font-black text-slate-900">{req.amount} CR</td>
                    <td className="p-4 font-semibold text-slate-600">{req.gateway || '—'}</td>
                    <td className="p-4 font-semibold text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={actingId === req._id}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <FaTimes /> Reject
                        </button>
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={actingId === req._id}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm disabled:opacity-50"
                        >
                          <FaCheck /> Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default PayoutRequests;
