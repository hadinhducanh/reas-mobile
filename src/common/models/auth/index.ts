import { Gender } from "../../enums/Gender";
import { RoleName } from "../../enums/RoleName";
import { StatusEntity } from "../../enums/StatusEntity";

export interface JWTAuthResponse {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export interface LoginDto {
  userNameOrEmailOrPhone: string | undefined;
  password: string | undefined;
}

export interface SignupDto {
  email: string | undefined;
  password: string | undefined;
  fullName: string | undefined;
}

export interface UserResponse {
  id: number | undefined;
  userName: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  gender: Gender | undefined;
  statusEntity: StatusEntity | undefined;
  image: string | undefined;
  roleName: RoleName | undefined;
}

export interface PasswordChangeRequest{
  oldPassword: string | undefined;
  newPassword: string | undefined;
}
