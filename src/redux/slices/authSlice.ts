import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  authenticateUserThunk,
  fetchUserInfoThunk,
  logoutUserThunk,
  sendOtpThunk,
  signupUserThunk,
} from "../thunk/authThunks";
import {
  JWTAuthResponse,
  SignupDto,
  UserResponse,
} from "../../common/models/auth";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  otp: string | null;
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  otp: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.otp = null;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authenticateUserThunk.fulfilled,
        (state, action: PayloadAction<JWTAuthResponse>) => {
          state.loading = false;
          state.accessToken = action.payload.accessToken || null;
          state.refreshToken = action.payload.refreshToken || null;
        }
      )
      .addCase(
        authenticateUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload.message || "Sign in failed";
        }
      );

    builder
      .addCase(signupUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUserThunk.fulfilled,
        (state, action: PayloadAction<JWTAuthResponse>) => {
          state.loading = false;
          state.accessToken = action.payload.accessToken || null;
          state.refreshToken = action.payload.refreshToken || null;
        }
      )
      .addCase(
        signupUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Sign up failed";
        }
      );

    builder
      .addCase(fetchUserInfoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserInfoThunk.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(
        fetchUserInfoThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Fetch user info failed";
        }
      );

    builder
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })
      .addCase(
        logoutUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Logout failed";
        }
      );

    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendOtpThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.otp = action.payload;
        }
      )
      .addCase(sendOtpThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Send OTP failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
