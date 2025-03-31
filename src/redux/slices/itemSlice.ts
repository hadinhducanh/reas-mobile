import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllAvailableItemOfUserThunk,
  getAllItemAvailableThunk,
  getAllItemOfCurrentUserByStatusThunk,
  getItemCountsOfUserThunk,
  getItemDetailThunk,
  getOtherItemsOfUserThunk,
  getRecommendedItemsInExchangeThunk,
  getRecommendedItemsThunk,
  getSimilarItemsThunk,
  uploadItemThunk,
} from "../thunk/itemThunks";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { StatusItem } from "../../common/enums/StatusItem";

interface ItemState {
  itemDetail: ItemResponse | null;
  itemAvailable: ResponseEntityPagination<ItemResponse>;
  itemByStatus: ResponseEntityPagination<ItemResponse>;
  itemByStatusOfUser: ResponseEntityPagination<ItemResponse>;
  itemRecommnand: ItemResponse[];
  itemSimilar: ItemResponse[];
  otherItemOfUser: ItemResponse[];
  itemSuggested: ItemResponse[];
  itemUpload: ItemResponse | null;
  countsOfUser: { [key in StatusItem]?: number };
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  itemDetail: null,
  itemAvailable: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemRecommnand: [],
  itemSimilar: [],
  otherItemOfUser: [],
  itemByStatus: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemByStatusOfUser: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemSuggested: [],
  itemUpload: null,
  countsOfUser: {},
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    resetItemDetailState: (state) => {
      state.itemUpload = null;
      state.itemDetail = null;
      state.itemRecommnand = [];
      state.itemSimilar = [];
      state.otherItemOfUser = [];
      state.itemSuggested = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadItemThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse>) => {
          state.loading = false;
          state.itemUpload = action.payload;
        }
      )
      .addCase(
        uploadItemThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Upload item failed";
        }
      );

    builder
      .addCase(getAllItemAvailableThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllItemAvailableThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.itemAvailable = action.payload;
          } else {
            state.itemAvailable = {
              ...action.payload,
              content: [
                ...state.itemAvailable.content,
                ...action.payload.content,
              ],
            };
          }
        }
      )
      .addCase(
        getAllItemAvailableThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get all item available failed";
        }
      );

    builder
      .addCase(getItemDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getItemDetailThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse>) => {
          state.loading = false;
          state.itemDetail = action.payload;
        }
      )
      .addCase(
        getItemDetailThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get item detail failed";
        }
      );

    builder
      .addCase(getAllItemOfCurrentUserByStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllItemOfCurrentUserByStatusThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          state.itemByStatus = action.payload;
        }
      )
      .addCase(
        getAllItemOfCurrentUserByStatusThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get all item of current user by status failed";
        }
      );

    builder
      .addCase(getAllAvailableItemOfUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAvailableItemOfUserThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          state.itemByStatusOfUser = action.payload;
        }
      )
      .addCase(
        getAllAvailableItemOfUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get all item of current user by status failed";
        }
      );

    builder
      .addCase(getRecommendedItemsInExchangeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getRecommendedItemsInExchangeThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse[]>) => {
          state.loading = false;
          state.itemSuggested = action.payload;
        }
      )
      .addCase(
        getRecommendedItemsInExchangeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get recommend item in exchange failed";
        }
      );

    builder
      .addCase(getRecommendedItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getRecommendedItemsThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse[]>) => {
          state.loading = false;
          state.itemRecommnand = action.payload;
        }
      )
      .addCase(
        getRecommendedItemsThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get recommend item in exchange failed";
        }
      );

    builder
      .addCase(getSimilarItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSimilarItemsThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse[]>) => {
          state.loading = false;
          state.itemSimilar = action.payload;
        }
      )
      .addCase(
        getSimilarItemsThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get similar items failed";
        }
      );

    builder
      .addCase(getOtherItemsOfUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getOtherItemsOfUserThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse[]>) => {
          state.loading = false;
          state.otherItemOfUser = action.payload;
        }
      )
      .addCase(
        getOtherItemsOfUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get other items of user failed";
        }
      );

    builder
      .addCase(getItemCountsOfUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getItemCountsOfUserThunk.fulfilled,
        (state, action: PayloadAction<{ [key in StatusItem]?: number }>) => {
          state.loading = false;
          state.countsOfUser = action.payload;
        }
      )
      .addCase(
        getItemCountsOfUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get item counts of user failed";
        }
      );
  },
});

export const { resetItemDetailState } = itemSlice.actions;
export default itemSlice.reducer;
