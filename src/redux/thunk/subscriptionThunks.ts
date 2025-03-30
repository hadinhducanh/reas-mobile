import { createAsyncThunk } from "@reduxjs/toolkit";
import { SubscriptionResponse } from "../../common/models/subscription";
import SubscriptionService from "../../services/SubscriptionService";


export const getSubscriptionThunk = createAsyncThunk<SubscriptionResponse[], void>(
  "subscription/getSubscriptionPlanThunk",
  async (_, thunkAPI) => {
    try {
      const data = await SubscriptionService.getSubscription();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Get subscription plans failed");
    }
  }
);
