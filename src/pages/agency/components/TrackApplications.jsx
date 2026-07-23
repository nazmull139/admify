import React, { useEffect, useState } from 'react';
import { FaBuilding, FaFilter, FaFolderOpen, FaSearch, FaUserAlt } from 'react-icons/fa';
import { agencyService } from '../../../utils/services/agencyService';
import { statusColor } from '../../../utils/statusColors';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const STATUS_OPTIONS = ['All', 'Pending', 'Assigned', 'Document Review', 'SOP Pending', 'Action Required', 'Processing', 'Offer Issued', 'Visa Processing', 'Completed', 'Rejected'];

const TrackApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [appsRes, agentsRes] = await Promise.all([
        agencyService.getApplications(searchTerm, statusFilter),
        agencyService.getAgents(),
      ]);
      setApplications(appsRes.data || []);
      setAgents(agentsRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadData, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  const handleAssignAgent = async (applicationId, agentId) => {
    if (!agentId) return;
    setAssigningId(applicationId);
    try {
      const res = await agencyService.assignAgentToApplication(applicationId, agentId);
      setApplications((prev) => prev.map((a) => (a._id === applicationId ? res.data : a)));
    } catch (err) {
      alert(err.message || 'Could not assign agent.');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FaFolderOpen className="text-indigo-600" /> Track Applications
            </h3>
            <p className="text-xs text-slate-400 font-medium">Real-time pipeline monitoring of all student files across your network.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by Student Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 sm:w-56">
            <FaFilter className="text-slate-400 text-xs" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-xs font-bold focus:outline-none text-slate-700"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading && <LoadingState label="Loading applications..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Application ID</th>
                  <th className="p-4">Student Details</th>
                  <th className="p-4">Assigned Consultant</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <span className="text-slate-900 font-black block">{app._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-[10px]"><FaUserAlt /></div>
                          <span className="font-bold text-slate-800">{app.studentId?.name}</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-600">
                        <select
                          value={app.assignedAgentId?._id || ''}
                          disabled={assigningId === app._id}
                          onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        >
                          <option value="">Not Assigned</option>
                          {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                        </select>
                      </td>

                      <td className="p-4">
                        <span className={`${statusColor(app.status)} px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-block`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center font-bold text-slate-400">
                      No matching applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrackApplications;
