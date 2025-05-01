import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllItemOfUserByStatusThunk,
  getAllItemAvailableThunk,
  getAllItemOfCurrentUserByStatusThunk,
  getItemCountsOfUserThunk,
  getItemDetailThunk,
  getOtherItemsOfUserThunk,
  getRecommendedItemsInExchangeThunk,
  getRecommendedItemsThunk,
  getSimilarItemsThunk,
  uploadItemThunk,
  searchItemPaginationThunk,
  getItemCountsOfCurrentUserThunk,
  findNearbyItemsThunk,
  changeItemStatusThunk,
  updateItemThunk,
  extendItemForFreeThunk,
  deleteItemThunk,
  isReachMaxOfUploadItemThisMonthThunk,
  isUpdatedItemInPendingExchangeThunk,
} from "../thunk/itemThunks";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { StatusItem } from "../../common/enums/StatusItem";
import {
  addToFavoriteThunk,
  deleteFromFavoriteThunk,
  getAllFavoriteItemsThunk,
} from "../thunk/favoriteThunk";
import { FavoriteResponse } from "../../common/models/favorite";

interface ItemState {
  itemDetail: ItemResponse | null;
  itemAvailable: ResponseEntityPagination<ItemResponse>;
  itemSearch: ResponseEntityPagination<ItemResponse>;
  itemByStatus: ResponseEntityPagination<ItemResponse>;
  itemByStatusOfUser: ResponseEntityPagination<ItemResponse>;
  itemFavorite: ResponseEntityPagination<FavoriteResponse>;
  itemRecommnand: ItemResponse[];
  itemDeleted: boolean;
  itemUploadMax: boolean;
  itemUpdateInExchange: boolean;
  itemSimilar: ItemResponse[];
  otherItemOfUser: ItemResponse[];
  itemSuggested: ItemResponse[];
  itemUpload: ItemResponse | null;
  itemUpdate: ItemResponse | null;
  countsOfUser: { [key in StatusItem]?: number };
  countsOfCurrentUser: { [key in StatusItem]?: number };
  extendFree: boolean;
  range: number;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  extendFree: false,
  itemUpdateInExchange: false,
  itemDetail: null,
  itemDeleted: false,
  itemUploadMax: false,
  itemAvailable: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemFavorite: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    last: false,
    content: [],
  },
  itemSearch: {
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
  itemUpdate: null,
  countsOfUser: {},
  countsOfCurrentUser: {},
  range: 0,
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setRangeState: (state, action: PayloadAction<number>) => {
      state.range = action.payload;
    },
    resetExtendFree: (state) => {
      state.extendFree = false;
    },
    resetItemDelete: (state) => {
      state.itemDeleted = false;
    },
    resetItemUploadMax: (state) => {
      state.itemUploadMax = false;
    },
    resetItemUpdateInExchange: (state) => {
      state.itemUpdateInExchange = false;
    },
    resetItemDetailState: (state) => {
      state.itemUpload = null;
      state.itemUpdate = null;
      state.itemDetail = null;
      state.itemRecommnand = [];
      state.itemSimilar = [];
      state.otherItemOfUser = [];
      state.itemSuggested = [];
      state.itemSearch = {
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
      .addCase(updateItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateItemThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse>) => {
          state.loading = false;
          state.itemUpdate = action.payload;
        }
      )
      .addCase(
        updateItemThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Update item failed";
        }
      );

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
          state.itemFavorite = action.payload;
        }
      )
      .addCase(
        getAllFavoriteItemsThunk.rejected,
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
      .addCase(searchItemPaginationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchItemPaginationThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.itemSearch = action.payload;
          } else {
            state.itemSearch = {
              ...action.payload,
              content: [...state.itemSearch.content, ...action.payload.content],
            };
          }
        }
      )
      .addCase(
        searchItemPaginationThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Search item failed";
        }
      );

    builder
      .addCase(findNearbyItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        findNearbyItemsThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          if (action.payload.pageNo === 0) {
            state.itemSearch = action.payload;
          } else {
            state.itemSearch = {
              ...action.payload,
              content: [...state.itemSearch.content, ...action.payload.content],
            };
          }
        }
      )
      .addCase(
        findNearbyItemsThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Find item near by failed";
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
      .addCase(changeItemStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changeItemStatusThunk.fulfilled,
        (state, action: PayloadAction<ItemResponse>) => {
          state.loading = false;
          state.itemDetail = action.payload;
        }
      )
      .addCase(
        changeItemStatusThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Get item detail failed";
        }
      );

    builder
      .addCase(addToFavoriteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToFavoriteThunk.fulfilled,
        (state, action: PayloadAction<FavoriteResponse>) => {
          state.loading = false;
          state.itemDetail = action.payload.item;
        }
      )
      .addCase(
        addToFavoriteThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Add item to favorite failed";
        }
      );

    builder
      .addCase(deleteFromFavoriteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteFromFavoriteThunk.fulfilled,
        (state, action: PayloadAction<Boolean>) => {
          state.loading = false;
          if (state.itemDetail) {
            state.itemDetail.favorite = !action.payload;
          }
        }
      )
      .addCase(
        deleteFromFavoriteThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Add item to favorite failed";
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
      .addCase(getAllItemOfUserByStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllItemOfUserByStatusThunk.fulfilled,
        (
          state,
          action: PayloadAction<ResponseEntityPagination<ItemResponse>>
        ) => {
          state.loading = false;
          state.itemByStatusOfUser = action.payload;
        }
      )
      .addCase(
        getAllItemOfUserByStatusThunk.rejected,
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

    builder
      .addCase(getItemCountsOfCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getItemCountsOfCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<{ [key in StatusItem]?: number }>) => {
          state.loading = false;
          state.countsOfCurrentUser = action.payload;
        }
      )
      .addCase(
        getItemCountsOfCurrentUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Get item counts of current user failed";
        }
      );

    builder
      .addCase(extendItemForFreeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        extendItemForFreeThunk.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
          state.extendFree = action.payload;
        }
      )
      .addCase(
        extendItemForFreeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Extend free of item failed";
        }
      );

    builder
      .addCase(deleteItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteItemThunk.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
          state.itemDeleted = action.payload;
        }
      )
      .addCase(
        deleteItemThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Delete item failed";
        }
      );

    builder
      .addCase(isReachMaxOfUploadItemThisMonthThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        isReachMaxOfUploadItemThisMonthThunk.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
          state.itemUploadMax = action.payload;
        }
      )
      .addCase(
        isReachMaxOfUploadItemThisMonthThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Check max of upload item failed";
        }
      );

    builder
      .addCase(isUpdatedItemInPendingExchangeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        isUpdatedItemInPendingExchangeThunk.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
          state.itemUpdateInExchange = action.payload;
        }
      )
      .addCase(
        isUpdatedItemInPendingExchangeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Update item in pending exchange failed";
        }
      );
  },
});

export const {
  resetItemDetailState,
  setRangeState,
  resetExtendFree,
  resetItemDelete,
  resetItemUploadMax,
  resetItemUpdateInExchange,
} = itemSlice.actions;
export default itemSlice.reducer;
