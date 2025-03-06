import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemReducer from "./slices/itemSlice";
import brandReducer from "./slices/brandSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    item: itemReducer,
    brand: brandReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
