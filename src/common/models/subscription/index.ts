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
  
