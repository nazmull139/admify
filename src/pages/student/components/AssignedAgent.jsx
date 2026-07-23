import React, { useEffect, useState } from 'react';
import { FaStar, FaUserTie, FaWhatsapp } from 'react-icons/fa';
import { studentService } from '../../../utils/services/studentService';
import { reviewService } from '../../../utils/services/reviewService';
import { LoadingState, ErrorState } from '../../../components/StatusState';

const AssignedAgent = () => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState('0.0');
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const loadAgent = async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const res = await studentService.getAssignedAgent();
      setAgent(res.data);
      loadReviews(res.data._id);
    } catch (err) {
      if (err.status === 404) setNotFound(true);
      else setError(err.message || 'Could not load your assigned agent.');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (agentId) => {
    try {
      const res = await reviewService.getForAgent(agentId);
      setReviews(res.data || []);
      setAvgRating(res.avgRating);
      setTotalReviews(res.totalReviews);
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    loadAgent();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setReviewMsg('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    setReviewMsg('');
    try {
      await reviewService.submit(agent._id, rating, comment);
      setReviewMsg('Review submitted — thank you!');
      setRating(0);
      setComment('');
      loadReviews(agent._id);
    } catch (err) {
      setReviewMsg(err.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading your agent..." />;
  if (error) return <ErrorState message={error} onRetry={loadAgent} />;

  if (notFound || !agent) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-2xl mb-4"><FaUserTie /></div>
        <h4 className="font-black text-slate-700 text-base">No Agent Assigned Yet</h4>
        <p className="text-xs max-w-xs mt-1 leading-relaxed">Once an agency assigns an agent to your application, their contact details will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-md">
        <h2 className="text-xl font-black text-slate-900 mb-4">Assigned Agent</h2>

        <p className="text-sm text-slate-700 mb-1.5"><strong className="text-slate-900">Name:</strong> {agent.name}</p>
        <p className="text-sm text-slate-700 mb-1.5"><strong className="text-slate-900">Email:</strong> {agent.email}</p>
        {agent.whatsappNumber && (
          <p className="text-sm text-slate-700"><strong className="text-slate-900">WhatsApp:</strong> +{agent.whatsappNumber}</p>
        )}

        {totalReviews > 0 && (
          <p className="text-sm text-slate-700 mt-2 flex items-center gap-1.5">
            <FaStar className="text-amber-400" /> <strong className="text-slate-900">{avgRating}</strong> ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
          </p>
        )}

        {agent.whatsappNumber && (
          <button
            onClick={() => window.open(`https://wa.me/${agent.whatsappNumber}`, '_blank')}
            className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaWhatsapp />
            Chat on WhatsApp
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-md space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Leave a Review</h3>

        {reviewMsg && (
          <div className={`text-xs font-bold px-3 py-2.5 rounded-xl ${reviewMsg.includes('Could not') || reviewMsg.includes('select') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {reviewMsg}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-3">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}>
                <FaStar className={`text-xl transition-colors ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>
          <textarea
            rows="3" required placeholder="Share your experience with this agent..."
            value={comment} onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {reviews.length > 0 && (
          <div className="pt-3 border-t border-slate-50 space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">{r.studentId?.name || 'Student'}</span>
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} className={s <= r.rating ? 'text-amber-400 text-[10px]' : 'text-slate-200 text-[10px]'} />)}
                  </span>
                </div>
                <p className="text-slate-500 font-medium mt-0.5">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedAgent;
