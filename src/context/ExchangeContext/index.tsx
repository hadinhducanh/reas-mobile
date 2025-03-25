import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import { ExtendExchangeRequestRequest } from "../../common/models/exchange";
import { MethodExchange } from "../../common/enums/MethodExchange";

export const defaultExchangeItem: ExtendExchangeRequestRequest = {
  sellerItemId: 0,
  buyerItemId: 0,
  paidByUserId: 0,
  exchangeDate: new Date(),
  exchangeLocation: "",
  estimatePrice: 0,
  methodExchange: MethodExchange.NO_METHOD,
  additionalNotes: "",
  methodExchangeName: "",
  locationGoong: {
    place_id: "",
    description: "",
    structured_formatting: {
      main_text: "",
      secondary_text: "",
    },
  },
  selectedItem: null,
};

export interface ExchangeItemContextType {
  exchangeItem: ExtendExchangeRequestRequest;
  setExchangeItem: React.Dispatch<
    React.SetStateAction<ExtendExchangeRequestRequest>
  >;
}

const ExchangeItemContext = createContext<ExchangeItemContextType | undefined>(
  undefined
);

export const ExchangeItemProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [exchangeItem, setExchangeItem] =
    useState<ExtendExchangeRequestRequest>(defaultExchangeItem);

  return (
    <ExchangeItemContext.Provider
      value={{
        exchangeItem,
        setExchangeItem,
      }}
    >
      {children}
    </ExchangeItemContext.Provider>
  );
};

export const useExchangeItem = (): ExchangeItemContextType => {
  const context = useContext(ExchangeItemContext);
  if (!context) {
    throw new Error(
      "useExchangeItem must be used within an ExchangeItemProvider"
    );
  }
  return context;
};
