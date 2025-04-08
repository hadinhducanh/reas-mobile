import { createAsyncThunk } from "@reduxjs/toolkit";
import ItemService from "../../services/ItemService";
import { RootState } from "../store";
import {
  ItemResponse,
  SearchItemRequest,
  UpdateItemRequest,
  UploadItemRequest,
} from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";
import { StatusItem } from "../../common/enums/StatusItem";

export const uploadItemThunk = createAsyncThunk<
  ItemResponse,
  UploadItemRequest,
  { state: RootState }
>("item/uploadItem", async (item, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ItemService.uploadItem(item, accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Upload item failed"
    );
  }
});

export const updateItemThunk = createAsyncThunk<
  ItemResponse,
  UpdateItemRequest,
  { state: RootState }
>("item/updateItem", async (item, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ItemService.updateItem(item, accessToken);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Update item failed"
    );
  }
});

export const getRecommendedItemsThunk = createAsyncThunk<
  ItemResponse[],
  {
    id: number;
    limit?: number;
  },
  { state: RootState }
>("item/getRecommendedItems", async ({ id, limit }, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ItemService.getRecommendedItems(id, accessToken, limit);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get recommend item failed"
    );
  }
});

export const getRecommendedItemsInExchangeThunk = createAsyncThunk<
  ItemResponse[],
  {
    sellerItemId: number;
    limit?: number;
  },
  { state: RootState }
>(
  "item/getRecommendedItemsInExchange",
  async ({ sellerItemId, limit }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ItemService.getRecommendedItemsInExchange(
        sellerItemId,
        accessToken,
        limit
      );
      return data;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get recommend item in exchange failed"
      );
    }
  }
);

export const getSimilarItemsThunk = createAsyncThunk<
  ItemResponse[],
  {
    itemId: number;
    limit?: number;
  }
>("item/getSimilarItems", async ({ itemId, limit }, thunkAPI) => {
  try {
    const data = await ItemService.getSimilarItems(itemId, limit);
    return data;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get similar items failed"
    );
  }
});

export const getOtherItemsOfUserThunk = createAsyncThunk<
  ItemResponse[],
  {
    currItemId: number;
    userId: number;
    limit?: number;
  }
>(
  "item/getOtherItemsOfUser",
  async ({ currItemId, userId, limit }, thunkAPI) => {
    try {
      const data = await ItemService.getOtherItemsOfUser(
        currItemId,
        userId,
        limit
      );
      return data;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get other items of user failed"
      );
    }
  }
);

export const getAllItemAvailableThunk = createAsyncThunk<
  ResponseEntityPagination<ItemResponse>,
  {
    pageNo: number;
    request: SearchItemRequest;
    sortBy?: string;
    sortDir?: string;
  }
>(
  "item/getAllItemAvailable",
  async ({ pageNo, request, sortBy, sortDir }, thunkAPI) => {
    try {
      const data = await ItemService.getAllItemAvailable(
        pageNo,
        request,
        sortBy,
        sortDir
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get all item available failed"
      );
    }
  }
);

export const searchItemPaginationThunk = createAsyncThunk<
  ResponseEntityPagination<ItemResponse>,
  {
    pageNo: number;
    sortBy?: string;
    sortDir?: string;
    request: SearchItemRequest;
  }
>(
  "item/searchItemPagination",
  async ({ pageNo, sortBy, sortDir, request }, thunkAPI) => {
    try {
      const data = await ItemService.getAllItemAvailable(
        pageNo,
        request,
        sortBy,
        sortDir
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Search item failed"
      );
    }
  }
);

export const findNearbyItemsThunk = createAsyncThunk<
  ResponseEntityPagination<ItemResponse>,
  {
    pageNo: number;
    latitude: number;
    longitude: number;
    distance: number;
  }
>(
  "item/findNearbyItems",
  async ({ pageNo, latitude, longitude, distance }, thunkAPI) => {
    try {
      const data = await ItemService.findNearbyItems(
        pageNo,
        latitude,
        longitude,
        distance
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Find item near by failed"
      );
    }
  }
);

export const getAllItemOfCurrentUserByStatusThunk = createAsyncThunk<
  ResponseEntityPagination<ItemResponse>,
  { pageNo: number; statusItem: StatusItem },
  { state: RootState }
>(
  "item/getAllItemOfCurrentUserByStatus",
  async ({ pageNo, statusItem }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ItemService.getAllItemOfCurrentUserByStatus(
        pageNo,
        statusItem,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get all item of current user by status failed"
      );
    }
  }
);

export const getAllItemOfUserByStatusThunk = createAsyncThunk<
  ResponseEntityPagination<ItemResponse>,
  { pageNo: number; userId: number; statusItem: StatusItem },
  { state: RootState }
>(
  "item/getAllItemOfUserByStatus",
  async ({ pageNo, userId, statusItem }, thunkAPI) => {
    try {
      const data = await ItemService.getAllItemOfUserByStatus(
        pageNo,
        userId,
        statusItem
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get all item of user by status failed"
      );
    }
  }
);

export const getItemDetailThunk = createAsyncThunk<
  ItemResponse,
  number,
  { state: RootState }
>("item/getItemDetail", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  try {
    const data = await ItemService.getItemDetail(id, accessToken!);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Get item detail failed"
    );
  }
});

export const changeItemStatusThunk = createAsyncThunk<
  ItemResponse,
  { itemId: number; statusItem: StatusItem },
  { state: RootState }
>("item/changeItemStatus", async ({ itemId, statusItem }, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  try {
    const data = await ItemService.changeItemStatus(
      itemId,
      statusItem,
      accessToken!
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data || "Change item status failed"
    );
  }
});

export const getItemCountsOfUserThunk = createAsyncThunk<
  { [key in StatusItem]?: number },
  number
>("item/getItemCountsOfUser", async (userId, thunkAPI) => {
  try {
    const statuses = [StatusItem.AVAILABLE, StatusItem.SOLD];

    const requests = statuses.map((status) => {
      return ItemService.getAllItemOfUserByStatus(0, userId, status);
    });

    const responses = await Promise.all(requests);

    const counts: { [key in StatusItem]?: number } = {};
    statuses.forEach((status, index) => {
      counts[status] = responses[index].totalRecords;
    });

    return counts;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get item counts of user failed"
    );
  }
});

export const getItemCountsOfCurrentUserThunk = createAsyncThunk<
  { [key in StatusItem]?: number },
  void,
  { state: RootState }
>("item/getItemCountsOfCurrentUser", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    const statuses = [
      StatusItem.AVAILABLE,
      StatusItem.EXPIRED,
      StatusItem.PENDING,
      StatusItem.REJECTED,
      StatusItem.NO_LONGER_FOR_EXCHANGE,
      StatusItem.SOLD,
      StatusItem.UNAVAILABLE,
    ];

    const requests = statuses.map((status) => {
      return ItemService.getAllItemOfCurrentUserByStatus(
        0,
        status,
        accessToken
      );
    });

    const responses = await Promise.all(requests);

    const counts: { [key in StatusItem]?: number } = {};
    statuses.forEach((status, index) => {
      counts[status] = responses[index].totalRecords;
    });

    return counts;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get item counts of current user failed"
    );
  }
});
