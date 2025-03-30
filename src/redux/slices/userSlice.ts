import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "../../common/models/auth";
import { getUserThunk } from "../thunk/userThunk";

interface UserState {
  userDetail: UserResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetail: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.userDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserThunk.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.userDetail = action.payload;
        }
      )
      .addCase(getUserThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Get user by id failed";
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
