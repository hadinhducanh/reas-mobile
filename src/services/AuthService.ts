import axios from "axios";
import {
  LoginDto,
  JWTAuthResponse,
  UserResponse,
  SignupDto,
  PasswordChangeRequest,
} from "../common/models/auth";
import { API_BASE_URL, API_BASE_URL_LOG_OUT } from "../common/constant";

const authenticateUser = async (
  credentials: LoginDto
): Promise<JWTAuthResponse> => {
  const response = await axios.post<JWTAuthResponse>(
    `${API_BASE_URL}/auth/login`,
    credentials
  );

  return response.data;
};

const signupUser = async (credentials: SignupDto): Promise<JWTAuthResponse> => {
  const response = await axios.post<JWTAuthResponse>(
    `${API_BASE_URL}/auth/register/user`,
    credentials
  );

  return response.data;
};

const sendOtp = async (credentials: SignupDto): Promise<string> => {
  const response = await axios.post<string>(
    `${API_BASE_URL}/auth/otp`,
    credentials
  );

  return response.data;
};

const getInfo = async (accessToken: string): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(`${API_BASE_URL}/auth/info`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const logout = async (accessToken: string): Promise<void> => {
  await axios.post(
    `${API_BASE_URL_LOG_OUT}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

const changePassword = async (
  accessToken: string,
  payload: PasswordChangeRequest
): Promise<boolean> => {
  const response = await axios.post<boolean>(
    `${API_BASE_URL}/auth/change-password`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  authenticateUser,
  signupUser,
  sendOtp,
  getInfo,
  logout,
  changePassword,
};
