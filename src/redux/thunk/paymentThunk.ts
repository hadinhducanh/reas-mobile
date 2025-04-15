import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CheckoutResponseData,
  CreatePaymentLinkRequest,
} from "../../common/models/payment";
import { createPaymentLink } from "../../services/PaymentService";
import { RootState } from "../store";

export const createPaymentLinkThunk = createAsyncThunk<
  CheckoutResponseData,
  CreatePaymentLinkRequest,
  { state: RootState }
>("payment/createPaymentLink", async (paymentLinkRequest, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    return await createPaymentLink(paymentLinkRequest, accessToken);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Create payment link failed"
    );
  }
});
