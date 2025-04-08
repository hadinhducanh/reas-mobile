import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { UserLocationDto, UserResponse } from "../common/models/auth";
import {
  UpdateResidentRequest,
  UserLocationRequest,
} from "../common/models/user";

const getUser = async (userId: number): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(
    `${API_BASE_URL}/user/${userId}`
  );
  return response.data;
};

const updateResidentInfo = async (
  request: UpdateResidentRequest,
  accessToken: string
): Promise<UserResponse> => {
  const response = await axios.put<UserResponse>(
    `${API_BASE_URL}/user/resident/info`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const createNewUserLocation = async (
  request: UserLocationRequest,
  accessToken: string
): Promise<UserLocationDto> => {
  const response = await axios.post<UserLocationDto>(
    `${API_BASE_URL}/user-location`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const deleteUserLocationOfCurrentUser = async (
  id: number,
  accessToken: string
): Promise<boolean> => {
  const response = await axios.delete<boolean>(
    `${API_BASE_URL}/user-location/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  getUser,
  updateResidentInfo,
  createNewUserLocation,
  deleteUserLocationOfCurrentUser,
};
