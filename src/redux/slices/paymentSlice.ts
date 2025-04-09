import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createPaymentLinkThunk } from "../thunk/paymentThunk";
import { CheckoutResponseData } from "../../common/models/payment";

export interface PaymentState {
  checkoutUrl: string | null;
  loadingPayment: boolean;
  errorPayment: string | null;
}

const initialState: PaymentState = {
  checkoutUrl: null,
  loadingPayment: false,
  errorPayment: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetCheckoutUrl: (state) => {
      state.checkoutUrl = null;
    },
  },
  extraReducers: (builder) => {
    setCheckoutUrl(builder);
  },
});

function setCheckoutUrl(builder: ActionReducerMapBuilder<PaymentState>) {
  builder
    .addCase(createPaymentLinkThunk.pending, (state) => {
      state.loadingPayment = true;
      state.errorPayment = null;
    })
    .addCase(
      createPaymentLinkThunk.fulfilled,
      (state, action: PayloadAction<CheckoutResponseData>) => {
        state.loadingPayment = false;
        state.checkoutUrl = action.payload.checkoutUrl;
      }
    )
    .addCase(
      createPaymentLinkThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingPayment = false;
        state.errorPayment = action.payload || "Failed to create payment link";
      }
    );
}

export const { resetCheckoutUrl } = paymentSlice.actions;
export default paymentSlice.reducer;
