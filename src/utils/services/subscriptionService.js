import { get, post } from '../api';

export const subscriptionService = {
  getPlans: () => get('/subscriptions/plans'), // public
  getMySubscription: () => get('/subscriptions/me'),
  createCheckout: (planName, billingCycle) => post('/subscriptions/checkout', { planName, billingCycle }),
  verify: (sessionId) => post('/subscriptions/verify', { sessionId }),
  cancel: () => post('/subscriptions/cancel'),
};
