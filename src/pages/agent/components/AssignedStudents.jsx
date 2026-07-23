import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaEye, FaGraduationCap, FaSearch, FaWhatsapp } from 'react-icons/fa';
import { agentService } from '../../../utils/services/agentService';
import { LoadingState, ErrorState } from '../../../components/StatusState';
import StudentFileReview from './StudentFileReview';

const AssignedStudents = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStudentId, setActiveStudentId] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentService.getAssignedStudents();
      setApplications(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your assigned students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = applications.filter((app) =>
    app.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.studentProfile?.desiredCountry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeStudentId !== null) {
    return (
      <StudentFileReview
        selectedStudentId={activeStudentId}
        onBackToList={() => { setActiveStudentId(null); loadStudents(); }}
      />
    );
  }

  if (loading) return <LoadingState label="Loading assigned students..." />;
  if (error) return <ErrorState message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaGraduationCap className="text-indigo-600" /> Assigned Clients Roster
          </h3>
          <p className="text-xs text-slate-400 font-medium">Overview of students currently assigned to you.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Student Name</th>
                <th className="p-4">Target Matrix</th>
                <th className="p-4">Current Workflow</th>
                <th className="p-4 text-center">Communications</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredStudents.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400 font-semibold">No assigned students found.</td></tr>
              )}
              {filteredStudents.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="text-slate-900 font-black text-sm">{app.studentId?.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <FaEnvelope className="text-[10px]" /> {app.studentId?.email}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="text-slate-800 font-bold">{app.studentProfile?.desiredCountry || '—'}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{app.studentProfile?.preferredSubject || '—'}</p>
                  </td>

                  <td className="p-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                      ${app.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                    `}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {app.studentProfile?.phone ? (
                      <a
                        href={`https://wa.me/${app.studentProfile.phone}?text=${encodeURIComponent(
                          `Hello ${app.studentId?.name},\n\nI am your assigned study abroad agent.\n\nCurrent Status: ${app.status}\n\nPlease contact me if you need any assistance regarding your application.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-[11px] px-3 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <FaWhatsapp />
                        WhatsApp
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic font-bold">No number</span>
                    )}
                  </td>

                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => setActiveStudentId(app.studentId?._id)}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest px-3 py-2 rounded-xl transition-all shadow-sm"
                    >
                      <FaEye /> Review File
                    </button>
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

export default AssignedStudents;
