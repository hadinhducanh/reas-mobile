import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ResponseEntityPagination } from "../../common/models/pagination";
import CriticalReportService from "../../services/CriticalReportService";
import {
  CriticalReportResidentRequest,
  CriticalReportResponse,
  SearchCriticalReportRequest,
} from "../../common/models/criticalReport";

export const searchCriticalReportThunk = createAsyncThunk<
  ResponseEntityPagination<CriticalReportResponse>,
  { pageNo: number; request: SearchCriticalReportRequest },
  { state: RootState }
>(
  "criticalReport/searchCriticalReport",
  async ({ pageNo, request }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await CriticalReportService.searchCriticalReport(
        pageNo,
        request,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Search critical report of user failed"
      );
    }
  }
);

export const createCriticalReportThunk = createAsyncThunk<
  CriticalReportResponse,
  CriticalReportResidentRequest,
  { state: RootState }
>("criticalReport/createCriticalReport", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await CriticalReportService.createCriticalReport(
      request,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Create critical report for resident failed"
    );
  }
});

export const getCriticalReportDetailThunk = createAsyncThunk<
  CriticalReportResponse,
  number,
  { state: RootState }
>("criticalReport/getCriticalReportDetail", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await CriticalReportService.getCriticalReportDetail(
      id,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get critical report for resident failed"
    );
  }
});
