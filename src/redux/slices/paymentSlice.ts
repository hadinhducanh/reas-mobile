import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createPaymentLinkThunk,
  searchPaymentHistoryOfUserPaginationThunk,
} from "../thunk/paymentThunk";
import {
  CheckoutResponseData,
  PaymentHistoryDto,
} from "../../common/models/payment";
import { ResponseEntityPagination } from "../../common/models/pagination";

export interface PaymentState {
  searchPaymentHistory: ResponseEntityPagination<PaymentHistoryDto>;
  checkoutUrl: string | null;
  loadingPayment: boolean;
  errorPayment: string | null;
}

const initialState: PaymentState = {
  searchPaymentHistory: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
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
    searchPaymentHistoryOfUserPagination(builder);
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

function searchPaymentHistoryOfUserPagination(
  builder: ActionReducerMapBuilder<PaymentState>
) {
  builder
    .addCase(searchPaymentHistoryOfUserPaginationThunk.pending, (state) => {
      state.loadingPayment = true;
      state.errorPayment = null;
    })
    .addCase(
      searchPaymentHistoryOfUserPaginationThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<PaymentHistoryDto>>
      ) => {
        state.loadingPayment = false;
        if (action.payload.pageNo === 0) {
          state.searchPaymentHistory = action.payload;
        } else {
          state.searchPaymentHistory = {
            ...action.payload,
            content: [
              ...state.searchPaymentHistory.content,
              ...action.payload.content,
            ],
          };
        }
      }
    )
    .addCase(
      searchPaymentHistoryOfUserPaginationThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingPayment = false;
        state.errorPayment =
          action.payload || "Search payment history of user failed";
      }
    );
}

export const { resetCheckoutUrl } = paymentSlice.actions;
export default paymentSlice.reducer;
