import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import {
  SubscriptionResponse,
  UserSubscriptionDto,
} from "../common/models/subscription";

const getSubscription = async (): Promise<SubscriptionResponse[]> => {
  const response = await axios.post<{ content: SubscriptionResponse[] }>(
    `${API_BASE_URL}/subscription-plan/search`
  );
  return response.data.content;
};

const getCurrentSubscription = async (
  accessToken: string
): Promise<UserSubscriptionDto> => {
  const response = await axios.get<UserSubscriptionDto>(
    `${API_BASE_URL}/user-subscription/current-subscription`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  getSubscription,
  getCurrentSubscription,
};
