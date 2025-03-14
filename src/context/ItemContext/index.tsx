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

const defaultUploadItem: UploadItemRequest = {
  itemName: "",
  description: "",
  price: 0,
  conditionItem: ConditionItem.NO_CONDITION,
  imageUrl: "",
  methodExchanges: [],
  isMoneyAccepted: false,
  typeExchange: TypeExchange.NO_TYPE,
  typeItem: TypeItem.NO_TYPE,
  termsAndConditionsExchange: "",
  categoryId: 0,
  brandId: 0,
  desiredItem: undefined,
};

export interface UploadItemContextType {
  uploadItem: UploadItemRequest;
  setUploadItem: React.Dispatch<React.SetStateAction<UploadItemRequest>>;
}

const UploadItemContext = createContext<UploadItemContextType | undefined>(
  undefined
);

export const UploadItemProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadItem, setUploadItem] =
    useState<UploadItemRequest>(defaultUploadItem);

  return (
    <UploadItemContext.Provider value={{ uploadItem, setUploadItem }}>
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
