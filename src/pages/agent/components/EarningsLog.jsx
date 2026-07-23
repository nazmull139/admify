import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleUp, FaCheckCircle, FaClock, FaHandHoldingUsd, FaHistory, FaTimesCircle } from 'react-icons/fa';
import { agentService } from '../../../utils/services/agentService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const EarningsLog = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('bKash');
  const [submitting, setSubmitting] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState('');

  const loadEarnings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentService.getEarnings();
      setTotalEarnings(res.data.totalEarnings);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.message || 'Could not load your earnings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const handleWithdrawSubmission = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      setPayoutMsg('Please enter a valid amount!');
      return;
    }
    setSubmitting(true);
    setPayoutMsg('');
    try {
      await agentService.requestPayout(Number(withdrawAmount), paymentGateway);
      setPayoutMsg(`Payout request of ${withdrawAmount} credits via ${paymentGateway} submitted successfully!`);
      setWithdrawAmount('');
      await loadEarnings();
    } catch (err) {
      setPayoutMsg(err.message || 'Could not submit payout request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading your earnings..." />;
  if (error) return <ErrorState message={error} onRetry={loadEarnings} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Wallet Balance (Credits)</p>
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{totalEarnings}</h3>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payouts Made</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {transactions.filter((t) => t.transactionType === 'Payout').length}
          </h3>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Credited Events</p>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{transactions.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-2">
            <FaHistory className="text-slate-400 text-xs sm:text-sm" />
            <h3 className="font-black text-slate-900 text-base">Payout & Transaction Ledger</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4 text-right pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {transactions.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-400 font-semibold">No transactions yet.</td></tr>
                )}
                {transactions.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 text-slate-900 font-bold uppercase">{log.transactionType}</td>
                    <td className="p-4 text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-900 font-black">{log.amount} CR</td>
                    <td className="p-4 text-slate-500">{log.gateway || 'Internal'}</td>
                    <td className="p-4 text-right pr-6">
                      {log.status === 'Pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                          <FaClock /> Awaiting Approval
                        </span>
                      ) : log.status === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                          <FaTimesCircle /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                          <FaCheckCircle /> {log.transactionType === 'Payout' ? 'Approved' : 'Recorded'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
              <FaHandHoldingUsd className="text-indigo-600" /> Claim Payout
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Request a payout from your wallet balance to your mobile bank or bank account.</p>
          </div>

          {payoutMsg && (
            <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${payoutMsg.includes('Could not') || payoutMsg.includes('valid amount') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {payoutMsg}
            </div>
          )}

          <form onSubmit={handleWithdrawSubmission} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Amount (Credits)</label>
              <input
                type="number"
                required
                placeholder="e.g. 2000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Gateway</label>
              <select
                value={paymentGateway}
                onChange={(e) => setPaymentGateway(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
              >
                <option value="bKash">bKash (Personal)</option>
                <option value="Nagad">Nagad (Personal)</option>
                <option value="Bank Transfer">Bank Electronic Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <FaArrowAltCircleUp /> {submitting ? 'Submitting...' : 'Request Payout'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default EarningsLog;
