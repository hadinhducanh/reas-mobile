import axios from "axios";
import {
  CheckoutResponseData,
  CreatePaymentLinkRequest,
  PaymentHistoryDto,
  SearchPaymentHistoryRequest,
} from "../common/models/payment";
import { API_BASE_URL } from "../common/constant";
import { ResponseEntityPagination } from "../common/models/pagination";

export const createPaymentLink = async (
  paymentLinkRequest: CreatePaymentLinkRequest,
  accessToken: string
): Promise<CheckoutResponseData> => {
  const response = await axios.post<CheckoutResponseData>(
    `${API_BASE_URL}/payos/create-payment-link`,
    paymentLinkRequest,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

const searchPaymentHistoryOfUserPagination = async (
  pageNo: number,
  userId: number,
  request: SearchPaymentHistoryRequest,
  accessToken: string
): Promise<ResponseEntityPagination<PaymentHistoryDto>> => {
  const response = await axios.post<
    ResponseEntityPagination<PaymentHistoryDto>
  >(
    `${API_BASE_URL}/payment-history/search/${userId}?pageNo=${pageNo}&pageSize=5&sortBy=id&sortDir=desc`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getNumberOfSuccessfulTransactionOfUser = async (
  month: number,
  year: number,
  accessToken: string
): Promise<number> => {
  const response = await axios.get<number>(
    `${API_BASE_URL}/payment-history/number-of-successful-transaction-of-user?month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  searchPaymentHistoryOfUserPagination,
  getNumberOfSuccessfulTransactionOfUser,
};
