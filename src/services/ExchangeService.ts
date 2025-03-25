import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import {
  ExchangeRequestRequest,
  ExchangeResponse,
} from "../common/models/exchange";

const makeAnExchange = async (
  request: ExchangeRequestRequest,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.post<ExchangeResponse>(
    `${API_BASE_URL}/exchange`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  makeAnExchange,
};
