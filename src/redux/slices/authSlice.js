import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getToken, setToken } from '../../utils/api';
import { authService } from '../../utils/services/authService';

// Maps backend role names to the dashboard route each role should land on after login.
export const ROLE_HOME = {
  Student: '/studentdashboard',
  Agent: '/agentdashboard',
  Agency: '/agencydashboard',
  Admin: '/admindashboard',
  Representative: '/representativedashboard',
};

// ============================================
// THUNKS
// ============================================

// Called once on app load to restore a session from the stored JWT (if any).
export const loadSession = createAsyncThunk('auth/loadSession', async (_, { rejectWithValue }) => {
  if (!getToken()) return null;
  try {
    const res = await authService.getMe();
    return res.data;
  } catch (err) {
    setToken(null);
    return rejectWithValue(err.message);
  }
});

export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await authService.login({ email, password });
    setToken(res.token);
    return res.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const verifyOTPThunk = createAsyncThunk('auth/verifyOTP', async ({ userId, otp }, { rejectWithValue }) => {
  try {
    const res = await authService.verifyOTP({ userId, otp });
    setToken(res.token);
    return res.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true, // true while we check for an existing session on app load
  },
  reducers: {
    logout(state) {
      setToken(null);
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSession.pending, (state) => { state.loading = true; })
      .addCase(loadSession.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(loadSession.rejected, (state) => { state.user = null; state.loading = false; })
      .addCase(loginThunk.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(verifyOTPThunk.fulfilled, (state, action) => { state.user = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
