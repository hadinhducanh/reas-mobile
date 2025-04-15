import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserLocationDto, UserResponse } from "../../common/models/auth";
import UserService from "../../services/UserService";
import {
  UpdateResidentRequest,
  UserLocationRequest,
} from "../../common/models/user";
import { RootState } from "../store";

export const getUserThunk = createAsyncThunk<UserResponse, number>(
  "user/getUser",
  async (userId, thunkAPI) => {
    try {
      const data = await UserService.getUser(userId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Get user by id failed"
      );
    }
  }
);

export const updateResidentInfoThunk = createAsyncThunk<
  UserResponse,
  UpdateResidentRequest,
  { state: RootState }
>("user/updateResidentInfo", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const userInfo = await UserService.updateResidentInfo(request, accessToken);
    return userInfo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Update resident info failed"
    );
  }
});

export const createNewUserLocationThunk = createAsyncThunk<
  UserLocationDto,
  UserLocationRequest,
  { state: RootState }
>("user/createNewUserLocation", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const userInfo = await UserService.createNewUserLocation(
      request,
      accessToken
    );
    return userInfo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Create new user location failed"
    );
  }
});

export const deleteUserLocationOfCurrentUserThunk = createAsyncThunk<
  boolean,
  number,
  { state: RootState }
>("user/deleteUserLocationOfCurrentUser", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const userInfo = await UserService.deleteUserLocationOfCurrentUser(
      id,
      accessToken
    );
    return userInfo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Delete user location of current user failed"
    );
  }
});
