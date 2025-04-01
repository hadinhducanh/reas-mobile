import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackResponse } from "../../common/models/feedback";
import {
  createFeedbackThunk,
  getAllFeedbackOfUserThunk,
  getFeedbackCountsThunk,
  updateFeedbackThunk,
  viewFeedbackDetailThunk,
} from "../thunk/feedbackThunk";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { FavoriteResponse } from "../../common/models/favorite";
import {
  addToFavoriteThunk,
  deleteFromFavoriteThunk,
  getAllFavoriteItemsThunk,
} from "../thunk/favoriteThunk";

interface FavoriteState {
  favoritePage: ResponseEntityPagination<FavoriteResponse>;
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favoritePage: {
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

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    resetFavorite: (state) => {
      state.favoritePage = {
        pageNo: 0,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0,
        last: false,
        content: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFavoriteItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllFavoriteItemsThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<FavoriteResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.favoritePage = action.payload;
          } else {
            state.favoritePage = {
              ...action.payload,
              content: [
                ...(state.favoritePage?.content || []),
                ...action.payload.content,
              ],
            };
          }
        }
      );
  },
});

export const { resetFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
