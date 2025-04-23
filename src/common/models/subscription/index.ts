import { TypeSubscriptionPlan } from "../../enums/TypeSubscriptionPlan";

export interface SubscriptionResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  typeSubscriptionPlan: TypeSubscriptionPlan;
  duration: number;
}

export interface UserSubscriptionDto {
  startDate: string;
  endDate: string;
  subscriptionPlan: SubscriptionPlanDto;
  numberOfFreeExtensionLeft: number;
}

export interface SubscriptionPlanDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  typeSubscriptionPlan: TypeSubscriptionPlan;
  duration: number;
}
