import axios from "axios";
import { FeedbackRequest, FeedbackResponse } from "../common/models/feedback";
import { API_BASE_URL } from "../common/constant";

const createFeedback = async (
  request: FeedbackRequest,
  accessToken: string
): Promise<FeedbackResponse> => {
  const response = await axios.post<FeedbackResponse>(
    `${API_BASE_URL}/feedback`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const updateFeedback = async (
  request: FeedbackRequest,
  accessToken: string
): Promise<FeedbackResponse> => {
  const response = await axios.put<FeedbackResponse>(
    `${API_BASE_URL}/feedback`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const viewFeedbackDetail = async (
  feedbackId: number,
  accessToken: string
): Promise<FeedbackResponse> => {
  const response = await axios.get<FeedbackResponse>(
    `${API_BASE_URL}/feedback/${feedbackId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  createFeedback,
  viewFeedbackDetail,
  updateFeedback,
};
