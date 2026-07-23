import React, { useEffect, useState } from 'react';
import { FaCheck, FaExclamationTriangle, FaShieldAlt, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { adminService } from '../../../utils/services/adminService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const DeleteRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getDeleteRequests();
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load delete requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApproveDelete = async (id) => {
    if (!window.confirm('CRITICAL WARNING: Are you absolutely sure you want to PERMANENTLY WIPE this record? This action cannot be undone.')) return;
    setActingId(id);
    try {
      await adminService.approveDelete(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete this account.');
    } finally {
      setActingId(null);
    }
  };

  const handleRejectDelete = async (id) => {
    setActingId(id);
    try {
      await adminService.rejectDelete(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || 'Could not reject this request.');
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading delete requests..." />;
  if (error) return <ErrorState message={error} onRetry={loadRequests} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-base font-black text-rose-600 tracking-tight flex items-center gap-2">
            <FaTrashAlt /> Sensitive Purge Requests
          </h3>
          <p className="text-xs text-slate-400 font-medium">Review account deletion requests and execute irreversible database purges.</p>
        </div>
        {requests.length > 0 && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto animate-pulse">
            <FaExclamationTriangle /> {requests.length} Critical Actions Pending
          </div>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-2xl text-center shadow-sm space-y-2">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-sm"><FaShieldAlt /></div>
          <h4 className="text-sm font-black text-slate-800">System Core is Secure</h4>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">No pending account deletion requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-5 sm:p-6 rounded-2xl border border-rose-100 hover:border-rose-200 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{req._id.slice(-8).toUpperCase()}</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wide">{req.entityType}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{req.userId?.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Initiator: <span className="text-slate-600 font-semibold font-mono">{req.userId?.email}</span></p>
                </div>
                <div className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100/60 p-2.5 rounded-xl italic">
                  " {req.reason || 'No reason provided.'} "
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-slate-50 md:border-t-0">
                <button
                  onClick={() => handleRejectDelete(req._id)}
                  disabled={actingId === req._id}
                  className="flex-1 md:flex-none px-3.5 py-2.5 bg-slate-50 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Reject & Keep Data"
                >
                  <FaTimes /> Reject
                </button>

                <button
                  onClick={() => handleApproveDelete(req._id)}
                  disabled={actingId === req._id}
                  className="flex-1 md:flex-none px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-rose-100 cursor-pointer disabled:opacity-50"
                  title="Irreversibly Purge Record"
                >
                  <FaCheck /> Confirm Purge
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DeleteRequests;
