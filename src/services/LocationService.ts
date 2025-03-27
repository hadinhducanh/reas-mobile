import axios from "axios";
import { GOONG_API_KEY } from "../common/constant";
import { PlaceDetail, Suggestion } from "../common/models/location";

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

export default {
  getSuggestions,
  getPlaceDetails,
};
