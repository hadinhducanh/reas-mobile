import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBrandsThunk } from "../thunk/brandThunks";
import { Brand } from "../../common/models/brand";

interface BrandState {
  brands: Brand[];
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
      .addCase(getBrandsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrandsThunk.fulfilled, (state, action: PayloadAction<Brand[]>) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(getBrandsThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Get brands failed";
      });
  },
});

export default brandSlice.reducer;
