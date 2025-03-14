import { createAsyncThunk } from "@reduxjs/toolkit";
import { BrandResponse } from "../../common/models/brand";
import BrandService from "../../services/BrandService";


export const getAllBrandThunk = createAsyncThunk<BrandResponse[], void>(
  "brand/getAllBrandThunk",
  async (_, thunkAPI) => {
    try {
      const data = await BrandService.getAllBrand();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "get all brand failed");
    }
  }
);
