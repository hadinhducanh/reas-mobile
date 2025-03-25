import { createAsyncThunk } from "@reduxjs/toolkit";
import ItemService from "../../services/ItemService";
import { RootState } from "../store";
import {
  ItemResponse,
  SearchItemRequest,
  UploadItemRequest,
} from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";

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

export const getAllItemAvailableThunk = createAsyncThunk<
  ResponseEntityPagination<ItemResponse>,
  { pageNo: number; request: SearchItemRequest }
>("item/getAllItemAvailable", async ({ pageNo, request }, thunkAPI) => {
  try {
    const data = await ItemService.getAllItemAvailable(pageNo, request);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get all item available failed"
    );
  }
});

export const getItemDetailThunk = createAsyncThunk<ItemResponse, number>(
  "item/getItemDetail",
  async (id, thunkAPI) => {
    try {
      const data = await ItemService.getItemDetail(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Get item detail failed"
      );
    }
  }
);
