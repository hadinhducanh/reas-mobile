import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeedbackResponse } from "../../common/models/feedback";
import { RootState } from "../store";
import FeedbackService from "../../services/FeedbackService";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { FavoriteResponse } from "../../common/models/favorite";
import FavoriteService from "../../services/FavoriteService";

export const addToFavoriteThunk = createAsyncThunk<
  FavoriteResponse,
  number,
  { state: RootState }
>("favorite/addToFavorite", async (itemId, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FavoriteService.addToFavorite(itemId, accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Add to favorite failed"
    );
  }
});

export const deleteFromFavoriteThunk = createAsyncThunk<
  Boolean,
  number,
  { state: RootState }
>("favorite/deleteFromFavorite", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }

  try {
    const data = await FavoriteService.deleteFromFavorite(id, accessToken);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Delete favorite of user failed"
    );
  }
});

export const getAllFavoriteItemsThunk = createAsyncThunk<
  ResponseEntityPagination<FeedbackResponse>,
  number,
  { state: RootState }
>("favorite/getAllFavoriteItems", async (pageNo, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FavoriteService.getAllFavoriteItems(pageNo, accessToken);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get all feedback of user failed"
    );
  }
});
