import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postItemThunk } from "../thunk/itemThunks";
import { Item } from "../../common/models/item-upload";

interface ItemState {
  item: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  item: null,
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
      .addCase(postItemThunk.fulfilled, (state, action: PayloadAction<Item>) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(postItemThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Post item failed";
      });
  },
});

export default itemSlice.reducer;
