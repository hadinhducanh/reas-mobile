import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationDto } from '../../common/models/notification/index';
import { fetchNotificationsOfCurrenteUser } from "../../services/NotificationService";

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

export const getNotificationsOfCurrentUserThunk = createAsyncThunk<
    NotificationDto[],
    string
>(
    "notification/getNotificationsOfCurrentUser",
    async (userId, thunkAPI) => {
        try {
           return await fetchNotificationsOfCurrenteUser(userId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data || "Fetch notifications failed");
        }
    }
);
