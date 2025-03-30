import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { UserResponse } from "../common/models/auth";

const getUser = async (userId: number): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(
    `${API_BASE_URL}/user/${userId}`
  );
  return response.data;
};

export default {
  getUser,
};
