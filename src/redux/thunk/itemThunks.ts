import { createAsyncThunk } from "@reduxjs/toolkit";
import { Item } from "../../common/models/item-upload";
import ItemService from "../../services/ItemService";
import { RootState } from "../store";

export const postItemThunk = createAsyncThunk<
  Item,
  Item,
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
