import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { FaCheckCircle, FaCoins, FaCreditCard, FaHistory, FaWallet } from 'react-icons/fa';
import { walletService } from '../../../utils/services/walletService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

// Backend only implements a single Stripe card checkout (see walletController.createCheckout),
// so the pack prices below are in USD and the only real payment method is card.
const creditPacks = [
  { id: 'pack_1', name: 'Starter Pack', credits: 10, amount: 5, description: 'Perfect for trying out AI tools' },
  { id: 'pack_2', name: 'Standard Pack', credits: 30, amount: 12, description: 'Most popular for active students', popular: true },
  { id: 'pack_3', name: 'Premium Bundle', credits: 100, amount: 35, description: 'Best value for complete applications' },
];

const StudentWallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentCredits, setCurrentCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState('');

  const loadWallet = async () => {
    setLoading(true);
    setError('');
    try {
      const [balRes, txRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
      ]);
      setCurrentCredits(balRes.data.balance);
      setTransactions(txRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your wallet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const verifyRan = useRef(false);

  // Handle return from Stripe checkout
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const payment = searchParams.get('payment');
    if (payment === 'success' && sessionId) {
      if (verifyRan.current) return; // guards against StrictMode's dev-only double-invoke
      verifyRan.current = true;
      (async () => {
        try {
          const res = await walletService.verifyPayment(sessionId);
          setPaymentMsg(res.message || 'Payment confirmed!');
          setCurrentCredits(res.balance);
          await loadWallet();
        } catch (err) {
          setPaymentMsg(err.message || 'Could not verify payment.');
        } finally {
          searchParams.delete('session_id');
          searchParams.delete('payment');
          setSearchParams(searchParams, { replace: true });
        }
      })();
    } else if (payment === 'cancelled') {
      setPaymentMsg('Payment was cancelled.');
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!selectedPack) return;
    setCheckingOut(true);
    setPaymentMsg('');
    try {
      const res = await walletService.createCheckout(selectedPack.credits, selectedPack.amount, selectedPack.name);
      window.location.href = res.url; // redirect to Stripe checkout
    } catch (err) {
      setPaymentMsg(err.message || 'Could not start checkout.');
      setCheckingOut(false);
    }
  };

  if (loading) return <LoadingState label="Loading your wallet..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {error && <ErrorState message={error} onRetry={loadWallet} />}
      {paymentMsg && (
        <div className={`text-sm font-bold px-4 py-3 rounded-xl ${paymentMsg.toLowerCase().includes('cancel') || paymentMsg.toLowerCase().includes('could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {paymentMsg}
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <FaWallet /> Current Wallet Status
          </div>
          <h2 className="text-sm font-medium text-slate-400">Available Platform Credits</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{currentCredits}</span>
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Credits</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl z-10 w-full sm:w-auto text-center sm:text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Info</p>
          <p className="text-xs text-slate-300 mt-1">1 Credit = 1 AI University Match Search</p>
          <p className="text-xs text-slate-300">2 Credits = 1 AI SOP/LOR Generation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Buy More Credits 🪙</h3>
          <p className="text-xs text-slate-500">Top up your account instantly to continue using premium Gemini AI modules.</p>
        </div>

        <form onSubmit={handlePurchase} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`
                  bg-white p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative flex flex-col justify-between
                  ${selectedPack?.id === pack.id
                    ? 'border-indigo-600 shadow-md shadow-indigo-600/5 bg-indigo-50/10'
                    : 'border-slate-100 hover:border-slate-200 shadow-sm'}
                `}
              >
                {pack.popular && (
                  <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                    Popular
                  </span>
                )}
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-900 text-base">{pack.name}</h4>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                      {selectedPack?.id === pack.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{pack.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-baseline justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-black text-xl">
                    <FaCoins className="text-amber-500 text-base" /> {pack.credits} <span className="text-xs text-slate-400 font-bold uppercase">CR</span>
                  </div>
                  <div className="text-base font-black text-indigo-600">${pack.amount}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedPack && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-fade-in">
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Secure Checkout</h4>
                <p className="text-xs text-slate-400">You'll be redirected to Stripe to complete your card payment.</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={checkingOut}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  <FaCreditCard /> {checkingOut ? 'Redirecting...' : `Pay $${selectedPack.amount} Now`}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-2.5">
          <FaHistory className="text-slate-400" />
          <h3 className="font-black text-slate-900 text-base">Credit Transaction Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Counterparty</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {transactions.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400 font-semibold">No transactions yet.</td></tr>
              )}
              {transactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 text-slate-900 font-bold uppercase tracking-tight">{txn.transactionType}</td>
                  <td className="p-4 text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-800">{txn.senderId?.name || txn.receiverId?.name || '—'}</td>
                  <td className="p-4 text-indigo-600 font-bold">+{txn.amount} CR</td>
                  <td className="p-4 text-slate-500">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-max">
                      <FaCheckCircle /> {txn.gateway || 'Internal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentWallet;
