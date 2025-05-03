import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import {
  ItemResponse,
  SearchItemRequest,
  UpdateItemRequest,
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

const updateItem = async (
  request: UpdateItemRequest,
  accessToken: string
): Promise<ItemResponse> => {
  const response = await axios.put<ItemResponse>(
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
    `${API_BASE_URL}/item/search?pageNo=${pageNo}&pageSize=10&sortBy=${sortBy}&sortDir=${sortDir}`,
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
    `${API_BASE_URL}/item/current-user?pageNo=${pageNo}&pageSize=10&sortBy=approvedTime&sortDir=asc&statusItem=${statusItem}`,
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
    `${API_BASE_URL}/item/user?pageNo=${pageNo}&pageSize=10&sortBy=id&sortDir=asc&statusItem=${statusItem}&userId=${userId}`
  );
  return response.data;
};

const getItemDetail = async (
  id: number,
  accessToken?: string
): Promise<ItemResponse> => {
  const response = await axios.get<ItemResponse>(`${API_BASE_URL}/item/${id}`, {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : null,
    },
  });
  return response.data;
};

const changeItemStatus = async (
  itemId: number,
  statusItem: StatusItem,
  accessToken: string
): Promise<ItemResponse> => {
  const response = await axios.put<ItemResponse>(
    `${API_BASE_URL}/item/status?itemId=${itemId}&statusItem=${statusItem}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const deleteItem = async (
  id: number,
  accessToken: string
): Promise<boolean> => {
  const response = await axios.delete<boolean>(`${API_BASE_URL}/item/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const isReachMaxOfUploadItemThisMonth = async (
  accessToken: string
): Promise<boolean> => {
  const response = await axios.get<boolean>(
    `${API_BASE_URL}/item/check-upload-item-reach-limit`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const isUpdatedItemInPendingExchange = async (
  itemId: number,
  accessToken: string
): Promise<boolean> => {
  const response = await axios.get<boolean>(
    `${API_BASE_URL}/item/updated-item-in-pending-exchange?itemId=${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const findNearbyItems = async (
  pageNo: number,
  latitude: number,
  longitude: number,
  distance: number
): Promise<ResponseEntityPagination<ItemResponse>> => {
  const response = await axios.get<ResponseEntityPagination<ItemResponse>>(
    `${API_BASE_URL}/item/nearby?pageNo=${pageNo}&pageSize=10&latitude=${latitude}&longitude=${longitude}&distance=${distance}`
  );

  return response.data;
};

const extendItemForFree = async (
  itemId: number,
  accessToken: string
): Promise<boolean> => {
  const response = await axios.put<boolean>(
    `${API_BASE_URL}/item/extend-item-for-free?itemId=${itemId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  uploadItem,
  updateItem,
  getAllItemAvailable,
  getItemDetail,
  getAllItemOfCurrentUserByStatus,
  getRecommendedItems,
  getRecommendedItemsInExchange,
  getSimilarItems,
  getOtherItemsOfUser,
  getAllItemOfUserByStatus,
  findNearbyItems,
  changeItemStatus,
  extendItemForFree,
  deleteItem,
  isReachMaxOfUploadItemThisMonth,
  isUpdatedItemInPendingExchange,
};
