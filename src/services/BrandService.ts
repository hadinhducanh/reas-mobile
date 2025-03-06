import axios from "axios";
import { Brand } from "../common/models/brand";
import { API_BASE_URL } from "../common/models/constants";

const getBrands = async (accessToken: string): Promise<Brand[]> => {
  const response = await axios.get<Brand[]>(`${API_BASE_URL}/brands`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export default {
  getBrands,
};
