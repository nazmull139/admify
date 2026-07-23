import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaLock } from 'react-icons/fa';
import { representativeService } from '../../../utils/services/representativeService';
import { statusColor } from '../../../utils/statusColors';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const ADMISSION_STATUSES = ['Processing', 'Offer Issued', 'Rejected', 'Visa Processing', 'Completed'];

const RepApplications = ({ isVerified }) => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await representativeService.getApplications(statusFilter);
      setApplications(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVerified) loadApplications();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, isVerified]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await representativeService.updateAdmissionStatus(id, status);
      setApplications((prev) => prev.map((a) => (a._id === id ? res.data : a)));
    } catch (err) {
      alert(err.message || 'Could not update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isVerified) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[250px]">
        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-xl mb-4"><FaLock /></div>
        <h4 className="font-black text-slate-700 text-sm">Verification Required</h4>
        <p className="text-xs max-w-xs mt-1">Your account needs to be verified by an admin before you can view applications submitted to your university.</p>
      </div>
    );
  }

  if (loading) return <LoadingState label="Loading applications..." />;
  if (error) return <ErrorState message={error} onRetry={loadApplications} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaClipboardList className="text-indigo-600" /> Incoming Applications
          </h3>
          <p className="text-xs text-slate-400 font-medium">Applications from students targeting your university.</p>
        </div>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Statuses</option>
          {ADMISSION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Student</th>
                <th className="p-4">Submitting Agency</th>
                <th className="p-4 text-right pr-6">Admission Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {applications.length === 0 && (
                <tr><td colSpan={3} className="p-6 text-center text-slate-400 font-semibold">No applications yet.</td></tr>
              )}
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="text-slate-900 font-black">{app.studentId?.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{app.studentId?.email}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-600">{app.agencyId?.name || '—'}</td>
                  <td className="p-4 text-right pr-6">
                    <select
                      value={app.status} disabled={updatingId === app._id}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block border-0 cursor-pointer ${statusColor(app.status)}`}
                    >
                      {ADMISSION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepApplications;
