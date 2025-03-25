import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllItemAvailableThunk,
  getItemDetailThunk,
  uploadItemThunk,
} from "../thunk/itemThunks";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { ExchangeResponse } from "../../common/models/exchange";
import { makeAnExchangeThunk } from "../thunk/exchangeThunk";

interface ExchangeState {
  exchangeRequest: ExchangeResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeState = {
  exchangeRequest: null,
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    resetExchange: (state) => {
      state.exchangeRequest = null;
    },
  },
  extraReducers: (builder) => {
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
  },
});

export default exchangeSlice.reducer;
