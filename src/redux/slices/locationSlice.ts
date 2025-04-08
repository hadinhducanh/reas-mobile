import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationDto, PlaceDetail } from "../../common/models/location";
import {
  getAllLocationThunk,
  getPlaceDetailsByReverseGeocodeThunk,
  getPlaceDetailsThunk,
} from "../thunk/locationThunks";
import { ResponseEntityPagination } from "../../common/models/pagination";

interface ItemState {
  selectedPlaceDetail: PlaceDetail | null;
  locations: ResponseEntityPagination<LocationDto>;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  selectedPlaceDetail: null,
  locations: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
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

    builder
      .addCase(getAllLocationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllLocationThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<LocationDto>>
        ) => {
          state.loading = false;
          state.locations = action.payload;
        }
      )
      .addCase(
        getAllLocationThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get all locations failed";
        }
      );
  },
});

export const { resetPlaceDetail } = itemSlice.actions;
export default itemSlice.reducer;
