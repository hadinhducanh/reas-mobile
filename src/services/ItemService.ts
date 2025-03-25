import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import {
  ItemResponse,
  SearchItemRequest,
  UploadItemRequest,
} from "../common/models/item";
import { ResponseEntityPagination } from "../common/models/pagination";

const uploadItem = async (
  request: UploadItemRequest,
  accessToken: string
): Promise<ItemResponse> => {
  const response = await axios.post<ItemResponse>(
    `${API_BASE_URL}/item`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getAllItemAvailable = async (
  pageNo: number,
  request: SearchItemRequest
): Promise<ResponseEntityPagination<ItemResponse>> => {
  const response = await axios.post<ResponseEntityPagination<ItemResponse>>(
    `${API_BASE_URL}/item/search?pageNo=${pageNo}&pageSize=100&sortBy=id&sortDir=asc`,
    request
  );
  return response.data;
};
const getItemDetail = async (id: number): Promise<ItemResponse> => {
  const response = await axios.get<ItemResponse>(`${API_BASE_URL}/item/${id}`);
  return response.data;
};

export default {
  uploadItem,
  getAllItemAvailable,
  getItemDetail,
};
