import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemReducer from "./slices/itemSlice";
import brandReducer from "./slices/brandSlice";
import categoryReducer from "./slices/categorySlice";
import exchangeReducer from "./slices/categorySlice";
import chatReducer from "./slices/chatSlice";
import locationReducer from "./slices/locationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    item: itemReducer,
    brand: brandReducer,
    category: categoryReducer,
    exchange: exchangeReducer,
    chat: chatReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
