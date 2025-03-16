// src/contexts/UploadItemContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import { UploadItemRequest } from "../../common/models/item";
import { ConditionItem } from "../../common/enums/ConditionItem";
import { TypeExchange } from "../../common/enums/TypeExchange";
import { TypeItem } from "../../common/enums/TypeItem";

export const defaultUploadItem = {
  itemName: "",
  description: "",
  price: 0,
  conditionItem: ConditionItem.NO_CONDITION,
  imageUrl: "",
  methodExchanges: [],
  isMoneyAccepted: false,
  typeExchange: TypeExchange.OPEN_EXCHANGE,
  typeItem: TypeItem.NO_TYPE,
  termsAndConditionsExchange: "",
  categoryId: 0,
  brandId: 0,
  isCheckedFree: false,
  desiredItem: {
    typeItem: TypeItem.NO_TYPE,
    categoryId: 0,
    conditionItem: ConditionItem.NO_CONDITION,
    brandId: 0,
    minPrice: 0,
    maxPrice: 0,
  },
};

export interface UploadItemContextType {
  isCheckFreeContext: boolean;
  setIsCheckFreeContext: React.Dispatch<React.SetStateAction<boolean>>;
  uploadItem: UploadItemRequest;
  setUploadItem: React.Dispatch<React.SetStateAction<UploadItemRequest>>;
}

const UploadItemContext = createContext<UploadItemContextType | undefined>(
  undefined
);

export const UploadItemProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isCheckFreeContext, setIsCheckFreeContext] = useState<boolean>(false);
  const [uploadItem, setUploadItem] =
    useState<UploadItemRequest>(defaultUploadItem);

  return (
    <UploadItemContext.Provider
      value={{
        isCheckFreeContext,
        setIsCheckFreeContext,
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
