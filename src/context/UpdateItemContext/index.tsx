import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import { ExtendedUploadItem } from "../../common/models/item";
import { ConditionItem } from "../../common/enums/ConditionItem";
import { TypeExchange } from "../../common/enums/TypeExchange";
import { TypeItem } from "../../common/enums/TypeItem";

export const defaultUpdateItem: ExtendedUploadItem = {
  itemName: "",
  description: "",
  price: null,
  conditionItem: ConditionItem.NO_CONDITION,
  imageUrl: "",
  methodExchanges: [],
  isMoneyAccepted: false,
  typeExchange: TypeExchange.OPEN_EXCHANGE,
  typeItem: TypeItem.NO_TYPE,
  termsAndConditionsExchange: "",
  categoryId: 0,
  brandId: 0,
  userLocationId: 0,
  desiredItem: {
    categoryId: null,
    conditionItem: null,
    brandId: null,
    minPrice: null,
    maxPrice: null,
    description: "",
  },
  isCheckedFree: false,
  conditionItemName: "",
  methodExchangeName: "",
  categoryName: "",
  brandName: "",

  typeItemDesire: TypeItem.NO_TYPE,
  conditionDesiredItemName: "",
  categoryDesiredItemName: "",
  brandDesiredItemName: "",
};

export interface UpdateItemContextType {
  updateItem: ExtendedUploadItem;
  setUpdateItem: React.Dispatch<React.SetStateAction<ExtendedUploadItem>>;
}

const UpdateItemContext = createContext<UpdateItemContextType | undefined>(
  undefined
);

export const UpdateItemProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [updateItem, setUpdateItem] =
    useState<ExtendedUploadItem>(defaultUpdateItem);

  return (
    <UpdateItemContext.Provider
      value={{
        updateItem,
        setUpdateItem,
      }}
    >
      {children}
    </UpdateItemContext.Provider>
  );
};

export const useUpdateItem = (): UpdateItemContextType => {
  const context = useContext(UpdateItemContext);
  if (!context) {
    throw new Error("useUpdateItem must be used within an UpdateItemProvider");
  }
  return context;
};
