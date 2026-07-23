import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCog, FaGlobe, FaIdCard, FaSave, FaShieldAlt } from 'react-icons/fa';
import { agencyService } from '../../../utils/services/agencyService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const FirmSettings = () => {
  const [firmInfo, setFirmInfo] = useState({
    firmName: '', licenseNo: '', email: '', website: '', address: '', twoFactor: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agencyService.getProfile();
      if (res.data) {
        setFirmInfo({
          firmName: res.data.firmName || '',
          licenseNo: res.data.licenseNo || '',
          email: res.data.email || '',
          website: res.data.website || '',
          address: res.data.address || '',
          twoFactor: !!res.data.twoFactor,
        });
      }
    } catch (err) {
      setError(err.message || 'Could not load firm settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await agencyService.updateProfile(firmInfo);
      setSaveMsg('Firm configuration saved successfully!');
    } catch (err) {
      setSaveMsg(err.message || 'Could not save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  if (loading) return <LoadingState label="Loading firm settings..." />;
  if (error) return <ErrorState message={error} onRetry={loadProfile} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaCog className="text-indigo-600" /> Firm Settings & Credentials
        </h3>
        <p className="text-xs text-slate-400 font-medium">Configure your corporate identity, licensing info, and security preferences.</p>
      </div>

      {saveMsg && (
        <div className={`text-xs font-bold px-4 py-3 rounded-xl ${saveMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {saveMsg}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <FaBuilding className="text-slate-400" /> Corporate Profile Data
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Firm Entity Name</label>
              <input
                type="text"
                value={firmInfo.firmName}
                onChange={(e) => setFirmInfo({ ...firmInfo, firmName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <FaIdCard /> Government License ID
              </label>
              <input
                type="text"
                value={firmInfo.licenseNo}
                onChange={(e) => setFirmInfo({ ...firmInfo, licenseNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Corporate Communication Email</label>
              <input
                type="email"
                value={firmInfo.email}
                onChange={(e) => setFirmInfo({ ...firmInfo, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <FaGlobe /> Institutional Domain
              </label>
              <input
                type="url"
                value={firmInfo.website}
                onChange={(e) => setFirmInfo({ ...firmInfo, website: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">HQ Headquarters Address</label>
            <input
              type="text"
              value={firmInfo.address}
              onChange={(e) => setFirmInfo({ ...firmInfo, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white font-black px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FaSave /> {saving ? 'Saving...' : 'Commit Changes'}
            </button>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <FaShieldAlt className="text-slate-400" /> Platform Access Security
          </h4>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <span className="text-xs font-black text-slate-800 block">Enforce 2FA Security</span>
              <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Protect sub-agent login domains.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={firmInfo.twoFactor}
                onChange={() => setFirmInfo({ ...firmInfo, twoFactor: !firmInfo.twoFactor })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="p-3 bg-indigo-50/40 border border-indigo-50 rounded-xl text-[10px] font-medium text-indigo-700 leading-normal">
            This flag is saved with your agency profile. Actual 2FA enforcement should be checked at login time by the backend.
          </div>
        </div>

      </form>

    </div>
  );
};

export default FirmSettings;
