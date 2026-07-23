import React, { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaFileAlt, FaSave, FaTimes } from 'react-icons/fa';
import { agentService } from '../../../utils/services/agentService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const EditRequests = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentService.getEditRequests();
      setDocs(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load edit requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleRespond = async (docId, accept) => {
    setActingId(docId);
    try {
      const res = await agentService.respondToEditRequest(docId, accept);
      if (!accept) setDocs((prev) => prev.filter((d) => d._id !== docId));
      else setDocs((prev) => prev.map((d) => (d._id === docId ? res.data : d)));
    } catch (err) {
      alert(err.message || 'Could not respond to this request.');
    } finally {
      setActingId(null);
    }
  };

  const openEditor = (doc) => {
    setEditingId(doc._id);
    setEditContent(doc.versions?.[doc.versions.length - 1]?.content || '');
    setEditNote('');
  };

  const handleSaveEdit = async (docId) => {
    setSaving(true);
    try {
      await agentService.editDocument(docId, editContent, editNote);
      setDocs((prev) => prev.filter((d) => d._id !== docId));
      setEditingId(null);
    } catch (err) {
      alert(err.message || 'Could not save your edits.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading edit requests..." />;
  if (error) return <ErrorState message={error} onRetry={loadRequests} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaFileAlt className="text-indigo-600" /> SOP/LOR Edit Requests
        </h3>
        <p className="text-xs text-slate-400 font-medium">Students you're assigned to may ask you to review or edit their AI-generated SOP/LOR.</p>
      </div>

      {docs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No pending edit requests right now.
        </div>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => {
            const isEditing = editingId === doc._id;
            const latest = doc.versions?.[doc.versions.length - 1];
            return (
              <div key={doc._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{doc.docType}</span>
                      <span className="text-[11px] font-bold text-slate-500">from {doc.studentId?.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${doc.editRequest.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {doc.editRequest.status}
                      </span>
                    </div>
                    {doc.editRequest.studentNote && (
                      <p className="text-xs text-slate-500 font-medium mt-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">"{doc.editRequest.studentNote}"</p>
                    )}
                  </div>

                  {doc.editRequest.status === 'Pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleRespond(doc._id, true)} disabled={actingId === doc._id} className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50">
                        <FaCheck /> Accept
                      </button>
                      <button onClick={() => handleRespond(doc._id, false)} disabled={actingId === doc._id} className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50">
                        <FaTimes /> Decline
                      </button>
                    </div>
                  )}

                  {doc.editRequest.status === 'Accepted' && !isEditing && (
                    <button onClick={() => openEditor(doc)} className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0">
                      <FaEdit /> Edit Document
                    </button>
                  )}
                </div>

                {isEditing && (
                  <div className="border-t border-slate-50 p-5 space-y-3 bg-slate-50/40">
                    <textarea
                      value={editContent} onChange={(e) => setEditContent(e.target.value)}
                      rows="10"
                      className="w-full bg-white text-slate-800 p-4 rounded-xl border border-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text" placeholder="Note about what you changed (optional)"
                      value={editNote} onChange={(e) => setEditNote(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveEdit(doc._id)} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <FaSave /> {saving ? 'Saving...' : 'Submit Edited Version'}
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-wider hover:underline">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EditRequests;
