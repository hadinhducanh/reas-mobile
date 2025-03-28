import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getSubscriptionThunk } from "../thunk/subscriptionThunks";
import { SubscriptionResponse } from "../../common/models/subscription";

interface SubscriptionState {
  plans: SubscriptionResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
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
      .addCase(getSubscriptionThunk.fulfilled, (state, action: PayloadAction<SubscriptionResponse[]>) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getSubscriptionThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Get subscription plans failed";
      });
  },
});

export default subscriptionSlice.reducer;
