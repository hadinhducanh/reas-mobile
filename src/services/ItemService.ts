import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { ItemResponse } from "../common/models/item";
import { ResponseEntityPagination } from "../common/models/pagination";

const createItem = async (item: ItemResponse, accessToken: string): Promise<ItemResponse> => {
  const response = await axios.post<ItemResponse>(`${API_BASE_URL}/item`, item, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const getAllItemAvailable = async (pageNo: number): Promise<ResponseEntityPagination<ItemResponse>> => {
  const response = await axios.get<ResponseEntityPagination<ItemResponse>>(`${API_BASE_URL}/item/search?pageNo=${pageNo}&pageSize=4&sortBy=id&sortDir=asc`);
  return response.data;
};
const getItemDetail = async (id: number): Promise<ItemResponse> => {
  const response = await axios.get<ItemResponse>(`${API_BASE_URL}/item/${id}`);
  return response.data;
};

export default {
  createItem,
  getAllItemAvailable,
  getItemDetail
};
