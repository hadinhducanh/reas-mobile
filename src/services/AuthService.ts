import axios from "axios";
import {
  LoginDto,
  JWTAuthResponse,
  UserResponse,
  SignupDto,
} from "../common/models/auth";
import { API_BASE_URL } from "../common/models/constants";

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
  console.log(response.data);

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
    `http://10.0.2.2:8080/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
export default {
  authenticateUser,
  signupUser,
  sendOtp,
  getInfo,
  logout,
};
