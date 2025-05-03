import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { ResponseEntityPagination } from "../common/models/pagination";
import { FavoriteResponse } from "../common/models/favorite";

const addToFavorite = async (
  itemId: number,
  accessToken: string
): Promise<FavoriteResponse> => {
  const response = await axios.post<FavoriteResponse>(
    `${API_BASE_URL}/favorite?itemId=${itemId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const deleteFromFavorite = async (
  itemId: number,
  accessToken: string
): Promise<Boolean> => {
  const response = await axios.delete<Boolean>(
    `${API_BASE_URL}/favorite?itemId=${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

const getAllFavoriteItems = async (
  pageNo: number,
  accessToken: string
): Promise<ResponseEntityPagination<FavoriteResponse>> => {
  const response = await axios.get<ResponseEntityPagination<FavoriteResponse>>(
    `${API_BASE_URL}/favorite`,
    {
      params: {
        pageNo,
        pageSize: 10,
        sortBy: "id",
        sortDir: "desc",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export default {
  getAllFavoriteItems,
  addToFavorite,
  deleteFromFavorite,
};
