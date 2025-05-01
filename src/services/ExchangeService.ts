import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import {
  EvidenceExchangeRequest,
  ExchangeRequestRequest,
  ExchangeResponse,
} from "../common/models/exchange";
import { ResponseEntityPagination } from "../common/models/pagination";
import { StatusExchange } from "../common/enums/StatusExchange";

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

const getAllExchangesByStatusOfCurrentUser = async (
  pageNo: number,
  accessToken: string,
  statusExchangeRequest: StatusExchange,
  statusExchangeHistory?: StatusExchange
): Promise<ResponseEntityPagination<ExchangeResponse>> => {
  const url = `${API_BASE_URL}/exchange/current-user`;
  const params = {
    pageNo,
    pageSize: 5,
    sortBy: "id",
    sortDir: "desc",
    statusExchangeRequest,
    ...(statusExchangeHistory ? { statusExchangeHistory } : {}),
  };

  const response = await axios.get<ResponseEntityPagination<ExchangeResponse>>(
    url,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

const getExchangeDetail = async (
  exchangeId: number,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.get<ExchangeResponse>(
    `${API_BASE_URL}/exchange/${exchangeId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const confirmNegotiatedPrice = async (
  exchangeId: number,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.put<ExchangeResponse>(
    `${API_BASE_URL}/exchange/negotiated-price/confirm?exchangeId=${exchangeId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const updateExchangeRequestPrice = async (
  exchangeId: number,
  negotiatedPrice: number,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.put<ExchangeResponse>(
    `${API_BASE_URL}/exchange/negotiated-price?exchangeId=${exchangeId}&negotiatedPrice=${negotiatedPrice}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const reviewExchangeRequest = async (
  exchangeId: number,
  statusExchangeRequest: StatusExchange,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.put<ExchangeResponse>(
    `${API_BASE_URL}/exchange/review?exchangeId=${exchangeId}&statusExchangeRequest=${statusExchangeRequest}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const cancelExchange = async (
  exchangeId: number,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.put<ExchangeResponse>(
    `${API_BASE_URL}/exchange/cancel?exchangeId=${exchangeId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const uploadExchangeEvidence = async (
  request: EvidenceExchangeRequest,
  accessToken: string
): Promise<ExchangeResponse> => {
  const response = await axios.post<ExchangeResponse>(
    `${API_BASE_URL}/exchange/evidence`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getNumberOfSuccessfulExchangesOfUser = async (
  month: number,
  year: number,
  accessToken: string
): Promise<number> => {
  const response = await axios.get<number>(
    `${API_BASE_URL}/exchange/number-of-successful-exchanges-of-user?month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getRevenueOfUserInOneYearFromExchanges = async (
  year: number,
  accessToken: string
): Promise<number> => {
  const response = await axios.get<number>(
    `${API_BASE_URL}/exchange/revenue-of-user-in-one-year-from-exchanges?year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getMonthlyRevenueOfUserInOneYearFromExchanges = async (
  year: number,
  accessToken: string
): Promise<Record<number, number>> => {
  const response = await axios.get<Record<number, number>>(
    `${API_BASE_URL}/exchange/monthly-revenue-of-user-in-one-year-from-exchanges?year=${year}`,
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
  getAllExchangesByStatusOfCurrentUser,
  getExchangeDetail,
  confirmNegotiatedPrice,
  updateExchangeRequestPrice,
  reviewExchangeRequest,
  cancelExchange,
  uploadExchangeEvidence,
  getNumberOfSuccessfulExchangesOfUser,
  getRevenueOfUserInOneYearFromExchanges,
  getMonthlyRevenueOfUserInOneYearFromExchanges,
};
