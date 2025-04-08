import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetNotificationRequest, NotificationResponse } from '../../common/models/notification/index';
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
    NotificationResponse,
    GetNotificationRequest
>(
    "notification/getNotificationsOfCurrentUser",
    async (getNotificationRequest, thunkAPI) => {
        try {
           return await fetchNotificationsOfCurrenteUser(getNotificationRequest);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data || "Fetch notifications failed");
        }
    }
);
