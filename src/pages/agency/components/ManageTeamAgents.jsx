import React, { useEffect, useState } from 'react';
import { FaBan, FaCheckCircle, FaEnvelope, FaPhone, FaTimes, FaTrash, FaUserPlus, FaUsers, FaUserTie } from 'react-icons/fa';
import { agencyService } from '../../../utils/services/agencyService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const ManageTeamAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [newAgent, setNewAgent] = useState({ name: '', email: '', password: '', specialization: '', whatsappNumber: '' });
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  const loadAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agencyService.getAgents();
      setAgents(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your team agents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleToggleStatus = async (agentId) => {
    setTogglingId(agentId);
    try {
      await agencyService.toggleAgentStatus(agentId);
      await loadAgents();
    } catch (err) {
      alert(err.message || 'Could not update agent status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleRemoveAgent = async (agentId) => {
    if (!window.confirm('Remove this agent from your agency?')) return;
    try {
      await agencyService.removeAgent(agentId);
      await loadAgents();
    } catch (err) {
      alert(err.message || 'Could not remove agent.');
    }
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    setAddSubmitting(true);
    setAddError('');
    try {
      await agencyService.onboardAgent({
        ...newAgent,
        specialization: newAgent.specialization.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setShowAddModal(false);
      setNewAgent({ name: '', email: '', password: '', specialization: '', whatsappNumber: '' });
      await loadAgents();
    } catch (err) {
      setAddError(err.message || 'Could not add agent.');
    } finally {
      setAddSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading your team agents..." />;
  if (error) return <ErrorState message={error} onRetry={loadAgents} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaUsers className="text-indigo-600" /> Manage Team Agents
          </h3>
          <p className="text-xs text-slate-400 font-medium">Recruit, monitor, and configure operational access for your sub-agents.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-indigo-600 text-white font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center transition-all"
        >
          <FaUserPlus /> Recruit New Agent
        </button>
      </div>

      {agents.length === 0 && (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No agents on your team yet. Recruit your first one above.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const isSuspended = agent.isBanned;
          return (
            <div key={agent._id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 ${isSuspended ? 'opacity-70' : 'hover:border-indigo-500/30'}`}>

              <div className={`absolute top-4 right-4 text-[9px] font-black px-2.5 py-1 rounded-full border ${
                !isSuspended ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {isSuspended ? 'Suspended' : 'Active'}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600 text-base">
                    <FaUserTie />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{agent.name}</h4>
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{agent.profile?.specialization?.join(', ') || 'General'}</span>
                  </div>
                </div>

                <hr className="border-slate-50" />

                <div className="space-y-2 text-[11px] font-medium text-slate-600">
                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-slate-400" /> <span>{agent.email}</span>
                  </p>
                  {agent.profile?.whatsappNumber && (
                    <p className="flex items-center gap-2">
                      <FaPhone className="text-slate-400" /> <span>{agent.profile.whatsappNumber}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2 pt-1">
                    <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md">
                      {agent.activeLeads} Active Files
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(agent._id)}
                  disabled={togglingId === agent._id}
                  className={`w-full font-black py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 ${
                    !isSuspended
                      ? 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white'
                      : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white'
                  }`}
                >
                  {!isSuspended ? (<><FaBan /> Suspend</>) : (<><FaCheckCircle /> Activate</>)}
                </button>
                <button
                  onClick={() => handleRemoveAgent(agent._id)}
                  title="Remove from agency"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-500 transition-all"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">Recruit New Agent</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
            </div>

            {addError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl px-4 py-3">{addError}</div>
            )}

            <form onSubmit={handleAddAgent} className="space-y-4">
              <input type="text" required placeholder="Full Name" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              <input type="email" required placeholder="Email Address" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              <input type="password" required minLength={6} placeholder="Temporary Password" value={newAgent.password} onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Specializations, comma-separated" value={newAgent.specialization} onChange={(e) => setNewAgent({ ...newAgent, specialization: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="WhatsApp Number" value={newAgent.whatsappNumber} onChange={(e) => setNewAgent({ ...newAgent, whatsappNumber: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500" />

              <button type="submit" disabled={addSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all">
                {addSubmitting ? 'Adding...' : 'Add Agent'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTeamAgents;
