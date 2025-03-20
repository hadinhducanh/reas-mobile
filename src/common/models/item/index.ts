import { ConditionItem } from "../../enums/ConditionItem";
import { MethodExchange } from "../../enums/MethodExchange";
import { StatusItem } from "../../enums/StatusItem";
import { TypeExchange } from "../../enums/TypeExchange";
import { TypeItem } from "../../enums/TypeItem";
import { UserLocationDto, UserResponse } from "../auth";
import { BrandDto } from "../brand";
import { CategoryDto } from "../category";

export interface UploadItemRequest {
    itemName: string;
    description: string;
    price: number;
    conditionItem: ConditionItem;
    imageUrl: string;
    methodExchanges: MethodExchange[];
    isMoneyAccepted: boolean;
    typeExchange: TypeExchange;
    typeItem: TypeItem;
    termsAndConditionsExchange: string;
    categoryId: number;
    brandId: number;
    desiredItem?: DesiredItemDto | null;
}

export interface DesiredItemDto {
    typeItem:  TypeItem;
    categoryId: number;
    conditionItem: ConditionItem;
    brandId: number;
    minPrice: number;
    maxPrice: number;
}

export interface ItemResponse{
    id: number;
    itemName: string;
    description: string;
    price: number;
    imageUrl: string;
    statusItem: StatusItem;
    moneyAccepted: boolean;
    termsAndConditionsExchange: string;
    expiredTime: Date;
    methodExchanges: MethodExchange[];
    category: CategoryDto;
    brand: BrandDto;
    owner: UserResponse;
    desiredItem: DesiredItemResponse;
    userLocation: UserLocationDto;
}

export interface DesiredItemResponse {
    id: number;
    typeItem:  TypeItem;
    categoryName: string;
    conditionItem: ConditionItem;
    brandName: string;
    minPrice: number;
    maxPrice: number;
}

export interface ExtendedUploadItem extends UploadItemRequest {
    isCheckedFree: boolean
    conditionItemName: string
    methodExchangeName: string
    categoryName: string
    brandName: string

    conditionDesiredItemName: string
    categoryDesiredItemName: string
    brandDesiredItemName: string
}
