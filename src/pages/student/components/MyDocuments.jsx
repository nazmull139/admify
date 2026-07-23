import React, { useEffect, useState } from 'react';
import { FaClock, FaFileAlt, FaHistory, FaPaperPlane, FaTimesCircle, FaUserEdit } from 'react-icons/fa';
import { aiService } from '../../../utils/services/aiService';
import { studentService } from '../../../utils/services/studentService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const statusBadge = (status) => ({
  None: 'bg-slate-100 text-slate-500',
  Pending: 'bg-amber-50 text-amber-600',
  Accepted: 'bg-blue-50 text-blue-600',
  Declined: 'bg-rose-50 text-rose-600',
  Completed: 'bg-emerald-50 text-emerald-600',
}[status] || 'bg-slate-100 text-slate-500');

const MyDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [note, setNote] = useState('');
  const [actingId, setActingId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const docsRes = await aiService.getMyDocuments();
      setDocs(docsRes.data || []);
      try {
        const agentRes = await studentService.getAssignedAgent();
        setAgent(agentRes.data);
      } catch {
        setAgent(null); // no assigned agent yet — that's fine, just disables the request-edit action
      }
    } catch (err) {
      setError(err.message || 'Could not load your documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestEdit = async (docId) => {
    if (!agent) return;
    setActingId(docId);
    setActionMsg('');
    try {
      const res = await studentService.requestDocumentEdit(docId, { agentId: agent._id, note });
      setDocs((prev) => prev.map((d) => (d._id === docId ? res.data : d)));
      setNote('');
      setActionMsg('Edit request sent to your agent!');
    } catch (err) {
      setActionMsg(err.message || 'Could not send edit request.');
    } finally {
      setActingId(null);
    }
  };

  const handleCancelRequest = async (docId) => {
    setActingId(docId);
    setActionMsg('');
    try {
      const res = await studentService.cancelDocumentEditRequest(docId);
      setDocs((prev) => prev.map((d) => (d._id === docId ? res.data : d)));
    } catch (err) {
      setActionMsg(err.message || 'Could not cancel request.');
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading your documents..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaFileAlt className="text-indigo-600" /> My AI Documents
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Every SOP and LOR you've generated, with full version history. {agent ? `Ask ${agent.name} to review or edit any of them.` : 'Get an agent assigned to request edits.'}
        </p>
      </div>

      {actionMsg && (
        <div className={`text-xs font-bold px-4 py-3 rounded-xl ${actionMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {actionMsg}
        </div>
      )}

      {docs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No SOP or LOR documents yet — generate one from the AI SOP or AI LOR tool first.
        </div>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => {
            const latest = doc.versions?.[doc.versions.length - 1];
            const isExpanded = expandedId === doc._id;
            const editRequest = doc.editRequest || { status: 'None' };
            return (
              <div key={doc._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{doc.docType}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${statusBadge(editRequest.status)}`}>
                        {editRequest.status === 'None' ? 'No Edit Request' : editRequest.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                      <FaHistory /> {doc.versions?.length || 0} version{doc.versions?.length !== 1 ? 's' : ''} · Created {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : doc._id)}
                    className="text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline self-start sm:self-auto"
                  >
                    {isExpanded ? 'Collapse' : 'View & Manage'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-50 p-5 space-y-4 bg-slate-50/40">
                    <textarea
                      readOnly value={latest?.content || ''}
                      className="w-full h-48 bg-white text-slate-800 p-4 rounded-xl border border-slate-200 font-mono text-xs leading-relaxed resize-none"
                    />

                    {doc.versions.length > 1 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Version History</p>
                        {doc.versions.map((v, i) => (
                          <p key={i} className="text-[11px] text-slate-500 font-medium">
                            v{i + 1} — {v.editorRole === 'AI' ? 'AI generated' : 'Edited by your agent'} {v.note && `("${v.note}")`}
                          </p>
                        ))}
                      </div>
                    )}

                    {editRequest.status === 'None' || editRequest.status === 'Declined' || editRequest.status === 'Completed' ? (
                      agent ? (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FaUserEdit /> Request a review from {agent.name}</label>
                          <textarea
                            rows="2" placeholder="What would you like your agent to improve or check?"
                            value={note} onChange={(e) => setNote(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 resize-none"
                          />
                          <button
                            onClick={() => handleRequestEdit(doc._id)}
                            disabled={actingId === doc._id}
                            className="bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <FaPaperPlane /> {actingId === doc._id ? 'Sending...' : 'Send Request'}
                          </button>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 font-semibold">Get an agent assigned to request edits on this document.</p>
                      )
                    ) : editRequest.status === 'Pending' ? (
                      <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5"><FaClock /> Waiting for your agent to respond...</p>
                        <button
                          onClick={() => handleCancelRequest(doc._id)}
                          disabled={actingId === doc._id}
                          className="text-[10px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-1 hover:underline disabled:opacity-50"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      </div>
                    ) : editRequest.status === 'Accepted' ? (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-blue-700">Your agent accepted this request and is working on it.</p>
                      </div>
                    ) : null}
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

export default MyDocuments;
