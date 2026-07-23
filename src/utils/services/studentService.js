import { get, post, put, patch, del } from '../api';

export const studentService = {
  updateProfile: (payload) => put('/student/profile', payload),
  getProfile: () => get('/student/profile'),
  getProfileStrength: () => get('/student/profile-strength'),
  getDashboardStats: () => get('/student/dashboard-stats'),
  getApplications: () => get('/student/applications'),
  getAssignedAgent: () => get('/student/assigned-agent'),
  listAgencies: () => get('/student/agencies'),
  requestDelete: (reason) => post('/student/delete-request', { reason }),

  uploadDocument: (file, docType) => {
    const formData = new FormData();
    formData.append('file', file);
    if (docType) formData.append('docType', docType);
    return post('/student/upload-document', formData, { isFormData: true });
  },
  deleteDocument: (docId) => del(`/student/document/${docId}`),

  getDeadlines: () => get('/student/deadlines'),
  addDeadline: (payload) => post('/student/deadlines', payload),
  updateDeadline: (id, payload) => put(`/student/deadlines/${id}`, payload),
  deleteDeadline: (id) => del(`/student/deadlines/${id}`),

  getCostEstimate: (country, budget) => get('/student/cost-estimate', { country, budget }),

  getAIDocumentById: (id) => get(`/student/ai-documents/${id}`),
  requestDocumentEdit: (id, payload) => post(`/student/ai-documents/${id}/request-edit`, payload), // { agentId, note }
  cancelDocumentEditRequest: (id) => put(`/student/ai-documents/${id}/cancel-edit-request`),
};
