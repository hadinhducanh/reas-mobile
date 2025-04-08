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
  startDate: Date;
  endDate: Date;
  subscriptionPlan: SubscriptionPlanDto;
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
