import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  ExchangeRequestRequest,
  ExchangeResponse,
} from "../../common/models/exchange";
import ExchangeService from "../../services/ExchangeService";

export const makeAnExchangeThunk = createAsyncThunk<
  ExchangeResponse,
  ExchangeRequestRequest,
  { state: RootState }
>("exchange/makeAnExchange", async (exchange, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ExchangeService.makeAnExchange(exchange, accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Make an exchange failed"
    );
  }
});
