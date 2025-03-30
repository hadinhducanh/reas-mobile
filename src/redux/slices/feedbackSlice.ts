import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackResponse } from "../../common/models/feedback";
import {
  createFeedbackThunk,
  getAllFeedbackOfUserThunk,
  updateFeedbackThunk,
  viewFeedbackDetailThunk,
} from "../thunk/feedbackThunk";
import { ResponseEntityPagination } from "../../common/models/pagination";

interface FeebackState {
  feedbackDetail: FeedbackResponse | null;
  feedbackByUser: ResponseEntityPagination<FeedbackResponse>;
  loading: boolean;
  error: string | null;
}

const initialState: FeebackState = {
  feedbackDetail: null,
  feedbackByUser: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    resetFeedback: (state) => {
      state.feedbackByUser = {
        pageNo: 0,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0,
        last: false,
        content: [],
      };
      state.feedbackDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFeedbackThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createFeedbackThunk.fulfilled,
        (state, action: PayloadAction<FeedbackResponse>) => {
          state.loading = false;
          state.feedbackDetail = action.payload;
        }
      )
      .addCase(
        createFeedbackThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Create a feedback failed";
        }
      );

    builder
      .addCase(updateFeedbackThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateFeedbackThunk.fulfilled,
        (state, action: PayloadAction<FeedbackResponse>) => {
          state.loading = false;
          state.feedbackDetail = action.payload;
        }
      )
      .addCase(
        updateFeedbackThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Update a feedback failed";
        }
      );

    builder
      .addCase(viewFeedbackDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        viewFeedbackDetailThunk.fulfilled,
        (state, action: PayloadAction<FeedbackResponse>) => {
          state.loading = false;
          state.feedbackDetail = action.payload;
        }
      )
      .addCase(
        viewFeedbackDetailThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get feedback detail failed";
        }
      );

    builder
      .addCase(getAllFeedbackOfUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllFeedbackOfUserThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<FeedbackResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.feedbackByUser = action.payload;
          } else {
            state.feedbackByUser = {
              ...action.payload,
              content: [
                ...(state.feedbackByUser?.content || []), // ✅ Kiểm tra null
                ...action.payload.content,
              ],
            };
          }
        }
      );
  },
});

export const { resetFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
