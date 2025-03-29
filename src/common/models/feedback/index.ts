import { UserResponse } from "../auth";
import { ExchangeHistoryResponse } from "../exchange";
import { ItemResponse } from "../item";

export interface FeedbackRequest {
  id?: number;
  itemId: number;
  exchangeHistoryId: number;
  rating: number;
  comment: string;
  imageUrl: string;
}

export interface FeedbackResponse {
  id: number;
  user: UserResponse;
  exchangeHistory: ExchangeHistoryResponse;
  item: ItemResponse;
  rating: number;
  comment: string;
  imageUrl: string;
  updated: boolean;
}
