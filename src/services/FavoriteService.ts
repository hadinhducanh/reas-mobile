import axios from "axios";
import { FeedbackRequest, FeedbackResponse } from "../common/models/feedback";
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
  id: number,
  accessToken: string
): Promise<Boolean> => {
  const response = await axios.delete<Boolean>(
    `${API_BASE_URL}/favorite?id=${id}`,
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
): Promise<ResponseEntityPagination<FeedbackResponse>> => {
  const response = await axios.get<ResponseEntityPagination<FeedbackResponse>>(
    `${API_BASE_URL}/favorite`,
    {
      params: {
        pageNo,
        pageSize: 5,
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
