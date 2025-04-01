import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setRegistrationTokenThunk } from "../thunk/notificationThunk";

export interface NotificationState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    token: null,
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

export default notificationSlice.reducer;