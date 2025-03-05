import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Brand } from "../../common/models/brand";
import { API_BASE_URL } from "../../common/models/constants";
import { RootState } from "../store";

export const getBrandsThunk = createAsyncThunk<Brand[], void, { state: RootState }>(
  "brand/getBrands",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Brand[]>(`${API_BASE_URL}/brand`);
      
      // Kiểm tra nếu response không phải array
      if (!Array.isArray(response.data)) {
        console.error("Invalid API response:", response.data);
        return thunkAPI.rejectWithValue("Invalid data format from API");
      }

      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch brands");
    }
  }
);
