import { get, post, put, patch, del } from '../api';

export const adminService = {
  getDashboardMetrics: () => get('/admin/analytics'),
  getAdvancedAnalytics: () => get('/admin/analytics/advanced'),

  getAllUsers: (search, role) => get('/admin/users', { search, role }),
  toggleUserStatus: (id) => patch(`/admin/users/${id}/toggle-status`),
  changeUserRole: (id, role) => patch(`/admin/users/${id}/role`, { role }),

  verifyAgent: (id) => patch(`/admin/verify-agent/${id}`),
  verifyAgency: (id) => patch(`/admin/verify-agency/${id}`),
  verifyRepresentative: (id) => patch(`/admin/verify-representative/${id}`),

  getDeleteRequests: () => get('/admin/delete-requests'),
  approveDelete: (id) => del(`/admin/delete-requests/${id}/approve`),
  rejectDelete: (id) => patch(`/admin/delete-requests/${id}/reject`),

  getPaymentLedger: () => get('/admin/payment-ledger'),
  getAIUsage: () => get('/admin/ai-usage'),
  broadcastNotification: (message, type, role) => post('/admin/broadcast', { message, type, role }),
  getPendingPayouts: () => get('/admin/payout-requests'),
  approvePayout: (id) => patch(`/admin/payout-requests/${id}/approve`),
  rejectPayout: (id) => patch(`/admin/payout-requests/${id}/reject`),

  createUniversity: (payload) => post('/admin/universities', payload),
  updateUniversity: (id, payload) => put(`/admin/universities/${id}`, payload),
  deleteUniversity: (id) => del(`/admin/universities/${id}`),
  verifyUniversity: (id) => patch(`/admin/universities/${id}/verify`),
};
