import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  SubscriptionResponse,
  UserSubscriptionDto,
} from "../../common/models/subscription";
import SubscriptionService from "../../services/SubscriptionService";
import { RootState } from "../store";

export const getSubscriptionThunk = createAsyncThunk<
  SubscriptionResponse[],
  void
>("subscription/getSubscriptionPlanThunk", async (_, thunkAPI) => {
  try {
    const data = await SubscriptionService.getSubscription();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get subscription plans failed"
    );
  }
});

export const getCurrentSubscriptionThunk = createAsyncThunk<
  UserSubscriptionDto,
  void,
  { state: RootState }
>("subscription/getCurrentSubscription", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await SubscriptionService.getCurrentSubscription(accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get current subcription failed"
    );
  }
});
