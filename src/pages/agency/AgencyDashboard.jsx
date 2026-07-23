import React, { useEffect, useState } from 'react';
import { FaChartBar, FaCog, FaFolderOpen, FaMoneyBillWave, FaThLarge, FaUsers } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { LoadingState, ErrorState } from '../../components/StatusState';
import { agencyService } from '../../utils/services/agencyService';
import FirmSettings from './components/FirmSettings';
import ManageTeamAgents from './components/ManageTeamAgents';
import PerformanceLogs from './components/PerformanceLogs';
import RevenueStreams from './components/RevenueStreams';
import TrackApplications from './components/TrackApplications';

const AgencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agencyService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message || 'Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const agencyMenu = [
    { name: 'Dashboard', icon: <FaThLarge /> },
    { name: 'Manage Team Agents', icon: <FaUsers /> },
    { name: 'Track Applications', icon: <FaFolderOpen /> },
    { name: 'Performance Logs', icon: <FaChartBar /> },
    { name: 'Revenue Streams', icon: <FaMoneyBillWave /> },
    { name: 'Firm Settings', icon: <FaCog /> },
  ];

  return (
    <div className='flex bg-slate-50 min-h-screen overflow-hidden relative'>
      <Sidebar menuItems={agencyMenu} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-20 lg:pt-8'>
        <div className='mb-8'>
          <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>Agency Enterprise Console 🏢</h1>
          <p className='text-xs sm:text-sm text-slate-500'>Oversee sub-agents and institutional performance trackers.</p>
        </div>

        {activeTab === 'Dashboard' && (
          <div className='space-y-6 sm:space-y-8 animate-fade-in'>
            {loading && <LoadingState label="Loading your dashboard..." />}
            {!loading && error && <ErrorState message={error} onRetry={loadStats} />}

            {!loading && !error && (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Sub-Agents</p>
                  <h3 className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stats?.totalSubAgents ?? 0} Users</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Gross Files Processed</p>
                  <h3 className='text-xl sm:text-2xl font-black text-indigo-600 mt-1'>{stats?.filesProcessed ?? 0} Files</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Success Rate</p>
                  <h3 className='text-xl sm:text-2xl font-black text-emerald-600 mt-1'>{stats?.successRate ?? '0%'}</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Wallet Balance (Credits)</p>
                  <h3 className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stats?.monthlyProfit ?? 0}</h3>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'Manage Team Agents' && <ManageTeamAgents />}
        {activeTab === 'Track Applications' && <TrackApplications />}
        {activeTab === 'Performance Logs' && <PerformanceLogs />}
        {activeTab === 'Revenue Streams' && <RevenueStreams />}
        {activeTab === 'Firm Settings' && <FirmSettings />}
      </div>
    </div>
  );
};

export default AgencyDashboard;
