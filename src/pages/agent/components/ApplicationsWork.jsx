import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCalendarAlt, FaFilter, FaSearch, FaUniversity } from 'react-icons/fa';
import { agentService } from '../../../utils/services/agentService';
import { statusColor } from '../../../utils/statusColors';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const STATUS_OPTIONS = ['All', 'Pending', 'Assigned', 'Document Review', 'SOP Pending', 'Action Required', 'Processing', 'Offer Issued', 'Visa Processing', 'Completed', 'Rejected'];

const ApplicationsWork = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentService.getApplicationsList(searchTerm, statusFilter);
      setApplications(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadApplications, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await agentService.modifyApplicationStatus(appId, { status: newStatus });
      setApplications((prev) => prev.map((a) => (a._id === appId ? res.data : a)));
    } catch (err) {
      alert(err.message || 'Could not update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaBriefcase className="text-indigo-600" /> University Applications Work
          </h3>
          <p className="text-xs text-slate-400 font-medium">Monitor active university enrollment pipelines and update milestone statuses.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors text-slate-800"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-[10px]">
              <FaFilter />
            </span>
          </div>
        </div>
      </div>

      {loading && <LoadingState label="Loading applications..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadApplications} />}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Client Details</th>
                  <th className="p-4">Application ID</th>
                  <th className="p-4">Agent Comments</th>
                  <th className="p-4 text-right pr-6">Milestone Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400 italic font-medium">
                      No applications match your criteria.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="text-slate-900 font-black text-sm">{app.studentId?.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{app.studentId?.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800 font-bold flex items-center gap-1.5">
                          <FaUniversity className="text-slate-400 text-xs" /> {app._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 ml-5">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        {app.agentComments || '—'}
                      </td>
                      <td className="p-4 text-right pr-6">
                        <select
                          value={app.status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block border-0 cursor-pointer ${statusColor(app.status)}`}
                        >
                          {STATUS_OPTIONS.filter((s) => s !== 'All').map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationsWork;
