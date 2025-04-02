import axios from "axios";
import { CheckoutResponseData, CreatePaymentLinkRequest } from "../common/models/payment";
import { API_BASE_URL } from "../common/constant";

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
}