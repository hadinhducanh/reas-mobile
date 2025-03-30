import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackResponse } from "../../common/models/feedback";
import {
  createFeedbackThunk,
  updateFeedbackThunk,
  viewFeedbackDetailThunk,
} from "../thunk/feedbackThunk";

interface FeebackState {
  feedbackDetail: FeedbackResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeebackState = {
  feedbackDetail: null,
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    resetFeedback: (state) => {
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
  },
});

export const { resetFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
