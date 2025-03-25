import { number } from "zod";
import { MethodExchange } from "../../enums/MethodExchange";
import { ItemResponse } from "../item";
import { Suggestion } from "../location";
import { UserResponse } from "../auth";
import { StatusExchangeRequest } from "../../enums/StatusExchangeRequest";
import { StatusExchangeHistory } from "../../enums/StatusExchangeHistory";

export interface ExchangeRequestRequest {
  sellerItemId: number;
  buyerItemId: number;
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
}

export interface ExchangeHistoryResponse {
  id: number;
  buyerConfirmation: boolean;
  sellerConfirmation: boolean;
  buyerImageUrl: string;
  sellerImageUrl: string;
  buyerAdditionalNotes: string;
  sellerAdditionalNotes: string;
  statusExchangeHistory: StatusExchangeHistory;
}

export interface ExchangeResponse {
  id: number;
  sellerItem: ItemResponse;
  buyerItem: ItemResponse;
  paidBy: UserResponse;
  exchangeDate: Date;
  exchangeLocation: string;
  estimatePrice: number;
  finalPrice: number;
  numberOfOffer: number;
  methodExchange: MethodExchange;
  statusExchangeRequest: StatusExchangeRequest;
  buyerConfirmation: boolean;
  sellerConfirmation: boolean;
  additionalNotes: string;
  exchangeHistory: ExchangeHistoryResponse;
}
