import { createAsyncThunk } from "@reduxjs/toolkit";
import ItemService from "../../services/ItemService";
import { RootState } from "../store";
import { ItemResponse, UploadItemRequest } from "../../common/models/item";
import { ResponseEntityPagination } from "../../common/models/pagination";

export const uploadItemThunk = createAsyncThunk<
  ItemResponse,
  UploadItemRequest,
  { state: RootState }
>("exchange/uploadItem", async (item, thunkAPI) => {
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
    return thunkAPI.rejectWithValue(error.response?.data || "Upload item failed");
  }
});

