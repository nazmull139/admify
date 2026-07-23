import React, { useEffect, useState } from 'react';
import { FaCashRegister, FaCreditCard, FaSearch } from 'react-icons/fa';
import { adminService } from '../../../utils/services/adminService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const PaymentLedger = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTxn, setSearchTxn] = useState('');

  const loadLedger = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getPaymentLedger();
      setBalance(res.data.balance);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.message || 'Could not load the payment ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const filteredTransactions = transactions.filter((txn) =>
    txn.senderId?.name?.toLowerCase().includes(searchTxn.toLowerCase()) ||
    txn.receiverId?.name?.toLowerCase().includes(searchTxn.toLowerCase()) ||
    txn.transactionType?.toLowerCase().includes(searchTxn.toLowerCase())
  );

  const totalTopUps = transactions.filter((t) => t.transactionType === 'TopUp').reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = transactions.filter((t) => t.transactionType === 'Payout').reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <LoadingState label="Loading payment ledger..." />;
  if (error) return <ErrorState message={error} onRetry={loadLedger} />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
        <h3 className="text-base font-black text-rose-600 tracking-tight flex items-center gap-2">
          <FaCashRegister /> Global Payment Ledger
        </h3>
        <p className="text-xs text-slate-400 font-medium">Platform-wide transaction log across all users, agents, and agencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Wallet Balance</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{balance} Credits</h3>
          </div>
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 text-base"><FaCreditCard /></div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Credits Topped Up</p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{totalTopUps}</h3>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payouts Processed</p>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{totalPayouts}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTxn}
              onChange={(e) => setSearchTxn(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Type</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Receiver</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right pr-6">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredTransactions.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400 font-semibold">No transactions found.</td></tr>
              )}
              {filteredTransactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="text-slate-900 font-black font-mono block uppercase">{txn.transactionType}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{txn.gateway || 'Internal'}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-600">{txn.senderId?.name || '—'}</td>
                  <td className="p-4 font-semibold text-slate-600">{txn.receiverId?.name || '—'}</td>
                  <td className="p-4 font-semibold text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right pr-6 font-black font-mono text-sm text-emerald-600">{txn.amount} CR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PaymentLedger;
