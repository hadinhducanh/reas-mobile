import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrandResponse } from "../../common/models/brand";
import { getAllBrandThunk } from "../thunk/brandThunks";

interface BrandState {
  brands: BrandResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBrandThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBrandThunk.fulfilled, (state, action: PayloadAction<BrandResponse[]>) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(getAllBrandThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Get all brand failed";
      });
  },
});

export default brandSlice.reducer;
