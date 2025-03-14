import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrandResponse } from "../../common/models/brand";
import { getAllBrandThunk } from "../thunk/brandThunks";
import { CategoryResponse } from "../../common/models/category";
import { getAllByTypeItemThunk } from "../thunk/categoryThunk";

interface CategoryState {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllByTypeItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllByTypeItemThunk.fulfilled, (state, action: PayloadAction<CategoryResponse[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllByTypeItemThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "get all category by type item failed";
      });
  },
});

export default brandSlice.reducer;
