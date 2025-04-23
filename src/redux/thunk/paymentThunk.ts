import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CheckoutResponseData,
  CreatePaymentLinkRequest,
  PaymentHistoryDto,
  SearchPaymentHistoryRequest,
} from "../../common/models/payment";
import PaymentService, {
  createPaymentLink,
} from "../../services/PaymentService";
import { RootState } from "../store";
import { ResponseEntityPagination } from "../../common/models/pagination";

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

export const searchPaymentHistoryOfUserPaginationThunk = createAsyncThunk<
  ResponseEntityPagination<PaymentHistoryDto>,
  { pageNo: number; userId: number; request: SearchPaymentHistoryRequest },
  { state: RootState }
>(
  "payment/searchPaymentHistoryOfUserPagination",
  async ({ pageNo, userId, request }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await PaymentService.searchPaymentHistoryOfUserPagination(
        pageNo,
        userId,
        request,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Search payment history of user failed"
      );
    }
  }
);
