import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExchangeResponse } from "../../common/models/exchange";
import {
  cancelExchangeThunk,
  confirmNegotiatedPriceThunk,
  getAllExchangesByStatusOfCurrentUserThunk,
  getExchangeCountsThunk,
  getExchangeDetailThunk,
  makeAnExchangeThunk,
  reviewExchangeRequestThunk,
  updateExchangeRequestPriceThunk,
  uploadExchangeEvidenceThunk,
} from "../thunk/exchangeThunk";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { StatusExchange } from "../../common/enums/StatusExchange";

interface ExchangeState {
  exchangeRequest: ExchangeResponse | null;
  exchangeByStatus: ResponseEntityPagination<ExchangeResponse>;
  exchangeDetail: ExchangeResponse | null;
  counts: { [key in StatusExchange]?: number }; // thêm counts
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeState = {
  exchangeRequest: null,
  exchangeDetail: null,
  exchangeByStatus: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  counts: {},
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    resetExchange: (state) => {
      state.exchangeRequest = null;
      state.exchangeDetail = null;
      state.exchangeByStatus = {
        pageNo: 0,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0,
        last: false,
        content: [],
      };
      state.counts = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExchangeCountsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getExchangeCountsThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ [key in StatusExchange]?: number }>
        ) => {
          state.loading = false;
          state.counts = action.payload;
        }
      )
      .addCase(
        getExchangeCountsThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get exchange counts failed";
        }
      );

    builder
      .addCase(makeAnExchangeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        makeAnExchangeThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeRequest = action.payload;
        }
      )
      .addCase(
        makeAnExchangeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Make an exchange failed";
        }
      );

    builder
      .addCase(getAllExchangesByStatusOfCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllExchangesByStatusOfCurrentUserThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ExchangeResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.exchangeByStatus = action.payload;
          } else {
            state.exchangeByStatus = {
              ...action.payload,
              content: [
                ...state.exchangeByStatus.content,
                ...action.payload.content,
              ],
            };
          }
        }
      )
      .addCase(
        getAllExchangesByStatusOfCurrentUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get all exchange of current user failed";
        }
      );

    builder
      .addCase(getExchangeDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getExchangeDetailThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeDetail = action.payload;
        }
      )
      .addCase(
        getExchangeDetailThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get exchange detail failed";
        }
      );

    builder
      .addCase(confirmNegotiatedPriceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        confirmNegotiatedPriceThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeDetail = action.payload;
        }
      )
      .addCase(
        confirmNegotiatedPriceThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Comfirm price failed";
        }
      );

    builder
      .addCase(updateExchangeRequestPriceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateExchangeRequestPriceThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeDetail = action.payload;
        }
      )
      .addCase(
        updateExchangeRequestPriceThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Update negotiate price failed";
        }
      );

    builder
      .addCase(reviewExchangeRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        reviewExchangeRequestThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeDetail = action.payload;
        }
      )
      .addCase(
        reviewExchangeRequestThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Review exchange failed";
        }
      );

    builder
      .addCase(cancelExchangeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        cancelExchangeThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeDetail = action.payload;
        }
      )
      .addCase(
        cancelExchangeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Cancel exchange failed";
        }
      );

    builder
      .addCase(uploadExchangeEvidenceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadExchangeEvidenceThunk.fulfilled,
        (state, action: PayloadAction<ExchangeResponse>) => {
          state.loading = false;
          state.exchangeDetail = action.payload;
        }
      )
      .addCase(
        uploadExchangeEvidenceThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Upload evidence for exchange failed";
        }
      );
  },
});

export const { resetExchange } = exchangeSlice.actions;
export default exchangeSlice.reducer;
