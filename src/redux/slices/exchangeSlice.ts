import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllItemAvailableThunk, getItemDetailThunk, uploadItemThunk } from "../thunk/itemThunks";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";

interface ExchangeState {
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeState = {
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    // resetItemDetail: (state) => {
    //   state.itemDetail = null;
    // },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(uploadItemThunk.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(uploadItemThunk.fulfilled, (state, action: PayloadAction<ItemResponse>) => {
    //     state.loading = false;
    //     state.itemUpload = action.payload;
    //   })
    //   .addCase(uploadItemThunk.rejected, (state, action: PayloadAction<any>) => {
    //     state.loading = false;
    //     state.error = action.payload || "Upload item failed";
    //   });
  },
});

export default exchangeSlice.reducer;
