import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaSearch, FaShieldAlt, FaUserMinus, FaUsersCog, FaUserTag } from 'react-icons/fa';
import { adminService } from '../../../utils/services/adminService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const VERIFIABLE_ROLES = ['Agent', 'Agency', 'Representative'];

const GlobalUsersControl = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);
  const [verifiedIds, setVerifiedIds] = useState([]); // tracks who's been verified this session

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getAllUsers(searchTerm, roleFilter);
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter]);

  const handleToggleStatus = async (id) => {
    setActingId(id);
    try {
      await adminService.toggleUserStatus(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBanned: !u.isBanned } : u)));
    } catch (err) {
      alert(err.message || 'Could not update user status.');
    } finally {
      setActingId(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setActingId(id);
    try {
      const res = await adminService.changeUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      alert(err.message || 'Could not update role.');
    } finally {
      setActingId(null);
    }
  };

  const handleVerify = async (id, role) => {
    setActingId(id);
    try {
      if (role === 'Agent') await adminService.verifyAgent(id);
      else if (role === 'Agency') await adminService.verifyAgency(id);
      else if (role === 'Representative') await adminService.verifyRepresentative(id);
      setVerifiedIds((prev) => [...prev, id]);
    } catch (err) {
      alert(err.message || 'Could not verify this account.');
    } finally {
      setActingId(null);
    }
  };

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastRole, setBroadcastRole] = useState('All');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setBroadcasting(true);
    setBroadcastResult('');
    try {
      const res = await adminService.broadcastNotification(broadcastMsg, 'info', broadcastRole);
      setBroadcastResult(res.message);
      setBroadcastMsg('');
    } catch (err) {
      setBroadcastResult(err.message || 'Could not send broadcast.');
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-black text-rose-600 tracking-tight flex items-center gap-2">
            <FaUsersCog /> Global Users Control
          </h3>
          <p className="text-xs text-slate-400 font-medium">Update authorization roles and ban network entities.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500 text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 sm:w-48">
            <FaUserTag className="text-slate-400 text-xs" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-transparent text-xs font-bold focus:outline-none text-slate-700"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Agent">Agent</option>
              <option value="Agency">Agency</option>
              <option value="Representative">Representative</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Broadcast Notification</h4>
        {broadcastResult && (
          <div className={`text-xs font-bold px-3 py-2 rounded-xl ${broadcastResult.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {broadcastResult}
          </div>
        )}
        <form onSubmit={handleBroadcast} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text" placeholder="Message to send to users..." value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
          />
          <select value={broadcastRole} onChange={(e) => setBroadcastRole(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-500">
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Agent">Agents</option>
            <option value="Agency">Agencies</option>
            <option value="Representative">Representatives</option>
          </select>
          <button type="submit" disabled={broadcasting} className="bg-slate-900 hover:bg-rose-600 disabled:opacity-50 text-white font-black px-5 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all">
            {broadcasting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      {loading && <LoadingState label="Loading users..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadUsers} />}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">User Node</th>
                  <th className="p-4">Network Email</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Verification</th>
                  <th className="p-4 text-center">Authorization Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {users.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-slate-400 font-semibold">No users found.</td></tr>
                )}
                {users.map((user) => (
                  <tr key={user._id} className={`hover:bg-slate-50/50 transition-colors ${user.isBanned ? 'bg-rose-50/20' : ''}`}>
                    <td className="p-4 pl-6">
                      <span className="text-slate-900 font-black block">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">UID: #{user._id.slice(-6).toUpperCase()}</span>
                    </td>

                    <td className="p-4 font-semibold text-slate-600">{user.email}</td>

                    <td className="p-4">
                      <select
                        value={user.role}
                        disabled={actingId === user._id}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-rose-500"
                      >
                        <option value="Student">Student</option>
                        <option value="Agent">Agent</option>
                        <option value="Agency">Agency</option>
                        <option value="Representative">Representative</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-block border ${
                        !user.isBanned ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {VERIFIABLE_ROLES.includes(user.role) ? (
                        verifiedIds.includes(user._id) ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <FaCheckCircle /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerify(user._id, user.role)}
                            disabled={actingId === user._id}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-all inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <FaShieldAlt /> Verify
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold">N/A</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        disabled={actingId === user._id}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all inline-flex items-center gap-1 shadow-sm disabled:opacity-50 ${
                          !user.isBanned
                            ? 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white'
                            : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white'
                        }`}
                      >
                        {!user.isBanned ? (<><FaUserMinus /> Revoke Access</>) : (<><FaCheckCircle /> Grant Access</>)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default GlobalUsersControl;
