import { number } from "zod";
import { MethodExchange } from "../../enums/MethodExchange";
import { ItemResponse } from "../item";
import { Suggestion } from "../location";
import { UserResponse } from "../auth";
import { StatusExchange } from "../../enums/StatusExchange";

export interface ExchangeRequestRequest {
  sellerItemId: number;
  buyerItemId: number | null;
  paidByUserId: number;
  exchangeDate: string;
  exchangeLocation: string;
  estimatePrice: number;
  methodExchange: MethodExchange;
  additionalNotes: string;
}

export interface ExtendExchangeRequestRequest extends ExchangeRequestRequest {
  methodExchangeName: string;
  locationGoong: Suggestion;
  selectedItem: ItemResponse | null;
  exchangeDateExtend: Date;
  paidBy: UserResponse | null;
}

export interface ExchangeHistoryResponse {
  id: number;
  buyerConfirmation: boolean;
  sellerConfirmation: boolean;
  buyerImageUrl: string;
  sellerImageUrl: string;
  buyerAdditionalNotes: string;
  sellerAdditionalNotes: string;
  statusExchangeHistory: StatusExchange;
}

export interface ExchangeResponse {
  id: number;
  sellerItem: ItemResponse;
  buyerItem: ItemResponse;
  paidBy: UserResponse;
  exchangeDate: string;
  exchangeLocation: string;
  estimatePrice: number;
  finalPrice: number;
  numberOfOffer: number;
  methodExchange: MethodExchange;
  statusExchangeRequest: StatusExchange;
  buyerConfirmation: boolean;
  sellerConfirmation: boolean;
  additionalNotes: string;
  creationDate: string;
  exchangeHistory: ExchangeHistoryResponse;
  feedbackId: number | null;
}

export interface EvidenceExchangeRequest {
  exchangeHistoryId: number;
  imageUrl: string;
  additionalNotes: string;
}
