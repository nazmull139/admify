import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { FaCheckCircle, FaCrown, FaExclamationTriangle } from 'react-icons/fa';
import { subscriptionService } from '../../../utils/services/subscriptionService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const StudentSubscription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sub, setSub] = useState(null);
  const [plans, setPlans] = useState(null);
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [subRes, plansRes] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getPlans(),
      ]);
      setSub(subRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError(err.message || 'Could not load your subscription.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle return from Stripe checkout, or a direct plan pick coming from the Pricing page
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const payment = searchParams.get('payment');
    const planParam = searchParams.get('plan');
    const cycleParam = searchParams.get('cycle');

    if (payment === 'success' && sessionId) {
      (async () => {
        try {
          const res = await subscriptionService.verify(sessionId);
          setActionMsg(res.message || 'Subscription activated!');
          setSub(res.data);
        } catch (err) {
          setActionMsg(err.message || 'Could not verify subscription payment.');
        } finally {
          searchParams.delete('session_id');
          searchParams.delete('payment');
          setSearchParams(searchParams, { replace: true });
        }
      })();
    } else if (payment === 'cancelled') {
      setActionMsg('Checkout was cancelled.');
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    } else if (planParam) {
      if (cycleParam) setBillingCycle(cycleParam);
      searchParams.delete('plan');
      searchParams.delete('cycle');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async (planName) => {
    setProcessing(true);
    setActionMsg('');
    try {
      const res = await subscriptionService.createCheckout(planName, billingCycle);
      window.location.href = res.url;
    } catch (err) {
      setActionMsg(err.message || 'Could not start checkout.');
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel your subscription at the end of the billing period?')) return;
    setProcessing(true);
    setActionMsg('');
    try {
      const res = await subscriptionService.cancel();
      setSub(res.data);
      setActionMsg(res.message);
    } catch (err) {
      setActionMsg(err.message || 'Could not cancel subscription.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingState label="Loading your subscription..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!sub || !plans) return null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {actionMsg && (
        <div className={`text-sm font-bold px-4 py-3 rounded-xl ${actionMsg.includes('Could not') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {actionMsg}
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <FaCrown /> Current Plan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{plans[sub.planName]?.name}</h2>
          <p className="text-xs text-slate-400 font-medium">
            Status: <span className={sub.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{sub.status}</span>
            {sub.cancelAtPeriodEnd && ' (cancelling at period end)'}
          </p>
        </div>
        {sub.planName !== 'Free' && !sub.cancelAtPeriodEnd && (
          <button
            onClick={handleCancel}
            disabled={processing}
            className="bg-white/10 hover:bg-rose-600 border border-white/10 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Cancel Subscription
          </button>
        )}
      </div>

      {sub.agencyApplicationsLimit !== 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Agency Applications This Period</p>
          <p className="text-sm font-black text-slate-800">
            {sub.agencyApplicationsUsed} / {sub.agencyApplicationsLimit === -1 ? 'Unlimited' : sub.agencyApplicationsLimit}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Available Plans</h3>
          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            {['Monthly', 'Annual'].map((cycle) => (
              <button
                key={cycle} onClick={() => setBillingCycle(cycle)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${billingCycle === cycle ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(plans).map(([key, plan]) => {
            // priceAnnual is the discounted MONTHLY rate for committing to a year
            // (backend charges priceAnnual * 12 once, annually) — always show it as /mo.
            const price = billingCycle === 'Annual' ? plan.priceAnnual : plan.priceMonthly;
            const annualTotal = plan.priceAnnual * 12;
            const isCurrent = sub.planName === key;
            return (
              <div key={key} className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4 ${isCurrent ? 'border-indigo-600' : 'border-slate-100'}`}>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{plan.name}</h4>
                  <p className="text-2xl font-black text-slate-900 mt-1">${price}<span className="text-xs text-slate-400 font-bold">/mo</span></p>
                  {billingCycle === 'Annual' && plan.priceMonthly > 0 && (
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Billed ${annualTotal}/year</p>
                  )}
                </div>
                {isCurrent ? (
                  <span className="w-full text-center py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <FaCheckCircle /> Current Plan
                  </span>
                ) : (
                  <button
                    onClick={() => key === 'Free' ? null : handleSubscribe(key)}
                    disabled={processing || key === 'Free'}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider transition-all"
                  >
                    {key === 'Free' ? 'Downgrade via support' : processing ? 'Redirecting...' : `Switch to ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-semibold text-amber-700 flex items-start gap-2">
          <FaExclamationTriangle className="mt-0.5 shrink-0" />
          Downgrading to Free isn't automated yet — it requires contacting support since it cancels an active Stripe subscription outside the normal flow.
        </div>
      </div>

    </div>
  );
};

export default StudentSubscription;
