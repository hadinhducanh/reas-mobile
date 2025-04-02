import { createAsyncThunk } from "@reduxjs/toolkit";

export const setRegistrationTokenThunk = createAsyncThunk<
    string,
    string
>(
    "notification/registerToken",

    async (token, thunkAPI) => {
        try {
            return token;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data || "Sign in failed");
        }
    }
);