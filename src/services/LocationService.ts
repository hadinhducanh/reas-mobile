import axios from "axios";
import { API_BASE_URL, GOONG_API_KEY } from "../common/constant";
import {
  LocationDto,
  PlaceDetail,
  Suggestion,
} from "../common/models/location";
import { ResponseEntityPagination } from "../common/models/pagination";

const getSuggestions = async (
  input: string,
  latitude: number,
  longitude: number
): Promise<Suggestion[]> => {
  if (input.length <= 2) return [];

  const response = await axios.get(
    `https://rsapi.goong.io/place/autocomplete?input=${encodeURIComponent(
      input
    )}&location=${latitude},${longitude}&limit=10&radius=1000&api_key=${GOONG_API_KEY}`,
    { timeout: 3000 }
  );

  return response.data.predictions || [];
};

const getPlaceDetails = async (place_id: string): Promise<PlaceDetail> => {
  const response = await axios.get(
    `https://rsapi.goong.io/place/detail?place_id=${place_id}&api_key=${GOONG_API_KEY}`,
    { timeout: 3000 }
  );

  return response.data.result;
};

const getPlaceDetailsByReverseGeocode = async (
  geocode: string
): Promise<PlaceDetail> => {
  const response = await axios.get(
    `https://rsapi.goong.io/geocode?latlng=${geocode}&api_key=${GOONG_API_KEY}`,
    { timeout: 3000 }
  );

  return response.data.results[0];
};

const getAllLocation = async (
  pageNo: number
): Promise<ResponseEntityPagination<LocationDto>> => {
  const response = await axios.get<ResponseEntityPagination<LocationDto>>(
    `${API_BASE_URL}/location?pageNo=${pageNo}&pageSize=10&sortBy=id&sortDir=desc`
  );
  return response.data;
};

export default {
  getSuggestions,
  getPlaceDetails,
  getPlaceDetailsByReverseGeocode,
  getAllLocation,
};
