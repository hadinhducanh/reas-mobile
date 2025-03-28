import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { SubscriptionResponse } from "../common/models/subscription";

const getSubscription = async (): Promise<SubscriptionResponse[]> => {
  const response = await axios.post<{ content: SubscriptionResponse[] }>(
    `${API_BASE_URL}/subscription-plan/search`
  );
  return response.data.content; 
};

export default {
  getSubscription,
};
