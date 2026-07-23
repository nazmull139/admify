import { get, put, del } from '../api';

export const notificationService = {
  getAll: () => get('/notifications'),
  markAllRead: () => put('/notifications/mark-read'),
  markOneRead: (id) => put(`/notifications/${id}/read`),
  remove: (id) => del(`/notifications/${id}`),
};
