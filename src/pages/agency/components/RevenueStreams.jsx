import React, { useEffect, useState } from 'react';
import { FaHandHoldingUsd, FaMoneyBillWave, FaWallet } from 'react-icons/fa';
import { agencyService } from '../../../utils/services/agencyService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const RevenueStreams = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedAgent, setSelectedAgent] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');

  const loadRevenue = async () => {
    setLoading(true);
    setError('');
    try {
      const [revRes, agentsRes] = await Promise.all([
        agencyService.getRevenue(),
        agencyService.getAgents(),
      ]);
      setBalance(revRes.data.balance);
      setTransactions(revRes.data.transactions || []);
      setAgents(agentsRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load revenue data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  const handleSendCommission = async (e) => {
    e.preventDefault();
    if (!selectedAgent || !creditAmount) return;
    setSending(true);
    setSendMsg('');
    try {
      const res = await agencyService.sendAgentCommission(selectedAgent, Number(creditAmount));
      setBalance(res.currentAgencyBalance);
      setSendMsg('Commission sent successfully!');
      setCreditAmount('');
      await loadRevenue();
    } catch (err) {
      setSendMsg(err.message || 'Could not send commission.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingState label="Loading revenue data..." />;
  if (error) return <ErrorState message={error} onRetry={loadRevenue} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FaMoneyBillWave className="text-indigo-600" /> Revenue Streams & Financial Ledger
        </h3>
        <p className="text-xs text-slate-400 font-medium">Track your agency wallet balance and distribute commissions to your team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between md:col-span-2">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Agency Wallet Balance</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{balance} Credits</h3>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-base"><FaWallet /></div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</p>
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{transactions.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base sm:text-lg">Audit Transaction Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {transactions.length === 0 && (
                  <tr><td colSpan={3} className="p-6 text-center text-slate-400 font-semibold">No transactions yet.</td></tr>
                )}
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 text-slate-900 font-black font-mono uppercase">{txn.transactionType}</td>
                    <td className="p-4 font-semibold text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-black font-mono text-sm text-emerald-600">+{txn.amount} CR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
            <FaHandHoldingUsd className="text-indigo-600" /> Send Commission
          </h3>
          <p className="text-xs text-slate-400 font-medium">Transfer credits from your agency wallet to a team agent.</p>

          {sendMsg && (
            <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${sendMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {sendMsg}
            </div>
          )}

          <form onSubmit={handleSendCommission} className="space-y-4">
            <select
              required value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">Select an agent...</option>
              {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
            <input
              type="number" required min="1" placeholder="Credit amount"
              value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
            />
            <button
              type="submit" disabled={sending}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-sm"
            >
              {sending ? 'Sending...' : 'Send Commission'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default RevenueStreams;
