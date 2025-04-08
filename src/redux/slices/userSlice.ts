import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserLocationDto, UserResponse } from "../../common/models/auth";
import {
  createNewUserLocationThunk,
  deleteUserLocationOfCurrentUserThunk,
  getUserThunk,
  updateResidentInfoThunk,
} from "../thunk/userThunk";

interface UserState {
  userDetail: UserResponse | null;
  userLocation: UserLocationDto | null;
  userLocationId: number;
  userPlaceId: string;
  deleteUserLocation: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetail: null,
  userLocation: null,
  userLocationId: 0,
  userPlaceId: "",
  deleteUserLocation: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPlaceIdState: (state, action: PayloadAction<string>) => {
      state.userPlaceId = action.payload;
    },
    setUserLocationIdState: (state, action: PayloadAction<number>) => {
      state.userLocationId = action.payload;
    },
    resetUser: (state) => {
      state.userDetail = null;
      state.userLocation = null;
      state.deleteUserLocation = false;
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

    builder
      .addCase(updateResidentInfoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateResidentInfoThunk.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.userDetail = action.payload;
        }
      )
      .addCase(
        updateResidentInfoThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Update resident info failed";
        }
      );

    builder
      .addCase(createNewUserLocationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewUserLocationThunk.fulfilled,
        (state, action: PayloadAction<UserLocationDto>) => {
          state.loading = false;
          state.userLocation = action.payload;
        }
      )
      .addCase(
        createNewUserLocationThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Create new user location failed";
        }
      );

    builder
      .addCase(deleteUserLocationOfCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteUserLocationOfCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
          state.deleteUserLocation = action.payload;
        }
      )
      .addCase(
        deleteUserLocationOfCurrentUserThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error =
            action.payload || "Delete user location of current user failed";
        }
      );
  },
});

export const { resetUser, setUserPlaceIdState, setUserLocationIdState } =
  userSlice.actions;
export default userSlice.reducer;
