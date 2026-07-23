import React, { useEffect, useState } from 'react';
import { FaCashRegister, FaExclamationTriangle, FaHandHoldingUsd, FaServer, FaThLarge, FaTrashAlt, FaUniversity, FaUsersCog } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { LoadingState, ErrorState } from '../../components/StatusState';
import { adminService } from '../../utils/services/adminService';
import AdminUniversities from './components/AdminUniversities';
import DeleteRequests from './components/DeleteRequests';
import GeminiApiEngine from './components/GeminiApiEngine';
import GlobalUsersControl from './components/GlobalUsersControl';
import PaymentLedger from './components/PaymentLedger';
import PayoutRequests from './components/PayoutRequests';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getDashboardMetrics();
      setMetrics(res.metrics);
    } catch (err) {
      setError(err.message || 'Could not load platform metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const adminMenu = [
    { name: 'Dashboard', icon: <FaThLarge /> },
    { name: 'Global Users Control', icon: <FaUsersCog /> },
    { name: 'Universities', icon: <FaUniversity /> },
    { name: 'Gemini API Engine', icon: <FaServer /> },
    { name: 'Payment Ledger', icon: <FaCashRegister /> },
    { name: 'Payout Requests', icon: <FaHandHoldingUsd /> },
    { name: 'Delete Requests', icon: <FaTrashAlt /> },
  ];

  return (
    <div className='flex bg-slate-50 min-h-screen overflow-hidden relative'>
      <Sidebar menuItems={adminMenu} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-20 lg:pt-8'>
        <div className='mb-8'>
          <h1 className='text-xl sm:text-2xl font-black text-rose-600 tracking-tight'>Universal Root Admin ⚙️</h1>
          <p className='text-xs sm:text-sm text-slate-500'>Global authorization core dashboard.</p>
        </div>

        {activeTab === 'Dashboard' && (
          <div className='space-y-6 sm:space-y-8 animate-fade-in'>
            {loading && <LoadingState label="Loading platform metrics..." />}
            {!loading && error && <ErrorState message={error} onRetry={loadMetrics} />}

            {!loading && !error && (
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5'>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-rose-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Platform Base</p>
                  <h3 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1'>{metrics?.totalUsers ?? 0} Users</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Gemini API Hits</p>
                  <h3 className='text-2xl sm:text-3xl font-black text-indigo-600 mt-1'>{metrics?.apiHits ?? 0} Requests</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between'>
                  <div>
                    <p className='text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider'>Delete Alerts</p>
                    <h3 className='text-2xl sm:text-3xl font-black text-rose-600 mt-1'>{metrics?.pendingDeletes ?? 0} Pending</h3>
                  </div>
                  <FaExclamationTriangle className='text-rose-500 text-lg sm:text-xl animate-bounce' />
                </div>

                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Applications</p>
                  <h3 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1'>{metrics?.totalApps ?? 0}</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Universities Listed</p>
                  <h3 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1'>{metrics?.totalUniversities ?? 0}</h3>
                </div>
                <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                  <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Admin Wallet Balance</p>
                  <h3 className='text-2xl sm:text-3xl font-black text-emerald-600 mt-1'>{metrics?.totalRevenue ?? 0}</h3>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'Gemini API Engine' && <GeminiApiEngine />}
        {activeTab === 'Global Users Control' && <GlobalUsersControl />}
        {activeTab === 'Universities' && <AdminUniversities />}
        {activeTab === 'Payment Ledger' && <PaymentLedger />}
        {activeTab === 'Payout Requests' && <PayoutRequests />}
        {activeTab === 'Delete Requests' && <DeleteRequests />}
      </div>
    </div>
  );
};

export default AdminDashboard;
