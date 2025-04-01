import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import {
  ItemResponse,
  SearchItemRequest,
  UploadItemRequest,
} from "../common/models/item";
import { ResponseEntityPagination } from "../common/models/pagination";
import { StatusItem } from "../common/enums/StatusItem";

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

const getRecommendedItems = async (
  id: number,
  accessToken: string,
  limit?: number
): Promise<ItemResponse[]> => {
  const response = await axios.get<ItemResponse[]>(
    `${API_BASE_URL}/item/recommend?id=${id}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getRecommendedItemsInExchange = async (
  sellerItemId: number,
  accessToken: string,
  limit?: number
): Promise<ItemResponse[]> => {
  const response = await axios.get<ItemResponse[]>(
    `${API_BASE_URL}/item/exchange/recommend?sellerItemId=${sellerItemId}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getSimilarItems = async (
  itemId: number,
  limit?: number
): Promise<ItemResponse[]> => {
  const response = await axios.get<ItemResponse[]>(
    `${API_BASE_URL}/item/similar?itemId=${itemId}&limit=${limit}`
  );
  return response.data;
};

const getOtherItemsOfUser = async (
  currItemId: number,
  userId: number,
  limit?: number
): Promise<ItemResponse[]> => {
  const response = await axios.get<ItemResponse[]>(
    `${API_BASE_URL}/item/others?currItemId=${currItemId}&userId=${userId}&limit=${limit}`
  );
  return response.data;
};

const getAllItemAvailable = async (
  pageNo: number,
  request: SearchItemRequest,
  sortBy?: string,
  sortDir?: string
): Promise<ResponseEntityPagination<ItemResponse>> => {
  const response = await axios.post<ResponseEntityPagination<ItemResponse>>(
    `${API_BASE_URL}/item/search?pageNo=${pageNo}&pageSize=5&sortBy=${sortBy}&sortDir=${sortDir}`,
    request
  );
  return response.data;
};

const getAllItemOfCurrentUserByStatus = async (
  pageNo: number,
  statusItem: StatusItem,
  accessToken: string
): Promise<ResponseEntityPagination<ItemResponse>> => {
  const response = await axios.get<ResponseEntityPagination<ItemResponse>>(
    `${API_BASE_URL}/item/current-user?pageNo=${pageNo}&pageSize=5&sortBy=approvedTime&sortDir=asc&statusItem=${statusItem}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getAllItemOfUserByStatus = async (
  pageNo: number,
  userId: number,
  statusItem: StatusItem
): Promise<ResponseEntityPagination<ItemResponse>> => {
  const response = await axios.get<ResponseEntityPagination<ItemResponse>>(
    `${API_BASE_URL}/item/user?pageNo=${pageNo}&pageSize=5&sortBy=id&sortDir=asc&statusItem=${statusItem}&userId=${userId}`
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
  getAllItemOfCurrentUserByStatus,
  getRecommendedItems,
  getRecommendedItemsInExchange,
  getSimilarItems,
  getOtherItemsOfUser,
  getAllItemOfUserByStatus,
};
