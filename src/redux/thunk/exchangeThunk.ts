import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  EvidenceExchangeRequest,
  ExchangeRequestRequest,
  ExchangeResponse,
} from "../../common/models/exchange";
import ExchangeService from "../../services/ExchangeService";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { StatusExchange } from "../../common/enums/StatusExchange";

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

export const getAllExchangesByStatusOfCurrentUserThunk = createAsyncThunk<
  ResponseEntityPagination<ExchangeResponse>,
  {
    pageNo: number;
    statusExchangeRequest: StatusExchange;
  },
  { state: RootState }
>(
  "exchange/getAllExchangesByStatusOfCurrentUser",
  async ({ pageNo, statusExchangeRequest }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }

    try {
      let data: ResponseEntityPagination<ExchangeResponse>;
      if (
        statusExchangeRequest === StatusExchange.SUCCESSFUL ||
        statusExchangeRequest === StatusExchange.FAILED ||
        statusExchangeRequest === StatusExchange.NOT_YET_EXCHANGE ||
        statusExchangeRequest === StatusExchange.PENDING_EVIDENCE
      ) {
        data = await ExchangeService.getAllExchangesByStatusOfCurrentUser(
          pageNo,
          accessToken,
          StatusExchange.APPROVED,
          statusExchangeRequest
        );
      } else {
        data = await ExchangeService.getAllExchangesByStatusOfCurrentUser(
          pageNo,
          accessToken,
          statusExchangeRequest
        );
      }

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get all exchange of current user failed"
      );
    }
  }
);

export const getExchangeCountsThunk = createAsyncThunk<
  { [key in StatusExchange]?: number },
  void,
  { state: RootState }
>("exchange/getExchangeCounts", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }

  try {
    const statuses = [
      StatusExchange.PENDING,
      StatusExchange.APPROVED,
      StatusExchange.REJECTED,
      StatusExchange.SUCCESSFUL,
      StatusExchange.FAILED,
      StatusExchange.CANCELLED,
    ];

    const requests = statuses.map((status) => {
      if (
        status === StatusExchange.SUCCESSFUL ||
        status === StatusExchange.FAILED
      ) {
        return ExchangeService.getAllExchangesByStatusOfCurrentUser(
          0,
          accessToken,
          StatusExchange.APPROVED,
          status
        );
      } else {
        return ExchangeService.getAllExchangesByStatusOfCurrentUser(
          0,
          accessToken,
          status
        );
      }
    });

    const responses = await Promise.all(requests);

    const counts: { [key in StatusExchange]?: number } = {};
    statuses.forEach((status, index) => {
      counts[status] = responses[index].totalRecords;
    });

    return counts;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get exchange counts failed"
    );
  }
});

export const getExchangeDetailThunk = createAsyncThunk<
  ExchangeResponse,
  number,
  { state: RootState }
>("exchange/getExchangeDetail", async (exchangeId, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ExchangeService.getExchangeDetail(
      exchangeId,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Get exchange detail failed"
    );
  }
});

export const confirmNegotiatedPriceThunk = createAsyncThunk<
  ExchangeResponse,
  number,
  { state: RootState }
>("exchange/confirmNegotiatedPrice", async (exchangeId, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ExchangeService.confirmNegotiatedPrice(
      exchangeId,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Comfirm price failed"
    );
  }
});

export const updateExchangeRequestPriceThunk = createAsyncThunk<
  ExchangeResponse,
  {
    exchangeId: number;
    negotiatedPrice: number;
  },
  { state: RootState }
>(
  "exchange/updateExchangeRequestPrice",
  async ({ exchangeId, negotiatedPrice }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ExchangeService.updateExchangeRequestPrice(
        exchangeId,
        negotiatedPrice,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Update negotiate price failed"
      );
    }
  }
);

export const reviewExchangeRequestThunk = createAsyncThunk<
  ExchangeResponse,
  {
    exchangeId: number;
    statusExchangeRequest: StatusExchange;
  },
  { state: RootState }
>(
  "exchange/reviewExchangeRequest",
  async ({ exchangeId, statusExchangeRequest }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ExchangeService.reviewExchangeRequest(
        exchangeId,
        statusExchangeRequest,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Review exchange failed"
      );
    }
  }
);

export const cancelExchangeThunk = createAsyncThunk<
  ExchangeResponse,
  number,
  { state: RootState }
>("exchange/cancelExchange", async (exchangeId, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ExchangeService.cancelExchange(exchangeId, accessToken);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Cancel exchange failed"
    );
  }
});

export const uploadExchangeEvidenceThunk = createAsyncThunk<
  ExchangeResponse,
  EvidenceExchangeRequest,
  { state: RootState }
>("exchange/uploadExchangeEvidence", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ExchangeService.uploadExchangeEvidence(
      request,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Upload evidence for exchange failed"
    );
  }
});

export const getNumberOfSuccessfulExchangesOfUserThunk = createAsyncThunk<
  number,
  { month: number; year: number },
  { state: RootState }
>(
  "exchange/getNumberOfSuccessfulExchangesOfUser",
  async ({ month, year }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ExchangeService.getNumberOfSuccessfulExchangesOfUser(
        month,
        year,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Get number of successful exchange of user failed"
      );
    }
  }
);

export const getRevenueOfUserInOneYearFromExchangesThunk = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("exchange/getRevenueOfUserInOneYearFromExchanges", async (year, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ExchangeService.getRevenueOfUserInOneYearFromExchanges(
      year,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data ||
        "Get revenure of user in one year from exchanges failed"
    );
  }
});

export const getMonthlyRevenueOfUserInOneYearFromExchangesThunk =
  createAsyncThunk<Record<number, number>, number, { state: RootState }>(
    "exchange/getMonthlyRevenueOfUserInOneYearFromExchanges",
    async (year, thunkAPI) => {
      const state = thunkAPI.getState();
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        return thunkAPI.rejectWithValue("No access token available");
      }
      try {
        const data =
          await ExchangeService.getMonthlyRevenueOfUserInOneYearFromExchanges(
            year,
            accessToken
          );
        return data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data ||
            "Get monthly revenure of user in one year from exchanges failed"
        );
      }
    }
  );
