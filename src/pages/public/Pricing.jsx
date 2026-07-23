import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { subscriptionService } from '../../utils/services/subscriptionService';
import { useAuth } from '../../context/AuthContext';
import { LoadingState, ErrorState } from '../../components/StatusState';

const FEATURE_LABELS = {
  universityMatch: 'AI University Match',
  sop: 'AI SOP Generator',
  lor: 'AI LOR Generator',
  admissionProbability: 'Admission Probability Analysis',
  compareUniversities: 'University Comparison Tool',
  scholarshipSuggestion: 'Scholarship Finder',
  costEstimator: 'Cost Estimator',
  careerPaths: 'Career Path Suggestions',
};

const Pricing = () => {
  const [plans, setPlans] = useState(null);
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const loadPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await subscriptionService.getPlans();
      setPlans(res.data);
    } catch (err) {
      setError(err.message || 'Could not load pricing plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleChoosePlan = (planKey) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    if (user?.role !== 'Student') {
      navigate('/'); // only students subscribe
      return;
    }
    if (planKey === 'Free') {
      navigate('/studentdashboard');
      return;
    }
    navigate(`/studentdashboard?tab=Subscription&plan=${planKey}&cycle=${billingCycle}`);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-16"><LoadingState label="Loading pricing plans..." /></div>;
  if (error) return <div className="max-w-6xl mx-auto px-6 py-16"><ErrorState message={error} onRetry={loadPlans} /></div>;
  if (!plans) return null;

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-indigo-100/80 text-sm sm:text-base">Choose the plan that matches how deep you want to go with AI-powered admissions tools.</p>

          <div className="inline-flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10 mt-2">
            {['Monthly', 'Annual'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${billingCycle === cycle ? 'bg-white text-indigo-700' : 'text-indigo-100'}`}
              >
                {cycle} {cycle === 'Annual' && '(Save 20%)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {Object.entries(plans).map(([key, plan]) => {
          // priceAnnual is the discounted MONTHLY rate you get by committing to a year
          // (backend charges priceAnnual * 12 once, annually) — not a standalone yearly price.
          const price = billingCycle === 'Annual' ? plan.priceAnnual : plan.priceMonthly;
          const annualTotal = plan.priceAnnual * 12;
          const monthlyTotal = plan.priceMonthly * 12;
          const savingsPercent = plan.priceMonthly > 0 ? Math.round((1 - plan.priceAnnual / plan.priceMonthly) * 100) : 0;
          const isPopular = key === 'Pro';
          return (
            <div
              key={key}
              className={`bg-white rounded-2xl border p-8 flex flex-col gap-6 relative ${isPopular ? 'border-indigo-600 shadow-xl scale-[1.02]' : 'border-slate-100 shadow-sm'}`}
            >
              {isPopular && (
                <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</span>
              )}

              <div>
                <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">${price}</span>
                  <span className="text-xs font-bold text-slate-400">/mo</span>
                </div>
                {billingCycle === 'Annual' && plan.priceMonthly > 0 ? (
                  <p className="text-[11px] font-bold text-emerald-600 mt-1">
                    Billed ${annualTotal}/year · Save {savingsPercent}% vs monthly (${monthlyTotal}/yr)
                  </p>
                ) : (
                  <div className="h-[17px] mt-1" />
                )}
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {plan.agencyApplicationsLimit === -1 ? 'Unlimited agency applications' : plan.agencyApplicationsLimit === 0 ? 'No agency applications' : `${plan.agencyApplicationsLimit} agency applications/mo`}
                </p>
              </div>

              <div className="space-y-2.5 flex-1">
                {Object.entries(FEATURE_LABELS).map(([featureKey, label]) => {
                  const enabled = plan.features[featureKey];
                  return (
                    <div key={featureKey} className="flex items-center gap-2.5 text-xs">
                      {enabled ? <FaCheck className="text-emerald-500 shrink-0" /> : <FaTimes className="text-slate-300 shrink-0" />}
                      <span className={enabled ? 'text-slate-700 font-semibold' : 'text-slate-300 font-medium'}>
                        {label}
                        {featureKey === 'universityMatch' && plan.features.universityMatchLimit > 0 && ` (${plan.features.universityMatchLimit}/mo)`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleChoosePlan(key)}
                className={`w-full py-3 rounded-xl font-black text-sm transition-all ${isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
              >
                {key === 'Free' ? 'Get Started Free' : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
