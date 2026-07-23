import { get, put, patch } from '../api';

export const representativeService = {
  updateProfile: (payload) => put('/representative/profile', payload), // { jobTitle, phone }
  getProfile: () => get('/representative/profile'),
  updateUniversityProfile: (payload) => put('/representative/university', payload),
  getMyUniversity: () => get('/representative/university'),
  getApplications: (status) => get('/representative/applications', { status }),
  updateAdmissionStatus: (id, status) => patch(`/representative/applications/${id}/status`, { status }),
};
