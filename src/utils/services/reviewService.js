import { get, post } from '../api';

export const reviewService = {
  submit: (agentId, rating, comment) => post('/reviews/submit', { agentId, rating, comment }),
  getForAgent: (agentId) => get(`/reviews/${agentId}`),
};
