import { createAsyncThunk } from "@reduxjs/toolkit";
import { LocationDto, PlaceDetail } from "../../common/models/location";
import LocationService from "../../services/LocationService";
import { ResponseEntityPagination } from "../../common/models/pagination";

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

export const getPlaceDetailsByReverseGeocodeThunk = createAsyncThunk<
  PlaceDetail,
  string
>("location/getPlaceDetailsByReverseGeocode", async (geocode, thunkAPI) => {
  try {
    const placeDetail = await LocationService.getPlaceDetailsByReverseGeocode(
      geocode
    );

    return placeDetail;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get detail location failed"
    );
  }
});

export const getAllLocationThunk = createAsyncThunk<
  ResponseEntityPagination<LocationDto>,
  number
>("location/getAllLocation", async (pageNo, thunkAPI) => {
  try {
    const data = await LocationService.getAllLocation(pageNo);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get all locations failed"
    );
  }
});
