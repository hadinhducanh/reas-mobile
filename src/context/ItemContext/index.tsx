import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useRef,
  MutableRefObject,
} from "react";
import { ExtendedUploadItem } from "../../common/models/item";
import { ConditionItem } from "../../common/enums/ConditionItem";
import { TypeExchange } from "../../common/enums/TypeExchange";
import { TypeItem } from "../../common/enums/TypeItem";

export const defaultUploadItem: ExtendedUploadItem = {
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

export interface UploadItemContextType {
  uploadItem: ExtendedUploadItem;
  setUploadItem: React.Dispatch<React.SetStateAction<ExtendedUploadItem>>;
}

const UploadItemContext = createContext<UploadItemContextType | undefined>(
  undefined
);

export const UploadItemProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadItem, setUploadItem] =
    useState<ExtendedUploadItem>(defaultUploadItem);

  return (
    <UploadItemContext.Provider
      value={{
        uploadItem,
        setUploadItem,
      }}
    >
      {children}
    </UploadItemContext.Provider>
  );
};

export const useUploadItem = (): UploadItemContextType => {
  const context = useContext(UploadItemContext);
  if (!context) {
    throw new Error("useUploadItem must be used within an UploadItemProvider");
  }
  return context;
};
