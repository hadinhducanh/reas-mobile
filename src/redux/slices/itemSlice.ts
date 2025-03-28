import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllItemAvailableThunk,
  getAllItemOfCurrentUserByStatusThunk,
  getItemDetailThunk,
  uploadItemThunk,
} from "../thunk/itemThunks";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { getAllExchangesByStatusOfCurrentUserThunk } from "../thunk/exchangeThunk";

interface ItemState {
  itemDetail: ItemResponse | null;
  itemAvailable: ResponseEntityPagination<ItemResponse>;
  itemRecommnand: ResponseEntityPagination<ItemResponse>;
  itemSuggested: ResponseEntityPagination<ItemResponse>;
  itemUpload: ItemResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  itemDetail: null,
  itemAvailable: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemRecommnand: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemSuggested: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemUpload: null,
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    resetItemUpload: (state) => {
      state.itemUpload = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadItemThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse>) => {
          state.loading = false;
          state.itemUpload = action.payload;
        }
      )
      .addCase(
        uploadItemThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Upload item failed";
        }
      );

    builder
      .addCase(getAllItemAvailableThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllItemAvailableThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.itemAvailable = action.payload;
            state.itemRecommnand = action.payload;
          } else {
            state.itemAvailable = {
              ...action.payload,
              content: [
                ...state.itemAvailable.content,
                ...action.payload.content,
              ],
            };
          }
        }
      )
      .addCase(
        getAllItemAvailableThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get all item available failed";
        }
      );

    builder
      .addCase(getItemDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getItemDetailThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse>) => {
          state.loading = false;
          state.itemDetail = action.payload;
        }
      )
      .addCase(
        getItemDetailThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get item detail failed";
        }
      );

    builder
      .addCase(getAllItemOfCurrentUserByStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllItemOfCurrentUserByStatusThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          state.itemSuggested = action.payload;
        }
      )
      .addCase(
        getAllItemOfCurrentUserByStatusThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get all item of current user by status failed";
        }
      );
  },
});

export const { resetItemUpload } = itemSlice.actions;
export default itemSlice.reducer;
