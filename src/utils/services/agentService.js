import { get, post, put, patch } from '../api';

export const agentService = {
  updateProfile: (payload) => put('/agent/profile', payload),
  getProfile: () => get('/agent/profile'),
  getDashboardStats: () => get('/agent/dashboard-stats'),
  getAssignedStudents: () => get('/agent/assigned-students'),
  getStudentDetails: (studentId) => get(`/agent/student/${studentId}`),
  getApplicationsList: (search, status) => get('/agent/applications', { search, status }),
  acceptApplication: (id) => put(`/agent/application/${id}/accept`),
  rejectApplication: (id) => put(`/agent/application/${id}/reject`),
  modifyApplicationStatus: (id, payload) => patch(`/agent/applications/${id}`, payload), // { status, agentComments, targetUniversityId }
  getEarnings: () => get('/agent/earnings'),
  requestPayout: (amount, method) => post('/agent/payout', { amount, method }),
  getMyAgency: () => get('/agent/my-agency'),
  leaveAgency: () => put('/agent/leave-agency'),
  requestDelete: (reason) => post('/agent/delete-request', { reason }),

  approveDocument: (studentId, docId) => patch(`/agent/document/${studentId}/${docId}/approve`),
  rejectDocument: (studentId, docId) => patch(`/agent/document/${studentId}/${docId}/reject`),

  getAgencyInvites: () => get('/agent/agency-invites'),
  acceptAgencyInvite: (inviteId) => put(`/agent/accept-invite/${inviteId}`),
  rejectAgencyInvite: (inviteId) => put(`/agent/reject-invite/${inviteId}`),

  getEditRequests: () => get('/agent/edit-requests'),
  respondToEditRequest: (docId, accept) => put(`/agent/edit-requests/${docId}/respond`, { accept }),
  editDocument: (docId, content, note) => put(`/agent/edit-requests/${docId}/edit`, { content, note }),
};
