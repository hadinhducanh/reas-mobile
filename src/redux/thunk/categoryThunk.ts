import { createAsyncThunk } from "@reduxjs/toolkit";
import { CategoryResponse } from "../../common/models/category";
import { TypeItem } from "../../common/enums/TypeItem";
import CategoryService from "../../services/CategoryService";


export const getAllByTypeItemThunk = createAsyncThunk<CategoryResponse[], TypeItem>(
  "category/getAllByTypeItemThunk",
  async (typeItem, thunkAPI) => {
    try {
      const data = await CategoryService.getAllByTypeItem(typeItem);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "get all category by type item failed");
    }
  }
);
