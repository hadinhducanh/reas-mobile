import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FeedbackRequest,
  FeedbackResponse,
} from "../../common/models/feedback";
import { RootState } from "../store";
import FeedbackService from "../../services/FeedbackService";
import { ResponseEntityPagination } from "../../common/models/pagination";

export const createFeedbackThunk = createAsyncThunk<
  FeedbackResponse,
  FeedbackRequest,
  { state: RootState }
>("feedback/createFeedback", async (feedback, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.createFeedback(feedback, accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Create a feedback failed"
    );
  }
});

export const updateFeedbackThunk = createAsyncThunk<
  FeedbackResponse,
  FeedbackRequest,
  { state: RootState }
>("feedback/updateFeedback", async (feedback, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.updateFeedback(feedback, accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Update a feedback failed"
    );
  }
});

export const viewFeedbackDetailThunk = createAsyncThunk<
  FeedbackResponse,
  number,
  { state: RootState }
>("feedback/viewFeedbackDetail", async (feedbackId, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.viewFeedbackDetail(
      feedbackId,
      accessToken
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Get feedback detail failed"
    );
  }
});

export const getAllFeedbackOfUserThunk = createAsyncThunk<
  ResponseEntityPagination<FeedbackResponse>,
  { pageNo: number; userId: number; rating?: number }
>(
  "feedback/getAllFeedbackOfUser",
  async ({ pageNo, userId, rating }, thunkAPI) => {
    try {
      const data = await FeedbackService.getAllFeedbackOfUser(
        pageNo,
        userId,
        rating
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get all feedback of user failed"
      );
    }
  }
);

export const getFeedbackCountsThunk = createAsyncThunk<
  { [key in number]?: number },
  number
>("exchange/getExchangeCounts", async (userId, thunkAPI) => {
  try {
    const statuses = ["All", 5, 4, 3, 2, 1];

    const requests = statuses.map((status) => {
      if (status === "All") {
        return FeedbackService.getAllFeedbackOfUser(0, userId);
      } else {
        return FeedbackService.getAllFeedbackOfUser(
          0,
          userId,
          status as number
        );
      }
    });

    const responses = await Promise.all(requests);

    const counts: { [key in number]?: number } = {};
    statuses.forEach((status, index) => {
      if (status === "All") {
        counts[0] = responses[index].totalRecords;
      } else {
        counts[status as number] = responses[index].totalRecords;
      }
    });

    return counts;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get feedback counts failed"
    );
  }
});
