import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserResponse } from "../../common/models/auth";
import UserService from "../../services/UserService";

export const getUserThunk = createAsyncThunk<UserResponse, number>(
  "user/getUser",
  async (userId, thunkAPI) => {
    try {
      const data = await UserService.getUser(userId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Get user by id failed"
      );
    }
  }
);
