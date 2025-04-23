import { MethodPayment } from "../../enums/MethodPayment";
import { StatusEntity } from "../../enums/StatusEntity";
import { StatusPayment } from "../../enums/StatusPayment";
import { TypeSubscriptionPlan } from "../../enums/TypeSubscriptionPlan";

export interface CreatePaymentLinkRequest {
  description: string;
  subscriptionPlanId?: number;
  itemId?: number;
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

export interface PaymentHistoryDto {
  id: number;
  transactionId: number;
  amount: number;
  description: string;
  transactionDateTime: Date;
  statusPayment: StatusPayment;
  methodPayment: MethodPayment;
  startDate: string;
  endDate: string;
  planName: string;
  typeSubscriptionPlan: TypeSubscriptionPlan;
  duration: number;
}

export interface SearchPaymentHistoryRequest {
  userId?: number;
  transactionId?: number;
  price?: number;
  fromPrice?: number;
  toPrice?: number;
  statusPayments?: StatusPayment[];
  methodPayments?: MethodPayment[];
  statusEntities?: StatusEntity[];
  fromTransactionDate?: Date;
  toTransactionDate?: Date;
}
