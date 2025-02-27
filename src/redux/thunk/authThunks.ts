import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  JWTAuthResponse,
  LoginDto,
  SignupDto,
  UserResponse,
} from "../../common/models/auth";
import ApiService from "../../services/AuthService";
import { RootState } from "../store";
import AuthService from "../../services/AuthService";

export const authenticateUserThunk = createAsyncThunk<
  JWTAuthResponse,
  LoginDto
>(
  "auth/authenticateUser",

  async (credentials, thunkAPI) => {
    try {
      const data = await ApiService.authenticateUser(credentials);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "Sign in failed");
    }
  }
);

export const signupUserThunk = createAsyncThunk<JWTAuthResponse, SignupDto>(
  "auth/signupUser",

  async (credentials, thunkAPI) => {
    try {
      const data = await ApiService.signupUser(credentials);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "Sign up failed");
    }
  }
);

export const sendOtpThunk = createAsyncThunk<string, SignupDto>(
  "auth/sendOtp",

  async (credentials, thunkAPI) => {
    try {
      const data = await ApiService.sendOtp(credentials);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "Send OTP failed");
    }
  }
);

export const fetchUserInfoThunk = createAsyncThunk<
  UserResponse,
  void,
  { state: RootState }
>("auth/fetchUserInfo", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const userInfo = await AuthService.getInfo(accessToken);
    return userInfo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Fetch user info failed"
    );
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("auth/logoutUser", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    await AuthService.logout(accessToken);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});
