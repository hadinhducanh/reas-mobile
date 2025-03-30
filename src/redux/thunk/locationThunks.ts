import { createAsyncThunk } from "@reduxjs/toolkit";
import { PlaceDetail } from "../../common/models/location";
import LocationService from "../../services/LocationService";

export const getPlaceDetailsThunk = createAsyncThunk<PlaceDetail, string>(
  "location/getPlaceDetails",
  async (place_id, thunkAPI) => {
    try {
      const placeDetail = await LocationService.getPlaceDetails(place_id);

      return placeDetail;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get detail location failed"
      );
    }
  }
);
