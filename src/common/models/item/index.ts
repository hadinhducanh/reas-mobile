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
  price: number;
  conditionItem: ConditionItem;
  imageUrl: string;
  methodExchanges: MethodExchange[];
  isMoneyAccepted: boolean;
  termsAndConditionsExchange: string;
  categoryId: number;
  brandId: number;
  desiredItem?: DesiredItemDto | null;
}

export interface DesiredItemDto {
  categoryId: number | null;
  conditionItem: ConditionItem | null;
  brandId: number | null;
  minPrice: number;
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
  expiredTime: Date;
  approvedTime: Date;
  methodExchanges: MethodExchange[];
  category: CategoryDto;
  brand: BrandDto;
  owner: UserResponse;
  desiredItem: DesiredItemResponse;
  userLocation: UserLocationDto;
  favorite: Boolean;
  distance: string;
}

export interface DesiredItemResponse {
  id: number;
  categoryName: string;
  conditionItem: ConditionItem;
  brandName: string;
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
  categoryIds?: [number];
  brandIds?: [number];
  ownerIds?: [number];
  locationIds?: [number];
  statusItems?: StatusItem[];
  statusEntities?: StatusEntity[];
  typeItems?: TypeItem[];
}
