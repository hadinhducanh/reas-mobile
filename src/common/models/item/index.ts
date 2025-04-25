import { number, string } from "zod";
import { ConditionItem } from "../../enums/ConditionItem";
import { MethodExchange } from "../../enums/MethodExchange";
import { StatusItem } from "../../enums/StatusItem";
import { TypeExchange } from "../../enums/TypeExchange";
import { TypeItem } from "../../enums/TypeItem";
import { UserLocationDto, UserResponse } from "../auth";
import { BrandDto } from "../brand";
import { CategoryDto } from "../category";
import { StatusEntity } from "../../enums/StatusEntity";

export interface UploadItemRequest {
  itemName: string;
  description: string;
  price: number | null;
  conditionItem: ConditionItem;
  imageUrl: string;
  methodExchanges: MethodExchange[];
  isMoneyAccepted: boolean;
  termsAndConditionsExchange: string | null;
  categoryId: number;
  brandId: number;
  desiredItem?: DesiredItemDto | null;
  userLocationId: number;
}

export interface UpdateItemRequest {
  id: number;
  itemName: string;
  description: string;
  price: number;
  conditionItem: ConditionItem;
  imageUrl: string;
  methodExchanges: MethodExchange[];
  isMoneyAccepted: boolean;
  termsAndConditionsExchange: string | null;
  categoryId: number;
  brandId: number;
  desiredItem?: DesiredItemDto | null;
  userLocationId: number;
}

export interface DesiredItemDto {
  categoryId: number | null;
  conditionItem: ConditionItem | null;
  brandId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  description: string;
}

export interface ItemResponse {
  id: number;
  itemName: string;
  description: string;
  price: number;
  imageUrl: string;
  moneyAccepted: boolean;
  statusItem: StatusItem;
  conditionItem: ConditionItem;
  termsAndConditionsExchange: string;
  expiredTime: string;
  approvedTime: Date;
  methodExchanges: MethodExchange[];
  category: CategoryDto;
  brand: BrandDto;
  owner: UserResponse;
  desiredItem: DesiredItemResponse;
  userLocation: UserLocationDto;
  favorite: Boolean;
  distance: string;
  typeItem: TypeItem;
}

export interface DesiredItemResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  conditionItem: ConditionItem;
  brandId: number;
  brandName: string;
  typeItem: TypeItem;
  minPrice: number;
  maxPrice: number;
  description: string;
}

export interface ExtendedUploadItem extends UploadItemRequest {
  isCheckedFree: boolean;
  conditionItemName: string;
  methodExchangeName: string;
  categoryName: string;
  brandName: string;
  typeExchange: TypeExchange;
  typeItem: TypeItem;
  typeItemDesire: TypeItem;
  conditionDesiredItemName: string;
  categoryDesiredItemName: string;
  brandDesiredItemName: string;
}

export interface SearchItemRequest {
  itemName?: string;
  description?: string;
  price?: number;
  fromPrice?: number;
  toPrice?: number;
  categoryIds?: number[];
  brandIds?: number[];
  ownerIds?: number[];
  locationIds?: number[];
  statusItems?: StatusItem[];
  statusEntities?: StatusEntity[];
  typeItems?: TypeItem[];
}
