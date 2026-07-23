import React, { useEffect, useState } from 'react';
import { FaCloudUploadAlt, FaFilePdf, FaGraduationCap, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { studentService } from '../../../utils/services/studentService';
import { useAuth } from '../../../context/AuthContext';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    desiredCountry: '',
    preferredSubject: '',
    gpa: '',
    ielts: '',
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentService.getProfile();
      const p = res.data;
      setProfileData({
        fullName: p.fullName || '',
        phone: p.phone || '',
        desiredCountry: p.desiredCountry || '',
        preferredSubject: p.preferredSubject || '',
        gpa: p.gpa ?? '',
        ielts: p.ielts ?? '',
      });
      setDocuments(p.documents || []);
    } catch (err) {
      if (err.status === 404) {
        // No profile yet — that's fine, keep defaults so the student can create one.
        setDocuments([]);
      } else {
        setError(err.message || 'Could not load your profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await studentService.updateProfile(profileData);
      setSaveMsg('Profile updated successfully!');
      setDocuments(res.data.documents || []);
    } catch (err) {
      setSaveMsg(err.message || 'Could not save profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await studentService.uploadDocument(file);
      setDocuments(res.data?.documents || documents);
      // Re-fetch to be safe, since upload response shape may vary
      await loadProfile();
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await studentService.deleteDocument(docId);
      setDocuments(documents.filter((d) => d._id !== docId));
    } catch (err) {
      setUploadError(err.message || 'Could not delete document.');
    }
  };

  if (loading) return <LoadingState label="Loading your profile..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Academic Profile Matrix 🎯</h3>
        <p className="text-xs text-slate-500">Keep your academic achievements and immigration papers updated for agent evaluation.</p>
      </div>

      {error && <ErrorState message={error} onRetry={loadProfile} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <FaUser /> Personal Details
            </div>

            {saveMsg && (
              <div className={`text-xs font-bold px-4 py-2.5 rounded-xl ${saveMsg.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {saveMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                <input
                  type="text" name="fullName" value={profileData.fullName} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                <input
                  type="email" value={user?.email || ''} disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Contact Phone</label>
                <input
                  type="text" name="phone" value={profileData.phone} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Target Country</label>
                <input
                  type="text" name="desiredCountry" value={profileData.desiredCountry} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pt-4 pb-3 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <FaGraduationCap /> Academic Scorecards
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Latest CGPA / GPA</label>
                <input
                  type="number" step="0.01" name="gpa" value={profileData.gpa} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">IELTS / TOEFL Score</label>
                <input
                  type="number" step="0.5" name="ielts" value={profileData.ielts} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Preferred Subject</label>
                <input
                  type="text" name="preferredSubject" value={profileData.preferredSubject} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Matrix Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider text-left mb-4">
              <FaCloudUploadAlt /> Document Vault
            </div>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 transition-colors rounded-xl p-6 bg-slate-50/50 cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                accept=".pdf,.doc,.docx"
              />
              {uploading ? (
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              ) : (
                <FaCloudUploadAlt className="text-slate-400 text-3xl mx-auto mb-2" />
              )}
              <p className="text-xs font-black text-slate-800">{uploading ? 'Uploading...' : 'Upload Academic Papers'}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">PDF, DOC up to 5MB</p>
            </div>
            {uploadError && <p className="text-[11px] font-bold text-red-500 mt-2">{uploadError}</p>}
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Uploaded Documents</div>

            <div className="space-y-2.5">
              {documents.length === 0 && (
                <p className="text-xs text-slate-400 font-semibold text-center py-4">No documents uploaded yet.</p>
              )}
              {documents.map((doc) => (
                <div key={doc._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FaFilePdf className="text-rose-500 text-base flex-shrink-0" />
                    <div className="min-w-0">
                      <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-800 truncate hover:text-indigo-600 block">{doc.name}</a>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">{doc.docType} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`
                      text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md
                      ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : doc.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}
                    `}>
                      {doc.status}
                    </span>
                    <button onClick={() => handleDeleteDocument(doc._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
