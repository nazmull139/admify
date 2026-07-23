import React, { useEffect, useState } from 'react';
import { FaIdCard, FaLock, FaSave, FaShieldAlt, FaUser } from 'react-icons/fa';
import { agentService } from '../../../utils/services/agentService';
import { authService } from '../../../utils/services/authService';
import { useAuth } from '../../../context/AuthContext';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const ProfileSettings = () => {
  const { user, refreshMe } = useAuth();
  const [profile, setProfile] = useState({ whatsappNumber: '', experience: '' });
  const [agencyName, setAgencyName] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentService.getProfile();
      const p = res.data;
      setProfile({ whatsappNumber: p?.whatsappNumber || '', experience: p?.experience ?? '' });
      setLicenseId(p?.licenseId || 'Not yet issued');
      setAgencyName(p?.agencyId?.firmName || 'Independent Agent');
    } catch (err) {
      setError(err.message || 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await agentService.updateProfile(profile);
      setSaveMsg('Profile info securely synced!');
    } catch (err) {
      setSaveMsg(err.message || 'Could not update profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg('New passwords do not match!');
      return;
    }
    setChangingPassword(true);
    setPasswordMsg('');
    try {
      await authService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordMsg('Security credentials updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg(err.message || 'Could not update password.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <LoadingState label="Loading your profile..." />;
  if (error) return <ErrorState message={error} onRetry={loadProfile} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaUser className="text-indigo-600" /> Account Security & Profile Settings
        </h3>
        <p className="text-xs text-slate-400 font-medium">Manage your identity details, system credentials, and license info.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
            <FaIdCard className="text-slate-400 text-sm" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Identity Specifications</h4>
          </div>

          {saveMsg && (
            <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${saveMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {saveMsg}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Officer Name</label>
                <input
                  type="text" disabled value={user?.name || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Official Email (Locked)</label>
                <input
                  type="email" disabled value={user?.email || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">WhatsApp Number</label>
                <input
                  type="text" value={profile.whatsappNumber}
                  onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                  placeholder="8801XXXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Affiliated Agency</label>
                <input
                  type="text" disabled value={agencyName}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Verification License</p>
                <p className="font-mono text-xs text-white font-bold mt-0.5">{licenseId}</p>
              </div>
              <span className="self-start sm:self-auto bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-emerald-500/20">
                {user?.isActive === false ? 'Suspended' : 'Authorized Node'}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <FaSave /> {saving ? 'Saving...' : 'Sync Profile Info'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
            <FaShieldAlt className="text-slate-400 text-sm" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Credential Rotation</h4>
          </div>

          {passwordMsg && (
            <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${passwordMsg.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {passwordMsg}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Password</label>
              <input
                type="password" required placeholder="••••••••" minLength={6}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confirm New Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5"
            >
              <FaLock /> {changingPassword ? 'Updating...' : 'Rotate Credentials'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfileSettings;
