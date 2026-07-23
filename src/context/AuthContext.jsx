import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../utils/services/authService';
import { loadSession, loginThunk, logout as logoutAction, verifyOTPThunk, ROLE_HOME as ROLE_HOME_MAP } from '../redux/slices/authSlice';

// Re-exported so existing imports of `{ ROLE_HOME }` from this file keep working.
export const ROLE_HOME = ROLE_HOME_MAP;

/**
 * Restores the session (if a token exists) once, at the top of the app.
 * Auth state itself now lives in Redux (see redux/slices/authSlice.js) —
 * this component just kicks off the initial session check.
 */
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return children;
};

/**
 * Same interface as before (user, loading, login, register, verifyOTP, logout,
 * refreshMe, isAuthenticated) so every component that already calls useAuth()
 * keeps working unchanged — it's just backed by the Redux store now.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const result = await dispatch(loginThunk({ email, password })).unwrap();
    return result;
  };

  const register = (payload) => authService.register(payload); // returns { userId, otp? } — OTP step handled by caller

  const verifyOTP = async (userId, otp) => {
    const result = await dispatch(verifyOTPThunk({ userId, otp })).unwrap();
    return result;
  };

  const logout = () => dispatch(logoutAction());

  const refreshMe = () => dispatch(loadSession());

  return { user, loading, login, register, verifyOTP, logout, refreshMe, isAuthenticated: !!user };
};
