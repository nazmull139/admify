import { get, post, put, patch, del } from '../api';

export const agencyService = {
  updateProfile: (payload) => put('/agency/profile', payload),
  getProfile: () => get('/agency/profile'),
  getDashboardStats: () => get('/agency/dashboard-stats'),

  inviteAgent: (agentEmail) => post('/agency/invite-agent', { agentEmail }),
  getAgents: () => get('/agency/agents'),
  onboardAgent: (payload) => post('/agency/onboard-agent', payload), // { name, email, password, specialization, whatsappNumber }
  toggleAgentStatus: (agentId) => patch(`/agency/agents/${agentId}/toggle`),
  removeAgent: (agentId) => del(`/agency/agents/${agentId}`),

  getApplications: (search, status) => get('/agency/applications', { search, status }),
  assignAgentToApplication: (applicationId, agentId) => patch('/agency/assign-agent', { applicationId, agentId }),

  getPerformance: () => get('/agency/performance'),
  getRevenue: () => get('/agency/revenue'),
  sendAgentCommission: (agentId, creditAmount) => post('/agency/pay-commission', { agentId, creditAmount }),
  requestDelete: (reason) => post('/agency/delete-request', { reason }),
};
