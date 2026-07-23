// Maps Application.status (backend enum) to a Tailwind badge class.
export const statusColor = (status) => {
  const map = {
    Pending: 'bg-slate-100 text-slate-600',
    Assigned: 'bg-blue-50 text-blue-600',
    'Document Review': 'bg-amber-50 text-amber-600',
    'SOP Pending': 'bg-amber-50 text-amber-600',
    'Action Required': 'bg-red-50 text-red-600',
    Processing: 'bg-blue-50 text-blue-600',
    'Offer Issued': 'bg-emerald-50 text-emerald-600',
    'Visa Processing': 'bg-violet-50 text-violet-600',
    Completed: 'bg-emerald-50 text-emerald-600',
    Rejected: 'bg-red-50 text-red-600',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};
