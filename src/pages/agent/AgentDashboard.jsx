import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaDollarSign, FaFileAlt, FaGraduationCap, FaThLarge, FaUser } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { LoadingState, ErrorState } from '../../components/StatusState';
import { agentService } from '../../utils/services/agentService';
import { statusColor } from '../../utils/statusColors';
import ApplicationsWork from './components/ApplicationsWork';
import AssignedStudents from './components/AssignedStudents';
import EarningsLog from './components/EarningsLog';
import EditRequests from './components/EditRequests';
import ProfileSettings from './components/ProfileSettings';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, studentsRes] = await Promise.all([
        agentService.getDashboardStats(),
        agentService.getAssignedStudents(),
      ]);
      setStats(statsRes.data);
      setStudents((studentsRes.data || []).slice(0, 5));
    } catch (err) {
      setError(err.message || 'Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const agentMenu = [
    { name: 'Dashboard', icon: <FaThLarge /> },
    { name: 'Assigned Students', icon: <FaGraduationCap /> },
    { name: 'Applications Work', icon: <FaBriefcase /> },
    { name: 'Edit Requests', icon: <FaFileAlt /> },
    { name: 'Earnings Log', icon: <FaDollarSign /> },
    { name: 'Profile Settings', icon: <FaUser /> },
  ];

  return (
    <div className='flex bg-slate-50 min-h-screen overflow-hidden relative'>
      <Sidebar menuItems={agentMenu} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-20 lg:pt-8'>
        <div className='mb-8'>
          <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>Agent Workspace 💼</h1>
          <p className='text-xs sm:text-sm text-slate-500'>Manage your clients and verify university documents.</p>
        </div>

        {activeTab === 'Dashboard' && (
          <div className='space-y-6 sm:space-y-8 animate-fade-in'>
            {loading && <LoadingState label="Loading your dashboard..." />}
            {!loading && error && <ErrorState message={error} onRetry={loadDashboard} />}

            {!loading && !error && (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5'>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                    <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Active Students</p>
                    <h3 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1'>{stats?.activeStudents ?? 0}</h3>
                  </div>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                    <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Pending Tasks</p>
                    <h3 className='text-2xl sm:text-3xl font-black text-amber-600 mt-1'>{stats?.pendingTasks ?? 0}</h3>
                  </div>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                    <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Wallet Balance (Credits)</p>
                    <h3 className='text-2xl sm:text-3xl font-black text-indigo-600 mt-1'>{stats?.totalEarnings ?? 0}</h3>
                  </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
                  <div className='p-5 sm:p-6 border-b border-slate-100'>
                    <h3 className='font-black text-slate-900 text-base sm:text-lg'>Assigned Student Queue</h3>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]'>
                      <thead>
                        <tr className='bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100'>
                          <th className='p-4 pl-6'>Student Name</th>
                          <th className='p-4'>Email</th>
                          <th className='p-4'>Status</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-100 text-slate-700 font-medium'>
                        {students.length === 0 && (
                          <tr><td colSpan={3} className='p-6 text-center text-slate-400 font-semibold'>No students assigned yet.</td></tr>
                        )}
                        {students.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className='p-4 pl-6 text-slate-900 font-bold'>{item.studentId?.name}</td>
                            <td className='p-4'>{item.studentId?.email}</td>
                            <td className='p-4'><span className={`${statusColor(item.status)} px-2.5 py-1 rounded-full text-[11px] font-bold inline-block`}>{item.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'Assigned Students' && <AssignedStudents />}
        {activeTab === 'Earnings Log' && <EarningsLog />}
        {activeTab === 'Applications Work' && <ApplicationsWork />}
        {activeTab === 'Edit Requests' && <EditRequests />}
        {activeTab === 'Profile Settings' && <ProfileSettings />}
      </div>
    </div>
  );
};

export default AgentDashboard;
