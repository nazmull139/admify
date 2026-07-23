import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { FaCheckCircle, FaCrown, FaFileAlt, FaGraduationCap, FaHourglassHalf, FaStar, FaThLarge, FaBuilding, FaUser, FaWallet, FaWhatsapp } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { LoadingState, ErrorState } from '../../components/StatusState';
import { studentService } from '../../utils/services/studentService';
import { statusColor } from '../../utils/statusColors';
import { useAuth } from '../../context/AuthContext';
import AISOPGenerator from './components/AISOPGenerator';
import AILORGenerator from './components/AILORGenerator';
import AIUniversityMatch from './components/AIUniversityMatch';
import AssignedAgent from './components/AssignedAgent';
import BrowseAgencies from './components/BrowseAgencies';
import MyDocuments from './components/MyDocuments';
import StudentProfile from './components/StudentProfile';
import StudentSubscription from './components/StudentSubscription';
import StudentWallet from './components/StudentWallet';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Dashboard');

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, appsRes] = await Promise.all([
        studentService.getDashboardStats(),
        studentService.getApplications(),
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const studentMenu = [
    { name: 'Dashboard', icon: <FaThLarge /> },
    { name: 'AI Recommendation', icon: <FaGraduationCap /> },
    { name: 'AI SOP Generator', icon: <FaFileAlt /> },
    { name: 'AI LOR Generator', icon: <FaFileAlt /> },
    { name: 'My Documents', icon: <FaFileAlt /> },
    { name: 'Wallet & Credits', icon: <FaWallet /> },
    { name: 'Subscription', icon: <FaCrown /> },
    { name: 'Browse Agencies', icon: <FaBuilding /> },
    { name: 'Assigned Agent', icon: <FaWhatsapp /> },
    { name: 'My Profile', icon: <FaUser /> },
  ];

  return (
    <div className='flex bg-slate-50 min-h-screen overflow-hidden relative'>
      <Sidebar menuItems={studentMenu} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-20 lg:pt-8'>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>Welcome Back, {user?.name || 'Student'}! 👋</h1>
            <p className='text-xs sm:text-sm text-slate-500'>Here is your AI application pipeline overview.</p>
          </div>
          <div className='bg-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start'>
            <div className='w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse'></div>
            <span className='text-xs sm:text-sm font-bold text-slate-700'>{stats?.credits ?? 0} Credits Available</span>
          </div>
        </div>

        {activeTab === 'Dashboard' && (
          <div className='space-y-6 sm:space-y-8 animate-fade-in'>
            {loading && <LoadingState label="Loading your dashboard..." />}
            {!loading && error && <ErrorState message={error} onRetry={loadDashboard} />}

            {!loading && !error && (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between'>
                    <div>
                      <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Profile Strength</p>
                      <h3 className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stats?.profileStrength ?? 0}%</h3>
                    </div>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-base sm:text-lg'><FaStar /></div>
                  </div>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between'>
                    <div>
                      <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Applications</p>
                      <h3 className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stats?.applicationsCount ?? 0}</h3>
                    </div>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-base sm:text-lg'><FaGraduationCap /></div>
                  </div>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between'>
                    <div>
                      <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Offers Received</p>
                      <h3 className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stats?.offersCount ?? 0}</h3>
                    </div>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-base sm:text-lg'><FaHourglassHalf /></div>
                  </div>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between'>
                    <div>
                      <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Completed</p>
                      <h3 className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stats?.completedCount ?? 0}</h3>
                    </div>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-base sm:text-lg'><FaCheckCircle /></div>
                  </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
                  <div className='p-5 sm:p-6 border-b border-slate-100'>
                    <h3 className='font-black text-slate-900 text-base sm:text-lg'>Latest Applications</h3>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]'>
                      <thead>
                        <tr className='bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100'>
                          <th className='p-4 pl-6'>Agency</th>
                          <th className='p-4'>Assigned Agent</th>
                          <th className='p-4'>Status</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-100 text-slate-700 font-medium'>
                        {applications.length === 0 && (
                          <tr><td colSpan={3} className='p-6 text-center text-slate-400 font-semibold'>No applications yet.</td></tr>
                        )}
                        {applications.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className='p-4 pl-6 text-slate-900 font-bold'>{app.agencyId?.name || '—'}</td>
                            <td className='p-4'>{app.assignedAgentId?.name || 'Not yet assigned'}</td>
                            <td className='p-4'><span className={`${statusColor(app.status)} px-2.5 py-1 rounded-full text-[11px] font-bold inline-block`}>{app.status}</span></td>
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

        {activeTab === 'AI Recommendation' && <AIUniversityMatch />}
        {activeTab === 'AI SOP Generator' && <AISOPGenerator />}
        {activeTab === 'AI LOR Generator' && <AILORGenerator />}
        {activeTab === 'My Documents' && <MyDocuments />}
        {activeTab === 'Wallet & Credits' && <StudentWallet />}
        {activeTab === 'Subscription' && <StudentSubscription />}
        {activeTab === 'Browse Agencies' && <BrowseAgencies />}
        {activeTab === 'My Profile' && <StudentProfile />}
        {activeTab === 'Assigned Agent' && <AssignedAgent />}

      </div>
    </div>
  );
};

export default StudentDashboard;
