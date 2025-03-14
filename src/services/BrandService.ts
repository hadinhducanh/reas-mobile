import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { BrandResponse } from "../common/models/brand";

const getAllBrand = async (): Promise<BrandResponse[]> => {
  const response = await axios.get<BrandResponse[]>(`${API_BASE_URL}/brand`);
  return response.data;
};

export default {
  getAllBrand,
};
