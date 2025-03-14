import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllItemAvailableThunk, getItemDetailThunk, postItemThunk } from "../thunk/itemThunks";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";

interface ItemState {
  itemDetail: ItemResponse | null;
  itemAvailable: ResponseEntityPagination<ItemResponse>;
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
    content: []
  },  
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postItemThunk.fulfilled, (state, action: PayloadAction<ItemResponse>) => {
        state.loading = false;
        state.itemDetail = action.payload;
      })
      .addCase(postItemThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Post item failed";
      });

    builder
      .addCase(getAllItemAvailableThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllItemAvailableThunk.fulfilled, (state, action: PayloadAction<ResponseEntityPagination<ItemResponse>>) => {
        state.loading = false;
        if (action.payload.pageNo === 0) {
          state.itemAvailable = action.payload;
        } else {
          state.itemAvailable = {
            ...action.payload,
            content: [...state.itemAvailable.content, ...action.payload.content],
          };
        }      
      })
      .addCase(getAllItemAvailableThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Get all item available failed";
      });

    builder
      .addCase(getItemDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemDetailThunk.fulfilled, (state, action: PayloadAction<ItemResponse>) => {
        state.loading = false;
        state.itemDetail = action.payload      
      })
      .addCase(getItemDetailThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Get item detail failed";
      });
  },
});

export default itemSlice.reducer;
