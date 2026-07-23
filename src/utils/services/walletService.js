import { get, post } from '../api';

export const walletService = {
  getBalance: () => get('/wallet/balance'),
  getTransactions: () => get('/wallet/transactions'),
  createCheckout: (credits, amount, packName) => post('/wallet/create-checkout', { credits, amount, packName }),
  verifyPayment: (sessionId) => post('/wallet/verify-payment', { sessionId }),
  applyToAgency: (agencyId) => post('/wallet/apply-agency', { agencyId }),
};
