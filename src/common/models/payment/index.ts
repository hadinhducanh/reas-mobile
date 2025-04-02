export interface CreatePaymentLinkRequest {
  description: string;
  subscriptionPlanId: number;
  returnUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponseData {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  expiredAt?: number;
  checkoutUrl: string;
  qrCode: string;
}
