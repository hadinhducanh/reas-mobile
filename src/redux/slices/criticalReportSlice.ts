import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { CriticalReportResponse } from "../../common/models/criticalReport";
import {
  createCriticalReportThunk,
  getCriticalReportDetailThunk,
  searchCriticalReportThunk,
} from "../thunk/criticalReportThunk";

export interface CriticalReportState {
  searchCriticalReport: ResponseEntityPagination<CriticalReportResponse>;
  criticalReportDetail: CriticalReportResponse | null;
  criticalReportCreate: CriticalReportResponse | null;
  loadingCriticalReport: boolean;
  errorCriticalReport: string | null;
}

const initialState: CriticalReportState = {
  searchCriticalReport: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  criticalReportDetail: null,
  criticalReportCreate: null,
  loadingCriticalReport: false,
  errorCriticalReport: null,
};

const criticalReportSlice = createSlice({
  name: "criticalReport",
  initialState,
  reducers: {
    resetCriticalReportDetail: (state) => {
      state.criticalReportDetail = null;
      state.criticalReportCreate = null;
    },
  },
  extraReducers: (builder) => {
    searchPaymentHistoryOfUserPagination(builder);
    createCriticalReport(builder);
    getCriticalReportDetail(builder);
  },
});

function searchPaymentHistoryOfUserPagination(
  builder: ActionReducerMapBuilder<CriticalReportState>
) {
  builder
    .addCase(searchCriticalReportThunk.pending, (state) => {
      state.loadingCriticalReport = true;
      state.errorCriticalReport = null;
    })
    .addCase(
      searchCriticalReportThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<CriticalReportResponse>>
      ) => {
        state.loadingCriticalReport = false;
        if (action.payload.pageNo === 0) {
          state.searchCriticalReport = action.payload;
        } else {
          state.searchCriticalReport = {
            ...action.payload,
            content: [
              ...state.searchCriticalReport.content,
              ...action.payload.content,
            ],
          };
        }
      }
    )
    .addCase(
      searchCriticalReportThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingCriticalReport = false;
        state.errorCriticalReport =
          action.payload || "Search critical report of user failed";
      }
    );
}

function createCriticalReport(
  builder: ActionReducerMapBuilder<CriticalReportState>
) {
  builder
    .addCase(createCriticalReportThunk.pending, (state) => {
      state.loadingCriticalReport = true;
      state.errorCriticalReport = null;
    })
    .addCase(
      createCriticalReportThunk.fulfilled,
      (state, action: PayloadAction<CriticalReportResponse>) => {
        state.loadingCriticalReport = false;
        state.criticalReportDetail = action.payload;
      }
    )
    .addCase(
      createCriticalReportThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingCriticalReport = false;
        state.errorCriticalReport =
          action.payload || "Create critical report for resident failed";
      }
    );
}

function getCriticalReportDetail(
  builder: ActionReducerMapBuilder<CriticalReportState>
) {
  builder
    .addCase(getCriticalReportDetailThunk.pending, (state) => {
      state.loadingCriticalReport = true;
      state.errorCriticalReport = null;
    })
    .addCase(
      getCriticalReportDetailThunk.fulfilled,
      (state, action: PayloadAction<CriticalReportResponse>) => {
        state.loadingCriticalReport = false;
        state.criticalReportDetail = action.payload;
      }
    )
    .addCase(
      getCriticalReportDetailThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingCriticalReport = false;
        state.errorCriticalReport =
          action.payload || "Get critical report for resident failed";
      }
    );
}

export const { resetCriticalReportDetail } = criticalReportSlice.actions;
export default criticalReportSlice.reducer;
