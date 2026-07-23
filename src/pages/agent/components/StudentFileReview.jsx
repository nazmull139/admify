import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheck, FaFilePdf, FaSave, FaTimes } from 'react-icons/fa';
import { agentService } from '../../../utils/services/agentService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const StudentFileReview = ({ selectedStudentId, onBackToList }) => {
  const [data, setData] = useState(null); // { user, profile, application }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewStatus, setReviewStatus] = useState('Document Review');
  const [agentComments, setAgentComments] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [docActingId, setDocActingId] = useState(null);

  const loadDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentService.getStudentDetails(selectedStudentId);
      setData(res.data);
      setReviewStatus(res.data.application?.status || 'Document Review');
      setAgentComments(res.data.application?.agentComments || '');
    } catch (err) {
      setError(err.message || 'Could not load this student file.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentId]);

  const handleSaveReview = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await agentService.modifyApplicationStatus(data.application._id, { status: reviewStatus, agentComments });
      setSaveMsg(`Review saved! Status updated to: ${reviewStatus}`);
    } catch (err) {
      setSaveMsg(err.message || 'Could not save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleDocDecision = async (docId, approve) => {
    setDocActingId(docId);
    try {
      if (approve) await agentService.approveDocument(selectedStudentId, docId);
      else await agentService.rejectDocument(selectedStudentId, docId);
      setData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          documents: prev.profile.documents.map((d) => (d._id === docId ? { ...d, status: approve ? 'Verified' : 'Rejected' } : d)),
        },
      }));
    } catch (err) {
      alert(err.message || 'Could not update document status.');
    } finally {
      setDocActingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading student file..." />;
  if (error) return <ErrorState message={error} onRetry={loadDetails} />;
  if (!data) return null;

  const { user, profile } = data;

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex items-center gap-3">
        <button
          onClick={onBackToList}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-600 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
        </button>
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Reviewing: {user?.name}</h3>
          <p className="text-xs text-slate-400 font-medium">Evaluate academic matrices and update verification status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Target Country</p>
              <p className="text-xs font-black text-slate-800">{profile?.desiredCountry || '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Desired Subject</p>
              <p className="text-xs font-black text-slate-800 truncate">{profile?.preferredSubject || '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">CGPA/GPA</p>
              <p className="text-xs font-black text-indigo-600">{profile?.gpa ?? '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">IELTS Score</p>
              <p className="text-xs font-black text-emerald-600">{profile?.ielts ?? '—'}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Uploaded Educational Vault</h4>
            <div className="grid grid-cols-1 gap-3">
              {(!profile?.documents || profile.documents.length === 0) && (
                <p className="text-xs text-slate-400 font-semibold py-2">No documents uploaded yet.</p>
              )}
              {profile?.documents?.map((doc) => (
                <div key={doc._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaFilePdf className="text-rose-500 text-sm flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-700 truncate">{doc.name}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : doc.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline">View</a>
                    {doc.status === 'Pending' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDocDecision(doc._id, true)}
                          disabled={docActingId === doc._id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => handleDocDecision(doc._id, false)}
                          disabled={docActingId === doc._id}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Evaluation Control</h4>

            {saveMsg && (
              <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${saveMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {saveMsg}
              </div>
            )}

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Workflow Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                >
                  <option value="Document Review">Document Review</option>
                  <option value="SOP Pending">SOP Pending</option>
                  <option value="Action Required">Action Required</option>
                  <option value="Processing">Processing</option>
                  <option value="Offer Issued">Offer Issued</option>
                  <option value="Visa Processing">Visa Processing</option>
                  <option value="Completed">Completed & Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Evaluation Note (Visible to Student)</label>
                <textarea
                  rows="4"
                  placeholder="Type advice or action required (e.g., Please re-upload clear transcript copy...)"
                  value={agentComments}
                  onChange={(e) => setAgentComments(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-1.5 pt-3"
              >
                <FaSave /> {saving ? 'Saving...' : 'Commit Evaluation'}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentFileReview;
