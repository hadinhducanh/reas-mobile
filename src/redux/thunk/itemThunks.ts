import { createAsyncThunk } from "@reduxjs/toolkit";
import ItemService from "../../services/ItemService";
import { RootState } from "../store";
import { ItemResponse } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";

export const postItemThunk = createAsyncThunk<
  ItemResponse,
  ItemResponse,
  { state: RootState }
>("item/postItem", async (item, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await ItemService.createItem(item, accessToken);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || "Post item failed");
  }
});

export const getAllItemAvailableThunk = createAsyncThunk<ResponseEntityPagination<ItemResponse>, number>(
  "item/getAllItemAvailable",
  async (pageNo, thunkAPI) => {
    try {
      const data = await ItemService.getAllItemAvailable(pageNo);            
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "get all item available failed");
    }
  }
);

export const getItemDetailThunk = createAsyncThunk<ItemResponse, number>(
  "item/getItemDetail",
  async (id, thunkAPI) => {
    try {
      const data = await ItemService.getItemDetail(id);            
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "get item detail failed");
    }
  }
);
