import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getCurrentSubscriptionThunk,
  getSubscriptionThunk,
} from "../thunk/subscriptionThunks";
import {
  SubscriptionResponse,
  UserSubscriptionDto,
} from "../../common/models/subscription";

interface SubscriptionState {
  plans: SubscriptionResponse[];
  currentPlan: UserSubscriptionDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSubscriptionThunk.fulfilled,
        (state, action: PayloadAction<SubscriptionResponse[]>) => {
          state.loading = false;
          state.plans = action.payload;
        }
      )
      .addCase(
        getSubscriptionThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get subscription plans failed";
        }
      );

    builder
      .addCase(getCurrentSubscriptionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCurrentSubscriptionThunk.fulfilled,
        (state, action: PayloadAction<UserSubscriptionDto>) => {
          state.loading = false;
          state.currentPlan = action.payload;
        }
      )
      .addCase(
        getCurrentSubscriptionThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get current subcription failed";
        }
      );
  },
});

export default subscriptionSlice.reducer;
