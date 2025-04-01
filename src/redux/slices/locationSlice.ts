import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlaceDetail } from "../../common/models/location";
import {
  getPlaceDetailsByReverseGeocodeThunk,
  getPlaceDetailsThunk,
} from "../thunk/locationThunks";

interface ItemState {
  selectedPlaceDetail: PlaceDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  selectedPlaceDetail: null,
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    resetPlaceDetail: (state) => {
      state.selectedPlaceDetail = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlaceDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPlaceDetailsThunk.fulfilled,
        (state, action: PayloadAction<PlaceDetail>) => {
          state.loading = false;
          state.selectedPlaceDetail = action.payload;
        }
      )
      .addCase(
        getPlaceDetailsThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get detail location failed";
        }
      );

    builder
      .addCase(getPlaceDetailsByReverseGeocodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPlaceDetailsByReverseGeocodeThunk.fulfilled,
        (state, action: PayloadAction<PlaceDetail>) => {
          state.loading = false;
          state.selectedPlaceDetail = action.payload;
        }
      )
      .addCase(
        getPlaceDetailsByReverseGeocodeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get detail location failed";
        }
      );
  },
});

export const { resetPlaceDetail } = itemSlice.actions;
export default itemSlice.reducer;
