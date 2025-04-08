import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNotificationsOfCurrentUserThunk, setRegistrationTokenThunk } from "../thunk/notificationThunk";
import { NotificationDto, NotificationResponse } from '../../common/models/notification/index';
import { set } from "zod";

export interface NotificationState {
    token: string | null;
    notifications: NotificationDto[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    token: null,
    notifications: null,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        registerToken(state, action) {
            state.token = action.payload;
        },
        clearToken(state) {
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        setRegistrationToken(builder);
        setNotifications(builder);
    },
});

function setRegistrationToken(
    builder: ActionReducerMapBuilder<NotificationState>,
) {
    builder
        .addCase(setRegistrationTokenThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(setRegistrationTokenThunk.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.token = action.payload;
        })
        .addCase(setRegistrationTokenThunk.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload || "Register token failed";
        });
}

function setNotifications(
    builder: ActionReducerMapBuilder<NotificationState>,
) {
    builder
        .addCase(getNotificationsOfCurrentUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getNotificationsOfCurrentUserThunk.fulfilled, (state, action: PayloadAction<NotificationResponse>) => {
            state.loading = false;
            state.notifications = action.payload.content;
        })
        .addCase(getNotificationsOfCurrentUserThunk.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload || "Register token failed";
        });
}

export default notificationSlice.reducer;