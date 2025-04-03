import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  authenticateGoogleUserkThunk,
  authenticateUserThunk,
  changePasswordThunk,
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
  changePasswordSuccess: boolean | null;
  loading: boolean;
  loadingGoogle: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  otp: null,
  user: null,
  loading: false,
  loadingGoogle: false,
  error: null,
  changePasswordSuccess: null,
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
      state.changePasswordSuccess = null;
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
      .addCase(authenticateGoogleUserkThunk.pending, (state) => {
        state.loadingGoogle = true;
        state.error = null;
      })
      .addCase(
        authenticateGoogleUserkThunk.fulfilled,
        (state, action: PayloadAction<JWTAuthResponse>) => {
          state.loadingGoogle = false;
          state.accessToken = action.payload.accessToken || null;
          state.refreshToken = action.payload.refreshToken || null;
        }
      )
      .addCase(
        authenticateGoogleUserkThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loadingGoogle = false;
          state.error =
            action.payload.message || "Authenticate by google failed";
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

    builder
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.changePasswordSuccess = null;
      })
      .addCase(
        changePasswordThunk.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
          state.changePasswordSuccess = action.payload;
        }
      )
      .addCase(
        changePasswordThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Change password failed";
          state.changePasswordSuccess = false;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
