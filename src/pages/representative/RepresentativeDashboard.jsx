import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaExclamationTriangle, FaThLarge, FaUniversity, FaUser } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { LoadingState, ErrorState } from '../../components/StatusState';
import { representativeService } from '../../utils/services/representativeService';
import { useAuth } from '../../context/AuthContext';
import RepApplications from './components/RepApplications';
import RepProfile from './components/RepProfile';
import RepUniversityProfile from './components/RepUniversityProfile';

const RepresentativeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await representativeService.getProfile();
      setProfile(res.data);
    } catch (err) {
      setError(err.message || 'Could not load your representative profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const repMenu = [
    { name: 'Dashboard', icon: <FaThLarge /> },
    { name: 'University Profile', icon: <FaUniversity /> },
    { name: 'Applications', icon: <FaClipboardList /> },
    { name: 'My Profile', icon: <FaUser /> },
  ];

  return (
    <div className='flex bg-slate-50 min-h-screen overflow-hidden relative'>
      <Sidebar menuItems={repMenu} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-20 lg:pt-8'>
        <div className='mb-8'>
          <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>University Representative Panel 🎓</h1>
          <p className='text-xs sm:text-sm text-slate-500'>Manage your university's public profile and review incoming applications.</p>
        </div>

        {loading && <LoadingState label="Loading your representative profile..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadProfile} />}

        {!loading && !error && profile && !profile.isVerified && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl shrink-0"><FaExclamationTriangle /></div>
            <div>
              <h3 className="font-black text-amber-700 text-sm">Verification Pending</h3>
              <p className="text-xs text-amber-600 font-medium mt-0.5">An admin needs to verify your representative account before you can manage applications. You can still update your profile in the meantime.</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'Dashboard' && (
              <div className='space-y-6 animate-fade-in'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                    <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Linked University</p>
                    <h3 className='text-lg sm:text-xl font-black text-slate-900 mt-1'>{profile?.universityId?.name || 'Not linked'}</h3>
                  </div>
                  <div className='bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm'>
                    <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider'>Verification Status</p>
                    <h3 className={`text-lg sm:text-xl font-black mt-1 ${profile?.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {profile?.isVerified ? 'Verified' : 'Pending Review'}
                    </h3>
                  </div>
                </div>
                <p className='text-xs text-slate-400 font-medium'>Welcome, {user?.name}. Use the sidebar to update your university's public listing or review applications submitted to it.</p>
              </div>
            )}
            {activeTab === 'University Profile' && <RepUniversityProfile />}
            {activeTab === 'Applications' && <RepApplications isVerified={!!profile?.isVerified} />}
            {activeTab === 'My Profile' && <RepProfile onSaved={loadProfile} />}
          </>
        )}
      </div>
    </div>
  );
};

export default RepresentativeDashboard;
