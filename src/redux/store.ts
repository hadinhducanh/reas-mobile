import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemReducer from "./slices/itemSlice";
import brandReducer from "./slices/brandSlice";
import categoryReducer from "./slices/categorySlice";
import exchangeReducer from "./slices/exchangeSlice";
import chatReducer from "./slices/chatSlice";
import locationReducer from "./slices/locationSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import feebackReducer from "./slices/feedbackSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    item: itemReducer,
    brand: brandReducer,
    category: categoryReducer,
    exchange: exchangeReducer,
    chat: chatReducer,
    location: locationReducer,
    subscription: subscriptionReducer,
    feeback: feebackReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
